import { Effect, Match, Ref, Stream } from "effect"
import type { SearchResult } from "@/types/chat"
import { OpenRouter } from "./services/OpenRouter"
import { ConfigService } from "./services/Config"
import { Redux } from "./services/Redux"
import { ChatApi } from "./services/ChatApi"
import { titleSystemPrompt } from "./services/prompts"
import {
  addMessage,
  updateLastMessage,
  setLoading,
  setError,
  setSuggestions,
  setActiveAdaptiveData,
  clearHistory as clearChatHistory,
  updateChat
} from "@/store/slices/chatSlice"
import { setApiError } from "@/store/slices/uiSlice"
import { OpenRouterError } from "./errors"
import type { AdaptiveData } from "@/types/chat"
import { extractUrls, toSource } from "@/lib/url"

const URL_MAX_LEN = 2083

/** @Logic.Effect.GenerateTitle */
const generateChatTitle = (
  currentMessage: string,
  conversationHistory: string[]
): Effect.Effect<string, never, ConfigService> =>
  Effect.gen(function* () {
    const config = yield* ConfigService
    
    const contextSnippet = conversationHistory.length > 0
      ? `\n\nRecent conversation:\n${conversationHistory.slice(-3).join('\n')}`
      : ''
    
    const response = yield* Effect.promise(() =>
      fetch(`${config.openRouterBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: titleSystemPrompt },
            { role: 'user', content: `Generate title for: "${currentMessage.slice(0, 80)}"${contextSnippet}` }
          ],
          max_tokens: 15,
          temperature: 0.3
        })
      })
    )

    if (!response.ok) {
      return currentMessage.slice(0, 25)
    }

    const data = yield* Effect.promise(() => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>)
    let title = data.choices?.[0]?.message?.content?.trim() || currentMessage.slice(0, 25)
    title = title.replace(/[^\w\sáéíóúñüÁÉÍÓÚÑÜ]/g, '').trim()
    return title.slice(0, 30)
  }).pipe(
    Effect.catchAll(() => Effect.succeed(currentMessage.slice(0, 25)))
  )

/** @Logic.Effect.Chat.Init */
export const initChat = Effect.gen(function* () {
  /** @Logic.Effect.GetConfig */
  const config = yield* ConfigService
  /** @Store.Action.Chat.ClearHistory */
  yield* Redux.dispatch(clearChatHistory())
  /** @Store.Action.Chat.AddSystemMessage */
  yield* Redux.dispatch(addMessage({ role: "system" as const, content: config.systemPrompt }))
})

/** @Logic.Chat.GenerateResponse.Internal */
/** @Logic.Chat.GenerateResponse */
const generateResponse: Effect.Effect<void, OpenRouterError, OpenRouter | Redux> = Effect.gen(function* () {
  /** @Logic.OpenRouter.Client */
  const openRouter = yield* OpenRouter
  /** @Store.Selector.Chat.Messages */
  const messages = yield* Redux.getState().pipe(Effect.map((s) => s.chat.messages))
  /** @Logic.OpenRouter.ChatStream */
  const stream = openRouter.chat(messages)

  /** @Store.Action.Chat.AddAssistantMessage */
  yield* Redux.dispatch(addMessage({ role: "assistant" as const, content: "" }))

  /** @Logic.Chat.Refs */
  const contentRef = yield* Ref.make("")
  const thoughtRef = yield* Ref.make("")
  const thinkingRef = yield* Ref.make(false)
  const thinkStartRef = yield* Ref.make(0)

  /** @Logic.Chat.SourceTracking */
  const sourcesRef = yield* Ref.make<SearchResult[]>([])
  const seenUrlsRef = yield* Ref.make(new Set<string>())
  const scanCursorRef = yield* Ref.make(0)

  /** @Logic.Chat.TrackUrls */
  const trackUrls = (urls: string[], verified: boolean) =>
    Effect.gen(function* () {
      if (urls.length === 0) return
      const seen = yield* Ref.get(seenUrlsRef)
      const novel = urls.filter((u) => !seen.has(u))
      if (novel.length === 0) return

      const next = new Set(seen)
      for (const u of novel) next.add(u)
      yield* Ref.set(seenUrlsRef, next)

      const newSources = novel.map((u) => toSource(u, verified))
      yield* Ref.update(sourcesRef, (prev) => [...prev, ...newSources])
    })

  /** @Logic.Chat.SyncSources */
  const syncSources = () =>
    Effect.gen(function* () {
      const all = yield* Ref.get(sourcesRef)
      yield* Redux.dispatch(updateLastMessage({ metadata: { sources: all } }))
    })

  /** @Logic.Chat.ScanContent */
  const scanContent = (content: string) =>
    Effect.gen(function* () {
      const cursor = yield* Ref.get(scanCursorRef)
      const region = content.slice(cursor)
      if (region.length === 0) return

      yield* trackUrls(extractUrls(region), false)
      yield* Ref.set(scanCursorRef, Math.max(0, content.length - URL_MAX_LEN))
    })

  /** @Logic.Chat.StreamConsumption */
  yield* Stream.runForEach(stream, (chunk: string) =>
    Effect.gen(function* () {
      for (const line of chunk.split("\n")) {
        const trimmed = line.trim()
        if (!trimmed?.startsWith("data: ")) continue

        const dataStr = trimmed.substring(6)
        if (dataStr === "[DONE]") break

        const parsed = yield* Effect.try({
          try: () =>
            JSON.parse(dataStr) as {
              choices?: Array<{
                delta?: {
                  reasoning?: string
                  reasoning_details?: Array<{ text: string }>
                  content?: string
                }
              }>
              citations?: string[]
            },
          catch: (e) => ({ _tag: "ParseError" as const, cause: e, raw: dataStr })
        }).pipe(Effect.option)

        const isNone = Match.value(parsed).pipe(
          Match.when({ _tag: "None" }, () => true),
          Match.when({ _tag: "Some" }, () => false),
          Match.orElse(() => true)
        )

        if (isNone) {
          yield* Effect.logDebug(`[Chat] Skipped malformed stream line: ${dataStr.slice(0, 100)}`)
          continue
        }

        const json = (parsed as { _tag: "Some"; value: ReturnType<typeof JSON.parse> }).value
        const delta = json.choices?.[0]?.delta

        /** @Logic.Chat.Citations */
        if (json.citations?.length) {
          yield* trackUrls(json.citations, true)
          yield* syncSources()
        }

        if (!delta) continue

        /** @Logic.Chat.Reasoning */
        if (delta.reasoning || delta.reasoning_details?.length) {
          const isThinking = yield* Ref.get(thinkingRef)
          if (!isThinking) {
            yield* Ref.set(thinkingRef, true)
            yield* Ref.set(thinkStartRef, Date.now())
            yield* Redux.dispatch(
              updateLastMessage({ metadata: { thought: "", isThinking: true } })
            )
          }

          const text =
            delta.reasoning || delta.reasoning_details?.map((d: { text: string }) => d.text).join("") || ""
          yield* Ref.update(thoughtRef, (prev) => prev + text)
          const current = yield* Ref.get(thoughtRef)
          yield* Redux.dispatch(updateLastMessage({ metadata: { thought: current } }))
        } else if (delta.content) {
          const isThinking = yield* Ref.get(thinkingRef)
          if (isThinking) {
            const start = yield* Ref.get(thinkStartRef)
            yield* Ref.set(thinkingRef, false)
            yield* Redux.dispatch(
              updateLastMessage({
                metadata: {
                  thoughtTime: ((Date.now() - start) / 1000).toFixed(1),
                  isThinking: false
                }
              })
            )
          }

          yield* Ref.update(contentRef, (prev) => prev + delta.content!)
          const current = yield* Ref.get(contentRef)
          yield* Redux.dispatch(updateLastMessage({ content: current }))

              /** @Logic.Chat.RealtimeUrlExtraction */
              yield* scanContent(current)
              /** @Store.Action.Chat.SyncSources */
              yield* syncSources()
            }
          }
        })
      )

  /** @Logic.Chat.PostStream */
  const assistantContent = yield* Ref.get(contentRef)

  yield* trackUrls(extractUrls(assistantContent), false)
  yield* syncSources()

  const matches = [...assistantContent.matchAll(/```json\n([\s\S]*?)\n```\n/g)]

  const results = yield* Effect.forEach(matches, (match) =>
    Effect.gen(function* () {
      try {
        return { block: JSON.parse(match[1]!), raw: match[0] }
      } catch {
        return null
      }
    })
  )

  const jsonBlocks = results.filter(
    (r): r is { block: Record<string, unknown>; raw: string } => r !== null
  )

  if (jsonBlocks.length > 0) {
    let processedContent = assistantContent
    for (const { raw } of jsonBlocks) processedContent = processedContent.replace(raw, "").trim()

    /** @Logic.Chat.AdaptiveExtraction */
    const adaptiveBlocks = jsonBlocks.map((b) => b.block as { type: string; data: unknown })
    const suggestions = adaptiveBlocks
      .filter((b) => b.type === "suggestions")
      .flatMap(
        (b) => (b.data as { items?: Array<{ label: string; action: string }> }).items || []
      )

    if (suggestions.length > 0) {
      /** @Store.Action.Chat.SetSuggestions */
      yield* Redux.dispatch(setSuggestions(suggestions))
    }

    /** @Logic.Chat.ReferencesExtraction */
    const referenceBlocks = adaptiveBlocks.filter((b) => b.type === "references")
    for (const block of referenceBlocks) {
      const items = (block.data as { items?: Array<{ label?: string; url?: string }> })?.items || []
      const refUrls = items.map((item) => item.url).filter((url): url is string => !!url && url.startsWith("http"))
      if (refUrls.length > 0) {
        yield* trackUrls(refUrls, true)
      }
    }
    yield* syncSources()

    yield* Redux.dispatch(setActiveAdaptiveData(jsonBlocks.map((b) => b.block as unknown as AdaptiveData)))
    yield* Redux.dispatch(
      updateLastMessage({
        content: processedContent,
        metadata: {
          searchQuery: assistantContent.match(/Buscando\s+"([^"]+)"/i)?.[1] || undefined
        }
      })
    )
  } else {
    /** @Logic.Chat.SourceExtraction.Fallback */
    const sources = yield* Ref.get(sourcesRef)
    if (sources.length === 0) {
      const state = yield* Redux.getState()
      const thought =
        state.chat.messages[state.chat.messages.length - 1]?.metadata?.thought || ""
      const fallbackUrls = extractUrls(assistantContent + " " + thought)
      if (fallbackUrls.length > 0) {
        const fallbackSources = fallbackUrls.map((u) => toSource(u))
        yield* Redux.dispatch(updateLastMessage({ metadata: { sources: fallbackSources } }))
      }
    }
  }
})

/** @Logic.Chat.Send */
export const sendChatMessage = (
  content: string
): Effect.Effect<void, never, OpenRouter | Redux | ConfigService | ChatApi> =>
  Effect.gen(function* () {
    if (!content.trim()) return

    /** @Store.Action.Chat.ResetUI */
    yield* Redux.dispatch(addMessage({ role: "user" as const, content }))
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(setSuggestions([]))

    /** @Store.Selector.Chat.State */
    const state = yield* Redux.getState()
    const currentChatId = state.chat.currentChatId

    if (currentChatId) {
      const chatApi = yield* ChatApi
      yield* Effect.asVoid(
        Effect.catchAll(
          chatApi.addMessage({
            chatId: currentChatId,
            role: "user",
            content,
            metadata: null
          }),
          () => Effect.sync(() => {})
        )
      )

      const chatState = yield* Redux.getState()
      const chat = chatState.chat.chats.find(c => c.id === currentChatId)
      const defaultTitles = ['New Chat', 'Nueva Conversación', 'Nuevo Chat', 'New Conversation']
      const needsTitle = !chat?.title || defaultTitles.includes(chat.title)
      
      if (needsTitle) {
        const userMessages = state.chat.messages
          .filter(m => m.role === 'user')
          .map(m => m.content)
        const title = yield* generateChatTitle(content, userMessages.slice(0, -1))
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => {})
          )
        )
      }
    }

    yield* generateResponse

    if (currentChatId) {
      const state = yield* Redux.getState()
      const lastMessage = state.chat.messages[state.chat.messages.length - 1]
      if (lastMessage && lastMessage.role === "assistant") {
        const chatApi = yield* ChatApi
        const filteredMetadata = lastMessage.metadata
          ? Object.fromEntries(
              Object.entries(lastMessage.metadata).filter(([, v]) => v !== undefined)
            )
          : null
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.addMessage({
              chatId: currentChatId,
              role: "assistant",
              content: lastMessage.content,
              metadata: filteredMetadata
            }),
            () => Effect.sync(() => {})
          )
        )
        
        const userMessages = state.chat.messages
          .filter(m => m.role === 'user')
          .map(m => m.content)
        const title = yield* generateChatTitle(lastMessage.content, userMessages)
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => {})
          )
        )
      }
    }
  }).pipe(
    Effect.ensuring(Redux.dispatch(setLoading(false))),
    Effect.catchAll((err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`[Chat] Fatal Error: ${String(err)}`)
        if (err instanceof OpenRouterError) {
          yield* Redux.dispatch(setApiError({ code: err.code, message: err.message }))
        } else {
          const config = yield* ConfigService
          yield* Redux.dispatch(setError(config.errorMessages.connectionError))
        }
      })
    )
  )

/** @Logic.Chat.Regenerate */
export const regenerateResponse: Effect.Effect<void, never, OpenRouter | Redux | ConfigService> =
  Effect.gen(function* () {
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(setSuggestions([]))

    yield* generateResponse
  }).pipe(
    Effect.ensuring(Redux.dispatch(setLoading(false))),
    Effect.catchAll((err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`[Chat] Regeneration Error: ${String(err)}`)
        if (err instanceof OpenRouterError) {
          yield* Redux.dispatch(setApiError({ code: err.code, message: err.message }))
        } else {
          const config = yield* ConfigService
          yield* Redux.dispatch(setError(config.errorMessages.connectionError))
        }
      })
    )
  )

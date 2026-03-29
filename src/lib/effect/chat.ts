import { Effect, Ref, Stream } from "effect"
import type { SearchResult } from "@/types/chat"
import { OpenRouter, type ChatResponse } from "./services/OpenRouter"
import { ConfigService } from "./services/Config"
import { Redux } from "./services/Redux"
import { ChatApi } from "./services/ChatApi"
import { titleSystemPrompt } from "./services/prompts"
import { ChatRole } from "@/types/chat"
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
import { toSource } from "@/lib/url"
import type { Personalization } from "./schemas/PersonalizationSchema"
import { I18n } from "./services/I18n"

/** @Logic.Effect.GenerateTitle */
const generateChatTitle = (
  currentMessage: string,
  conversationHistory: string[]
): Effect.Effect<string, never, ConfigService> =>
  Effect.gen(function* () {
    const config = yield* ConfigService

    /** @Logic.Chat.PrepareTitleContext */
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
          model: config.models.default,
          messages: [
            { role: ChatRole.SYSTEM, content: titleSystemPrompt },
            { role: ChatRole.USER, content: `Generate title for: "${currentMessage.slice(0, 80)}"${contextSnippet}` }
          ],
          max_tokens: 15,
          temperature: config.chatRequestConfig.temperature
        })
      })
    )

    if (!response.ok) {
      return currentMessage.slice(0, 25)
    }

    const data = yield* Effect.promise(() => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>)
    let title = data.choices?.[0]?.message?.content?.trim() || currentMessage.slice(0, 25)
    /** @Logic.Chat.SanitizeTitle */
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
  yield* Redux.dispatch(addMessage({ role: ChatRole.SYSTEM, content: config.systemPrompt }))
})

/** @Logic.Chat.GenerateResponse.Internal */
/** @Logic.Chat.GenerateResponse */
const generateResponse = (
  sessionId?: string,
  personalization?: Personalization
): Effect.Effect<void, OpenRouterError | void, OpenRouter | Redux | I18n> => Effect.gen(function* () {
  /** @Logic.OpenRouter.Client */
  const openRouter = yield* OpenRouter
  /** @Store.Selector.Chat.Messages */
  const messages = yield* Redux.getState().pipe(Effect.map((s) => s.chat.messages))
  /** @Logic.OpenRouter.ChatStream */
  const stream = openRouter.chat(messages, undefined, sessionId, personalization)

  /** @Store.Action.Chat.AddAssistantMessage */
  yield* Redux.dispatch(addMessage({ role: ChatRole.ASSISTANT, content: "" }))

  /** @Logic.Chat.Refs */
  const contentRef = yield* Ref.make("")
  const reasoningRef = yield* Ref.make("")

  /** @Logic.Chat.SourceTracking */
  const sourcesRef = yield* Ref.make<SearchResult[]>([])
  const seenUrlsRef = yield* Ref.make(new Set<string>())

  /** @Logic.Chat.SyncSources */
  const syncSources = () =>
    Effect.gen(function* () {
      const all = yield* Ref.get(sourcesRef)
      yield* Redux.dispatch(updateLastMessage({ metadata: { sources: all } }))
    })

  /** @Logic.Chat.StreamConsumption */
  yield* Stream.runForEach(stream, (response: ChatResponse) =>
    Effect.gen(function* () {
      const content = response.content
      const reasoning = response.reasoning
      const annotations = response.annotations

      /** @Logic.Chat.ProcessReasoning */
      if (reasoning) {
        yield* Ref.update(reasoningRef, (prev) => prev + reasoning)
        const currentReasoning = yield* Ref.get(reasoningRef)
        yield* Redux.dispatch(updateLastMessage({
          metadata: { thought: currentReasoning, isThinking: true }
        }))
      }

      /** @Logic.Chat.ProcessAnnotations */
      if (annotations?.length) {
        const citationSources = annotations
          .filter((a) => a.url_citation)
          .map((a) => toSource(
            a.url_citation!.url,
            true,
            a.url_citation!.title,
            a.url_citation!.content?.slice(0, 200)
          ))

        /** @Logic.Chat.DeduplicateSources */
        if (citationSources.length) {
          const seen = yield* Ref.get(seenUrlsRef)
          const novel = citationSources.filter((s) => !seen.has(s.url))
          if (novel.length) {
            const next = new Set(seen)
            for (const s of novel) next.add(s.url)
            yield* Ref.set(seenUrlsRef, next)
            yield* Ref.update(sourcesRef, (prev) => [...prev, ...novel])
            yield* syncSources()
          }
        }
      }

      if (!content) return

      /** @Logic.Chat.AppendContent */
      yield* Ref.update(contentRef, (prev) => prev + content)
      const current = yield* Ref.get(contentRef)
      yield* Redux.dispatch(updateLastMessage({ content: current }))
    })
  )

  /** @Logic.Chat.PostStream */
  const assistantContent = yield* Ref.get(contentRef)

  /** @Logic.Chat.ClearThinking */
  yield* Redux.dispatch(updateLastMessage({
    metadata: { isThinking: false }
  }))

  /** @Logic.Chat.FlushSources */
  yield* syncSources()

  /** @Logic.Chat.TrackUsage */
  yield* Effect.asVoid(Effect.tryPromise({
    try: async () => {
      await fetch('/api/user/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1, tokens: 0, cost: 0 })
      })
    },
    catch: () => {
      // Silent failure - usage tracking should not block chat
    }
  }))

  const assistantContentStr = assistantContent as string
  const matches = [...assistantContentStr.matchAll(/```json\n([\s\S]*?)\n```\n/g)]

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
    let processedContent = assistantContentStr
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

    yield* Redux.dispatch(setActiveAdaptiveData(jsonBlocks.map((b) => b.block as unknown as AdaptiveData)))
    yield* Redux.dispatch(
      updateLastMessage({
        content: processedContent,
        metadata: {
          searchQuery: assistantContentStr.match(/Buscando\s+"([^"]+)"/i)?.[1] || undefined
        }
      })
    )
  }
})

/** @Logic.Chat.Send */
export const sendChatMessage = (
  content: string,
  personalization?: Personalization
): Effect.Effect<void, never, OpenRouter | Redux | ConfigService | ChatApi | I18n> =>
  Effect.gen(function* () {
    if (!content.trim()) return

    /** @Store.Action.Chat.ResetUI */
    yield* Redux.dispatch(addMessage({ role: ChatRole.USER, content }))
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
            role: ChatRole.USER,
            content,
            metadata: null
          }),
          () => Effect.sync(() => { })
        )
      )

      const chatState = yield* Redux.getState()
      const chat = chatState.chat.chats.find(c => c.id === currentChatId)
      const defaultTitles = ['New Chat', 'Nueva Conversación', 'Nuevo Chat', 'New Conversation']
      const needsTitle = !chat?.title || defaultTitles.includes(chat.title)

      if (needsTitle) {
        const userMessages = state.chat.messages
          .filter(m => m.role === ChatRole.USER)
          .map(m => m.content)
        const title = yield* generateChatTitle(content, userMessages.slice(0, -1))
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => { })
          )
        )
      }
    }

    yield* generateResponse(currentChatId ?? undefined, personalization)

    if (currentChatId) {
      const state = yield* Redux.getState()
      const lastMessage = state.chat.messages[state.chat.messages.length - 1]
      if (lastMessage && lastMessage.role === ChatRole.ASSISTANT) {
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
              role: ChatRole.ASSISTANT,
              content: lastMessage.content,
              metadata: filteredMetadata
            }),
            () => Effect.sync(() => { })
          )
        )

        const userMessages = state.chat.messages
          .filter(m => m.role === ChatRole.USER)
          .map(m => m.content)
        const title = yield* generateChatTitle(lastMessage.content, userMessages)
        yield* Redux.dispatch(updateChat({ id: currentChatId, updates: { title } }))
        yield* Effect.asVoid(
          Effect.catchAll(
            chatApi.updateChat({ chatId: currentChatId, title }),
            () => Effect.sync(() => { })
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
export const regenerateResponse = (
  personalization?: Personalization
): Effect.Effect<void, never, OpenRouter | Redux | ConfigService | I18n> =>
  Effect.gen(function* () {
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(setSuggestions([]))

    const state = yield* Redux.getState()
    const currentChatId = state.chat.currentChatId
    yield* generateResponse(currentChatId ?? undefined, personalization)
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

import { Effect, Ref, Stream } from "effect"
import type { SearchResult } from "@/types/chat"
import { OpenRouter } from "./services/OpenRouter"
import { ConfigService } from "./services/Config"
import { Redux } from "./services/Redux"
import {
  addMessage,
  updateLastMessage,
  setLoading,
  setError,
  setSuggestions,
  setActiveAdaptiveData,
  clearHistory as clearChatHistory
} from "@/store/slices/chatSlice"

/** @Logic.Effect.Chat.Init */
export const initChat = Effect.gen(function* () {
  const config = yield* ConfigService

  yield* Redux.dispatch(clearChatHistory())
  yield* Redux.dispatch(addMessage({
    role: "system" as const,
    content: config.systemPrompt
  }))
})

/** @Logic.Chat.GenerateResponse.Internal */
const generateResponse: Effect.Effect<void, never, OpenRouter | Redux> = Effect.gen(function* () {
  const openRouter = yield* OpenRouter

  const messages = yield* Redux.getState().pipe(Effect.map((s) => s.chat.messages))
  const stream = openRouter.chat(messages)

  yield* Redux.dispatch(addMessage({ role: "assistant" as const, content: "" }))

  /** @Logic.Chat.Ref */
  const assistantContentRef = yield* Ref.make("")
  const thoughtContentRef = yield* Ref.make("")
  const isThoughtRef = yield* Ref.make(false)
  const thoughtStartTimeRef = yield* Ref.make(0)
  const extractedSourcesRef = yield* Ref.make<SearchResult[]>([])

  /** @Logic.Chat.StreamConsumption */
  yield* Stream.runForEach(stream, (chunk: string) =>
    Effect.gen(function* () {
      const lines = chunk.split("\n")

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.substring(6)
          if (dataStr === "[DONE]") break

          const parseResult = yield* Effect.try({
            try: () => JSON.parse(dataStr) as {
              choices?: Array<{ delta?: { reasoning?: string; reasoning_details?: Array<{ text: string }>; content?: string } }>,
              citations?: string[]
            },
            catch: (e) => ({ _tag: "ParseError" as const, cause: e, raw: dataStr })
          }).pipe(Effect.option)

          if (parseResult._tag === "None") continue

          const json = parseResult.value
          const delta = json.choices?.[0]?.delta

          /** @Logic.Chat.Citations */
          if (json.citations && json.citations.length > 0) {
            const chatState = (yield* Redux.getState()).chat.messages
            const lastMessage = chatState[chatState.length - 1]
            const existingSources = lastMessage?.metadata?.sources || []

            const newSources = json.citations.map(url => {
              try {
                const domain = new URL(url).hostname.replace('www.', '')
                return { title: domain, url, source: domain, verified: true }
              } catch {
                return { title: url, url, verified: false }
              }
            })

            const allSources = [...existingSources, ...newSources]
            const uniqueSources = Array.from(new Map(allSources.map(s => [s.url, s])).values())

            yield* Redux.dispatch(updateLastMessage({
              metadata: { sources: uniqueSources }
            }))
          }

          if (!delta) continue

          /** @Logic.Chat.Reasoning */
          if (delta.reasoning || (delta.reasoning_details && delta.reasoning_details.length > 0)) {
            const isThought = yield* Ref.get(isThoughtRef)
            if (!isThought) {
              yield* Ref.set(isThoughtRef, true)
              yield* Ref.set(thoughtStartTimeRef, Date.now())
              yield* Redux.dispatch(updateLastMessage({
                metadata: { thought: "", isThinking: true }
              }))
            }

            const reasoningText = delta.reasoning || delta.reasoning_details?.map(d => d.text).join("") || ""
            yield* Ref.update(thoughtContentRef, (prev) => prev + reasoningText)
            const currentThought = yield* Ref.get(thoughtContentRef)
            yield* Redux.dispatch(updateLastMessage({ metadata: { thought: currentThought } }))
          } else if (delta.content) {
            const isThought = yield* Ref.get(isThoughtRef)
            if (isThought) {
              const start = yield* Ref.get(thoughtStartTimeRef)
              const duration = ((Date.now() - start) / 1000).toFixed(1)
              yield* Ref.set(isThoughtRef, false)
              yield* Redux.dispatch(updateLastMessage({
                metadata: {
                  thoughtTime: duration,
                  isThinking: false
                }
              }))
            }

            yield* Ref.update(assistantContentRef, (prev) => prev + delta.content!)
            const current = yield* Ref.get(assistantContentRef)
            yield* Redux.dispatch(updateLastMessage({ content: current }))

            /** @Logic.Chat.RealtimeUrlExtraction */
            const urlMatches = current.match(/(https?:\/\/[^\s)<>"]+)/g) || []
            if (urlMatches.length > 0) {
              const existing = yield* Ref.get(extractedSourcesRef)
              const newSources: SearchResult[] = []
              for (const url of urlMatches) {
                if (existing.some(s => s.url === url)) continue
                try {
                  const domain = new URL(url).hostname.replace('www.', '')
                  newSources.push({ title: domain, url, source: domain, verified: false })
                } catch {}
              }
              if (newSources.length > 0) {
                const allSources: SearchResult[] = [...existing, ...newSources]
                yield* Ref.set(extractedSourcesRef, allSources)
                yield* Redux.dispatch(updateLastMessage({
                  metadata: { sources: allSources }
                }))
              }
            }
          }
        }
      }
    })
  ).pipe(
    Effect.catchAll(() => Effect.void)
  )

  /** @Logic.Chat.PostStream */
  const assistantContent = yield* Ref.get(assistantContentRef)
  const matches = [...assistantContent.matchAll(/```json\n([\s\S]*?)\n```\n/g)]

  const results = yield* Effect.forEach(matches, (match) =>
    Effect.gen(function* () {
      const raw = match[0]
      const jsonStr = match[1]
      try {
        const block = JSON.parse(jsonStr as string)
        return { block, raw }
      } catch {
        return null
      }
    })
  )

  const jsonBlocks = results.filter((r): r is { block: typeof r extends { block: infer B } ? B : never; raw: string } => r !== null)

  if (jsonBlocks.length > 0) {
    let processedContent = assistantContent
    for (const { raw } of jsonBlocks) {
      processedContent = processedContent.replace(raw, "").trim()
    }

    /** @Logic.Chat.AdaptiveExtraction */
    const adaptiveBlocks = jsonBlocks.map(b => b.block as { type: string; data: unknown })
    const suggestionItems = adaptiveBlocks
      .filter(block => block.type === "suggestions")
      .flatMap(block => (block.data as { items?: Array<{ label: string; action: string }> }).items || [])

    if (suggestionItems.length > 0) {
      yield* Redux.dispatch(setSuggestions(suggestionItems))
    }

    yield* Redux.dispatch(setActiveAdaptiveData(jsonBlocks.map(b => b.block)))
    const finalSources = yield* Ref.get(extractedSourcesRef)
    yield* Redux.dispatch(updateLastMessage({
      content: processedContent,
      metadata: {
        sources: finalSources,
        searchQuery: assistantContent.match(/Buscando\s+"([^"]+)"/i)?.[1] || undefined
      }
    }))
  } else {
    /** @Logic.Chat.SourceExtraction.NoBlocks */
    const realtimeSources = yield* Ref.get(extractedSourcesRef)

    if (realtimeSources.length === 0) {
      const latestState = yield* Redux.getState()
      const lastMessage = latestState.chat.messages[latestState.chat.messages.length - 1]
      const thoughtContent = lastMessage?.metadata?.thought || ""
      const allContent = assistantContent + " " + thoughtContent
      const urlRegex = /(https?:\/\/[^\s)<>"]+)/g
      const foundUrls = allContent.match(urlRegex) || []
      const uniqueUrls = Array.from(new Set(foundUrls))
      const postSources: SearchResult[] = uniqueUrls.map(url => {
        try {
          const domain = new URL(url).hostname.replace('www.', '')
          return { title: domain, url, source: domain, verified: false }
        } catch {
          return { title: url, url, verified: false }
        }
      })
      if (postSources.length > 0) {
        yield* Redux.dispatch(updateLastMessage({ metadata: { sources: postSources } }))
      }
    }
  }
})

/** @Logic.Chat.Send */
export const sendChatMessage = (content: string): Effect.Effect<void, never, OpenRouter | Redux | ConfigService> =>
  Effect.gen(function* () {
    if (!content.trim()) return

    yield* Redux.dispatch(addMessage({ role: "user" as const, content }))
    yield* Redux.dispatch(setLoading(true))
    yield* Redux.dispatch(setError(null))
    yield* Redux.dispatch(setSuggestions([]))

    yield* generateResponse
  }).pipe(
    Effect.ensuring(Redux.dispatch(setLoading(false))),
    Effect.catchAll((err) =>
      Effect.gen(function* () {
        yield* Effect.logError(`[Chat] Fatal Error: ${String(err)}`)
        const config = yield* ConfigService
        yield* Redux.dispatch(setError(config.errorMessages.connectionError))
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
        const config = yield* ConfigService
        yield* Redux.dispatch(setError(config.errorMessages.connectionError))
      })
    )
  )

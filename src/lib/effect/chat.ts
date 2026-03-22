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
import { setApiError } from "@/store/slices/uiSlice"
import { OpenRouterError } from "./errors"
import type { AdaptiveData } from "@/types/chat"
import { extractUrls, toSource } from "@/lib/url"

const URL_MAX_LEN = 2083

/** @Logic.Effect.Chat.Init */
export const initChat = Effect.gen(function* () {
  const config = yield* ConfigService
  yield* Redux.dispatch(clearChatHistory())
  yield* Redux.dispatch(addMessage({ role: "system" as const, content: config.systemPrompt }))
})

/** @Logic.Chat.GenerateResponse.Internal */
const generateResponse: Effect.Effect<void, OpenRouterError, OpenRouter | Redux> = Effect.gen(function* () {
  const openRouter = yield* OpenRouter
  const messages = yield* Redux.getState().pipe(Effect.map((s) => s.chat.messages))
  const stream = openRouter.chat(messages)

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

        if (parsed._tag === "None") {
          yield* Effect.logDebug(`[Chat] Skipped malformed stream line: ${dataStr.slice(0, 100)}`)
          continue
        }
        const json = parsed.value
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
            delta.reasoning || delta.reasoning_details?.map((d) => d.text).join("") || ""
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
        return { block: JSON.parse(match[1] as string), raw: match[0] }
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

    if (suggestions.length > 0) yield* Redux.dispatch(setSuggestions(suggestions))

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
): Effect.Effect<void, never, OpenRouter | Redux | ConfigService> =>
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

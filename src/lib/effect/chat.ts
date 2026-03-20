import { Effect, Ref, Stream, Schema } from "effect"
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
import { 
  AdaptiveBlock 
} from "./schemas/AdaptiveCardsSchema"
import { 
  THINKING_PHASES, 
  DEFAULT_THINKING_STATUS 
} from "./constants/ChatConstants"

/** @Logic.Effect.Chat.Helpers */
const getThinkingStatus = (length: number): string => {
  const phase = THINKING_PHASES.find(p => length < p.threshold)
  return phase ? phase.status : DEFAULT_THINKING_STATUS
}

/** @Logic.Effect.Chat */
export const initChat = Effect.gen(function* () {
  const config = yield* ConfigService

  yield* Redux.dispatch(clearChatHistory())
  yield* Redux.dispatch(addMessage({
    role: "system" as const,
    content: config.systemPrompt
  }))
})

/** @Logic.Effect.Chat.Send */
export const sendChatMessage = (content: string) => Effect.gen(function* () {
  const openRouter = yield* OpenRouter

  if (!content.trim()) return

  yield* Redux.dispatch(addMessage({ role: "user" as const, content }))
  yield* Redux.dispatch(setLoading(true))
  yield* Redux.dispatch(setError(null))
  yield* Redux.dispatch(setSuggestions([]))
  yield* Redux.dispatch(setActiveAdaptiveData([]))

  const state = yield* Redux.getState()
  const messages = state.chat.messages
  const stream = openRouter.chat(messages)

  yield* Redux.dispatch(addMessage({ role: "assistant" as const, content: "" }))

  /** @Logic.Chat.Ref */
  const assistantContentRef = yield* Ref.make("")
  const pendingBufferRef = yield* Ref.make("")
  const thoughtStartTimeRef = yield* Ref.make(0)

  /** @Logic.Chat.StreamConsumption */
  yield* Stream.runForEach(stream, (chunk: string) =>
    Effect.gen(function* () {
      const pending = yield* Ref.get(pendingBufferRef)
      let remaining = pending + chunk
      yield* Ref.set(pendingBufferRef, "")

      const lines = remaining.split("\n")
      /** @Logic.Chat.PartialChunk */
      if (!remaining.endsWith("\n")) {
        const incomplete = lines.pop() || ""
        yield* Ref.set(pendingBufferRef, incomplete)
      }

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(":")) continue

        if (trimmed.startsWith("data: ")) {
          const dataStr = trimmed.substring(6)
          if (dataStr === "[DONE]") break

          const parseResult = yield* Effect.try({
            try: () => JSON.parse(dataStr) as { choices?: Array<{ delta?: { reasoning?: string; reasoning_details?: Array<{ text: string }>; content?: string } }> },
            catch: (e) => ({ _tag: "ParseError" as const, cause: e, raw: dataStr })
          }).pipe(Effect.option)

          if (parseResult._tag === "None") continue

          const json = parseResult.value
          const delta = json.choices?.[0]?.delta
          if (!delta) continue

          /** @Logic.Chat.Reasoning */
          if (delta.reasoning || delta.reasoning_details) {
            const reasoningText = delta.reasoning ||
              delta.reasoning_details?.map((d) => d.text).join("") || ""

            if (reasoningText) {
              const current = yield* Ref.get(thoughtStartTimeRef)
              if (current === 0) yield* Ref.set(thoughtStartTimeRef, Date.now())

              const chatState = (yield* Redux.getState()).chat.messages
              const lastMessage = chatState[chatState.length - 1]
              const currentThought = lastMessage?.metadata?.thought || ""
              const newThought = currentThought + reasoningText

              yield* Redux.dispatch(updateLastMessage({
                metadata: {
                  thought: newThought,
                  thoughtDuration: `status:${getThinkingStatus(newThought.length)}`
                }
              }))
            }
          }

          /** @Logic.Chat.Content */
          if (delta.content) {
            const startTime = yield* Ref.get(thoughtStartTimeRef)
            if (startTime > 0) {
              const duration = ((Date.now() - startTime) / 1000).toFixed(1)
              yield* Redux.dispatch(updateLastMessage({
                metadata: { thoughtDuration: `completed:${duration}s` }
              }))
              yield* Ref.set(thoughtStartTimeRef, 0)
            }
            yield* Ref.update(assistantContentRef, (prev) => prev + delta.content!)
            const current = yield* Ref.get(assistantContentRef)
            yield* Redux.dispatch(updateLastMessage({ content: current }))
          }
        }
      }
    })
  )

  /** @Logic.Chat.PostStream */
  yield* Redux.dispatch(setActiveAdaptiveData([]))

  const assistantContent = yield* Ref.get(assistantContentRef)

  const matches = [...assistantContent.matchAll(/```json\n([\s\S]*?)\n```/g)]

  const results = yield* Effect.forEach(matches, (match) =>
    Effect.gen(function* () {
      const rawMatch = match[0]
      const rawJson = match[1]
      if (!rawMatch || !rawJson) return null
      const decoded = yield* Effect.try({
        try: () => {
          const parsed = JSON.parse(rawJson) as unknown
          return Schema.decodeUnknownSync(AdaptiveBlock)(parsed)
        },
        catch: () => null
      })
      return decoded ? { block: decoded, raw: rawMatch } : null
    }),
    { concurrency: "unbounded" }
  )

  const jsonBlocks = results.filter((r): r is { block: typeof r extends { block: infer B } ? B : never; raw: string } => r !== null)

  if (jsonBlocks.length > 0) {
    let processedContent = assistantContent
    for (const { raw } of jsonBlocks) {
      processedContent = processedContent.replace(raw, "").trim()
    }
    yield* Redux.dispatch(setActiveAdaptiveData(jsonBlocks.map(b => b.block)))
    yield* Redux.dispatch(updateLastMessage({ content: processedContent }))
  }

  yield* Redux.dispatch(setLoading(false))
}).pipe(
  Effect.catchAll((err) =>
    Effect.gen(function* () {
      yield* Effect.logError(`[Chat] Fatal Error: ${String(err)}`)
      const config = yield* ConfigService
      yield* Redux.dispatch(setError(config.errorMessages.connectionError))
      yield* Redux.dispatch(setLoading(false))
    })
  )
)

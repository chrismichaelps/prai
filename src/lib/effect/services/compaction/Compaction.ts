/** @Service.Effect.Compaction */

import { Effect } from "effect"
import type { CompactionResult } from "../../schemas/compaction/CompactionSchema"
import { CompactionError } from "../../errors"
import { TokenEstimationService } from "../token/TokenEstimation"
import {
  AUTO_COMPACT_THRESHOLD,
  MICRO_COMPACT_MAX_RESULTS,
  TOOL_RESULT_STUB,
  MIN_MESSAGES_TO_COMPACT,
  COMPACT_SUMMARY_PROMPT,
  COMPACT_MAX_OUTPUT_TOKENS
} from "../../constants/compaction/CompactionConstants"

/** @Type.Compaction.Message */
type CompactableMessage = {
  readonly role: string
  readonly content: string
  readonly name?: string
  readonly tool_calls?: unknown[]
  readonly tool_call_id?: string
}

/** @Service.Effect.Compaction.Class */
export class CompactionService extends Effect.Service<CompactionService>()("Compaction", {
  dependencies: [TokenEstimationService.Default],
  effect: Effect.gen(function* () {
    const tokenEstimation = yield* TokenEstimationService

    const shouldAutoCompact = (
      tokenCount: number,
      threshold?: number
    ): boolean => tokenCount >= (threshold ?? AUTO_COMPACT_THRESHOLD)

    const microCompact = (
      messages: ReadonlyArray<CompactableMessage>,
      maxRecentResults?: number
    ): Effect.Effect<{ messages: CompactableMessage[]; result: CompactionResult }, CompactionError> =>
      Effect.try({
        try: () => {
          const maxRecent = maxRecentResults ?? MICRO_COMPACT_MAX_RESULTS
          const preTokenCount = messages.reduce(
            (sum, m) => sum + tokenEstimation.estimateTokenCount(m.content), 0
          )

          const toolResultIndices: number[] = []
          messages.forEach((m, i) => {
            if (m.role === "tool") toolResultIndices.push(i)
          })

          const indicesToStub = toolResultIndices.slice(0, -maxRecent)

          const compacted = messages.map((m, i) => {
            if (indicesToStub.includes(i)) {
              return { ...m, content: TOOL_RESULT_STUB }
            }
            return { ...m }
          })

          const postTokenCount = compacted.reduce(
            (sum, m) => sum + tokenEstimation.estimateTokenCount(m.content), 0
          )

          return {
            messages: compacted,
            result: {
              summary: undefined,
              preTokenCount,
              postTokenCount,
              method: "micro" as const,
              messagesRemoved: 0,
              messagesKept: messages.length
            }
          }
        },
        catch: (e) =>
          new CompactionError({
            message: `Micro-compact failed: ${String(e)}`,
            method: "micro",
            cause: e
          })
      })

    const buildCompactPrompt = (
      messages: ReadonlyArray<CompactableMessage>,
      customInstructions?: string
    ): string => {
      const conversationText = messages
        .filter((m) => m.role !== "system" && m.content !== TOOL_RESULT_STUB)
        .map((m) => {
          const roleLabel = m.role === "user" ? "Usuario" : m.role === "assistant" ? "Asistente" : m.role
          const content = m.content.slice(0, 2000)
          return `${roleLabel}: ${content}`
        })
        .join("\n\n")

      const basePrompt = COMPACT_SUMMARY_PROMPT
      const instructions = customInstructions
        ? `${basePrompt}\n\nAdditional instructions: ${customInstructions}`
        : basePrompt

      return `${instructions}\n\n--- CONVERSATION ---\n${conversationText}\n---`
    }

    const fullCompact = (
      messages: ReadonlyArray<CompactableMessage>,
      summaryResponse: string
    ): Effect.Effect<{ messages: CompactableMessage[]; result: CompactionResult }, CompactionError> =>
      Effect.sync(() => {
        if (messages.length < MIN_MESSAGES_TO_COMPACT) {
          throw new CompactionError({
            message: "No hay suficientes mensajes para compactar",
            method: "full",
            cause: undefined
          })
        }

        const preTokenCount = messages.reduce(
          (sum, m) => sum + tokenEstimation.estimateTokenCount(m.content), 0
        )

        const summaryMessage: CompactableMessage = {
          role: "user",
          content: `[Resumen de conversación previa]\n${summaryResponse}\n\n[La conversación continúa desde aquí. Usa el resumen acima como contexto.]`
        }

        const compactedMessages = [summaryMessage]
        const postTokenCount = compactedMessages.reduce(
          (sum, m) => sum + tokenEstimation.estimateTokenCount(m.content), 0
        )

        return {
          messages: compactedMessages,
          result: {
            summary: summaryResponse,
            preTokenCount,
            postTokenCount,
            method: "full" as const,
            messagesRemoved: messages.length,
            messagesKept: 1
          }
        }
      })

    return { shouldAutoCompact, microCompact, buildCompactPrompt, fullCompact } as const
  })
}) {}

/** @Constant.Compaction.ExportThreshold */
export { AUTO_COMPACT_THRESHOLD, COMPACT_MAX_OUTPUT_TOKENS }

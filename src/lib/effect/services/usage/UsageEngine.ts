/** @Service.Effect.UsageEngine */

import { Effect, pipe } from "effect"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { TierKey } from "../../constants/tier/TierPolicy"
import type { SubscriptionTierType } from "../../constants/SubscriptionConstants"
import { UsageEngineError } from "../../errors"
import { CompactionService } from "../compaction"
import { TokenEstimationService } from "../token"
import { getTierContextThreshold, MIN_MESSAGES_TO_COMPACT } from "../../constants/compaction/CompactionConstants"

type TierInput = TierKey | SubscriptionTierType

/** @Type.UsageEngine.DeniedReason */
export type UsageDeniedReason =
  | "global_quota"
  | "daily_messages"
  | "daily_cost"
  | "user_not_found"

/** @Type.UsageEngine.CheckResult */
export type UsageCheckResult =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: UsageDeniedReason }

/** @Logic.UsageEngine.CanSend */
export const canSend = (
  userId: string,
  tier: TierInput,
  supabase: SupabaseClient
): Effect.Effect<UsageCheckResult, UsageEngineError> =>
  pipe(
    Effect.tryPromise({
      try: async () => {
        const { data, error } = await supabase.rpc(
          "check_and_increment_openrouter_quota",
          { p_user_id: userId, p_tier: tier }
        )

        if (error) {
          throw new UsageEngineError({
            message: `Quota RPC failed: ${error.message}`,
            cause: error,
          })
        }

        const row = data?.[0] as { allowed: boolean; reason: string } | undefined
        if (!row) {
          throw new UsageEngineError({ message: "Quota RPC returned no data" })
        }

        if (!row.allowed) {
          return {
            allowed: false as const,
            reason: row.reason as UsageDeniedReason,
          }
        }

        return { allowed: true as const }
      },
      catch: (e) =>
        e instanceof UsageEngineError
          ? e
          : new UsageEngineError({ message: String(e), cause: e }),
    })
  )

/** @Logic.UsageEngine.UsageErrorMessage */
export const usageErrorMessage = (reason: UsageDeniedReason): string => {
  switch (reason) {
    case "global_quota":
      return "El servicio está al límite de capacidad. Intenta de nuevo más tarde."
    case "daily_messages":
      return "Has alcanzado tu límite de mensajes diarios. Se renueva a medianoche."
    case "daily_cost":
      return "Has alcanzado tu presupuesto de uso diario. Se renueva mañana."
    case "user_not_found":
      return "No se encontró tu cuenta de usuario."
  }
}

type CompactableMessage = {
  readonly role: string
  readonly content: string
  readonly name?: string
  readonly tool_calls?: unknown[]
  readonly tool_call_id?: string
}

/** @Logic.UsageEngine.CheckAndCompact */
export const checkAndCompact = (
  messages: ReadonlyArray<CompactableMessage>,
  tier: TierInput
): Effect.Effect<CompactableMessage[], never, CompactionService | TokenEstimationService> =>
  Effect.gen(function* () {
    const tokenSvc = yield* TokenEstimationService
    const compaction = yield* CompactionService

    const threshold = getTierContextThreshold(tier as TierKey)
    const totalTokens = tokenSvc.estimateTokenCount(
      messages.map((m) => m.content).join(" ")
    )

    if (totalTokens <= threshold) return [...messages]
    if (messages.length < MIN_MESSAGES_TO_COMPACT) return [...messages]

    const { messages: compacted } = yield* compaction.microCompact(messages).pipe(
      Effect.orElse(() => Effect.succeed({ messages: [...messages], result: null as never }))
    )

    return compacted
  })

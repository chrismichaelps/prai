/** @Service.Effect.CostTracker */

import { Effect } from "effect"
import type { CostEntry, SessionCost } from "../../schemas/token/TokenEstimationSchema"
import { CostTrackingError } from "../../errors"
import { COST_DISPLAY_THRESHOLD, COST_PRECISION } from "../../constants/token/CostConstants"

/** @Logic.CostTracker.ComputeSessionCost */
const computeSessionCost = (entries: ReadonlyArray<CostEntry>): SessionCost => {
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0)
  const totalInputTokens = entries.reduce((sum, e) => sum + e.inputTokens, 0)
  const totalOutputTokens = entries.reduce((sum, e) => sum + e.outputTokens, 0)
  return {
    entries: [...entries],
    totalCost,
    totalInputTokens,
    totalOutputTokens,
    totalTokens: totalInputTokens + totalOutputTokens
  }
}

/** @Service.Effect.CostTracker.Class */
export class CostTrackerService extends Effect.Service<CostTrackerService>()("CostTracker", {
  effect: Effect.gen(function* () {
    let sessionEntries: CostEntry[] = []

    const recordUsage = (
      model: string,
      usage: { readonly input_tokens?: number; readonly output_tokens?: number; readonly cost?: number }
    ): Effect.Effect<SessionCost, CostTrackingError> =>
      Effect.try({
        try: () => {
          const entry: CostEntry = {
            model,
            inputTokens: usage.input_tokens ?? 0,
            outputTokens: usage.output_tokens ?? 0,
            cost: usage.cost ?? 0,
            timestamp: Date.now()
          }
          sessionEntries = [...sessionEntries, entry]
          return computeSessionCost(sessionEntries)
        },
        catch: (e) =>
          new CostTrackingError({
            message: `Failed to record usage: ${String(e)}`,
            cause: e
          })
      })

    const getSessionCost = (): Effect.Effect<SessionCost, CostTrackingError> =>
      Effect.try({
        try: () => computeSessionCost(sessionEntries),
        catch: (e) =>
          new CostTrackingError({
            message: `Failed to get session cost: ${String(e)}`,
            cause: e
          })
      })

    const resetSession = (): Effect.Effect<void> =>
      Effect.sync(() => {
        sessionEntries = []
      })

    const formatCost = (amount: number): string => {
      const precision = amount >= COST_DISPLAY_THRESHOLD
        ? COST_PRECISION.low
        : COST_PRECISION.high
      return `$${amount.toFixed(precision)}`
    }

    return { recordUsage, getSessionCost, resetSession, formatCost } as const
  })
}) {}

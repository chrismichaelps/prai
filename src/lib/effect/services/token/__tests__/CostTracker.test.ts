/** @Test.CostTracker */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { CostTrackerService } from "../CostTracker"
import { COST_DISPLAY_THRESHOLD } from "../../../constants/token/CostConstants"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, CostTrackerService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(CostTrackerService.Default)))

describe("CostTracker", () => {
  /** @Test.CostTracker.RecordUsage */
  describe("recordUsage", () => {
    it("records usage and returns session cost", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CostTrackerService
          return yield* svc.recordUsage("openrouter/free", {
            input_tokens: 100,
            output_tokens: 50,
            cost: 0.001
          })
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.totalCost).toBe(0.001)
        expect(exit.value.totalInputTokens).toBe(100)
        expect(exit.value.totalOutputTokens).toBe(50)
      }
    })
  })

  /** @Test.CostTracker.FormatCost */
  describe("formatCost", () => {
    it("formats small costs with high precision", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CostTrackerService
          return svc.formatCost(0.0001)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain("$")
        expect(exit.value).toContain("0.0001")
      }
    })

    it("formats large costs with low precision", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CostTrackerService
          return svc.formatCost(COST_DISPLAY_THRESHOLD + 1)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain("$")
      }
    })
  })
})

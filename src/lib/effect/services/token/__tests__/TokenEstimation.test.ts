/** @Test.TokenEstimation */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { TokenEstimationService } from "../TokenEstimation"
import { BYTES_PER_TOKEN, MESSAGE_ROLE_OVERHEAD_TOKENS } from "../../../constants/token/CostConstants"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, TokenEstimationService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(TokenEstimationService.Default)))

describe("TokenEstimation", () => {
  /** @Test.TokenEstimation.EstimateTokens.Text */
  describe("estimateTokens", () => {
    it("estimates tokens for plain text", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* TokenEstimationService
          return yield* svc.estimateTokens("Hello, world! This is a test.")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        const estimate = exit.value
        expect(estimate.tokens).toBeGreaterThan(0)
        expect(estimate.method).toBe("rough")
        const expectedTokens = Math.ceil("Hello, world! This is a test.".length / BYTES_PER_TOKEN.text)
        expect(estimate.tokens).toBe(expectedTokens)
      }
    })

    it("estimates tokens for JSON content with different ratio", async () => {
      const jsonContent = '{"key": "value", "nested": {"a": 1}}'
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* TokenEstimationService
          return yield* svc.estimateTokens(jsonContent)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        const expectedTokens = Math.ceil(jsonContent.length / BYTES_PER_TOKEN.json)
        expect(exit.value.tokens).toBe(expectedTokens)
      }
    })
  })

  /** @Test.TokenEstimation.EstimateTokenCount */
  describe("estimateTokenCount", () => {
    it("returns synchronous token count", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* TokenEstimationService
          return svc.estimateTokenCount("Test string")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toBeGreaterThan(0)
      }
    })
  })

  /** @Test.TokenEstimation.EstimateMessagesTokens */
  describe("estimateMessagesTokens", () => {
    it("estimates total tokens for array of messages", async () => {
      const messages = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there, how can I help?" }
      ]

      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* TokenEstimationService
          return yield* svc.estimateMessagesTokens(messages)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        const expectedMin = messages.length * MESSAGE_ROLE_OVERHEAD_TOKENS
        expect(exit.value).toBeGreaterThan(expectedMin)
      }
    })
  })
})

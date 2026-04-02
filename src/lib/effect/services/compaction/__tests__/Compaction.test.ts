/** @Test.Compaction */

import { describe, it, expect } from "vitest"
import { Effect, Exit, Layer } from "effect"
import { CompactionService } from "../Compaction"
import { TokenEstimationService } from "../../token/TokenEstimation"
import { AUTO_COMPACT_THRESHOLD, TOOL_RESULT_STUB } from "../../../constants/compaction/CompactionConstants"

/** @Logic.Test.CompactionLayer */
const CompactionLayer = CompactionService.Default.pipe(
  Layer.provide(TokenEstimationService.Default)
)

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, CompactionService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(CompactionLayer)))

describe("Compaction", () => {
  /** @Test.Compaction.ShouldAutoCompact */
  describe("shouldAutoCompact", () => {
    it("returns true when token count exceeds threshold", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return svc.shouldAutoCompact(AUTO_COMPACT_THRESHOLD + 1)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(true)
    })

    it("returns false when token count is below threshold", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return svc.shouldAutoCompact(AUTO_COMPACT_THRESHOLD - 1)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(false)
    })
  })

  /** @Test.Compaction.MicroCompact */
  describe("microCompact", () => {
    it("stubs old tool results and keeps recent ones", async () => {
      const messages = [
        { role: "user", content: "Find beaches" },
        { role: "assistant", content: "", tool_calls: [{ id: "1", function: { name: "search_beaches", arguments: "{}" } }] },
        { role: "tool", content: '{"beaches": ["Flamenco"]}', tool_call_id: "1" },
        { role: "assistant", content: "Here are beaches" },
        { role: "user", content: "Find restaurants" },
        { role: "assistant", content: "", tool_calls: [{ id: "2", function: { name: "search_restaurants", arguments: "{}" } }] },
        { role: "tool", content: '{"restaurants": ["La Placita"]}', tool_call_id: "2" },
        { role: "assistant", content: "Here are restaurants" }
      ]

      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return yield* svc.microCompact(messages, 1)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        const { messages: compacted, result } = exit.value
        expect(compacted.at(2)?.content).toBe(TOOL_RESULT_STUB)
        expect(compacted.at(6)?.content).toBe('{"restaurants": ["La Placita"]}')
        expect(result.method).toBe("micro")
      }
    })
  })

  /** @Test.Compaction.BuildCompactPrompt */
  describe("buildCompactPrompt", () => {
    it("builds prompt from messages excluding system and stubs", async () => {
      const messages = [
        { role: "system", content: "System prompt" },
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there" },
        { role: "tool", content: TOOL_RESULT_STUB }
      ]

      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return svc.buildCompactPrompt(messages)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain("Usuario: Hello")
        expect(exit.value).not.toContain("System prompt")
      }
    })
  })

  /** @Test.Compaction.FullCompact */
  describe("fullCompact", () => {
    it("creates summary message from response", async () => {
      const messages = [
        { role: "user", content: "Find beaches" },
        { role: "assistant", content: "Here are beaches" },
        { role: "user", content: "Find restaurants" },
        { role: "assistant", content: "Here are restaurants" }
      ]

      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return yield* svc.fullCompact(messages, "User asked about beaches and restaurants in PR")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        const { messages: compacted, result } = exit.value
        expect(compacted).toHaveLength(1)
        expect(compacted.at(0)?.content).toContain("Previous conversation summary")
        expect(result.method).toBe("full")
      }
    })

    it("fails when too few messages", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CompactionService
          return yield* svc.fullCompact([{ role: "user", content: "Hello" }], "summary")
        })
      )

      expect(Exit.isFailure(exit)).toBe(true)
    })
  })
})

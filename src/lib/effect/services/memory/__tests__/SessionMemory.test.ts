/** @Test.SessionMemory */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { SessionMemoryService } from "../SessionMemory"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, SessionMemoryService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(SessionMemoryService.Default)))

describe("SessionMemory", () => {
  /** @Test.SessionMemory.Extract */
  describe("extractMemories", () => {
    it("extracts food preferences", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          yield* svc.reset()
          return yield* svc.extractMemories([
            { role: "user", content: "Prefiero comida italiana" },
            { role: "assistant", content: "Entendido" }
          ])
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.length).toBeGreaterThan(0)
        expect(exit.value.at(0)?.key).toBe("food_preference")
        expect(exit.value.at(0)?.category).toBe("preference")
      }
    })

    it("skips assistant messages", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          yield* svc.reset()
          return yield* svc.extractMemories([
            { role: "assistant", content: "Prefiero comida italiana" }
          ])
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toHaveLength(0)
    })
  })

  /** @Test.SessionMemory.Store */
  describe("storeMemories", () => {
    it("stores new entries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          yield* svc.reset()
          return yield* svc.storeMemories([
            { key: "test", value: "value", category: "preference" as const, extractedAt: Date.now() }
          ])
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value.entries).toHaveLength(1)
    })

    it("deduplicates by key", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          yield* svc.reset()
          yield* svc.storeMemories([
            { key: "test", value: "value1", category: "preference" as const, extractedAt: Date.now() }
          ])
          return yield* svc.storeMemories([
            { key: "test", value: "value2", category: "preference" as const, extractedAt: Date.now() }
          ])
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.entries).toHaveLength(1)
        expect(exit.value.entries.at(0)?.value).toBe("value1")
      }
    })
  })

  /** @Test.SessionMemory.BuildPrompt */
  describe("buildMemoryPrompt", () => {
    it("builds grouped prompt from entries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          return svc.buildMemoryPrompt({
            entries: [
              { key: "food", value: "italian", category: "preference" as const, extractedAt: 0 },
              { key: "budget", value: "$500", category: "fact" as const, extractedAt: 0 }
            ]
          })
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain("<session_memory>")
        expect(exit.value).toContain("[preference]")
        expect(exit.value).toContain("food: italian")
      }
    })

    it("returns empty string for no entries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SessionMemoryService
          return svc.buildMemoryPrompt({ entries: [] })
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe("")
    })
  })
})

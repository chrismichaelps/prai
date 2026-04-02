/** @Test.Coordinator */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { CoordinatorService, MAX_CONCURRENT_WORKERS } from "../Coordinator"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, CoordinatorService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(CoordinatorService.Default)))

describe("Coordinator", () => {
  /** @Test.Coordinator.CreateWorker */
  describe("createWorker", () => {
    it("creates a pending worker", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          return yield* svc.createWorker("Research beaches")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.status).toBe("pending")
        expect(exit.value.prompt).toBe("Research beaches")
      }
    })
  })

  /** @Test.Coordinator.UpdateWorker */
  describe("updateWorker", () => {
    it("updates worker status and result", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          const worker = yield* svc.createWorker("Research task")
          return yield* svc.updateWorker(worker.id, { status: "completed", result: "Found 5 beaches" })
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value?.status).toBe("completed")
        expect(exit.value?.result).toBe("Found 5 beaches")
      }
    })

    it("returns null for unknown worker", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          return yield* svc.updateWorker("unknown_id", { status: "failed" })
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBeNull()
    })
  })

  /** @Test.Coordinator.Phases */
  describe("setPhase", () => {
    it("transitions through phases", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          yield* svc.setPhase("research")
          const s1 = yield* svc.getState()
          yield* svc.setPhase("synthesis")
          const s2 = yield* svc.getState()
          return { phase1: s1.phase, phase2: s2.phase }
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.phase1).toBe("research")
        expect(exit.value.phase2).toBe("synthesis")
      }
    })
  })

  /** @Test.Coordinator.ConcurrencyLimit */
  describe("canSpawnWorker", () => {
    it("blocks spawning at limit", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          for (let i = 0; i < MAX_CONCURRENT_WORKERS; i++) {
            yield* svc.createWorker(`Task ${i}`)
          }
          return yield* svc.canSpawnWorker()
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(false)
    })

    it("allows spawning after completion", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          yield* svc.reset()
          const w1 = yield* svc.createWorker("Task 0")
          for (let i = 1; i < MAX_CONCURRENT_WORKERS; i++) {
            yield* svc.createWorker(`Task ${i}`)
          }
          yield* svc.updateWorker(w1.id, { status: "completed" })
          return yield* svc.canSpawnWorker()
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(true)
    })
  })

  /** @Test.Coordinator.BuildPrompt */
  describe("buildWorkerPrompt", () => {
    it("builds a self-contained worker prompt", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* CoordinatorService
          return svc.buildWorkerPrompt("Find restaurants", "User is in San Juan")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain("Find restaurants")
        expect(exit.value).toContain("User is in San Juan")
      }
    })
  })
})

/** @Test.Proactive */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { ProactiveService } from "../Proactive"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, ProactiveService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(ProactiveService.Default)))

describe("Proactive", () => {
  /** @Test.Proactive.CreateAlert */
  describe("createAlert", () => {
    it("creates an alert with correct fields", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          return yield* svc.createAlert("weather_change", "Rain expected", "medium")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.type).toBe("weather_change")
        expect(exit.value.message).toBe("Rain expected")
        expect(exit.value.priority).toBe("medium")
      }
    })

    it("sets expiration when provided", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          return yield* svc.createAlert("event_reminder", "Concert tonight", "high", 3600000)
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value.expiresAt).toBeDefined()
        expect(exit.value.expiresAt! - exit.value.timestamp).toBe(3600000)
      }
    })
  })

  /** @Test.Proactive.ShouldNotify */
  describe("shouldNotify", () => {
    it("returns false when disabled", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          return yield* svc.shouldNotify("weather_change")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(false)
    })

    it("returns true when enabled and no prior alerts", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          yield* svc.updateConfig({ enabled: true })
          return yield* svc.shouldNotify("weather_change")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(true)
    })

    it("throttles repeated alerts of same type", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          yield* svc.updateConfig({ enabled: true, throttleMs: 999999 })
          yield* svc.createAlert("weather_change", "Rain", "low")
          return yield* svc.shouldNotify("weather_change")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBe(false)
    })
  })

  /** @Test.Proactive.ActiveAlerts */
  describe("getActiveAlerts", () => {
    it("returns unexpired alerts", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          yield* svc.createAlert("weather_change", "Rain", "low", 999999)
          return yield* svc.getActiveAlerts()
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toHaveLength(1)
    })

    it("filters expired alerts", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* ProactiveService
          yield* svc.reset()
          yield* svc.createAlert("weather_change", "Rain", "low", -1)
          return yield* svc.getActiveAlerts()
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toHaveLength(0)
    })
  })
})

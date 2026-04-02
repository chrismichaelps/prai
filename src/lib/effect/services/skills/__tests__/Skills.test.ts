/** @Test.Skills */

import { describe, it, expect } from "vitest"
import { Effect, Exit } from "effect"
import { SkillsService } from "../Skills"

/** @Logic.Test.RunWithService */
const run = <A>(effect: Effect.Effect<A, unknown, SkillsService>) =>
  Effect.runPromiseExit(effect.pipe(Effect.provide(SkillsService.Default)))

describe("Skills", () => {
  /** @Test.Skills.Match */
  describe("matchSkill", () => {
    it("matches restaurant-related queries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          return yield* svc.matchSkill("Dónde puedo comer mofongo?")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).not.toBeNull()
        expect(exit.value!.skill.name).toBe("restaurants")
      }
    })

    it("matches beach-related queries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          return yield* svc.matchSkill("Best beach for snorkeling")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value!.skill.name).toBe("beaches")
      }
    })

    it("matches emergency queries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          return yield* svc.matchSkill("Necesito un hospital urgente")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value!.skill.name).toBe("emergency")
      }
    })

    it("returns null for unrelated queries", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          return yield* svc.matchSkill("What is the meaning of life?")
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value).toBeNull()
    })
  })

  /** @Test.Skills.GetAll */
  describe("getAllSkills", () => {
    it("returns all registered skills", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          return yield* svc.getAllSkills()
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) expect(exit.value.length).toBe(7)
    })
  })

  /** @Test.Skills.BuildPrompt */
  describe("buildSkillPrompt", () => {
    it("wraps skill instructions in XML tag", async () => {
      const exit = await run(
        Effect.gen(function* () {
          const svc = yield* SkillsService
          const match = yield* svc.matchSkill("Find me a restaurant")
          return match ? svc.buildSkillPrompt(match) : ""
        })
      )

      expect(Exit.isSuccess(exit)).toBe(true)
      if (Exit.isSuccess(exit)) {
        expect(exit.value).toContain('<active_skill name="restaurants">')
        expect(exit.value).toContain("</active_skill>")
      }
    })
  })
})

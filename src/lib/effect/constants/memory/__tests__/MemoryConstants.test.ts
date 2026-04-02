/** @Test.MemoryConstants */

import { describe, it, expect } from "vitest"
import { MEMORY_PATTERNS } from "../MemoryConstants"

describe("MemoryConstants", () => {
  describe("MEMORY_PATTERNS", () => {
    it("has patterns for allergies", () => {
      const allergyPatterns = MEMORY_PATTERNS.filter(p => p.key === "allergy")
      expect(allergyPatterns.length).toBeGreaterThan(0)
    })

    it("has patterns for food preferences", () => {
      const foodPatterns = MEMORY_PATTERNS.filter(p => p.key === "food_preference")
      expect(foodPatterns.length).toBeGreaterThan(0)
    })

    it("has patterns for travel group", () => {
      const groupPatterns = MEMORY_PATTERNS.filter(p => p.key === "travel_group")
      expect(groupPatterns.length).toBeGreaterThan(0)
    })

    it("patterns match Spanish 'soy alérgico a los mariscos'", () => {
      const content = "soy alérgico a los mariscos"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
      expect(matchingPatterns.some(p => p.key === "allergy")).toBe(true)
    })

    it("patterns match 'tengo alergia a los mariscos'", () => {
      const content = "tengo alergia a los mariscos"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
      expect(matchingPatterns.some(p => p.key === "allergy")).toBe(true)
    })

    it("patterns match 'me llamo Chris' for name extraction", () => {
      const content = "hola, me llamo Chris"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
    })

    it("patterns match family environment preferences", () => {
      const content = "prefiero los ambientes familiares y tranquilos"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
    })

    it("patterns match exact user message: 'soy alérgico a los mariscos y prefiero ambientes familiares'", () => {
      const content = "soy alérgico a los mariscos y prefiero los ambientes familiares y tranquilos"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
      
      const keys = matchingPatterns.map(p => p.key)
      expect(keys).toContain("allergy")
    })

    it("patterns match user name from 'me llamo Chris'", () => {
      const content = "me llamo Chris"
      const matchingPatterns = MEMORY_PATTERNS.filter(p => p.pattern.test(content))
      expect(matchingPatterns.length).toBeGreaterThan(0)
      expect(matchingPatterns.some(p => p.key === "user_name")).toBe(true)
    })

    it("patterns are valid RegExp objects", () => {
      MEMORY_PATTERNS.forEach(p => {
        expect(p.pattern).toBeInstanceOf(RegExp)
        expect(p.key).toBeDefined()
        expect(typeof p.key).toBe("string")
      })
    })
  })
})
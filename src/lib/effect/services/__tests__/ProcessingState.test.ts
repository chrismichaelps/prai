import { describe, it, expect } from "vitest"
import { composeStateMessage } from "../ProcessingState"

describe("composeStateMessage", () => {
  describe("analyzing state", () => {
    it("returns Spanish fallback when no hint", () => {
      expect(composeStateMessage("analyzing", undefined, "es")).toBe("Analizando tu pregunta…")
    })

    it("interpolates hint in Spanish", () => {
      expect(composeStateMessage("analyzing", "mejor playa", "es")).toBe("Analizando mejor playa…")
    })

    it("returns English fallback when no hint", () => {
      expect(composeStateMessage("analyzing", undefined, "en")).toBe("Analyzing your request…")
    })

    it("interpolates hint in English", () => {
      expect(composeStateMessage("analyzing", "best beach", "en")).toBe("Analyzing best beach…")
    })
  })

  describe("searching state", () => {
    it("returns Spanish fallback when no hint", () => {
      expect(composeStateMessage("searching", undefined, "es")).toBe("Buscando información…")
    })

    it("interpolates hint in Spanish", () => {
      expect(composeStateMessage("searching", "restaurantes Old San Juan", "es")).toBe("Buscando restaurantes Old San Juan…")
    })
  })

  describe("evaluating state", () => {
    it("returns Spanish fallback when no hint", () => {
      expect(composeStateMessage("evaluating", undefined, "es")).toBe("Evaluando resultados…")
    })

    it("passes through unknown tool name as-is", () => {
      expect(composeStateMessage("evaluating", "custom_tool", "es")).toBe("Evaluando custom_tool…")
    })

    it("maps web_search tool name to human-readable hint (es)", () => {
      expect(composeStateMessage("evaluating", "web_search", "es")).toBe("Evaluando resultados de búsqueda…")
    })

    it("maps search_web tool name to human-readable hint (es)", () => {
      expect(composeStateMessage("evaluating", "search_web", "es")).toBe("Evaluando resultados de búsqueda…")
    })

    it("maps web_search tool name to human-readable hint (en)", () => {
      expect(composeStateMessage("evaluating", "web_search", "en")).toBe("Evaluating search results…")
    })
  })

  describe("generating state", () => {
    it("always returns fixed Spanish string regardless of hint", () => {
      expect(composeStateMessage("generating", undefined, "es")).toBe("Generando respuesta…")
      expect(composeStateMessage("generating", "some hint", "es")).toBe("Generando respuesta…")
    })

    it("always returns fixed English string regardless of hint", () => {
      expect(composeStateMessage("generating", undefined, "en")).toBe("Generating response…")
    })
  })

  describe("hint handling", () => {
    it("truncates hint to 60 characters", () => {
      const longHint = "a".repeat(80)
      const result = composeStateMessage("searching", longHint, "es")
      expect(result).toBe(`Buscando ${"a".repeat(60)}…`)
    })

    it("trims whitespace from hint", () => {
      expect(composeStateMessage("searching", "  mofongo  ", "es")).toBe("Buscando mofongo…")
    })

    it("treats empty-string hint as no hint", () => {
      expect(composeStateMessage("searching", "", "es")).toBe("Buscando información…")
    })
  })

  describe("locale fallback", () => {
    it("falls back to Spanish for unknown locale", () => {
      expect(composeStateMessage("analyzing", undefined, "fr")).toBe("Analizando tu pregunta…")
    })
  })
})

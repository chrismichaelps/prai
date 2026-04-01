import { describe, it, expect, beforeEach } from "vitest"
import {
  shouldShowSuggestion,
  shouldFilterSuggestion,
  filterSuggestion,
  buildSuggestionPrompt,
  getSuggestionSystemPrompt,
  processSuggestionResponse,
  ROLE_LABELS,
  CHAT_ROLE_API_INDICATOR,
} from "../Suggestion"
import { ChatRole } from "@/types/chat"
import { SUGGESTION_CONFIG } from "../prompts/suggestion-filters"

describe("Suggestion service", () => {
  describe("ROLE_LABELS", () => {
    it("should have labels for all roles", () => {
      expect(ROLE_LABELS[ChatRole.USER]).toBe("Usuario")
      expect(ROLE_LABELS[ChatRole.ASSISTANT]).toBe("Asistente")
      expect(ROLE_LABELS[ChatRole.SYSTEM]).toBe("Sistema")
    })
  })

  describe("CHAT_ROLE_API_INDICATOR", () => {
    it("should equal 'API'", () => {
      expect(CHAT_ROLE_API_INDICATOR).toBe("API")
    })
  })

  describe("shouldShowSuggestion", () => {
    it("should return false for empty messages array", () => {
      expect(shouldShowSuggestion([])).toBe(false)
    })

    it("should return false when fewer than MIN_ASSISTANT_MESSAGES", () => {
      const messages = [
        { role: ChatRole.USER, content: "Hola" },
        { role: ChatRole.ASSISTANT, content: "Hola, soy PR/AI" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(false)
    })

    it("should return false when only user messages", () => {
      const messages = [
        { role: ChatRole.USER, content: "Hola" },
        { role: ChatRole.USER, content: "Playas" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(false)
    })

    it("should return false when last assistant message contains API indicator", () => {
      const messages = [
        { role: ChatRole.USER, content: "Playas" },
        { role: ChatRole.ASSISTANT, content: "Te recomiendo..." },
        { role: ChatRole.USER, content: "Más info" },
        { role: ChatRole.ASSISTANT, content: "API: Playas recomendadas" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(false)
    })

    it("should return false when assistant message contains API in different case", () => {
      const messages = [
        { role: ChatRole.USER, content: "Playas" },
        { role: ChatRole.ASSISTANT, content: "Recomendación" },
        { role: ChatRole.USER, content: "Más" },
        { role: ChatRole.ASSISTANT, content: "api: data" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(false)
    })

    it("should return true when conditions met", () => {
      const messages = [
        { role: ChatRole.USER, content: "Playas" },
        { role: ChatRole.ASSISTANT, content: "Te recomiendo playas" },
        { role: ChatRole.USER, content: "Cuál es la más cercana?" },
        { role: ChatRole.ASSISTANT, content: "Favorita cerca de San Juan" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(true)
    })

    it("should handle empty string content", () => {
      const messages = [
        { role: ChatRole.USER, content: "" },
        { role: ChatRole.ASSISTANT, content: "Te recomiendo" },
        { role: ChatRole.USER, content: "Gracias" },
        { role: ChatRole.ASSISTANT, content: "De nada" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(true)
    })

    it("should return true with system messages in conversation", () => {
      const messages = [
        { role: ChatRole.SYSTEM, content: "System prompt" },
        { role: ChatRole.USER, content: "Playas" },
        { role: ChatRole.ASSISTANT, content: "Te recomiendo" },
        { role: ChatRole.USER, content: "Gracias" },
        { role: ChatRole.ASSISTANT, content: "De nada" },
      ]
      expect(shouldShowSuggestion(messages)).toBe(true)
    })
  })

  describe("shouldFilterSuggestion", () => {
    it("should filter empty string", () => {
      const result = shouldFilterSuggestion("")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("empty")
    })

    it("should filter null", () => {
      const result = shouldFilterSuggestion(null)
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("empty")
    })

    it("should filter 'done'", () => {
      const result = shouldFilterSuggestion("done")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("done")
    })

    it("should filter 'DONE' (case insensitive)", () => {
      const result = shouldFilterSuggestion("DONE")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("done")
    })

    it("should filter meta text 'sin suggestion'", () => {
      const result = shouldFilterSuggestion("sin suggestion")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("meta_text")
    })

    it("should filter meta text 'silencio'", () => {
      const result = shouldFilterSuggestion("silencio")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("meta_text")
    })

    it("should filter evaluative responses 'gracias'", () => {
      const result = shouldFilterSuggestion("Gracias por la ayuda")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("evaluative")
    })

    it("should filter evaluative 'thank you' (english)", () => {
      const result = shouldFilterSuggestion("Thank you!")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("evaluative")
    })

    it("should filter evaluative 'perfecto'", () => {
      const result = shouldFilterSuggestion("Perfecto, gracias!")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("evaluative")
    })

    it("should filter auto responses 'déjame buscar'", () => {
      const result = shouldFilterSuggestion("Déjame buscar eso")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("auto_response")
    })

    it("should filter auto responses 'yo puedo'", () => {
      const result = shouldFilterSuggestion("Yo puedo ayudarte")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("auto_response")
    })

    it("should filter auto responses 'claro' (spanish)", () => {
      const result = shouldFilterSuggestion("Claro, te ayudo")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("auto_response")
    })

    it("should filter single words not in allowed list", () => {
      const result = shouldFilterSuggestion("maybe")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("too_few_words")
    })

    it("should allow single words in allowed list 'si'", () => {
      expect(shouldFilterSuggestion("si").suggestion).toBe("si")
    })

    it("should allow single words in allowed list 'yes'", () => {
      expect(shouldFilterSuggestion("yes").suggestion).toBe("yes")
    })

    it("should allow single words in allowed list 'no'", () => {
      expect(shouldFilterSuggestion("no").suggestion).toBe("no")
    })

    it("should allow single words in allowed list 'ok'", () => {
      expect(shouldFilterSuggestion("ok").suggestion).toBe("ok")
    })

    it("should allow single words in allowed list 'continuar'", () => {
      expect(shouldFilterSuggestion("continuar").suggestion).toBe("continuar")
    })

    it("should allow single words in allowed list 'continue'", () => {
      expect(shouldFilterSuggestion("continue").suggestion).toBe("continue")
    })

    it("should filter 'gracias' as evaluative", () => {
      const result = shouldFilterSuggestion("gracias")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("evaluative")
    })

    it("should filter single word 'suggestion' (not in allowed list)", () => {
      const result = shouldFilterSuggestion("  suggestion  ")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("too_few_words")
    })

    it("should filter too many words", () => {
      const result = shouldFilterSuggestion("uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("too_many_words")
    })

    it("should filter too long suggestions", () => {
      const longSuggestion = "abcdefghijklmnopqrstuvwxyz1 abcdefghijklmnopqrstuvwxyz2 abcdefghijklmnopqrstuvwxyz3 abcdefghijklmnopqrstuvwxyz4 abcdefghijklmnopqrstuvwxyz5"
      const result = shouldFilterSuggestion(longSuggestion)
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("too_long")
    })

    it("should filter multiple sentences", () => {
      const result = shouldFilterSuggestion("Esta es una. Esta es dos.")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("multiple_sentences")
    })

    it("should filter suggestions with newline", () => {
      const result = shouldFilterSuggestion("suggestion\nwith newline")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("has_formatting")
    })

    it("should filter suggestions with asterisks", () => {
      const result = shouldFilterSuggestion("suggestion *bold* text")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("has_formatting")
    })

    it("should filter suggestions with markdown", () => {
      const result = shouldFilterSuggestion("suggestion **bold** text")
      expect(result.suggestion).toBeNull()
      expect(result.reason).toBe("has_formatting")
    })

    it("should pass valid suggestions", () => {
      const result = shouldFilterSuggestion("Cuál es la más cercana a San Juan?")
      expect(result.suggestion).toBe("Cuál es la más cercana a San Juan?")
      expect(result.reason).toBe("passed")
    })

    it("should pass suggestion with exactly 12 words", () => {
      const result = shouldFilterSuggestion("uno dos tres cuatro cinco seis siete ocho nueve diez once doce")
      expect(result.suggestion).toBe("uno dos tres cuatro cinco seis siete ocho nueve diez once doce")
      expect(result.reason).toBe("passed")
    })

    it("should pass suggestion with exactly 2 words", () => {
      const result = shouldFilterSuggestion("playas cercanas")
      expect(result.suggestion).toBe("playas cercanas")
      expect(result.reason).toBe("passed")
    })

    it("should trim whitespace before filtering", () => {
      const result = shouldFilterSuggestion("  playitas cercanas  ")
      expect(result.suggestion).toBe("playitas cercanas")
      expect(result.reason).toBe("passed")
    })
  })

  describe("buildSuggestionPrompt", () => {
    it("should return empty prompt for empty messages array", () => {
      const prompt = buildSuggestionPrompt([])
      expect(prompt).toContain("CONVERSACIÓN")
      expect(prompt).not.toContain("Usuario:")
    })

    it("should include last N messages", () => {
      const messages = [
        { role: ChatRole.USER, content: "Playas" },
        { role: ChatRole.ASSISTANT, content: "Recomendación" },
        { role: ChatRole.USER, content: "Más info" },
        { role: ChatRole.ASSISTANT, content: "Detalles" },
        { role: ChatRole.USER, content: "Gracias" },
        { role: ChatRole.ASSISTANT, content: "De nada" },
        { role: ChatRole.USER, content: "Nueva pregunta" },
        { role: ChatRole.ASSISTANT, content: "Nueva respuesta" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      expect(prompt).toContain("Nueva pregunta")
      expect(prompt).toContain("Nueva respuesta")
      expect(prompt).not.toContain("Playas")
    })

    it("should truncate long messages", () => {
      const longContent = "abcdefghijklmnopqrstuvwxyz1 abcdefghijklmnopqrstuvwxyz2 abcdefghijklmnopqrstuvwxyz3 abcdefghijklmnopqrstuvwxyz4 abcdefghijklmnopqrstuvwxyz5 abcdefghijklmnopqrstuvwxyz6 abcdefghijklmnopqrstuvwxyz7 abcdefghijklmnopqrstuvwxyz8 abcdefghijklmnopqrstuvwxyz9 abcdefghijklmnopqrstuvwxyz0 abcdefghijklmnopqrstuvwxyz1 abcdefghijklmnopqrstuvwxyz2 abcdefghijklmnopqrstuvwxyz3 abcdefghijklmnopqrstuvwxyz4 abcdefghijklmnopqrstuvwxyz5 abcdefghijklmnopqrstuvwxyz6 abcdefghijklmnopqrstuvwxyz7 abcdefghijklmnopqrstuvwxyz8 abcdefghijklmnopqrstuvwxyz9 abcdefghijklmnopqrstuvwxyz0"
      const messages = [
        { role: ChatRole.USER, content: longContent },
        { role: ChatRole.ASSISTANT, content: "respuesta" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      const userContentInPrompt = prompt.split("Usuario: ")[1]?.split("\n")[0] ?? ""
      expect(userContentInPrompt.length).toBeLessThanOrEqual(200)
    })

    it("should handle empty content in messages", () => {
      const messages = [
        { role: ChatRole.USER, content: "" },
        { role: ChatRole.ASSISTANT, content: "respuesta" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      expect(prompt).toContain("Usuario:")
    })

    it("should include system messages with correct label", () => {
      const messages = [
        { role: ChatRole.SYSTEM, content: "System prompt" },
        { role: ChatRole.USER, content: "Pregunta" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      expect(prompt).toContain("Sistema:")
      expect(prompt).toContain("System prompt")
    })

    it("should include assistant messages with correct label", () => {
      const messages = [
        { role: ChatRole.USER, content: "Pregunta" },
        { role: ChatRole.ASSISTANT, content: "Respuesta" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      expect(prompt).toContain("Asistente:")
      expect(prompt).toContain("Respuesta")
    })

    it("should include prompt template header", () => {
      const messages = [
        { role: ChatRole.USER, content: "test" },
        { role: ChatRole.ASSISTANT, content: "response" },
      ]
      const prompt = buildSuggestionPrompt(messages)
      expect(prompt).toContain("MODO SUGERENCIA")
    })
  })

  describe("getSuggestionSystemPrompt", () => {
    it("should return non-empty string", () => {
      const prompt = getSuggestionSystemPrompt()
      expect(prompt.length).toBeGreaterThan(0)
      expect(prompt).toContain("PR/AI")
    })
  })

  describe("processSuggestionResponse", () => {
    it("should return filtered result for empty input", () => {
      const result = processSuggestionResponse("")
      expect(result.suggestion).toBe("")
      expect(result.confidence).toBe(0)
    })

    it("should return filtered result for whitespace only", () => {
      const result = processSuggestionResponse("   ")
      expect(result.suggestion).toBe("")
      expect(result.confidence).toBe(0)
    })

    it("should return result with confidence for valid suggestion", () => {
      const result = processSuggestionResponse("Cuáles son las mejores playas?")
      expect(result.suggestion).toBe("Cuáles son las mejores playas?")
      expect(result.confidence).toBe(SUGGESTION_CONFIG.CONFIDENCE_THRESHOLD)
    })

    it("should trim suggestion before filtering", () => {
      const result = processSuggestionResponse(" playitas del mar  ")
      expect(result.suggestion).toBe("playitas del mar")
    })

    it("should return empty for filtered suggestion", () => {
      const result = processSuggestionResponse("gracias")
      expect(result.suggestion).toBe("")
      expect(result.confidence).toBe(0)
    })
  })

  describe("filterSuggestion", () => {
    it("should be an alias for shouldFilterSuggestion", () => {
      const suggestion = "Cuál es la más cercana?"
      expect(filterSuggestion(suggestion)).toEqual(shouldFilterSuggestion(suggestion))
    })

    it("should filter null the same way", () => {
      expect(filterSuggestion(null)).toEqual(shouldFilterSuggestion(null))
    })
  })

  describe("Edge cases and bug prevention", () => {
    describe("shouldShowSuggestion edge cases", () => {
      it("should handle only one assistant message", () => {
        const messages = [
          { role: ChatRole.USER, content: "Playas" },
          { role: ChatRole.ASSISTANT, content: "Te recomiendo" },
        ]
        expect(shouldShowSuggestion(messages)).toBe(false)
      })

      it("should handle exactly MIN_ASSISTANT_MESSAGES", () => {
        const messages = [
          { role: ChatRole.USER, content: "Hola" },
          { role: ChatRole.ASSISTANT, content: "Hola!" },
          { role: ChatRole.USER, content: "Playas" },
          { role: ChatRole.ASSISTANT, content: "Te recomiendo" },
        ]
        expect(shouldShowSuggestion(messages)).toBe(true)
      })

      it("should check LAST assistant message, not any", () => {
        const messages = [
          { role: ChatRole.USER, content: "Question1" },
          { role: ChatRole.ASSISTANT, content: "API: response" },
          { role: ChatRole.USER, content: "Question2" },
          { role: ChatRole.ASSISTANT, content: "Regular response" },
        ]
        expect(shouldShowSuggestion(messages)).toBe(true)
      })

      it("should handle many messages (performance)", () => {
        const messages = Array.from({ length: 50 }, (_, i) => ({
          role: i % 2 === 0 ? ChatRole.USER : ChatRole.ASSISTANT,
          content: i % 2 === 0 ? `Pregunta ${i}` : `Respuesta ${i}`,
        }))
        expect(shouldShowSuggestion(messages)).toBe(true)
      })

      it("should handle consecutive user messages", () => {
        const messages = [
          { role: ChatRole.USER, content: "Pregunta 1" },
          { role: ChatRole.USER, content: "Pregunta 2" },
          { role: ChatRole.ASSISTANT, content: "Respuesta 1" },
          { role: ChatRole.ASSISTANT, content: "Respuesta 2" },
        ]
        expect(shouldShowSuggestion(messages)).toBe(true)
      })

      it("should handle consecutive assistant messages (still has 2+)", () => {
        const messages = [
          { role: ChatRole.USER, content: "Pregunta" },
          { role: ChatRole.ASSISTANT, content: "Respuesta 1" },
          { role: ChatRole.ASSISTANT, content: "Follow up" },
        ]
        expect(shouldShowSuggestion(messages)).toBe(true)
      })
    })

    describe("shouldFilterSuggestion edge cases", () => {
      it("should handle whitespace-only string", () => {
        const result = shouldFilterSuggestion("   ")
        expect(result.reason).toBe("empty")
      })

      it("should handle tabs and newlines", () => {
        const result = shouldFilterSuggestion("\t\n")
        expect(result.reason).toBe("empty")
      })

      it("should handle numeric-only input", () => {
        const result = shouldFilterSuggestion("123")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle single character", () => {
        const result = shouldFilterSuggestion("a")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle suggestion with only special characters", () => {
        const result = shouldFilterSuggestion("???")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle Spanish question with accent", () => {
        const result = shouldFilterSuggestion("Dónde está El Yunque?")
        expect(result.suggestion).toBe("Dónde está El Yunque?")
        expect(result.reason).toBe("passed")
      })

      it("should allow emojis (not considered formatting)", () => {
        const result = shouldFilterSuggestion("Playa 🏖️ recomendada?")
        expect(result.suggestion).toBe("Playa 🏖️ recomendada?")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion with numbers as words", () => {
        const result = shouldFilterSuggestion("Playa 1 y playa 2")
        expect(result.suggestion).toBe("Playa 1 y playa 2")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion at MAX_WORDS boundary (12)", () => {
        const result = shouldFilterSuggestion("uno dos tres cuatro cinco seis siete ocho nueve diez once doce")
        expect(result.suggestion).toBe("uno dos tres cuatro cinco seis siete ocho nueve diez once doce")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion at MAX_WORDS + 1 (13)", () => {
        const result = shouldFilterSuggestion("uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_many_words")
      })

      it("should filter single repeated character as too few words", () => {
        const result = shouldFilterSuggestion("a".repeat(99))
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle suggestion with single sentence (no filter)", () => {
        const result = shouldFilterSuggestion("Cuál es la mejor gastronomía local?")
        expect(result.suggestion).toBe("Cuál es la mejor gastronomía local?")
        expect(result.reason).toBe("passed")
      })

      it("should allow single sentence with exclamation", () => {
        const result = shouldFilterSuggestion("Qué lugares visitar!")
        expect(result.suggestion).toBe("Qué lugares visitar!")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion with only question mark", () => {
        const result = shouldFilterSuggestion("?")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle suggestion starting with number", () => {
        const result = shouldFilterSuggestion("5 estrellas beach")
        expect(result.suggestion).toBe("5 estrellas beach")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion with apostrophe", () => {
        const result = shouldFilterSuggestion("Where's the best mofongo?")
        expect(result.suggestion).toBe("Where's the best mofongo?")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion with Spanish ñ", () => {
        const result = shouldFilterSuggestion("Cómo llegar a Rincón?")
        expect(result.suggestion).toBe("Cómo llegar a Rincón?")
        expect(result.reason).toBe("passed")
      })

      it("should handle suggestion with Puerto Rico specific terms", () => {
        const result = shouldFilterSuggestion("Mejor borinquen food?")
        expect(result.suggestion).toBe("Mejor borinquen food?")
        expect(result.reason).toBe("passed")
      })

      it("should filter 'nada' (nothing in Spanish)", () => {
        const result = shouldFilterSuggestion("nada")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })

      it("should handle case sensitivity in 'done'", () => {
        expect(shouldFilterSuggestion("Done").suggestion).toBeNull()
        expect(shouldFilterSuggestion("DONE").suggestion).toBeNull()
        expect(shouldFilterSuggestion("dOne").suggestion).toBeNull()
      })

      it("should filter 'done!' as too few words (not exact 'done')", () => {
        const result = shouldFilterSuggestion("done!")
        expect(result.suggestion).toBeNull()
        expect(result.reason).toBe("too_few_words")
      })
    })

    describe("buildSuggestionPrompt edge cases", () => {
      it("should handle messages with only system role", () => {
        const messages = [
          { role: ChatRole.SYSTEM, content: "System prompt" },
        ]
        const prompt = buildSuggestionPrompt(messages)
        expect(prompt).toContain("Sistema:")
      })

      it("should handle messages with unicode content", () => {
        const messages = [
          { role: ChatRole.USER, content: "🌴 Puerto Rico" },
          { role: ChatRole.ASSISTANT, content: "¡Excelente elección!" },
        ]
        const prompt = buildSuggestionPrompt(messages)
        expect(prompt).toContain("🌴 Puerto Rico")
      })

      it("should include proper separator between messages", () => {
        const messages = [
          { role: ChatRole.USER, content: "Question" },
          { role: ChatRole.ASSISTANT, content: "Answer" },
        ]
        const prompt = buildSuggestionPrompt(messages)
        expect(prompt).toContain("Usuario:")
        expect(prompt).toContain("Asistente:")
      })

      it("should handle single message", () => {
        const messages = [{ role: ChatRole.USER, content: "Test" }]
        const prompt = buildSuggestionPrompt(messages)
        expect(prompt).toContain("Usuario: Test")
      })
    })

    describe("SUGGESTION_CONFIG constants", () => {
      it("MIN_ASSISTANT_MESSAGES should be 2", () => {
        expect(SUGGESTION_CONFIG.MIN_ASSISTANT_MESSAGES).toBe(2)
      })

      it("CONFIDENCE_THRESHOLD should be 0.7", () => {
        expect(SUGGESTION_CONFIG.CONFIDENCE_THRESHOLD).toBe(0.7)
      })

      it("MAX_WORDS should be 12", () => {
        expect(SUGGESTION_CONFIG.MAX_WORDS).toBe(12)
      })

      it("MAX_LENGTH should be 100", () => {
        expect(SUGGESTION_CONFIG.MAX_LENGTH).toBe(100)
      })

      it("CONVERSATION_HISTORY_SIZE should be 6", () => {
        expect(SUGGESTION_CONFIG.CONVERSATION_HISTORY_SIZE).toBe(6)
      })
    })
  })
})

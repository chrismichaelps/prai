/** @Type.FilterRule */
export interface FilterRule {
  readonly id: string
  readonly check: (suggestion: string) => boolean
}

/** @Rule.FilterAll */
export const SUGGESTION_FILTER_RULES: FilterRule[] = [
  /** @Rule.Done */
  {
    id: "done",
    check: (s) => s.toLowerCase() === "done",
  },
  /** @Rule.MetaText */
  {
    id: "meta_text",
    check: (s) =>
      s.toLowerCase().includes("nada que") ||
      s.toLowerCase().includes("sin suggestion") ||
      s.toLowerCase().includes("silencio"),
  },
  /** @Rule.Evaluative */
  {
    id: "evaluative",
    check: (s) =>
      /gracias|thank|está bien|sounds good|that works|perfect|awesome|excellent|bueno|perfecto|genial/i.test(
        s,
      ),
  },
  /** @Rule.AutoResponse */
  {
    id: "auto_response",
    check: (s) =>
      /^(déjame|let me|te ayudo|i'll|i can|yo puedo|puedo|claro|of course|certainly)/i.test(
        s,
      ),
  },
  /** @Rule.TooFewWords */
  {
    id: "too_few_words",
    check: (s) => {
      const words = s.trim().split(/\s+/)
      if (words.length >= 2) return false
      const ALLOWED = new Set([
        "si",
        "yes",
        "no",
        "ok",
        "continuar",
        "continue",
        "gracias",
      ])
      return !ALLOWED.has(s.toLowerCase())
    },
  },
  /** @Rule.TooManyWords */
  {
    id: "too_many_words",
    check: (s) => s.trim().split(/\s+/).length > 12,
  },
  /** @Rule.TooLong */
  {
    id: "too_long",
    check: (s) => s.length >= 100,
  },
  /** @Rule.MultipleSentences */
  {
    id: "multiple_sentences",
    check: (s) => /[.!?]\s+[A-Z]/.test(s),
  },
  /** @Rule.HasFormatting */
  {
    id: "has_formatting",
    check: (s) => /[\n*]|\*\*/.test(s),
  },
]

/** @Config.Suggestion */
export const SUGGESTION_CONFIG = {
  MIN_WORDS: 2,
  MAX_WORDS: 12,
  MAX_LENGTH: 100,
  CONVERSATION_HISTORY_SIZE: 6,
  MAX_CONTEXT_LENGTH: 200,
  CONFIDENCE_THRESHOLD: 0.7,
  MIN_ASSISTANT_MESSAGES: 1,
  /** @Config.RateLimit */
  RATE_LIMIT_MS: 10000, // 10 seconds between requests
} as const

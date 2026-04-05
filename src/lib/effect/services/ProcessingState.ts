import type { ProcessingStateValue } from "@/lib/constants/app-constants"

/** @Constant.ProcessingState.ToolHints */
const TOOL_HINTS: Record<string, Record<string, string>> = {
  es: {
    web_search: "resultados de búsqueda",
    search_web: "resultados de búsqueda",
  },
  en: {
    web_search: "search results",
    search_web: "search results",
  },
}

/** @Constant.ProcessingState.Verbs */
const VERBS: Record<ProcessingStateValue, Record<string, { withHint: string; withoutHint: string }>> = {
  analyzing: {
    es: { withHint: "Analizando", withoutHint: "Analizando tu pregunta…" },
    en: { withHint: "Analyzing", withoutHint: "Analyzing your request…" },
  },
  searching: {
    es: { withHint: "Buscando", withoutHint: "Buscando información…" },
    en: { withHint: "Searching for", withoutHint: "Searching for information…" },
  },
  evaluating: {
    es: { withHint: "Evaluando", withoutHint: "Evaluando resultados…" },
    en: { withHint: "Evaluating", withoutHint: "Evaluating results…" },
  },
  /** @Constant.ProcessingState.Verbs.Generating.NoHint */
  generating: {
    es: { withHint: "Generando respuesta…", withoutHint: "Generando respuesta…" },
    en: { withHint: "Generating response…", withoutHint: "Generating response…" },
  },
}

/** @Logic.ProcessingState.Compose */
export const composeStateMessage = (
  state: ProcessingStateValue,
  hint: string | undefined,
  locale: string
): string => {
  const lang = locale === "en" ? "en" : "es"
  const verbConfig = VERBS[state]?.[lang]
  if (!verbConfig) return "…"

  if (state === "generating") return verbConfig.withoutHint

  const trimmed = hint?.trim()
  if (!trimmed) return verbConfig.withoutHint

  const toolHints = TOOL_HINTS[lang]
  const mappedHint = toolHints?.[trimmed] ?? trimmed
  const truncated = mappedHint.slice(0, 60)

  return `${verbConfig.withHint} ${truncated}…`
}

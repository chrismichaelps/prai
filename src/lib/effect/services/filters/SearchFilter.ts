/** @Service.Effect.SearchFilter */

import { Effect } from "effect"
import { ApiConstants } from "@/lib/constants/app-constants"
import { SearchFilterError } from "../../errors"
import {
  FILTER_EXTRACTION_MAX_TOKENS,
  FILTER_EXTRACTION_MIN_QUERY_LENGTH,
  FILTER_CONTEXT_MESSAGES,
  FILTER_EXTRACTION_SYSTEM_PROMPT
} from "../../constants/filters/SearchFilterConstants"

type ConversationMessage = { readonly role: string; readonly content: string }

export type SearchFilters = {
  readonly time?:     string
  readonly location?: string
  readonly budget?:   string
}

/** @Logic.SearchFilter.Parse */
const parseFilters = (content: string): SearchFilters => {
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed !== "object" || parsed === null) return {}
    const p = parsed as Record<string, unknown>
    return {
      ...(typeof p.time === "string" && p.time ? { time: p.time } : {}),
      ...(typeof p.location === "string" && p.location ? { location: p.location } : {}),
      ...(typeof p.budget === "string" && p.budget ? { budget: p.budget } : {})
    }
  } catch {
    return {}
  }
}

/** @Logic.SearchFilter.HasFilters */
export const hasFilters = (f: SearchFilters): boolean =>
  Boolean(f.time || f.location || f.budget)

/** @Logic.SearchFilter.EnrichQuery */
export const enrichSearchQuery = (query: string, filters: SearchFilters): string => {
  if (!hasFilters(filters)) return query
  const parts: string[] = [query]
  if (filters.location) parts.push(`cerca de ${filters.location}`)
  if (filters.time) parts.push(filters.time)
  if (filters.budget) parts.push(filters.budget)
  return parts.join(", ")
}

/** @Service.Effect.SearchFilter.Class */
export class SearchFilterService extends Effect.Service<SearchFilterService>()("SearchFilter", {
  effect: Effect.gen(function* () {
    /** @Logic.SearchFilter.Extract */
    const extract = (
      query: string,
      history: ReadonlyArray<ConversationMessage>
    ): Effect.Effect<SearchFilters, never> =>
      Effect.gen(function* () {
        if (query.length < FILTER_EXTRACTION_MIN_QUERY_LENGTH) return {}

        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) return {}

        const recentContext = history
          .filter(m => m.role !== "system")
          .slice(-FILTER_CONTEXT_MESSAGES)
          .map(m => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content.slice(0, 150)}`)
          .join("\n")

        const userContent = `Consulta: "${query}"${recentContext ? `\n\nContexto reciente:\n${recentContext}` : ""}`

        const response = yield* Effect.tryPromise({
          try: () => fetch(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`,
              "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
              "X-Title": "PR\\AI Assistant"
            },
            body: JSON.stringify({
              model: process.env.NEXT_PUBLIC_MODEL_NAME || "",
              messages: [
                { role: "system", content: FILTER_EXTRACTION_SYSTEM_PROMPT },
                { role: "user", content: userContent }
              ],
              stream: false,
              max_tokens: FILTER_EXTRACTION_MAX_TOKENS,
              response_format: { type: "json_object" }
            })
          }),
          catch: (e) => new SearchFilterError({ message: `Fetch failed: ${String(e)}`, cause: e })
        })

        if (!response.ok) return {}

        const data = yield* Effect.tryPromise({
          try: () => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>,
          catch: (e) => new SearchFilterError({ message: `Parse failed: ${String(e)}`, cause: e })
        })

        return parseFilters(data.choices?.[0]?.message?.content?.trim() ?? "")
      }).pipe(
        Effect.catchAll(() => Effect.succeed({} satisfies SearchFilters))
      )

    return { extract } as const
  })
}) {}

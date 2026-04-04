/** @Service.Effect.ToolRelevance */

import { Effect } from "effect"
import { ApiConstants } from "@/lib/constants/app-constants"
import { ToolRelevanceError } from "../../errors"
import {
  RELEVANCE_MIN_SCORE,
  RELEVANCE_MAX_TOKENS,
  RELEVANCE_CONTEXT_PREVIEW,
  RELEVANCE_SYSTEM_PROMPT,
  RELEVANCE_FILTERED_CONTENT
} from "../../constants/relevance/ToolRelevanceConstants"

export type ToolResult = {
  readonly toolName: string
  readonly result: string
}

export type RelevanceScore = {
  readonly index: number
  readonly score: number
}

/** @Logic.ToolRelevance.ParseScores */
const parseScores = (content: string, count: number): RelevanceScore[] => {
  try {
    const parsed = JSON.parse(content)
    const arr: unknown = parsed?.scores
    if (!Array.isArray(arr)) return []
    return (arr as unknown[])
      .filter((s): s is { index: number; score: number } =>
        typeof s === "object" && s !== null &&
        typeof (s as Record<string, unknown>).index === "number" &&
        typeof (s as Record<string, unknown>).score === "number"
      )
      .slice(0, count)
  } catch {
    return []
  }
}

/** @Service.Effect.ToolRelevance.Class */
export class ToolRelevanceService extends Effect.Service<ToolRelevanceService>()("ToolRelevance", {
  effect: Effect.gen(function* () {
    /** @Logic.ToolRelevance.Score */
    const score = (
      query: string,
      results: ToolResult[]
    ): Effect.Effect<ToolResult[]> =>
      Effect.gen(function* () {
        if (results.length === 0) return results

        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) return results

        const previews = results.map((r, i) => ({
          index: i,
          tool: r.toolName,
          preview: r.result.slice(0, RELEVANCE_CONTEXT_PREVIEW)
        }))

        const userContent = `Consulta: "${query}"\n\nResultados:\n${JSON.stringify(previews)}`

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
                { role: "system", content: RELEVANCE_SYSTEM_PROMPT },
                { role: "user", content: userContent }
              ],
              stream: false,
              max_tokens: RELEVANCE_MAX_TOKENS,
              response_format: { type: "json_object" }
            })
          }),
          catch: (e) => new ToolRelevanceError({ message: `Fetch failed: ${String(e)}`, cause: e })
        })

        if (!response.ok) return results

        const data = yield* Effect.tryPromise({
          try: () => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>,
          catch: (e) => new ToolRelevanceError({ message: `Parse failed: ${String(e)}`, cause: e })
        })

        const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
        const scores = parseScores(raw, results.length)
        if (scores.length === 0) return results

        const scoreMap = new Map(scores.map(s => [s.index, s.score]))

        return results.map((r, i) => {
          const s = scoreMap.get(i) ?? RELEVANCE_MIN_SCORE
          return s < RELEVANCE_MIN_SCORE
            ? { ...r, result: RELEVANCE_FILTERED_CONTENT }
            : r
        })
      }).pipe(
        Effect.catchAll(() => Effect.succeed(results))
      )

    return { score } as const
  })
}) { }

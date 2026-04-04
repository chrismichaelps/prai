/** @Service.Effect.QueryExpansion */

import { Effect } from "effect"
import { ApiConstants } from "@/lib/constants/app-constants"
import { SessionMemoryService } from "../memory"
import { QueryExpansionError } from "../../errors"
import {
  QUERY_EXPANSION_CONTEXT_MESSAGES,
  SEMANTIC_REPHRASE_MAX_TOKENS,
  KEYWORD_EXPANSION_MAX_TOKENS,
  KEYWORD_EXPANSION_MAX_QUERIES,
  SEMANTIC_REPHRASE_SYSTEM_PROMPT,
  KEYWORD_EXPANSION_SYSTEM_PROMPT
} from "../../constants/query/QueryExpansionConstants"

type ConversationMessage = { readonly role: string; readonly content: string }

export type QueryExpansionResult = {
  readonly semantic: string
  readonly keywords: readonly string[]
}

/** @Logic.QueryExpansion.ParseKeywords */
const parseKeywords = (content: string): string[] => {
  try {
    const parsed = JSON.parse(content)
    const arr: unknown = Array.isArray(parsed) ? parsed : parsed?.keywords
    if (!Array.isArray(arr)) return []
    return (arr as unknown[])
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .slice(0, KEYWORD_EXPANSION_MAX_QUERIES)
  } catch {
    // Fallback: plain text lines
    return content.split("\n").map(l => l.trim()).filter(l => l.length > 0).slice(0, KEYWORD_EXPANSION_MAX_QUERIES)
  }
}

/** @Logic.QueryExpansion.BuildUserContent */
const buildUserContent = (
  query: string,
  history: ReadonlyArray<ConversationMessage>,
  memContext: string
): string => {
  const recentContext = history
    .filter(m => m.role !== "system")
    .slice(-QUERY_EXPANSION_CONTEXT_MESSAGES)
    .map(m => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content.slice(0, 200)}`)
    .join("\n")

  return `Consulta: "${query}"${memContext}${recentContext ? `\n\nContexto:\n${recentContext}` : ""}`
}

/** @Logic.QueryExpansion.LLMCall */
const callLLM = (
  systemPrompt: string,
  userContent: string,
  maxTokens: number,
  responseFormat?: { type: "json_object" }
): Effect.Effect<string, QueryExpansionError> =>
  Effect.gen(function* () {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return ""

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
          ],
          stream: false,
          max_tokens: maxTokens,
          ...(responseFormat ? { response_format: responseFormat } : {})
        })
      }),
      catch: (e) => new QueryExpansionError({ message: `Fetch failed: ${String(e)}`, cause: e })
    })

    if (!response.ok) return ""

    const data = yield* Effect.tryPromise({
      try: () => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>,
      catch: (e) => new QueryExpansionError({ message: `Parse failed: ${String(e)}`, cause: e })
    })

    return data.choices?.[0]?.message?.content?.trim() ?? ""
  })

/** @Service.Effect.QueryExpansion.Class */
export class QueryExpansionService extends Effect.Service<QueryExpansionService>()("QueryExpansion", {
  dependencies: [SessionMemoryService.Default],
  effect: Effect.gen(function* () {
    const memory = yield* SessionMemoryService

    /** @Logic.QueryExpansion.Expand */
    const expand = (
      query: string,
      history: ReadonlyArray<ConversationMessage>
    ): Effect.Effect<QueryExpansionResult> =>
      Effect.gen(function* () {
        const mem = yield* memory.getMemory()
        const memContext = mem.entries.length > 0
          ? `\nPreferencias: ${mem.entries.slice(0, 5).map(e => `${e.key}: ${e.value}`).join(", ")}`
          : ""

        const userContent = buildUserContent(query, history, memContext)

        const [semantic, keywordsRaw] = yield* Effect.all(
          [
            callLLM(SEMANTIC_REPHRASE_SYSTEM_PROMPT, userContent, SEMANTIC_REPHRASE_MAX_TOKENS),
            callLLM(KEYWORD_EXPANSION_SYSTEM_PROMPT, userContent, KEYWORD_EXPANSION_MAX_TOKENS, { type: "json_object" })
          ],
          { concurrency: "unbounded" }
        ).pipe(
          Effect.catchAll(() => Effect.succeed(["", ""] as [string, string]))
        )

        return {
          semantic: semantic || query,
          keywords: parseKeywords(keywordsRaw)
        } satisfies QueryExpansionResult
      }).pipe(
        Effect.catchAll(() => Effect.succeed({ semantic: query, keywords: [] } satisfies QueryExpansionResult))
      )

    return { expand } as const
  })
}) { }

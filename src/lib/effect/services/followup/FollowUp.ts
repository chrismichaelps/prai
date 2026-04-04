/** @Service.Effect.FollowUp */

import { Effect } from "effect"
import { ApiConstants } from "@/lib/constants/app-constants"
import { FollowUpError } from "../../errors"
import {
  FOLLOWUP_MAX_SUGGESTIONS,
  FOLLOWUP_MAX_TOKENS,
  FOLLOWUP_MIN_MESSAGES,
  FOLLOWUP_CONTEXT_MESSAGES,
  FOLLOWUP_SYSTEM_PROMPT
} from "../../constants/followup/FollowUpConstants"

type ConversationMessage = { readonly role: string; readonly content: string }

/** @Logic.FollowUp.ParseSuggestions */
const parseSuggestions = (content: string): string[] => {
  try {
    const parsed = JSON.parse(content)
    const arr: unknown = parsed?.suggestions
    if (!Array.isArray(arr)) return []
    return (arr as unknown[])
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .slice(0, FOLLOWUP_MAX_SUGGESTIONS)
  } catch {
    return []
  }
}

/** @Service.Effect.FollowUp.Class */
export class FollowUpSuggestionsService extends Effect.Service<FollowUpSuggestionsService>()("FollowUp", {
  effect: Effect.gen(function* () {
    /** @Logic.FollowUp.Generate */
    const generate = (
      messages: ReadonlyArray<ConversationMessage>
    ): Effect.Effect<string[]> =>
      Effect.gen(function* () {
        const nonSystem = messages.filter(m => m.role !== "system")
        if (nonSystem.length < FOLLOWUP_MIN_MESSAGES) return []

        const apiKey = process.env.OPENROUTER_API_KEY
        if (!apiKey) return []

        const recentMessages = nonSystem
          .slice(-FOLLOWUP_CONTEXT_MESSAGES)
          .map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content.slice(0, 400)
          }))

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
                { role: "system", content: FOLLOWUP_SYSTEM_PROMPT },
                ...recentMessages
              ],
              stream: false,
              max_tokens: FOLLOWUP_MAX_TOKENS,
              response_format: { type: "json_object" }
            })
          }),
          catch: (e) => new FollowUpError({ message: `Fetch failed: ${String(e)}`, cause: e })
        })

        if (!response.ok) return []

        const data = yield* Effect.tryPromise({
          try: () => response.json() as Promise<{ choices?: Array<{ message?: { content?: string } }> }>,
          catch: (e) => new FollowUpError({ message: `Parse failed: ${String(e)}`, cause: e })
        })

        return parseSuggestions(data.choices?.[0]?.message?.content?.trim() ?? "")
      }).pipe(
        Effect.catchAll(() => Effect.succeed([] as string[]))
      )

    return { generate } as const
  })
}) { }

/** @Route.Chat.Completions */
import { ValidationError } from "../_lib/errors"
import { decodeBody, S, MessageRoleSchema } from "../_lib/validation"
import { exitResponse } from "../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError

/** @Route.Chat.Completions.POST */
export async function POST(req: Request) {
  /** @Logic.Chat.StreamProgram */
  const program: Effect.Effect<Response, ApiError> = pipe(
    decodeBody(
      S.Struct({
        messages: S.Array(
          S.Struct({
            role: MessageRoleSchema,
            content: S.String,
            name: S.optional(S.String)
          })
        ),
        model: S.optional(S.String),
        stream: S.optional(S.Boolean)
      })
    )(req),
    /** @Logic.Chat.OpenRouterInvocation */
    Effect.flatMap((params) =>
      Effect.tryPromise({
        try: async () => {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '',
              'X-Title': 'PR\\AI Assistant',
            },
            body: JSON.stringify({
              model: params.model || process.env.NEXT_PUBLIC_MODEL_NAME || "",
              messages: params.messages,
              stream: params.stream ?? true,
            }),
          })

          if (!response.ok) {
            throw new Error('OpenRouter error')
          }

          return new Response(response.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          })
        },
        catch: (e) => new ValidationError({ message: String(e) })
      })
    )
  )

  /** @Logic.Effect.ExitResponse */
  return exitResponse((response: Response) => response)(program)
}

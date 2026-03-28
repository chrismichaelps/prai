/** @Route.Health.OpenRouter */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { HttpStatus } from "../../_lib/constants/status-codes"
import { Data, Effect, pipe } from "effect"
import { exitResponse } from "../../_lib/response"

export const dynamic = 'force-dynamic'

class OpenRouterHealthError extends Data.TaggedError("OpenRouterHealthError")<{
  readonly error: unknown
}> {}

type ApiError = OpenRouterHealthError

/** @Logic.Health.CheckOpenRouter */
const checkOpenRouter = pipe(
  Effect.tryPromise({
    try: async () => {
      const apiKey = process.env.OPENROUTER_API_KEY
      const baseUrl = process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"

      if (!apiKey) {
        throw new Error("Missing OpenRouter API key")
      }

      const response = await fetch(`${baseUrl}/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal: AbortSignal.timeout(5000)
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      return { status: "ok", service: "openrouter" as const }
    },
    catch: (error) => new OpenRouterHealthError({ error })
  })
)

/** @Route.Health.OpenRouter.GET */
export async function GET(_request: NextRequest) {
  return exitResponse(
    (value) => NextResponse.json(value, { status: HttpStatus.OK }),
    {
      spanName: "health.openrouter",
      method: "GET",
    }
  )(checkOpenRouter)
}

/** @Route.Health.OpenRouter */
import type { NextRequest } from "next/server"
import { HttpStatus } from "../../_lib/constants/status-codes"
import { Effect, pipe } from "effect"
import { HealthCheckError } from "../../_lib/errors/services"
import { exitResponse } from "../../_lib/response"
import { checkRateLimit, getClientIp } from "../../_lib/utils/rate-limit"

export const dynamic = 'force-dynamic'

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
    catch: (error) => new HealthCheckError({ error, service: "openrouter" })
  })
)

/** @Route.Health.OpenRouter.GET */
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request)
  const rateLimit = checkRateLimit(clientIp)
  
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ 
      error: "Too many requests",
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
    }), { 
      status: HttpStatus.TOO_MANY_REQUESTS,
      headers: { 
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      }
    })
  }

  return exitResponse(
    (value) => new Response(JSON.stringify(value), { 
      status: HttpStatus.OK,
      headers: { 
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(rateLimit.resetTime)
      }
    }),
    {
      spanName: "health.openrouter",
      method: "GET",
    }
  )(checkOpenRouter)
}

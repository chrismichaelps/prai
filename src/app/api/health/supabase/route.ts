/** @Route.Health.Supabase */
import type { NextRequest } from "next/server"
import { HttpStatus } from "../../_lib/constants/status-codes"
import { Effect, pipe } from "effect"
import { createClient } from "@supabase/supabase-js"
import { PostgRErrorCodes } from "@/lib/effect/constants/PostgRErrorCodes"
import { HealthCheckError } from "../../_lib/errors/services"
import { exitResponse } from "../../_lib/response"
import { checkRateLimit, getClientIp } from "../../_lib/utils/rate-limit"
import { ContentTypeConstants, HttpHeaderConstants } from "@/lib/constants/app-constants"

export const dynamic = 'force-dynamic'

/** @Logic.Health.CheckSupabase */
const checkSupabase = pipe(
  Effect.tryPromise({
    try: async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials")
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.from('profiles').select('id').limit(1).maybeSingle()

      if (error && error.code !== PostgRErrorCodes.SINGLETON_NOT_FOUND) {
        throw new Error(error.message)
      }

      return { status: "ok", service: "supabase" as const }
    },
    catch: (error) => new HealthCheckError({ error, service: "supabase" })
  })
)

/** @Route.Health.Supabase.GET */
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
        [HttpHeaderConstants.CONTENT_TYPE]: ContentTypeConstants.JSON,
        [HttpHeaderConstants.RETRY_AFTER]: String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      }
    })
  }

  return exitResponse(
    (value) => new Response(JSON.stringify(value), { 
      status: HttpStatus.OK,
      headers: { 
        [HttpHeaderConstants.CONTENT_TYPE]: ContentTypeConstants.JSON,
        [HttpHeaderConstants.RATE_LIMIT_REMAINING]: String(rateLimit.remaining),
        [HttpHeaderConstants.RATE_LIMIT_RESET]: String(rateLimit.resetTime)
      }
    }),
    {
      spanName: "health.supabase",
      method: "GET",
    }
  )(checkSupabase)
}

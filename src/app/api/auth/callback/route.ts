/** @Route.Auth.Callback */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { ValidationError } from "@/app/api/_lib/errors"
import { decodeSearchParams, S } from "@/app/api/_lib/validation"
import { Effect, Match } from "effect"
import type { Exit, Cause } from "effect"

type ApiError = ValidationError
interface SearchParams {
  code?: string
  error?: string
  error_description?: string
  error_code?: string
  state?: string
}

/** @Logic.Auth.ErrorHandler */
const handleError = (error: unknown) => {
  console.error("Auth Callback Error:", error)
  if (error instanceof ValidationError) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/?error=${encodeURIComponent(error.message)}`
    )
  }
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/?error=callback_failed`)
}

/** @Logic.Effect.CauseHandler */
const handleCauseError = (cause: Cause.Cause<ApiError>): never => {
  return Match.type<Cause.Cause<ApiError>>().pipe(
    Match.tag("Fail", (cause) => {
      throw cause.error
    }),
    Match.orElse(() => {
      throw new ValidationError({ message: "Validation failed" })
    })
  )(cause)
}

/** @Route.Auth.Callback.GET */
export async function GET(request: NextRequest) {
  /** @Logic.Effect.RunPromiseExit */
  const exit = await Effect.runPromiseExit(
    decodeSearchParams(
      S.Struct({
        code: S.optional(S.String),
        error: S.optional(S.String),
        error_description: S.optional(S.String),
        error_code: S.optional(S.String),
        state: S.optional(S.String)
      })
    )(request.nextUrl.searchParams) as Effect.Effect<SearchParams, ApiError>
  )

  const params = Match.type<Exit.Exit<SearchParams, ApiError>>().pipe(
    Match.tag("Success", (exit) => exit.value),
    Match.tag("Failure", (exit) => handleCauseError(exit.cause)),
    Match.orElse(() => {
      throw new ValidationError({ message: "Unknown error" })
    })
  )(exit)

  if (params instanceof Error) {
    return handleError(params)
  }

  if (params.error) {
    return handleError(new ValidationError({ 
      message: params.error_description || params.error 
    }))
  }

  if (!params.code) {
    return handleError(new ValidationError({ message: "Missing authorization code" }))
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return handleError(new ValidationError({ message: "Missing Supabase configuration" }))
  }

  let cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[] = []
  
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookies) {
        cookiesToSet = cookies
      }
    }
  })
  
  /** @Logic.Supabase.ExchangeCode */
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(params.code)

  if (sessionError) {
    return handleError(new ValidationError({ message: sessionError.message }))
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const response = NextResponse.redirect(`${siteUrl}/?auth=success`)
  
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Record<string, string | number | boolean>)
  })
  
  return response
}

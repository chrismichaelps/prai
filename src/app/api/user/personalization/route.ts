/** @Route.User.Personalization */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError, ValidationError } from "@/app/api/_lib/errors"
import { exitResponse } from "../../_lib/response"
import * as S from "effect/Schema"
import { Effect, pipe } from "effect"
import { getPersonalization, savePersonalization } from "./services/personalization"

const PersonalizationBodySchema = S.Struct({
  preferences: S.optional(S.Unknown)
})

/** @Route.User.Personalization.GET */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const program = pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
        return session.user
      },
      catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
    }),
    Effect.flatMap((user) => getPersonalization(user.id))
  )

  return exitResponse(NextResponse.json, {
    spanName: "user.personalization.get",
    method: "GET",
    path: request.url,
    searchParams
  })(program)
}

/** @Route.User.Personalization.POST */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const decodeBody = (req: Request): Effect.Effect<{ preferences?: unknown }, ValidationError> =>
    pipe(
      Effect.tryPromise({
        try: () => req.json(),
        catch: (e) => new ValidationError({ message: `Failed to parse JSON: ${String(e)}` })
      }),
      Effect.flatMap((data) =>
        pipe(
          S.decodeUnknown(PersonalizationBodySchema)(data),
          Effect.mapError((error) => 
            new ValidationError({ 
              message: "Invalid request body",
              details: error instanceof Error ? error.message : String(error)
            })
          )
        )
      )
    )

  const program = pipe(
    decodeBody(request),
    Effect.flatMap((body) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
          return { userId: session.user.id, preferences: body.preferences }
        },
        catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
      })
    ),
    Effect.flatMap(({ userId, preferences }) => savePersonalization(userId, preferences))
  )

  return exitResponse(NextResponse.json, {
    spanName: "user.personalization.post",
    method: "POST",
    path: request.url,
    searchParams
  })(program)
}
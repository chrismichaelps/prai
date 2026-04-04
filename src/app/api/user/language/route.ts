/** @Route.User.Language */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Effect, pipe, Schema as S } from "effect"
import { UnauthorizedError, ValidationError } from "@/app/api/_lib/errors"
import { exitResponse } from "../../_lib/response"

const LanguageBodySchema = S.Struct({
  language: S.Literal("es", "en"),
})

/** @Route.User.Language.PATCH */
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const program = pipe(
    Effect.tryPromise({
      try: () => request.json(),
      catch: (e) => new ValidationError({ message: `Failed to parse JSON: ${String(e)}` }),
    }),
    Effect.flatMap((data) =>
      pipe(
        S.decodeUnknown(LanguageBodySchema)(data),
        Effect.mapError((e) => new ValidationError({ message: "Invalid body", details: String(e) }))
      )
    ),
    Effect.flatMap((body) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })

          const { error } = await supabase
            .from("profiles")
            .update({ language: body.language, updated_at: new Date().toISOString() })
            .eq("id", session.user.id)

          if (error) throw new Error(error.message)
          return { language: body.language }
        },
        catch: (e) => e instanceof UnauthorizedError ? e : new ValidationError({ message: String(e) }),
      })
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "user.language.patch",
    method: "PATCH",
    path: request.url,
    searchParams,
  })(program)
}

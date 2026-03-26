/** @Route.Issues */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ValidationError } from "@/app/api/_lib/errors"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeParams, decodeBody, S } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { issueService, IssueDbError } from "../../services/issue"

type ApiError = ValidationError | UnauthorizedError | IssueDbError

const idParamSchema = S.Struct({
  id: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid issue ID" })
  ),
})

/** @Route.Issues.Comments.POST */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(idParamSchema)(resolvedParams),
    Effect.flatMap(({ id }) =>
      pipe(
        Effect.tryPromise({
          try: async () => {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            return user
          },
          catch: () => new UnauthorizedError({ message: "Failed to get auth session" }),
        }),
        Effect.flatMap((user) => {
          if (!user) return Effect.fail(new UnauthorizedError({ message: "Authentication required" }))
          return Effect.succeed({ id, user })
        }),
        Effect.flatMap(({ id, user }) =>
          pipe(
            Effect.all({
              profile: issueService.getProfile(user.id),
              body: decodeBody(
                S.Struct({
                  body: S.String.pipe(
                    S.filter((s: string) => s.trim().length > 0, {
                      message: () => "Comment body is required",
                    })
                  ),
                })
              )(request),
            }),
            Effect.flatMap(({ profile, body }) =>
              issueService.addComment(id, user.id, body.body, (profile as { is_admin?: boolean } | null)?.is_admin === true)
            )
          )
        )
      )
    )
  )

  return exitResponse((data) => NextResponse.json(data, { status: 201 }), {
    spanName: "issues.comments.create",
    method: "POST",
    path: request.url,
    payload: await request.clone().json().catch(() => undefined)
  })(program)
}

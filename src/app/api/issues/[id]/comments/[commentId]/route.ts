/** @Route.Issues.Comments.Edit */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ValidationError } from "@/app/api/_lib/errors"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeParams, decodeBody, S } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { issueService, IssueDbError } from "../../../services/issue"

type ApiError = ValidationError | UnauthorizedError | IssueDbError

const ParamsSchema = S.Struct({
  id: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid issue ID" })
  ),
  commentId: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid comment ID" })
  ),
})

const CommentBodySchema = S.Struct({
  body: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, {
      message: () => "Comment body is required",
    })
  ),
})

/** @Route.Issues.Comments.PATCH - Edit comment */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const resolvedParams = await params

  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(ParamsSchema)(resolvedParams),
    Effect.flatMap(({ id: _id, commentId }) =>
      pipe(
        decodeBody(CommentBodySchema)(request),
        Effect.flatMap(({ body }) =>
          pipe(
            Effect.tryPromise({
              try: async () => {
                const supabase = await createClient()
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new UnauthorizedError({ message: "Authentication required" })
                return { commentId, body, userId: user.id }
              },
              catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Failed to get auth session" })
            }),
            Effect.flatMap(({ commentId, body, userId }) =>
              issueService.updateComment(commentId, userId, body)
            )
          )
        )
      )
    )
  )

  return exitResponse((data) => NextResponse.json(data), {
    spanName: "issues.comments.patch",
    method: "PATCH",
    path: request.url,
    payload: await request.clone().json().catch(() => undefined)
  })(program)
}

/** @Route.Issues.Comments.DELETE */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const resolvedParams = await params
  const { searchParams } = new URL(request.url)

  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(ParamsSchema)(resolvedParams),
    Effect.flatMap(({ id: _id, commentId }) =>
      pipe(
        Effect.tryPromise({
          try: async () => {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new UnauthorizedError({ message: "Authentication required" })
            const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
            return { commentId, userId: user.id, isAdmin: profile?.is_admin ?? false }
          },
          catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Failed to get auth session" })
        }),
        Effect.flatMap(({ commentId, userId, isAdmin }) =>
          issueService.deleteComment(commentId, userId, isAdmin)
        )
      )
    )
  )

  return exitResponse((data) => NextResponse.json(data), {
    spanName: "issues.comments.delete",
    method: "DELETE",
    path: request.url,
    searchParams
  })(program)
}

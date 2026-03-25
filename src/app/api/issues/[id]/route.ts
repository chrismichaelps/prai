/** @Route.Issues */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ValidationError } from "@/app/api/_lib/errors"
import { UnauthorizedError, NotFoundError } from "@/app/api/_lib/errors"
import { decodeParams, decodeBody, S } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { issueService, IssueDbError } from "../services/issue"

type ApiError = ValidationError | UnauthorizedError | NotFoundError | IssueDbError

const idParamSchema = S.Struct({
  id: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid issue ID" })
  ),
})

/** @Route.Issues.GET */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeParams(idParamSchema)(resolvedParams),
    Effect.flatMap(({ id }) => issueService.getIssueById(id))
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Issues.PATCH */
export async function PATCH(
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
              issue: issueService.getIssueById(id),
            }),
            Effect.flatMap(({ profile, issue }) => {
                const isAdmin = (profile as { is_admin?: boolean } | null)?.is_admin === true
                const isOwner = (issue as { user_id: string }).user_id === user.id
              if (!isOwner && !isAdmin) {
                return Effect.fail(new UnauthorizedError({ message: "You can only edit your own issues" }) as ApiError)
              }
              return pipe(
                decodeBody(
                  S.Struct({
                    title: S.optional(S.String.pipe(
                      S.filter((s: string) => s.trim().length > 0 && s.length <= 120, {
                        message: () => "Title must be 1–120 characters",
                      })
                    )),
                    body: S.optional(S.String),
                    status: S.optional(S.Literal("open", "in_progress", "closed")),
                    label: S.optional(S.Literal("bug", "feature", "question", "docs")),
                    is_pinned: S.optional(S.Boolean),
                  })
                )(request),
                Effect.flatMap((updates) => {
                  const safeUpdates = { ...updates }
                  if (!isAdmin) delete safeUpdates.is_pinned
                  return issueService.updateIssue(id, user.id, safeUpdates)
                })
              )
            })
          )
        )
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Issues.DELETE */
export async function DELETE(
  _request: NextRequest,
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
              issue: issueService.getIssueById(id),
            }),
            Effect.flatMap(({ profile, issue }) => {
              const isAdmin = (profile as { is_admin?: boolean } | null)?.is_admin === true
              const isOwner = (issue as { user_id: string }).user_id === user.id
              if (!isOwner && !isAdmin) {
                return Effect.fail(new UnauthorizedError({ message: "You can only delete your own issues" }) as ApiError)
              }
              return issueService.deleteIssue(id, user.id)
            })
          )
        )
      )
    )
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Issues */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ValidationError } from "@/app/api/_lib/errors"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeSearchParams, S } from "@/app/api/_lib/validation"
import { decodeBody } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { issueService, IssueDbError } from "./services/issue"

type ApiError = ValidationError | UnauthorizedError | IssueDbError

/** @Route.Issues.GET */
export async function GET(request: NextRequest) {
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeSearchParams(
      S.Struct({
        status: S.optional(S.String),
        label: S.optional(S.String),
        mine: S.optional(S.String),
        page: S.optional(S.String),
        limit: S.optional(S.String),
      })
    )(new URL(request.url).searchParams),
    Effect.flatMap((query) => {
      const page = Math.max(1, parseInt(query.page ?? "1", 10))
      const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? "20", 10)))
      return issueService.listIssues({
        status: query.status,
        label: query.label,
        userId: query.mine === "true" ? "me" : null,
        page,
        limit,
      })
    })
  )

  return exitResponse(NextResponse.json)(program)
}

/** @Route.Issues.POST */
export async function POST(request: NextRequest) {
  const program: Effect.Effect<unknown, ApiError> = pipe(
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
      return Effect.succeed(user)
    }),
    Effect.flatMap((user) =>
      pipe(
        decodeBody(
          S.Struct({
            title: S.String.pipe(
              S.filter((s: string) => s.trim().length > 0 && s.length <= 120, {
                message: () => "Title must be 1–120 characters",
              })
            ),
            body: S.optional(S.String),
            label: S.optional(S.Literal("bug", "feature", "question", "docs")),
          })
        )(request),
        Effect.flatMap((body) =>
          issueService.createIssue(user.id, body.title, body.body, body.label)
        )
      )
    )
  )

  return exitResponse((data) => NextResponse.json(data, { status: 201 }))(program)
}

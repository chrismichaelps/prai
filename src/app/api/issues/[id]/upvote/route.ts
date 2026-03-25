/** @Route.Issues */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { ValidationError } from "@/app/api/_lib/errors"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeParams, S } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { issueService, IssueDbError } from "../../services/issue"

type ApiError = ValidationError | UnauthorizedError | IssueDbError

const idParamSchema = S.Struct({
  id: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid issue ID" })
  ),
})

/** @Route.Issues.Upvote.POST */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  const program = pipe(
    decodeParams(idParamSchema)(resolvedParams),
    Effect.flatMap(({ id }) => {
      const getUser = Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()
          return user
        },
        catch: () => new UnauthorizedError({ message: "Failed to get auth session" }),
      })

      return pipe(
        getUser,
        Effect.flatMap((user) =>
          user
            ? issueService.toggleUpvote(id, user.id)
            : Effect.fail(new UnauthorizedError({ message: "Authentication required" }) as ApiError)
        )
      )
    })
  )

  return exitResponse(NextResponse.json)(program)
}

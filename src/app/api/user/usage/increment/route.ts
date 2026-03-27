/** @Route.User.Usage.Increment */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError, ValidationError } from "@/app/api/_lib/errors"
import { decodeBody, S } from "@/app/api/_lib/validation"
import { exitResponse } from "../../../_lib/response"
import { Effect, pipe } from "effect"
import { incrementUserUsage } from "../services/usage"
import { ChatDbError } from "../services/usage"
import type { Database } from "@/types/database.types"

type UserUsage = Database["public"]["Functions"]["increment_user_usage"]["Returns"][number]
type ApiError = UnauthorizedError | ValidationError | ChatDbError

/** @Logic.User.Usage.Increment.Schema */
const IncrementUsageSchema = S.Struct({
  amount: S.optional(S.Number.pipe(
    S.filter((n: number) => Number.isInteger(n) && n > 0 && n <= 100, { message: () => "Amount must be a positive integer between 1 and 100" })
  )),
  tokens: S.optional(S.Number),
  cost: S.optional(S.Number)
})

/** @Route.User.Usage.Increment.POST */
export async function POST(request: NextRequest) {
  /** @Logic.User.Usage.Increment.Program */
  const program: Effect.Effect<UserUsage, ApiError> = pipe(
    decodeBody(IncrementUsageSchema)(request),
    Effect.flatMap((body) =>
      Effect.tryPromise({
        /** @Logic.User.Usage.Increment.Authenticate */
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
          return { 
            userId: session.user.id, 
            amount: body.amount ?? 1,
            tokens: body.tokens ?? 0,
            cost: body.cost ?? 0
          }
        },
        catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
      })
    ),
    /** @Logic.User.Usage.Increment.Execute */
    Effect.flatMap(({ userId, amount, tokens, cost }) => incrementUserUsage(userId, amount, tokens, cost))
  )

  /** @Logic.User.Usage.Increment.Response */
  return exitResponse(NextResponse.json, {
    spanName: "user.usage.increment",
    method: "POST",
    path: request.url
  })(program)
}

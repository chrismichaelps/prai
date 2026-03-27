/** @Route.User.Usage */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { exitResponse } from "../../_lib/response"
import { Effect, pipe } from "effect"
import { getUserUsage } from "./services/usage"
import { ChatDbError } from "./services/usage"
import type { Database } from "@/types/database.types"

type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number]
type ApiError = UnauthorizedError | ChatDbError

/** @Route.User.Usage.GET */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  /** @Logic.User.Usage.Program */
  const program: Effect.Effect<UserUsage, ApiError> = pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
        return session.user
      },
      catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
    }),
    /** @Logic.User.Usage.FetchData */
    Effect.flatMap((user) => getUserUsage(user.id))
  )

  /** @Logic.User.Usage.Response */
  return exitResponse(NextResponse.json, {
    spanName: "user.usage.get",
    method: "GET",
    path: request.url,
    searchParams
  })(program)
}

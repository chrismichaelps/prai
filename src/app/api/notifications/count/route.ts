/** @Route.Notifications.Count */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe } from "effect"
import { NotificationDbError } from "../services/notification"

type ApiError = UnauthorizedError | NotificationDbError

/** @Route.Notifications.Count.GET */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const program: Effect.Effect<unknown, ApiError> = pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
        return session.user
      },
      catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
    }),
    Effect.flatMap((user) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          
          const { data: count, error } = await supabase.rpc("get_unread_notification_count", {
            p_user_id: user.id
          })

          if (error) throw new NotificationDbError({ error })

          return { count: count ?? 0 }
        },
        catch: (e) => new NotificationDbError({ error: e }),
      })
    )
  )

  return exitResponse((data: unknown) => NextResponse.json(data), {
    spanName: "notifications.count",
    method: "GET",
    path: request.url,
    searchParams
  })(program)
}

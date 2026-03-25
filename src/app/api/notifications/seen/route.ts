/** @Route.Notifications.Seen */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe as pipeEffect } from "effect"
import { NotificationDbError } from "../services/notification"

/** @Route.Notifications.Seen.POST */
export async function POST() {
  const program = pipeEffect(
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
          
          const { error } = await supabase.rpc("mark_notifications_seen", {
            p_user_id: user.id
          })

          if (error) throw new NotificationDbError({ error })
          return { success: true }
        },
        catch: (e) => new NotificationDbError({ error: e }),
      })
    )
  )

  return exitResponse((data: unknown) => NextResponse.json(data))(program)
}

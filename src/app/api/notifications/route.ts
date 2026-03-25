/** @Route.Notifications */
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe as pipeEffect } from "effect"
import { NotificationDbError } from "./services/notification"

export interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  resource_type: string | null
  resource_id: string | null
  issue_id: string | null
  comment_id: string | null
  actor_handle: string | null
  actor_avatar_url: string | null
  is_read: boolean
  created_at: string
}

/** @Route.Notifications.GET */
export async function GET() {
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
          
          const { data: notifications, error } = await supabase.rpc("get_notifications", {
            p_user_id: user.id,
            p_limit: 20,
            p_offset: 0
          })

          if (error) throw new NotificationDbError({ error })

          return { notifications: (notifications ?? []) as Notification[] }
        },
        catch: (e) => new NotificationDbError({ error: e }),
      })
    )
  )

  return exitResponse((data: unknown) => NextResponse.json(data))(program)
}

/** @Route.Notifications.PATCH - Mark all as read */
export async function PATCH() {
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
          
          const { error } = await supabase.rpc("mark_notifications_read", {
            p_user_id: user.id,
            p_notification_ids: null
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

/** @Route.Notifications.[id] */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { UnauthorizedError } from "@/app/api/_lib/errors"
import { decodeParams, S } from "@/app/api/_lib/validation"
import { exitResponse } from "@/app/api/_lib/response"
import { Effect, pipe as pipeEffect } from "effect"
import { NotificationDbError } from "../services/notification"

const idParamSchema = S.Struct({
  id: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "Invalid notification ID" })
  ),
})

/** @Route.Notifications.[id].PATCH */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  const program = pipeEffect(
    decodeParams(idParamSchema)(resolvedParams),
    Effect.flatMap(() =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.user) throw new UnauthorizedError({ message: "Authentication required" })
          return session.user
        },
        catch: (e) => e instanceof UnauthorizedError ? e : new UnauthorizedError({ message: "Authentication required" }),
      })
    ),
    Effect.flatMap((user) =>
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { id } = resolvedParams
          
          const { error } = await supabase.rpc("mark_notifications_read", {
            p_user_id: user.id,
            p_notification_ids: [id]
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

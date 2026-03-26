/** @Route.Profile */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ValidationError } from "@/app/api/_lib/errors"
import { decodeBody } from "@/app/api/_lib/validation"
import { UpdateProfileSchema } from "./schemas"
import { exitResponse } from "../_lib/response"
import { Effect, pipe } from "effect"

type ApiError = ValidationError

/** @Route.Profile.PATCH */
export async function PATCH(request: NextRequest) {
  /** @Logic.Profile.Update */
  const program: Effect.Effect<unknown, ApiError> = pipe(
    decodeBody(UpdateProfileSchema)(request),
    Effect.flatMap((updates) => {
      const dbUpdates: Record<string, unknown> = {}
      if (updates.display_name !== undefined) dbUpdates.display_name = updates.display_name
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio
      if (updates.language !== undefined) dbUpdates.language = updates.language

      if (Object.keys(dbUpdates).length === 0) {
        return Effect.fail(new ValidationError({ message: "No updates provided" }))
      }

      return pipe(
        Effect.tryPromise({
          try: async () => {
            const supabase = await createClient()
            const { data, error } = await supabase
              .from("profiles")
              .update(dbUpdates)
              .eq("id", updates.userId)
              .select()
              .single()

            if (error) throw error
            return data
          },
          catch: (e) => new ValidationError({ message: `Database error: ${String(e)}` })
        })
      )
    })
  )

  return exitResponse(NextResponse.json, {
    spanName: "profile.patch",
    method: "PATCH",
    path: request.url,
    payload: await request.clone().json().catch(() => undefined)
  })(program)
}

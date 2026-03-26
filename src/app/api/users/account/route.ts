/** @Route.Api.Users.DeleteAccount */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { userService } from "@/app/api/users/services/user"
import { Effect, pipe } from "effect"
import { S } from "@/app/api/_lib/validation/common"
import { exitResponse } from "../../_lib/response"
import { ValidationError } from "@/app/api/_lib/errors"

const DeleteAccountBodySchema = S.Struct({
  confirmHandle: S.String,
})

type DeleteAccountBody = S.Schema.Type<typeof DeleteAccountBodySchema>
type ApiError = ValidationError

/** @Route.Api.Users.DeleteAccount.DELETE */
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const program: Effect.Effect<unknown, ApiError> = pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          throw new Error("Unauthorized")
        }
        
        let body: DeleteAccountBody
        try {
          const raw = await request.json()
          body = S.decodeSync(DeleteAccountBodySchema)(raw)
        } catch {
          throw new Error("Invalid request body")
        }
        
        return { userId: user.id, body }
      },
      catch: (e) => new ValidationError({ message: String(e) })
    }),
    Effect.flatMap(({ userId, body }) => 
      pipe(
        userService.deleteAccount({ userId, confirmHandle: body.confirmHandle }),
        Effect.mapError((e) => new ValidationError({ message: String(e) }))
      )
    )
  )

  return exitResponse(NextResponse.json, {
    spanName: "users.account.delete",
    method: "DELETE",
    path: request.url,
    searchParams,
    payload: await request.clone().json().catch(() => undefined)
  })(program)
}

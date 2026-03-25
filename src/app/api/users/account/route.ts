/** @Route.Api.Users.DeleteAccount */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { userService } from "@/app/api/users/services/user"
import { Effect } from "effect"
import { S } from "@/app/api/_lib/validation/common"
import { HttpStatus } from "@/app/api/_lib/constants/status-codes"

const DeleteAccountBodySchema = S.Struct({
  confirmHandle: S.String,
})

type DeleteAccountBody = S.Schema.Type<typeof DeleteAccountBodySchema>

/** @Logic.Effect.AccountDeletion */
const handleDeleteAccount = async (userId: string, body: DeleteAccountBody) => {
  try {
    const result = await Effect.runPromise(
      userService.deleteAccount({ userId, confirmHandle: body.confirmHandle })
    )
    return NextResponse.json(result)
  } catch (e) {
    if (e && typeof e === "object" && "error" in e) {
      const err = e as { error: unknown }
      const message = typeof err.error === "string" ? err.error : "Failed to delete account"
      return NextResponse.json({ error: message }, { status: HttpStatus.BAD_REQUEST })
    }
    return NextResponse.json({ error: "Unknown error" }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

/** @Route.Api.Users.DeleteAccount.DELETE */
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: HttpStatus.UNAUTHORIZED })
  }

  let body: DeleteAccountBody
  try {
    const raw = await request.json()
    body = S.decodeSync(DeleteAccountBodySchema)(raw)
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: HttpStatus.BAD_REQUEST })
  }

  return handleDeleteAccount(user.id, body)
}

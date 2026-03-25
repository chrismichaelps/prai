/** @Service.Api.Users */
import { Effect, pipe } from "effect"
import { createClient as createServiceClient } from "@supabase/supabase-js"
import { UuidSchema, S } from "@/app/api/_lib/validation/common"
import { AccountDbError, UsersDbError } from "@/app/api/_lib/errors/services"

export { AccountDbError, UsersDbError }
export type UsersServiceError = AccountDbError | UsersDbError

const DeleteAccountSchema = S.Struct({
  userId: UuidSchema,
  confirmHandle: S.String,
})

type DeleteAccountParams = S.Schema.Type<typeof DeleteAccountSchema>

/** @Logic.Users.CascadeDelete */
const deleteUserData = async (userId: string): Promise<void> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new AccountDbError({ error: "Missing Supabase configuration" })
  }

  const supabase = createServiceClient(supabaseUrl, serviceKey)

  const deletions = [
    supabase.from("issue_comments").delete().eq("user_id", userId),
    supabase.from("issue_upvotes").delete().eq("user_id", userId),
    supabase.from("issues").delete().eq("user_id", userId),
    supabase.from("notifications").delete().eq("recipient_id", userId),
    supabase.from("notifications").delete().eq("actor_id", userId),
  ]

  for (const deletion of deletions) {
    const { error } = await deletion
    if (error) {
      console.error("Deletion error:", error)
      throw new AccountDbError({ error })
    }
  }

  const { data: chats } = await supabase
    .from("chats")
    .select("id")
    .eq("user_id", userId)

  if (chats && chats.length > 0) {
    const chatIds = chats.map((c: { id: string }) => c.id)

    await supabase.from("messages").delete().in("chat_id", chatIds)
    await supabase.from("chats").delete().eq("user_id", userId)
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (profileError) {
    throw new AccountDbError({ error: profileError })
  }
}

/** @Logic.Users.Service */
export const userService = {

  /** @Logic.Api.Users.DeleteAccount */
  deleteAccount: (params: DeleteAccountParams) =>
    pipe(
      Effect.try({
        try: () => S.decodeSync(DeleteAccountSchema)(params),
        catch: (e) => new AccountDbError({ error: e }),
      }),
      Effect.flatMap((validated) =>
        Effect.tryPromise({
          try: async () => {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

            if (!supabaseUrl || !serviceKey) {
              throw new AccountDbError({ error: "Missing Supabase configuration" })
            }

            const supabase = createServiceClient(supabaseUrl, serviceKey)

            const { data: profile, error: profileFetchError } = await supabase
              .from("profiles")
              .select("handle")
              .eq("id", validated.userId)
              .single()

            if (profileFetchError || !profile) {
              throw new AccountDbError({ error: "Profile not found" })
            }

            if (profile.handle !== validated.confirmHandle) {
              throw new AccountDbError({ error: "Handle mismatch" })
            }

            await deleteUserData(validated.userId)

            const { error: authError } = await supabase.auth.admin.deleteUser(
              validated.userId
            )

            if (authError) {
              console.error("Auth deletion error:", authError)
              throw new AccountDbError({ error: authError })
            }

            return { success: true, deletedAt: new Date().toISOString() }
          },
          catch: (e) => new AccountDbError({ error: e }),
        })
      )
    ),
}

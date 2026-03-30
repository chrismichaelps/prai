/** @Service.Api.User.Usage */
import { Effect, pipe } from "effect"
import { createClient } from "@/lib/supabase/server"
import { ChatDbError } from "@/app/api/_lib/errors/services"
import { UsageDefaults } from "@/lib/effect/constants/UsageConstants"
import { TimeConstants } from "@/lib/constants/app-constants"
import type { Database } from "@/types/database.types"

type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number]

export { ChatDbError }
export type UsageServiceError = ChatDbError

/** @Logic.Api.Usage.GetUserUsage */
export const getUserUsage = (userId: string): Effect.Effect<UserUsage, UsageServiceError> => {
  return pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data, error } = await supabase.rpc("get_user_usage", {
          p_user_id: userId
        })

        if (error) {
          throw new ChatDbError({ error })
        }

        if (!data || data.length === 0) {
          return { ...UsageDefaults } as UserUsage
        }

        const usage = { ...data[0] } as UserUsage & { next_reset_date?: string }
        if (usage.last_reset_date) {
          const lastReset = new Date(usage.last_reset_date)
          const nextReset = new Date(lastReset.getTime() + TimeConstants.USAGE_RESET_INTERVAL_MS)
          usage.next_reset_date = nextReset.toISOString()
        }
        return usage
      },
      catch: (error) => new ChatDbError({ error })
    })
  )
}

/** @Logic.Api.Usage.IncrementUserUsage */
export const incrementUserUsage = (
  userId: string,
  amount = 1,
  tokens = 0,
  cost = 0
): Effect.Effect<UserUsage, UsageServiceError> => {
  return pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        
        /** @Logic.Usage.IncrementMessageCount */
        const { data, error } = await supabase.rpc("increment_user_usage", {
          p_user_id: userId,
          p_amount: amount
        })

        if (error) {
          throw new ChatDbError({ error })
        }

        /** @Logic.Usage.TrackTokenUsage */
        if (tokens > 0) {
          await supabase.rpc("increment_token_usage", {
            p_user_id: userId,
            p_tokens: tokens,
            p_cost: cost
          })
        }

        if (!data || data.length === 0) {
          throw new Error("Failed to increment usage")
        }

        return data[0] as UserUsage
      },
      catch: (error) => new ChatDbError({ error })
    })
  )
}

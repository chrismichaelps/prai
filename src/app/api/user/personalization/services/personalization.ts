/** @Service.Api.User.Personalization */
import { Effect, pipe } from "effect"
import { createClient } from "@/lib/supabase/server"
import { ChatDbError } from "@/app/api/_lib/errors/services"
import { PersonalizationSchema, DEFAULT_PERSONALIZATION, type Personalization } from "@/lib/effect/schemas/PersonalizationSchema"
import { Schema } from "effect"

export { ChatDbError }

/** @Logic.Api.Personalization.GetPersonalization */
export const getPersonalization = (userId: string): Effect.Effect<Personalization, ChatDbError> => {
  return pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        const { data, error } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", userId)
          .single()

        if (error) {
          /** @Logic.Personalization.DefaultProfile */
          return DEFAULT_PERSONALIZATION
        }

        const decode = Schema.decodeUnknownEither(PersonalizationSchema)
        const result = decode(data?.preferences || {})
        
        if (result._tag === "Left") {
          return DEFAULT_PERSONALIZATION
        }

        return result.right
      },
      catch: (error) => new ChatDbError({ error })
    })
  )
}

/** @Logic.Api.Personalization.SavePersonalization */
export const savePersonalization = (
  userId: string,
  prefs: unknown
): Effect.Effect<Personalization, ChatDbError> => {
  return pipe(
    Effect.tryPromise({
      try: async () => {
        const supabase = await createClient()
        
        const decoded = Schema.decodeUnknownEither(PersonalizationSchema)
        const result = decoded(prefs as Record<string, unknown>)

        if (result._tag === "Left") {
          throw new Error("Invalid personalization schema")
        }

        const validPrefs = result.right
        
        const { data, error } = await supabase
          .from("profiles")
          .update({ 
            preferences: validPrefs,
            updated_at: new Date().toISOString() 
          })
          .eq("id", userId)
          .select("preferences")
          .single()

        if (error) {
          throw new ChatDbError({ error })
        }

        return data.preferences as Personalization
      },
      catch: (error) => error instanceof ChatDbError ? error : new ChatDbError({ error })
    })
  )
}

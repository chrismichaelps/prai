import { Effect, Context, Layer } from "effect"
import { SupabaseService, SupabaseAdminService } from "./Supabase"
import { AuthError } from "../errors"
import type { User, Session } from "../schemas/AuthSchema"

/** @Type.Effect.Auth */
export interface Auth {
  readonly signInWithGoogle: () => Effect.Effect<{ url: string }, AuthError>
  readonly signOut: () => Effect.Effect<void, AuthError>
  readonly getSession: () => Effect.Effect<Session | null, AuthError>
  readonly getUser: () => Effect.Effect<User | null, AuthError>
  readonly onAuthStateChange: (callback: (event: string, session: Session | null) => void) => () => void
}

/** @Service.Effect.Auth */
export const AuthService = Context.GenericTag<Auth>("Auth")

/** @Layer.Effect.Auth */
export const AuthLayer = Layer.effect(
  AuthService,
  Effect.gen(function* () {
    const supabase = yield* SupabaseService

    const getUrl = () => {
      const url = process.env.NEXT_PUBLIC_SITE_URL
      return url ? `${url}/auth/callback` : `${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
    }

    return {
      signInWithGoogle: () =>
        Effect.gen(function* () {
          const { data, error } = yield* Effect.promise(() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: getUrl()
              }
            })
          )

          if (error || !data.url) {
            return yield* Effect.fail(new AuthError({ message: error?.message || "Failed to sign in" }))
          }

          return { url: data.url }
        }),

      signOut: () =>
        Effect.gen(function* () {
          const { error } = yield* Effect.promise(() => supabase.auth.signOut())

          if (error) {
            return yield* Effect.fail(new AuthError({ message: error.message }))
          }
        }),

      getSession: () =>
        Effect.gen(function* () {
          const { data: { session }, error } = yield* Effect.promise(() => supabase.auth.getSession())

          if (error) {
            return yield* Effect.fail(new AuthError({ message: error.message }))
          }

          return session as Session | null
        }),

      getUser: () =>
        Effect.gen(function* () {
          const { data: { user }, error } = yield* Effect.promise(() => supabase.auth.getUser())

          if (error) {
            return yield* Effect.fail(new AuthError({ message: error.message }))
          }

          return user as User | null
        }),

      onAuthStateChange: (callback) => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
        return () => subscription.unsubscribe()
      }
    } as Auth
  })
)

/** @Service.Effect.AuthAdmin */
export const AuthAdminService = Context.GenericTag<{
  readonly verifyToken: (token: string) => Effect.Effect<User | null, AuthError>
  readonly deleteUser: (userId: string) => Effect.Effect<void, AuthError>
}>("AuthAdmin")

/** @Layer.Effect.AuthAdmin */
export const AuthAdminLayer = Layer.effect(
  AuthAdminService,
  Effect.gen(function* () {
    const supabaseAdmin = yield* SupabaseAdminService

    return {
      verifyToken: (token: string) =>
        Effect.gen(function* () {
          const { data: { user }, error } = yield* Effect.promise(() =>
            supabaseAdmin.auth.getUser(token)
          )

          if (error) {
            return yield* Effect.fail(new AuthError({ message: error.message }))
          }

          return user as User | null
        }),

      deleteUser: (userId: string) =>
        Effect.gen(function* () {
          const { error } = yield* Effect.promise(() =>
            supabaseAdmin.auth.admin.deleteUser(userId)
          )

          if (error) {
            return yield* Effect.fail(new AuthError({ message: error.message }))
          }
        })
    }
  })
)

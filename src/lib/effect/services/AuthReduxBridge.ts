import { Effect, Layer, Context } from "effect"
import { SupabaseService } from "../services/Supabase"
import { AuthService } from "../services/Auth"
import { AuthError } from "../errors"
import { store } from "@/store"
import { setSession, setUser, setLoading, setError, reset } from "@/store/slices/authSlice"
import type { User, Session } from "@supabase/supabase-js"

/** @Type.Effect.Auth.ReduxBridge */
export interface ReduxAuthBridge {
  readonly syncToRedux: (session: Session | null) => Effect.Effect<void>
  readonly dispatchSignOut: () => Effect.Effect<void>
  readonly dispatchFetchSession: () => Effect.Effect<void>
}

/** @Service.Effect.Auth.ReduxBridge */
export const ReduxAuthBridgeService = Context.GenericTag<ReduxAuthBridge>("ReduxAuthBridge")

/** @Layer.Effect.Auth.ReduxBridge */
export const ReduxAuthBridgeLayer = Layer.effect(
  ReduxAuthBridgeService,
  Effect.gen(function* () {
    const auth = yield* AuthService

    return {
      syncToRedux: (session: Session | null) =>
        Effect.sync(() => {
          store.dispatch(setSession({ 
            user: session?.user as User | null, 
            session 
          }))
        }),

      dispatchSignOut: () =>
        Effect.sync(() => {
          store.dispatch(setLoading(true))
          fetch('/api/auth/signout', { method: 'POST' })
            .then(() => {
              store.dispatch(reset())
              window.location.href = '/'
            })
            .catch(err => store.dispatch(setError(err.message)))
        }),

      dispatchFetchSession: () =>
        Effect.sync(() => {
          store.dispatch(setLoading(true))
          fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
              store.dispatch(setSession({ 
                user: data.user as User | null, 
                session: data.session as Session | null 
              }))
            })
            .catch(err => {
              store.dispatch(setError(err.message))
            })
        })
    } as ReduxAuthBridge
  })
)

/** @Effect.Auth.ReduxSync */
export const syncAuthToRedux = (session: Session | null): Effect.Effect<void> =>
  Effect.sync(() => {
    store.dispatch(setSession({ 
      user: session?.user as User | null, 
      session 
    }))
  })

/** @Effect.Auth.ReduxSignOut */
export const signOutViaRedux = (): Effect.Effect<void> =>
  Effect.sync(() => {
    store.dispatch(setLoading(true))
    fetch('/api/auth/signout', { method: 'POST' })
      .then(() => {
        store.dispatch(reset())
        window.location.href = '/'
      })
      .catch(err => store.dispatch(setError(err.message)))
  })

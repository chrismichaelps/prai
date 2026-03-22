---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Lib.Effect.Services.AuthReduxBridge

### [Signatures]
```ts
export interface ReduxAuthBridge {
  readonly syncToRedux: (session: Session | null) => Effect.Effect<void>
  readonly dispatchSignIn: () => Effect.Effect<void>
  readonly dispatchSignOut: () => Effect.Effect<void>
  readonly dispatchFetchSession: () => Effect.Effect<void>
}

export const ReduxAuthBridgeService: Context.Tag<ReduxAuthBridge>("ReduxAuthBridge")
export const ReduxAuthBridgeLayer: Layer<ReduxAuthBridgeService, never, AuthService>
```

### [Governance]
- **Bridge_Law:** Bridges Effect world with Redux world - Effect operations dispatch Redux actions.
- **Sync_Law:** All methods use `Effect.sync` to bridge async operations to Redux dispatch.
- **SideEffect_Law:** Uses `fetch` API directly for HTTP operations, updates Redux state on completion.

### [Implementation Notes]
- **Status:** DEPRECATED. Auth now uses `@Context.Auth` directly with Supabase `onAuthStateChange`.
- **syncToRedux:** Dispatches `setSession` action with user/session data.
- **dispatchSignIn:** Opens OAuth URL via browser redirect.
- **dispatchSignOut:** Calls signout API and resets Redux state.
- **dispatchFetchSession:** Fetches session and updates Redux state.

### [Semantic Hash]
Provides Effect-compatible interface to Redux auth operations. **Currently superseded by `@Context.Auth`** which provides direct React Context integration with Supabase.

### [Linkage]
- **Legacy:** Redux-based auth bridge for Effect layer integration
- **Current:** `@root/src/contexts/AuthContext.tsx`
- **Dependencies:** `@root/src/store/slices/authSlice.ts`, `@root/src/lib/effect/services/Auth.ts`

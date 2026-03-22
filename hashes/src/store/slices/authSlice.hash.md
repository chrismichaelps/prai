---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Store.Slice.Auth

### [Signatures]
```ts
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  initialized: boolean
}

export const fetchSession: AsyncThunk<void, void, { rejectValue: string }>
export const signIn: AsyncThunk<void, void, { rejectValue: string }>
export const signOut: AsyncThunk<void, void, { rejectValue: string }>
```

### [Governance]
- **AsyncThunk_Law:** Uses `createAsyncThunk` for API calls (fetchSession, signIn, signOut).
- **SyncReducers_Law:** Sync reducers (setSession, setUser, setLoading, setError, reset) for immediate state updates.
- **Initialized_Law:** Tracks `initialized` state to prevent re-fetching after first load.

### [Implementation Notes]
- **Status:** This Redux slice is DEPRECATED. Auth now uses `@Context.Auth` via Supabase `onAuthStateChange`.
- **ExtraReducers:** Handles pending/fulfilled/rejected states for all async thunks.
- **Reset:** Clears all auth state on sign out.
- **Error Handling:** Stores error messages in `error` field for UI display.

### [Semantic Hash]
Redux slice for authentication state management. **Currently superseded by `@Context.Auth`** which uses Supabase `onAuthStateChange` for real-time reactive updates.

### [Linkage]
- **Legacy:** `@root/src/hooks/useAuthRedux.ts`, `@root/src/lib/effect/services/AuthReduxBridge.ts`
- **Current:** `@root/src/contexts/AuthContext.tsx`
- **Dependencies:** `@root/src/lib/effect/schemas/AuthSchema.ts`

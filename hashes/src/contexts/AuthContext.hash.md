---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.Auth

### [Signatures]
```ts
export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement
export function useAuth(): AuthContextValue

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  initialized: boolean
  signIn: (callbackUrl?: string) => void
  signOut: () => void
  refreshProfile: () => Promise<void>
}
```

### [Governance]
- **ClientOnly_Law:** Uses `'use client'` directive - browser-only auth context.
- **SupabaseSSR_Law:** Uses `@supabase/ssr` `createBrowserClient` for cookie-based sessions.
- **CallbackUrl_Law:** Supports `callbackUrl` for redirect after OAuth login.
- **EventDriven_Law:** Auth state changes via `onAuthStateChange` subscription.
- **ProfileAutoCreate_Law:** Auto-creates profile on first sign-in via `fetchProfile`.

### [Implementation Notes]
- **LazyLoad:** Supabase client loaded via dynamic `import()` inside `useEffect` to avoid build-time errors.
- **useRef:** Stores supabase client instance in `useRef` to prevent recreation on re-renders.
- **fetchProfile:** Fetches profile from Supabase, auto-creates if not found (PGRST116).
- **onAuthStateChange:** Subscribes to auth events, handles signin/signout and profile fetch.
- **sessionStorage:** Stores `callbackUrl` for redirect after OAuth flow.
- **signIn:** Stores callbackUrl in sessionStorage before OAuth redirect.
- **signOut:** Clears session via Supabase + server API, then full page redirect.
- **refreshProfile:** Re-fetches profile data after updates.

### [Semantic Hash]
Provides React Context for auth state using Supabase browser client with `onAuthStateChange` for reactive updates. Handles OAuth flow with callback URL support and integrates profile fetching.

### [Linkage]
- **Used by:** `@root/src/app/layout.tsx`, `@root/src/components/layout/Header.tsx`, `@root/src/app/profile/page.tsx`, `@root/src/app/auth/signin/page.tsx`
- **Dependencies:** `@supabase/ssr`, `@/lib/supabase/client.ts`, `@/types/database.types.ts`

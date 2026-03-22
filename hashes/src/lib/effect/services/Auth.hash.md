---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Lib.Effect.Services.Auth

### [Signatures]
```ts
// API Routes (Next.js Route Handlers)
export async function GET /api/auth/session    // Get current session
export async function POST /api/auth/signin    // Initiate OAuth flow
export async function POST /api/auth/signout   // Sign out user
export async function GET /api/auth/callback   // OAuth callback

// Supabase Auth Service
export interface Auth {
  readonly signInWithGoogle: () => Effect.Effect<{ url: string }, AuthError>
  readonly signOut: () => Effect.Effect<void, AuthError>
  readonly getSession: () => Effect.Effect<Session | null, AuthError>
  readonly getUser: () => Effect.Effect<User | null, AuthError>
  readonly onAuthStateChange: (callback: (event: string, session: Session | null) => void) => () => void
}
```

### [Governance]
- **OAuth_Law:** Google OAuth via Supabase Auth with PKCE flow.
- **Cookie_Law:** Session stored in cookies via Supabase SSR `@supabase/ssr`.
- **Callback_Law:** OAuth callback exchanges code for session, sets cookies, redirects to `/?auth=success`.
- **ProtectedRoute_Law:** Protected pages redirect to `/?callbackUrl=/path` when unauthenticated.

### [API Routes]

#### GET /api/auth/session
- Reads cookies via `createServerClient`
- Returns `{ session, user }` from `supabase.auth.getSession()`
- Uses mutable cookie container pattern for `setAll`

#### POST /api/auth/signin
- Creates OAuth URL via `supabase.auth.signInWithOAuth()`
- Returns `{ url }` for client-side redirect
- Sets cookies (PKCE verifier) before redirect

#### GET /api/auth/callback
- Exchanges OAuth code for session via `exchangeCodeForSession()`
- Sets auth cookies on response
- Redirects to `/?auth=success`

#### POST /api/auth/signout
- Calls `supabase.auth.signOut()`
- Clears session cookies

### [Implementation Notes]
- **Cookie Container Pattern:** API routes use `let cookiesToSet = []` and `setAll(cookies) { cookiesToSet = cookies }` to capture cookies before response.
- **OAuth Flow:** signIn → Google → callback → session → redirect
- **Session Storage:** Cookies stored with `httpOnly: false` for client access

### [Semantic Hash]
Provides authentication API routes and service layer for Supabase OAuth flow with PKCE, cookie-based session management, and protected route support.

### [Linkage]
- **Routes:** `/api/auth/session`, `/api/auth/signin`, `/api/auth/callback`, `/api/auth/signout`
- **Dependencies:** `@supabase/ssr`, `@supabase/supabase-js`

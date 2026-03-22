---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Auth

### [Routes]
- `@Route.Auth.Session` - `GET /api/auth/session`
- `@Route.Auth.Signin` - `POST /api/auth/signin`
- `@Route.Auth.Callback` - `GET /api/auth/callback`
- `@Route.Auth.Signout` - `POST /api/auth/signout`

### [Signatures]
```ts
// GET /api/auth/session
export async function GET(request: NextRequest): Promise<NextResponse>

// POST /api/auth/signin
export async function POST(request: NextRequest): Promise<NextResponse>

// GET /api/auth/callback
export async function GET(request: NextRequest): Promise<NextResponse>

// POST /api/auth/signout
export async function POST(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **SSRLaw:** Uses `createServerClient` from `@supabase/ssr` with mutable cookie container.
- **CookieContainer_Law:** Uses `let cookiesToSet = []` pattern to capture cookies before response.
- **NoLogs_Law:** No console.log in production routes.

### [Implementation Notes]
- **Session:** Reads cookies, returns `{ session, user }` from `supabase.auth.getSession()`.
- **Signin:** Initiates OAuth, returns `{ url }` for client redirect.
- **Callback:** Exchanges OAuth code, sets cookies, redirects to `/?auth=success`.
- **Signout:** Calls `supabase.auth.signOut()`, returns `{ success: true }`.

### [Semantic Hash]
Next.js API routes handling Supabase authentication: session retrieval, OAuth signin, OAuth callback, and signout operations.

### [Linkage]
- **Client:** `@root/src/contexts/AuthContext.tsx`
- **Supabase:** `@root/src/lib/supabase/server.ts`

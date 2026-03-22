---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Lib.Effect.Services.Supabase

### [Signatures]
```ts
// Browser Client (via @supabase/ssr)
export function createBrowserClient(): SupabaseClient
export function createServerClient(supabaseUrl, supabaseAnonKey, cookies): SupabaseClient

// Supabase SSR Package
import { createBrowserClient, createServerClient } from '@supabase/ssr'
```

### [Governance]
- **SSRLaw:** Uses `@supabase/ssr` package for cookie-based auth.
- **Browser_Law:** `createBrowserClient` for client-side with cookie storage.
- **Server_Law:** `createServerClient` for API routes with mutable cookie container.
- **PKCE_Law:** OAuth flow uses PKCE for security.

### [Implementation Notes]
- **Browser Client:** Created in `@/lib/supabase/client.ts` using `createBrowserClient`.
- **Server Client:** Created in API routes with `getAll`/`setAll` cookie handlers.
- **Cookie Container:** API routes use mutable array pattern for `setAll` to avoid immutable request.cookies issues.
- **Credentials:** Browser fetch includes `credentials: 'include'` for cookies.

### [Semantic Hash]
Provides Supabase client factory functions using `@supabase/ssr` for proper cookie-based session management in Next.js App Router.

### [Linkage]
- **Used by:** `@root/src/contexts/AuthContext.tsx`, `@root/src/app/api/auth/*`
- **Dependencies:** `@supabase/ssr`, `@supabase/supabase-js`

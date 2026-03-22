---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Supabase

### [Files]
- `@Lib.Supabase.Client` - Browser client factory
- `@Lib.Supabase.Server` - Server client factory

### [Signatures]
```ts
// Browser client
export function createSupabaseBrowserClient(): SupabaseClient

// Server client
export async function createClient(): SupabaseClient
```

### [Governance]
- **Singleton_Law:** Browser client is singleton pattern via module-level function.
- **SSRLaw:** Uses `@supabase/ssr` package for proper cookie handling.
- **Browser_Law:** `createBrowserClient` for client-side components.
- **Server_Law:** `createServerClient` with `cookies()` from `next/headers`.

### [Implementation Notes]
- **Browser Client:** Uses `createBrowserClient` from `@supabase/ssr` with env vars.
- **Server Client:** Uses `createServerClient` with Next.js `cookies()` API.
- **Error Handling:** Throws if env vars are missing.

### [Semantic Hash]
Supabase client factory functions using `@supabase/ssr` for proper cookie-based session management in Next.js App Router.

### [Linkage]
- **Browser Client:** `@root/src/contexts/AuthContext.tsx`
- **Server Client:** `@root/src/lib/supabase/server.ts` (via `cookies()`)
- **Dependencies:** `@supabase/ssr`, `@supabase/supabase-js`

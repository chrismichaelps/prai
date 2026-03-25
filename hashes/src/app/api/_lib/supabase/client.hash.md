---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Supabase.Client

### [Signatures]
```ts
export const supabase: SupabaseClient<Database>
export { supabase as db }
```

### [Governance]
- **Server_Side:** Uses `SUPABASE_SERVICE_ROLE_KEY` for full database access.
- **RLS:** API routes bypass RLS; auth handled via validated user IDs.
- **No_Sessions:** Auth disabled (`autoRefreshToken: false`, `persistSession: false`).

### [Implementation Notes]
- **Service_Role:** Uses service role key, not anon key.
- **Database_Types:** Typed against `@/types/database.types`.
- **Named_Export:** Exported as both `supabase` and `db` for convenience.

### [Semantic Hash]
Server-side Supabase client for API routes. Uses service role key for unrestricted database access in Next.js API routes.

### [Linkage]
- **Upstream:** `@supabase/supabase-js`, `@/types/database.types`
- **Downstream:** All API service files (`chatService`, `authService`)

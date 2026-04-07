---
State_ID: BigInt(0xb06818db)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @types.database.types

### [Signatures]
```ts
export type Json =
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          bio: string | null
          language: string | null
          preferences: Json | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
          // Usage tracking
          messages_used: number
          messages_limit: number
          last_reset_date: string
          total_tokens_used: number
          total_cost: number
          daily_cost_usd: number
          cost_reset_date: string
          // Subscription
          subscription_tier: string          // billing tier ('free' | 'pro')
          subscription_status: string
          subscription_start_date: string | null
          subscription_end_date: string | null
          reset_interval: string
          // Admin & gifted tier
          is_admin: boolean                  // bypasses all per-user quotas
          gifted_tier: string | null         // override tier ('pro' | 'free' | null)
          gifted_until: string | null        // ISO timestamp or null = permanent
          // Jina search
          jina_searches_used: number
          jina_searches_reset: string
        }
        Insert: { /* all fields optional except id, handle */ }
        Update: { /* all fields optional */ }
```

### [Governance]
- **Encapsulation_Law:** Strictly adheres to file-level opacity rules.
- **Grammar_Bridge:** Mirrors `@root/hashes/grammar/typescript.hash.md`
- **Billing_Decoupling_Law:** `gifted_tier` + `gifted_until` are independent of `subscription_tier`. Effective tier is always resolved by the DB RPCs — never computed in app code by reading these columns directly.
- **Admin_Flag_Law:** `is_admin` is a boolean that bypasses per-user quota checks in all quota RPCs. Set via `ADMIN_EMAILS` env var at login or directly via SQL.

### [Semantic Hash]
Supabase-generated TypeScript types for the public schema. The profiles table is the central entity — it now tracks three access dimensions: billing tier (`subscription_tier`), admin bypass (`is_admin`), and gifted tier override (`gifted_tier` / `gifted_until`). All quota and usage RPCs resolve the effective tier from these columns server-side.

### [Linkage]
- **Dependencies:** None (pure type declaration)
- **Downstream:** Every file that imports `Database` from `@/types/database.types`
- **Source of Truth:** `supabase/migrations/` — these types must be kept in sync with migrations manually until `supabase gen types` is run

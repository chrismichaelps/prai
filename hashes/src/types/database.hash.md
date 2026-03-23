---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Types.Database

### [Signatures]
```ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; bio: string | null; language: string | null; preferences: Json | null; avatar_url: string | null; created_at: string | null; updated_at: string | null; }
        Insert: { ... }
        Update: { ... }
        Relationships: []
      }
    }
  }
}
```

### [Governance]
- **Supabase_Sync_Law:** This file acts as the primary DTO (Data Transfer Object) proxy reflecting the remote Postgres schema.

### [Semantic Hash]
Strongly-typed interface defining the Postgres schema exposed by the Supabase client. Primarily maps the `profiles` table attributes.

### [Linkage]
- **Dependencies:** N/A (Pure Type Declaration)

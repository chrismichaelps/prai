---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Api.User.Personalization

### [Signatures]
```ts
export const getPersonalization: (userId: string) => Effect.Effect<Personalization, ChatDbError>
export const savePersonalization: (userId: string, prefs: unknown) => Effect.Effect<Personalization, ChatDbError>
```

### [Governance]
- **Database_Law:** Reads/writes to profiles.preferences JSON column.
- **Schema_Law:** Uses Schema.decodeUnknownEither for validation.

### [Semantic Hash]
Effect service for personalization database operations.

### [Linkage]
- **Upstream:** PersonalizationSchema, Supabase client
- **Downstream:** `@root/src/app/api/user/personalization/route.ts`
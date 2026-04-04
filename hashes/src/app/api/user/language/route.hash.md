---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.User.Language

### [Signatures]
```ts
export async function PATCH(request: NextRequest): Promise<NextResponse>
// Body: { language: "es" | "en" }
// → updates profiles.language for authenticated user
```

### [Governance]
- **Auth_Law:** Requires active Supabase session — throws `UnauthorizedError` if no session.
- **Validation_Law:** Body decoded via `Schema.Literal("es", "en")` — strictly typed language values.
- **Table_Law:** Updates `profiles` table columns `language` + `updated_at`.
- **Pipeline_Law:** Uses `exitResponse` + `pipe(Effect.tryPromise(...))` — consistent with API route pattern.

### [Semantic Hash]
PATCH endpoint for persisting user language preference to the `profiles` table. Called by `ChatApi.updateUserLanguage` when `/language` command executes.

### [Linkage]
- **Upstream:** `@/lib/supabase/server`, `@/app/api/_lib/errors`, `@/app/api/_lib/response`
- **Downstream:** `@/lib/effect/services/ChatApi` (updateUserLanguage)

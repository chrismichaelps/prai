---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Memory

### [Signatures]
```ts
export async function POST(request: NextRequest): Promise<NextResponse>
// Body: { key: string (min 1), value: string (min 1), category: "preference"|"fact"|"itinerary"|"contact" }
// → upserts to session_memory table (onConflict: "user_id,memory_key")

export async function DELETE(request: NextRequest): Promise<NextResponse>
// Body: { key: string (min 1) }
// → deletes from session_memory where user_id + memory_key match
```

### [Governance]
- **Auth_Law:** Both methods require active Supabase session — throws `UnauthorizedError` if no session.
- **Validation_Law:** Request body decoded via Effect Schema (`SaveMemoryBodySchema` / `DeleteMemoryBodySchema`) with `minLength(1)` guards.
- **Upsert_Law:** POST uses `onConflict: "user_id,memory_key"` — updates existing key rather than inserting duplicate.
- **Pipeline_Law:** Both routes use `exitResponse` + `pipe(Effect.tryPromise(...))` pattern — consistent with other API routes.

### [Semantic Hash]
Internal API for persisting and removing user memory entries in `session_memory` table. Called by `MemoryApiLayer` in the Effect runtime.

### [Linkage]
- **Upstream:** `@/lib/supabase/server`, `@/app/api/_lib/errors`, `@/app/api/_lib/response`
- **Downstream:** `@/lib/effect/services/MemoryApi`

---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Profile

### [Routes]
| Method | Handler | Description |
|--------|---------|-------------|
| PATCH | `PATCH` | Update user profile |

### [Signatures]
```ts
export async function PATCH(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Schema_Law:** Input validated via `UpdateProfileSchema` from `./schemas`.
- **Response_Law:** Uses `exitResponse` helper for Effect → NextResponse conversion.
- **Validation_Law:** Rejects requests with no valid update fields.

### [Implementation Notes]
- **PATCH:** Updates profile fields (display_name, bio, language) via Supabase.
- **Validation:** Returns `ValidationError` if no valid fields provided.
- **RLS:** Uses server-side Supabase client with service role key.

### [Semantic Hash]
API route for user profile updates. Accepts partial updates for display_name, bio, and language fields.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`, `@/app/api/_lib/response`
- **Downstream:** Profile component (`src/app/profile/`)

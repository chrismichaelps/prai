---
State_ID: BigInt(0x0fc98d6)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Issues.Upvote

### [Signatures]
```ts
export async function POST(request: NextRequest, { params }): Promise<NextResponse>
```

### [Governance]
- **Toggle_Atomic_Lock:** Wraps the check-then-insert/delete logic within a single `issueService` call to ensure idempotent upvote states.
- **Auth_Gate_POST:** Strictly requires a valid user session, preventing anonymous upvoting.

### [Semantic Hash]
The interaction endpoint for community upvoting. It allows authenticated users to express interest in specific issues, serving as a primary driver for report prioritization.

### [Linkage]
- **Dependencies:** `@/app/api/issues/services/issue`, `@/app/api/_lib/validation`, `@/lib/supabase/server`

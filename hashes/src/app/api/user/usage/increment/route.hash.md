---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.API.User.Usage.Increment

### [Signatures]
```ts
export async function POST(request: NextRequest): NextResponse<UserUsage>
```

### [Governance]
- **Auth_Law:** Requires authentication via Supabase session.
- **Effect_Law:** Uses Effect framework pattern with `exitResponse`.

### [Semantic Hash]
POST endpoint for incrementing user usage count and optionally tracking tokens/cost.

### [Linkage]
- **Upstream:** `@root/src/app/api/user/usage/services/usage.ts`
- **Downstream:** `@root/src/lib/effect/chat.ts`

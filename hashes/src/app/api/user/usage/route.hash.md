---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.API.User.Usage

### [Signatures]
```ts
export async function GET(request: NextRequest): NextResponse<UserUsage>
export async function POST(request: NextRequest): NextResponse<UserUsage>
```

### [Governance]
- **Auth_Law:** Requires authentication via Supabase session.
- **Effect_Law:** Uses Effect framework pattern with `exitResponse`.
- **Usage_Law:** GET fetches usage stats, POST increments usage count.

### [Semantic Hash]
GET endpoint returning user's current usage statistics including next_reset_date calculation.

### [Linkage]
- **Upstream:** `@root/src/app/api/user/usage/services/usage.ts`
- **Downstream:** `@root/src/hooks/useUsage.ts`

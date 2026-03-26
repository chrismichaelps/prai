---
State_ID: BigInt(0x0fc98dc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Users.Search

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Auth_Gate_GET:** Mandates a valid user session before allowing cross-profile discovery to prevent anonymous scraping.
- **RPC_Sovereignty:** Offloads the complex ILIKE and distance-based searching to the `search_users` database RPC for optimal performance.

### [Semantic Hash]
The discovery boundary for the PR\\AI community. It supports fuzzy handle/name searching with built-in pagination, enabling features like @mentions and profile lookup.

### [Linkage]
- **Dependencies:** `@/lib/supabase/server`, `@/app/api/_lib/validation`, `@/app/api/_lib/errors`

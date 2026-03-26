---
State_ID: BigInt(0x0fc98d3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Issues.Detail

### [Signatures]
```ts
export async function GET(request: NextRequest, { params }): Promise<NextResponse>
export async function PATCH(request: NextRequest, { params }): Promise<NextResponse>
export async function DELETE(request: NextRequest, { params }): Promise<NextResponse>
```

### [Governance]
- **Effect_Silo_Pattern:** Wraps granular entity retrieval and modification within `Effect` to maintain predictable error states.
- **Admin_Reflex_Rule:** Permits issue deletion only to the original author or a verified administrator, enforcing strict access control.
- **Validation_Hard_Lock:** Standardizes URI parameter and body validation through `@/app/api/_lib/validation`.

### [Semantic Hash]
The authoritative endpoint for single-issue operations. It manages the lifecycle of a specific report, including fetching deep metadata (comments, author details) and handling authorized state changes or removals.

### [Linkage]
- **Dependencies:** `@/app/api/issues/services/issue`, `@/app/api/_lib/validation`, `@/app/api/_lib/response`, `@/lib/supabase/server`

---
State_ID: BigInt(0x0fc98dd)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Users.DeleteAccount

### [Signatures]
```ts
export async function DELETE(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **Account_Deletion_Hard_Lock:** Mandates a `confirmHandle` match in the request body as a secondary safety gate before executing destructive service deletions.
- **Auth_Gate_DELETE:** Strictly requires a fresh Supabase user session to protect account integrity.

### [Semantic Hash]
The destructive boundary for user offboarding. It validates the user's intent through a handle-match confirmation and triggers the multi-layer cascade deletion service.

### [Linkage]
- **Dependencies:** `@/app/api/users/services/user`, `@/app/api/_lib/validation/common`, `@/lib/supabase/server`, `@/app/api/_lib/constants/status-codes`

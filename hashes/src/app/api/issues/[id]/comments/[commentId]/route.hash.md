---
State_ID: BigInt(0x0fc98d5)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Issues.Comments.Edit

### [Signatures]
```ts
export async function PATCH(request: NextRequest, { params }): Promise<NextResponse>
export async function DELETE(request: NextRequest, { params }): Promise<NextResponse>
```

### [Governance]
- **Ownership_Hard_Lock:** Restricts comment edits strictly to the original author via ID verification in the implementation logic.
- **Soft_Delete_Law:** Implements comment removal as a `deleted_at` timestamp update to maintain reference integrity within the notification system.
- **Validation_Hard_Lock:** Enforces `ParamsSchema` and `CommentBodySchema` decoding to prevent malformed updates.

### [Semantic Hash]
The management interface for existing comments. It provides secure paths for authors to update their feedback and for both authors and admins to perform non-destructive deletions.

### [Linkage]
- **Dependencies:** `@/app/api/issues/services/issue`, `@/app/api/_lib/validation`, `@/lib/supabase/server`

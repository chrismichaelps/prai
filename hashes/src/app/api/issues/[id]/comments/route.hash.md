---
State_ID: BigInt(0x0fc98d4)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Issues.Comments

### [Signatures]
```ts
export async function POST(request: NextRequest, { params }): Promise<NextResponse>
```

### [Governance]
- **Auth_Gate_POST:** Mandates a verified user session through `@/lib/supabase/server` before allowing comment ingestion.
- **Admin_Reflex_Rule:** Determines `is_admin_reply` status by fetching the actor's profile visibility, ensuring authoritative labeling in the UI.
- **Mention_Reflex_Rule:** Indirectly triggers asynchronous mention dispatching via the `issueService` upon successful insertion.

### [Semantic Hash]
The write-only boundary for issue discussions. It facilitates the creation of a new comment, ensuring proper attribution and triggering the notification ecosystem for mentioned users.

### [Linkage]
- **Dependencies:** `@/app/api/issues/services/issue`, `@/app/api/_lib/validation`, `@/lib/supabase/server`

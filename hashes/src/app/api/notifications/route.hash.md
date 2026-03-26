---
State_ID: BigInt(0x0fc98d7)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Notifications

### [Signatures]
```ts
export async function GET(): Promise<NextResponse>
export async function PATCH(): Promise<NextResponse>
```

### [Governance]
- **Auth_Gate_GET:** Strictly enforces a valid Supabase session before allowing access to the notification feed.
- **RPC_Sovereignty:** Delegates all data retrieval and batch updates to vetted database RPCs (`get_notifications`, `mark_notifications_read`) for performance and integrity.

### [Semantic Hash]
The main controller for the Notification system. It manages the retrieval of paginated events and provides a bulk action for marking all notifications as read.

### [Linkage]
- **Dependencies:** `@/lib/supabase/server`, `@/app/api/notifications/services/notification`, `effect`

---
State_ID: BigInt(0x0fc98d8)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Notifications.Count

### [Signatures]
```ts
export async function GET(): Promise<NextResponse>
```

### [Governance]
- **Performance_Isolation_Law:** Maintains a dedicated, high-performance endpoint for unread counts to prevent pagination logic from bloating the badge update lifecycle.

### [Semantic Hash]
A specialized utility endpoint for the notification badge. It returns a precise integer of unread notifications, ensuring the UI accurately reflects the user's pending alerts.

### [Linkage]
- **Dependencies:** `@/lib/supabase/server`, `@/app/api/notifications/services/notification`

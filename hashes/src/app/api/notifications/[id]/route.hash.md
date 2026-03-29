---
State_ID: BigInt(0x0fc98da)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Notifications.Detail

### [Signatures]
```ts
export async function PATCH(request: NextRequest, { params }): Promise<NextResponse>
```

### [Governance]
- **Granular_Read_Law:** Allows for the marking of an individual notification as read, ensuring precise state control for the user's focus.
- **Validation_Hard_Lock:** Standardizes URI parameter decoding via `UuidSchema` and `@/app/api/_lib/validation`.

### [Semantic Hash]
The targeted boundary for a single notification's lifecycle. It facilitates the state transition of a specific alert from unread to read, typically triggered by a user's direct interaction.

### [Linkage]
- **Dependencies:** `@/lib/supabase/server`, `@/app/api/notifications/services/notification`, `@/app/api/_lib/validation`

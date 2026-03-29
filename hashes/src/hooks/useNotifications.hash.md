---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Hooks.useNotifications

### [Hook]
| File | Role |
|------|------|
| `useNotifications.ts` | Data-layer logic for fetching notifications and subscribing to `postgres_changes` via Supabase Realtime channel. |

### [Governance]
- **Network_Law**: Synchronizes internal React state with remote Supabase signals.
- **Auth_Law**: Subscriptions strictly scoped to `recipient_id=eq.${user.id}`.
- **StrictMode_Law**: Uses `fetchedRef` to prevent duplicate API calls in development (React Strict Mode).

### [Linkage]
- **Upstream**: Supabase SDK, React Context (Auth).
- **Downstream**: `NotificationBell.tsx`.

---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Notifications.NotificationBell

### [Component]
| File | Role |
|------|------|
| `NotificationBell.tsx` | UI Shell for fetching, displaying, and managing real-time notifications via Supabase channels. |

### [Governance]
- **State_Law**: Extracted logic delegates to `useNotifications` hook.
- **Render_Law**: Implements compound component pattern (`NotificationBell.Toggle`, `NotificationBell.List`).

### [Linkage]
- **Upstream**: `useNotifications` hook.
- **Downstream**: Navigation bars.

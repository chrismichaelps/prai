---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Components.Auth

### [Components]
| Component | Description |
|-----------|-------------|
| `ProtectedRoute.tsx` | Auth guard for protected routes |

### [Governance]
- **Auth_Law:** Redirects unauthenticated users.
- **Loading_Law:** Shows loading state while auth initializes.

### [Semantic Hash]
Authentication-related UI components for route protection.

### [Linkage]
- **Upstream:** AuthContext
- **Downstream:** Protected pages (Chat, Profile)

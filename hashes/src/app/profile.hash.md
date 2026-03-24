---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Profile

### [Routes]
| Handler | Description |
|---------|-------------|
| `page.tsx` | Profile page |
| `_components/ProfileClient.tsx` | Profile client component |

### [Governance]
- **Auth_Law:** Protected route - requires authentication.
- **Update_Law:** Profile updates via `/api/profile` API.

### [Semantic Hash]
User profile management page with display name, bio, and language settings.

### [Linkage]
- **Upstream:** AuthContext, ProtectedRoute
- **Downstream:** `/api/profile` API

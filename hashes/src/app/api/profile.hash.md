---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Lib.Api.Profile

### [Routes]
| Route | Description |
|-------|-------------|
| `route.ts` | Profile update (PATCH) |
| `schemas/` | Profile schemas |

### [Governance]
- **Auth_Law:** Requires authenticated user.
- **Validation_Law:** Profile data validated via schemas.

### [Semantic Hash]
Profile API for updating user display name, bio, and language preferences.

### [Linkage]
- **Upstream:** AuthContext
- **Downstream:** Profile page

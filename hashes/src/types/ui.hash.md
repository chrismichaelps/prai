---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Types.UI

### [Types]
| File | Role |
|------|------|
| `ui.ts` | Central definition for foundational UI variant and tab states (`HeaderVariant`, `UIActiveTab`). |

### [Governance]
- **Type_Law**: Global UI types extracted to prevent circular dependencies between layout components.

### [Linkage]
- **Upstream**: None.
- **Downstream**: `Header.tsx`, `SideNav.tsx`.

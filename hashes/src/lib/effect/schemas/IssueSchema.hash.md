---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Effect.Issue

### [Schema]
| File | Role |
|------|------|
| `IssueSchema.ts` | Effect `Schema.Struct` definitions for Issue and IssueComment data entities, including create/update inputs. |

### [Governance]
- **Type_Law**: All domain objects must be strictly defined via `effect/Schema` with corresponding type extractions.

### [Linkage]
- **Upstream**: `effect` library.
- **Downstream**: Redux Slices, API Routes, Database Interfaces.

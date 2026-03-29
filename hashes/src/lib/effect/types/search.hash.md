---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Effect.Search

### [Types]
| File | Role |
|------|------|
| `search.ts` | Domain type definitions and deterministic enum sets (`MediaTypes`, `SearchCategories`, `Timeframes`, `Languages`) for the search module. |

### [Governance]
- **Enum_Law**: Uses `as const` object mapping over TypeScript enums to prevent runtime overhead and simplify payload serialization.
- **Effect_Law**: Contains a `Data.Class<PuertoRicoSearchOptions>` implementation.

### [Linkage]
- **Upstream**: `effect` library.
- **Downstream**: `SearchConstants`, Search UI, Server APIs.

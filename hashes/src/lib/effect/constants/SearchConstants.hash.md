---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Effect.Constants.Search

### [Constants]
| File | Role |
|------|------|
| `SearchConstants.ts` | Static configuration definitions for search queries, priority sources, categories, and instructions. |

### [Governance]
- **Type_Law**: All static arrays and string mapped objects must be asserted `as const` for strict type inference.
- **Domain_Law**: Provides deterministic prompts for OpenRouter/Fallback AI engines.

### [Linkage]
- **Upstream**: Types (`DiscoveryCategory`).
- **Downstream**: Search orchestrator and AI prompt injection.

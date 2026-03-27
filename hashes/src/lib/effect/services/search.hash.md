---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Effect.SearchService

### [Service]
| File | Role |
|------|------|
| `search.ts` | Search domain logic offering functions to build context blocks, resolve options to strict defaults, and map categories to queries. |

### [Governance]
- **Time_Law**: Injects properly localized `America/Puerto_Rico` timestamp headers to maintain LLM temporal awareness.
- **Config_Law**: Consumes `SearchConstants` to build definitive `PuertoRicoSearchOptions`.

### [Linkage]
- **Upstream**: `SearchConstants`, `types/search`.
- **Downstream**: `ChatApi`, Chat Streamer.

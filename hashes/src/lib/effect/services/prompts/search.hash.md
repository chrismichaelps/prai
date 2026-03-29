---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Effect.SearchPrompts

### [Prompt]
| File | Role |
|------|------|
| `search.ts` | System prompt configuration specifically tailored for Puerto Rico tourism searches, enforcing formatting and source priorities. |

### [Governance]
- **Prompt_Law**: Defines clear `<search_config>`, `<fuentes_oficiales>`, and `<reglas_búsqueda>` blocks to constrain the LLM context.

### [Linkage]
- **Upstream**: OpenRouter completions.
- **Downstream**: Search Orchestrator.

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.SearchFilter

### [Signatures]
```ts
export const FILTER_EXTRACTION_MAX_TOKENS = 100
export const FILTER_EXTRACTION_MIN_QUERY_LENGTH = 10
export const FILTER_CONTEXT_MESSAGES = 4
export const FILTER_EXTRACTION_SYSTEM_PROMPT: string
```

### [Governance]
- **Immutable_Law:** All constants are readonly primitives.
- **Min_Length_Law:** `FILTER_EXTRACTION_MIN_QUERY_LENGTH` (10 chars) gates whether filter extraction runs.
- **Token_Budget_Law:** LLM filter extraction capped at 100 tokens.
- **Context_Law:** Uses last 4 messages for context.

### [Semantic Hash]
Configuration constants for the search filter extraction system. Defines token budgets, minimum query length, context window size, and the system prompt for extracting time, location, and budget filters from user queries.

### [Linkage]
- **Used by:** `@root/src/lib/effect/services/filters/SearchFilter.ts`
- **Used by:** `@root/src/app/api/chat/route.ts` (Preflight and tool execution enrichment)

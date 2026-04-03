---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.QueryExpansion

### [Signatures]
```ts
export const QUERY_EXPANSION_CONTEXT_MESSAGES = 6
export const QUERY_EXPANSION_MIN_LENGTH = 20
export const SEMANTIC_REPHRASE_MAX_TOKENS = 80
export const KEYWORD_EXPANSION_MAX_TOKENS = 100
export const KEYWORD_EXPANSION_MAX_QUERIES = 3
export const SEMANTIC_REPHRASE_SYSTEM_PROMPT: string
export const KEYWORD_EXPANSION_SYSTEM_PROMPT: string
```

### [Governance]
- **Immutable_Law:** All constants are readonly primitives.
- **Min_Length_Law:** `QUERY_EXPANSION_MIN_LENGTH` gates whether expansion runs (20 chars minimum).
- **Token_Budget_Law:** Semantic rephrase capped at 80 tokens, keywords at 100 tokens.

### [Semantic Hash]
Configuration constants for the query expansion system. Defines token budgets, context window sizes, and system prompts for semantic rephrasing and keyword extraction specialized for Puerto Rico tourism.

### [Linkage]
- **Used by:** `@root/src/lib/effect/services/query/QueryExpansion.ts`
- **Used by:** `@root/src/app/api/chat/route.ts` (QUERY_EXPANSION_MIN_LENGTH gate)

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.ToolRelevance

### [Signatures]
```ts
export const RELEVANCE_MIN_SCORE = 1
export const RELEVANCE_MAX_TOKENS = 250
export const RELEVANCE_CONTEXT_PREVIEW = 300
export const RELEVANCE_SYSTEM_PROMPT: string
export const RELEVANCE_FILTERED_CONTENT: string
```

### [Governance]
- **Immutable_Law:** All constants are readonly primitives.
- **Scoring_Law:** `RELEVANCE_MIN_SCORE` (1) is the threshold below which results are filtered out.
- **Token_Budget_Law:** LLM scoring capped at 250 tokens.
- **Preview_Law:** Only first 300 chars of each tool result sent for relevance scoring.

### [Semantic Hash]
Configuration constants for the tool relevance scoring system. Defines minimum score threshold, token budgets, content preview size, and the system prompt for evaluating tool result relevance on a 0-3 scale.

### [Linkage]
- **Used by:** `@root/src/lib/effect/services/relevance/ToolRelevance.ts`
- **Used by:** `@root/src/app/api/chat/route.ts` (Post-execution filtering)

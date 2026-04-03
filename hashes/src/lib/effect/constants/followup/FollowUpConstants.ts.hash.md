---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.FollowUp

### [Signatures]
```ts
export const FOLLOWUP_MAX_SUGGESTIONS = 3
export const FOLLOWUP_MAX_TOKENS = 200
export const FOLLOWUP_MIN_MESSAGES = 2
export const FOLLOWUP_CONTEXT_MESSAGES = 8
export const FOLLOWUP_SYSTEM_PROMPT: string
```

### [Governance]
- **Immutable_Law:** All constants are readonly primitives.
- **Min_Messages_Law:** Requires at least 2 non-system messages before generating suggestions.
- **Token_Budget_Law:** LLM suggestion generation capped at 200 tokens.
- **Context_Law:** Uses last 8 messages for context, each truncated to 400 chars.
- **Style_Law:** System prompt enforces topic-style phrases — no questions, no imperatives, no "qué tal si", no "y si", max 8 words per suggestion.

### [Semantic Hash]
Configuration constants for the follow-up suggestions system. Defines max suggestions count, token budgets, minimum message threshold, context window size, and the system prompt that generates natural, topic-style action suggestions.

### [Linkage]
- **Used by:** `@root/src/lib/effect/services/followup/FollowUp.ts`
- **Used by:** `@root/src/app/api/chat/route.ts` (Post-flight follow-up generation)

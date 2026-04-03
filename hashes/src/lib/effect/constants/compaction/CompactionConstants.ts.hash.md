---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.Compaction

### [Signatures]
```ts
export const AUTO_COMPACT_THRESHOLD = 100_000
export const MICRO_COMPACT_MAX_RESULTS = 5
export const TOOL_RESULT_STUB = "[resultado borrado]"
export const COMPACT_MAX_OUTPUT_TOKENS = 8_000
export const MIN_MESSAGES_TO_COMPACT = 4
export const FULL_COMPACT_MIN_MESSAGES = 20
export const COMPACT_SYSTEM_INSTRUCTION: string
export const COMPACT_SUMMARY_PROMPT: string
```

### [Governance]
- **Immutable_Law:** All constants are readonly primitives.
- **Full_Compact_Law:** `FULL_COMPACT_MIN_MESSAGES` (20) gates full conversation compaction before the agentic loop begins.
- **Micro_Compact_Law:** `MIN_MESSAGES_TO_COMPACT` (4) gates micro-compaction during tool iterations.
- **Token_Budget_Law:** Full compaction capped at 8,000 output tokens.

### [Semantic Hash]
Configuration constants for the conversation compaction system. Defines thresholds for auto-compact, micro-compaction, and full compaction. Full compaction runs before the agentic loop when message count exceeds 20, producing a concise summary that preserves user preferences, factual info, decisions, and saved items.

### [Linkage]
- **Used by:** `@root/src/lib/effect/services/compaction/Compaction.ts`
- **Used by:** `@root/src/app/api/chat/route.ts` (runFullCompactionIfNeeded)

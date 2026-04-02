---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Context.Compaction

### [Signatures]
```ts
export class CompactionService extends Effect.Service<CompactionService>()("app/Compaction", {
  effect: Effect.gen(function* () { ... })
})

export const microCompact: (messages: any[]) => Effect.Effect<any[]>
export const autoCompact: (messages: any[], maxTokens?: number) => Effect.Effect<any[]>
```

### [Governance]
- **Dependency_Law:** Strictly depends on `TokenEstimationService` to measure window saturation.
- **Scrubbing_Law:** Prioritizes purging heavy `tool_calls` payloads from legacy messages to protect the context window.
- **Immutability_Law:** Returns a new array of compacted messages without mutating the original history.

### [Semantic Hash]
The micro-compaction engine. Dynamically trims the agentic message history by scrubbing bulky API tool results from older interactions, ensuring the LLM never exceeds context limits while retaining conversational flow.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/services/token/TokenEstimation.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`

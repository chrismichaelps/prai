---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Agent.Coordinator

### [Signatures]
```ts
export class CoordinatorService extends Effect.Service<CoordinatorService>()("app/Coordinator", {
  effect: Effect.gen(function* () { ... })
})

export const dispatchIntent: (input: string) => Effect.Effect<{ intent: IntentType, confidence: number }>
```

### [Governance]
- **Routing_Law:** Acts as the primary heuristic router for incoming user inputs before heavy LLM processing.
- **Lightweight_Law:** Computes intent syntactically or via fast matching rather than deep generations.
- **Fail_Safe_Law:** Defaults to conversational intent if confidence heuristics fall below threshold.

### [Semantic Hash]
The heuristic orchestration layer. Analyzes user queries to determine the required agentic intent (search, casual, analytical) to optimize which prompt templates and skills should be prioritized in the pre-flight loop.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/schemas/coordinator/CoordinatorSchema.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`

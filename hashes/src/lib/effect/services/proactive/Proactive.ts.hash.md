---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Agent.Proactive

### [Signatures]
```ts
export class ProactiveService extends Effect.Service<ProactiveService>()("app/Proactive", {
  effect: Effect.gen(function* () { ... })
})

export const analyzeProactiveNeeds: (context: any) => Effect.Effect<ProactiveAlert[]>
```

### [Governance]
- **Intervention_Law:** Monitors systemic context (time, weather, explicit triggers) to interject helpful alerts without explicit user prompts.
- **Non_Blocking_Law:** Proactive evaluation is strictly executed parallel or asynchronously to prevent chat loop latency.

### [Semantic Hash]
The autonomous alert engine. Scans environmental and user context to surface relevant, unprompted assistance (weather warnings, calendar conflicts) by generating synthetic system messages into the chat stream.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/schemas/proactive/ProactiveSchema.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`

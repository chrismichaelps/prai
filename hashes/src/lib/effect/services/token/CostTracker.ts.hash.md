---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Metrics.CostTracker

### [Signatures]
```ts
export class CostTrackerService extends Effect.Service<CostTrackerService>()("app/CostTracker", {
  effect: Effect.gen(function* () { ... })
})

export const recordCost: (model: string, promptTokens: number, completionTokens: number) => Effect.Effect<void>
```

### [Governance]
- **Ledger_Law:** Maintains an immutable append-only ledger of generation costs per model tier.
- **Aggregation_Law:** Handles dynamic token-to-cost multipliers defined in `CostConstants.ts`.
- **Side_Effect_Law:** Pure Effect recording; UI/database synchronization occurs independently via stream observers.

### [Semantic Hash]
The financial telemetry layer. Subscribes to OpenRouter stream completion events to extract `prompt_tokens` and `completion_tokens`, translating them into live operational costs for internal dashboards.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/constants/token/CostConstants.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`

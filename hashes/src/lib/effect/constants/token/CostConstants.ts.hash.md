---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.Metrics.Cost

### [Signatures]
```ts
export const MODEL_PRICING = { ... }
```

### [Governance]
- **Ledger_Law:** Maintains raw fractional USD multiplier prices for various LLMs to accurately convert tokens into actual cost.

### [Semantic Hash]
Financial rates and multipliers injected into the Cost Tracker engine.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/token/CostTracker.ts\`

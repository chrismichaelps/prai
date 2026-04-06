---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.Effect.Model.Registry

### [Signatures]
```ts
type ModelProfile = {
  readonly contextWindow: number
  readonly maxOutputTokens: number
  readonly inputCostPer1KTokens: number
  readonly outputCostPer1KTokens: number
  readonly supportsReasoning: boolean
  readonly supportsTools: boolean
}

export const ModelRegistry = {
  free: { contextWindow: 16_384, maxOutputTokens: 3_000, inputCostPer1KTokens: 0, outputCostPer1KTokens: 0, supportsReasoning: true, supportsTools: true },
  pro: { contextWindow: 131_072, maxOutputTokens: 8_000, inputCostPer1KTokens: 0.003, outputCostPer1KTokens: 0.015, supportsReasoning: true, supportsTools: true }
} as const

export type ModelTierKey = keyof typeof ModelRegistry
```

### [Governance]
- **Context_Law:** Free uses 16,384 (conservative floor for openrouter/free router)
- **Cost_Law:** Free is $0, Pro uses actual pricing from environment

### [Semantic Hash]
Single source of truth for model capabilities. All tier limits derive from these values.

### [Linkage]
- **Upstream:** Used by TierPolicy to derive safe context thresholds
- **Downstream:** TierPolicy, ContextGuard, UsageEngine
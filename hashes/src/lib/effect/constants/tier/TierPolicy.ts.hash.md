---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Constant.Effect.Tier.Policy

### [Signatures]
```ts
type TierFeatures = {
  readonly nativeWebSearch: boolean
  readonly jinaSearch: boolean
  readonly tools: boolean
  readonly reasoning: boolean
  readonly memoryPersistence: boolean
}

type TierPolicyConfig = {
  readonly dailyMessages: number
  readonly resetInterval: "daily" | "monthly"
  readonly safeContextRatio: number
  readonly dailyCostBudgetUSD: number
  readonly modelKey: ModelTierKey
  readonly features: TierFeatures
}

export const TierPolicies = {
  free: { dailyMessages: 20, resetInterval: "daily", safeContextRatio: 0.70, dailyCostBudgetUSD: 0, modelKey: "free", features: {...} },
  pro: { dailyMessages: 1_000, resetInterval: "monthly", safeContextRatio: 0.85, dailyCostBudgetUSD: 3.00, modelKey: "pro", features: {...} }
} as const

export type TierKey = keyof typeof TierPolicies
export const getSafeContextThreshold = (tier: TierKey): number
```

### [Governance]
- **Messages_Law:** Free: 20/day, Pro: 1,000/month
- **Cost_Law:** Free has no cost gate ($0), Pro has $3.00/day budget
- **Context_Law:** Free compacts at 8,468 tokens, Pro at 103,411 tokens

### [Semantic Hash]
Maps subscription tiers to limits and features. All per-user limits derived from here.

### [Change Notes — new tier policy system]
- Added TierPolicies constant with free/pro tiers
- Added getSafeContextThreshold derived from ModelRegistry contextWindow
- Added getTierContextThreshold to CompactionConstants
- UsageConstants now derives DEFAULT_USAGE_LIMIT from TierPolicies.free.dailyMessages
- SubscriptionConstants.messagesLimit derived from TierPolicies

### [Linkage]
- **Upstream:** ModelRegistry (contextWindow, maxOutputTokens)
- **Downstream:** UsageConstants, SubscriptionConstants, UsageEngine, CompactionConstants
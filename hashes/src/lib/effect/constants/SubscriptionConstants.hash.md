---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Constant.Subscription

### [Signatures]
```ts
export type SubscriptionTierType = "free" | "pro"
export type ResetIntervalType = "daily" | "monthly"
export type ReasoningEffortType = "low" | "medium" | "high"

export const SubscriptionTier = {
  Free: "free",
  Pro: "pro"
} as const

export const ResetInterval = {
  Daily: "daily",
  Monthly: "monthly"
} as const

export const ReasoningEffort = {
  Low: "low",
  Medium: "medium",
  High: "high"
} as const

export interface TierModelConfig {
  readonly model: string
  readonly reasoningEffort: ReasoningEffortType
}

export const TierModelConfig: Record<SubscriptionTierType, TierModelConfig> = {
  free: { model: "openrouter/free", reasoningEffort: "low" },
  pro: { model: "openrouter/premium", reasoningEffort: "medium" }
}

export const WebSearchPlugins: ReadonlyArray<{ name: string; plugin: string }> = [
  { name: "Google Search", plugin: "google-search" },
  { name: "Wikipedia", plugin: "wikipedia" }
]
```

### [Governance]
- **Tier_Law:** Free tier uses open-source models via `openrouter/free` with low reasoning effort. Pro tier uses premium models with medium reasoning.
- **Plugin_Law:** Web search plugins are only injected for Pro tier users in `/api/chat` route.

### [Semantic Hash]
Defines subscription tier constants, model configurations by tier, and web search plugin definitions.

### [Linkage]
- **Upstream:** Environment variables (`NEXT_PUBLIC_MODEL_NAME`, `NEXT_PUBLIC_MODEL_NAME_PREMIUM`)
- **Downstream:** `@root/src/app/api/chat/route.ts`, `@root/src/lib/effect/services/OpenRouter.ts`

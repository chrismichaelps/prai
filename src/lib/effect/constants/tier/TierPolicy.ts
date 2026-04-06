/** @Constant.Effect.Tier.Policy */

import type { ModelTierKey } from "../model/ModelRegistry"
import { ModelRegistry } from "../model/ModelRegistry"

/** @Type.TierFeatures */
export type TierFeatures = {
  readonly nativeWebSearch: boolean
  readonly jinaSearch: boolean
  readonly tools: boolean
  readonly reasoning: boolean
  readonly memoryPersistence: boolean
}

/** @Type.TierPolicyConfig */
export type TierPolicyConfig = {
  readonly dailyMessages: number
  readonly resetInterval: "daily" | "monthly"
  readonly safeContextRatio: number
  readonly dailyCostBudgetUSD: number
  readonly modelKey: ModelTierKey
  readonly features: TierFeatures
}

/** @Constant.TierPolicies */
export const TierPolicies = {
  free: {
    dailyMessages: 20,
    resetInterval: "daily",
    safeContextRatio: 0.70,
    dailyCostBudgetUSD: 0,
    modelKey: "free",
    features: {
      nativeWebSearch: false,
      jinaSearch: true,
      tools: true,
      reasoning: true,
      memoryPersistence: true,
    },
  },
  pro: {
    dailyMessages: 1_000,
    resetInterval: "monthly",
    safeContextRatio: 0.85,
    dailyCostBudgetUSD: 3.00,
    modelKey: "pro",
    features: {
      nativeWebSearch: true,
      jinaSearch: true,
      tools: true,
      reasoning: true,
      memoryPersistence: true,
    },
  },
} as const satisfies Record<string, TierPolicyConfig>

export type TierKey = keyof typeof TierPolicies

/** @Logic.TierPolicy.GetSafeContextThreshold */
export const getSafeContextThreshold = (tier: TierKey): number => {
  const policy = TierPolicies[tier]
  const model = ModelRegistry[policy.modelKey]
  return Math.floor(model.contextWindow * policy.safeContextRatio) - model.maxOutputTokens
}

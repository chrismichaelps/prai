/** @Constant.Effect.Subscription */

import { TierPolicies } from "./tier/TierPolicy"

export const SubscriptionTier = {
  Free: 'free',
  Pro: 'pro'
} as const

export type SubscriptionTierType = typeof SubscriptionTier[keyof typeof SubscriptionTier]

export const SubscriptionStatus = {
  Active: 'active',
  Inactive: 'inactive',
  PastDue: 'past_due',
  Cancelled: 'cancelled'
} as const

export type SubscriptionStatusType = typeof SubscriptionStatus[keyof typeof SubscriptionStatus]

export const ResetInterval = {
  Daily: 'daily',
  Monthly: 'monthly'
} as const

export type ResetIntervalType = typeof ResetInterval[keyof typeof ResetInterval]

export const ReasoningEffort = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Auto: 'auto'
} as const

export type ReasoningEffortType = typeof ReasoningEffort[keyof typeof ReasoningEffort]

export const SubscriptionDefaults = {
  tier: SubscriptionTier.Free,
  status: SubscriptionStatus.Inactive,
  resetInterval: ResetInterval.Daily,
  messagesLimit: TierPolicies.free.dailyMessages
} as const

export const TierModelConfig = {
  [SubscriptionTier.Free]: {
    reasoningEffort: ReasoningEffort.Low
  },
  [SubscriptionTier.Pro]: {
    reasoningEffort: ReasoningEffort.Medium
  }
} as const

export type ModelConfigReasoning = {
  reasoning_effort: ReasoningEffortType
}

/** @Constant.WebSearch.Tool */
export const WebSearchTool = { type: "openrouter:web_search" } as const

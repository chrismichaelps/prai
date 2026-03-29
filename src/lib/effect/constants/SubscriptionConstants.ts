/** @Constant.Effect.Subscription */

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
  messagesLimit: 100
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

export const WebSearchPlugins = [{
  id: "web",
  enabled: true,
  max_results: 3,
  include_domains: [
    "discoverpuertorico.com",
    "seepuertorico.com",
    "elnuevodia.com",
    "primerahora.com",
    "lonelyplanet.com/puerto-rico",
    "booking.com/puerto-rico",
    "youtube.com",
    "instagram.com",
    "facebook.com"
  ]
}] as const

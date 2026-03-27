/** @Constant.Effect.Usage */

export const DEFAULT_USAGE_LIMIT = 100

export const UsageDefaults = {
  messages_used: 0,
  messages_limit: DEFAULT_USAGE_LIMIT,
  messages_remaining: DEFAULT_USAGE_LIMIT,
  usage_percentage: 0,
  can_send: true,
  last_reset_date: new Date().toISOString()
} as const

export const UsageLimits = {
  MAX_INCREMENT_AMOUNT: 100,
  WARNING_THRESHOLD: 70,
  CRITICAL_THRESHOLD: 90,
} as const

---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Constant.Usage

### [Signatures]
```ts
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
```

### [Semantic Hash]
Defines default usage limits and thresholds for message usage tracking.

### [Linkage]
- **Upstream:** Database schema (profiles table)
- **Downstream:** `@root/src/hooks/useUsage.ts`, `@root/src/app/api/user/usage/route.ts`

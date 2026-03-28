---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Hook.UseUsage

### [Signatures]
```ts
export type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number] & {
  subscription_tier?: SubscriptionTierType
  reset_interval?: ResetIntervalType
  next_reset_date?: string
}

export function useUsage(): {
  readonly usage: UserUsage | null
  readonly loading: boolean
  readonly error: string | null
  readonly fetchUsage: () => Promise<void>
  readonly incrementUsage: (amount?: number) => Promise<UserUsage | null>
  readonly setUsage: (usage: UserUsage) => void
  readonly isAuthenticated: boolean
  readonly canSend: boolean
  readonly isAtLimit: boolean
  readonly isAtWarning: boolean
  readonly isAtCritical: boolean
}
```

### [Governance]
- **Fetch_Law:** Fetches usage on mount if authenticated.
- **Increment_Law:** Calls `/api/user/usage/increment` and updates local state.
- **Thresholds:** isAtWarning when messages_remaining <= 5; isAtCritical when messages_remaining <= 0.
- **StrictMode_Law:** Uses `fetchedRef` to prevent duplicate API calls in development (React Strict Mode).

### [Semantic Hash]
React hook for managing user usage state, fetching from API, and computing usage thresholds.

### [Linkage]
- **Upstream:** `@root/src/app/api/user/usage/route.ts`, `@root/src/app/api/user/usage/increment/route.ts`
- **Downstream:** `@root/src/components/usage/UsageDisplay.tsx`, `@root/src/components/chat/ChatContainer.tsx`

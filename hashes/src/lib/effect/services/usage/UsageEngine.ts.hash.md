---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.UsageEngine

### [Signatures]
```ts
type UsageDeniedReason = "global_quota" | "daily_messages" | "daily_cost" | "user_not_found"
type UsageCheckResult = { readonly allowed: true } | { readonly allowed: false; readonly reason: UsageDeniedReason }

export const canSend = (userId: string, tier: TierInput, supabase: SupabaseClient): Effect.Effect<UsageCheckResult, UsageEngineError>
export const usageErrorMessage = (reason: UsageDeniedReason): string
export const checkAndCompact = (messages: ReadonlyArray<CompactableMessage>, tier: TierInput): Effect.Effect<CompactableMessage[], never, CompactionService | TokenEstimationService>
```

### [Governance]
- **Check_Order_Law:** 1) global pool, 2) per-user messages, 3) per-user cost (Pro only)
- **Atomic_Law:** All checks happen in single RPC call `check_and_increment_openrouter_quota`
- **Compact_Law:** Runs before every OpenRouter API call (per-iteration)

### [Semantic Hash]
Single service that answers "can this user send?" with typed reasons. Also handles token-aware context compaction.

### [Change Notes — production usage system]
- Added canSend function calling check_and_increment_openrouter_quota RPC
- Added usageErrorMessage returning Spanish error strings
- Added checkAndCompact for tier-aware context guarding
- Added UsageEngineError to errors.ts

### [Linkage]
- **Upstream:** TierPolicy (dailyMessages, dailyCostBudgetUSD), ModelRegistry (contextWindow)
- **Downstream:** chat/route.ts (usage gate + context guard)
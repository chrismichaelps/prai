---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Usage.Client

### [Signatures]
```tsx
interface UsageClientProps {}

export function UsagePage(): JSX.Element
function UsageContent()
function UsageBar({ label, value, max, color })
function StatCard({ label, value, color })
function UsageWarning()
function JinaUsageCard({ data, loading, locale, t })
function DailyCostCard({ usage, locale, t })
```

### [Implementation Notes]
- Displays usage stats: messages used/limit, percentage
- Shows tier badge (FREE/PRO)
- Shows last_reset_date and next_reset_date
- Jina web search card with progress bar
- Daily cost card for Pro users only (hidden when daily_cost_budget_usd <= 0)
- UsageWarning shows when approaching or at limit
- Animated progress bars with color thresholds (blue/yellow/red)

### [Semantic Hash]
Client component for usage page displaying detailed consumption information including messages, Jina searches, and daily cost for Pro users.

### [Change Notes — daily cost tracking]
- Added DailyCostCard component showing $X.XX / $3.00 budget for Pro users
- Added i18n keys: daily_cost_title, daily_cost_description, daily_cost_used, daily_cost_budget, daily_cost_reset
- Imported UserUsage type from useUsage hook

### [Linkage]
- **Upstream:** `@root/src/hooks/useUsage.ts`, `@root/src/components/usage/TierBadge.tsx`, `@root/src/lib/effect/i18n/index.ts`
- **Downstream:** `@root/src/app/usage/page.tsx`

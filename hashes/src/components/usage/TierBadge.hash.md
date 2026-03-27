---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Usage.TierBadge

### [Signatures]
```tsx
interface TierBadgeProps {
  tier: SubscriptionTierType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function TierBadge(props: TierBadgeProps): JSX.Element
```

### [Governance]
- **Display_Law:** FREE shows blue, PRO shows gradient (orange/purple).
- **Size_Law:** Supports sm (badge), md (inline), lg (prominent) sizes.

### [Semantic Hash]
Badge component displaying user's subscription tier (FREE/PRO).

### [Linkage]
- **Upstream:** `@root/src/lib/effect/constants/SubscriptionConstants.ts`
- **Downstream:** `@root/src/components/chat/SidebarProfile.tsx`, `@root/src/app/usage/UsageClient.tsx`

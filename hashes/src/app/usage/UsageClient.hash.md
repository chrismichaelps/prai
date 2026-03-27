---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Usage.Client

### [Signatures]
```tsx
interface UsageClientProps {
  user: User
}

export function UsageClient(props: UsageClientProps): JSX.Element
```

### [Implementation Notes]
- Displays usage stats: messages used/limit, percentage
- Shows tier badge (FREE/PRO)
- Shows last reset and next reset dates with times
- Shows remaining/limit stats
- Includes link to report quota issues

### [Semantic Hash]
Client component for usage page displaying detailed usage information.

### [Linkage]
- **Upstream:** `@root/src/hooks/useUsage.ts`, `@root/src/components/usage/TierBadge.tsx`
- **Downstream:** `@root/src/app/usage/page.tsx`

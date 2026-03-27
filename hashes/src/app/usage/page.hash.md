---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Page.Usage

### [Signatures]
```tsx
export default function UsagePage(): JSX.Element
```

### [Governance]
- **Auth_Law:** Redirects to sign-in if not authenticated.
- **I18n_Law:** All text via useI18n translations.

### [Semantic Hash]
Usage statistics page displaying message usage, limits, and reset dates.

### [Linkage]
- **Upstream:** `@root/src/hooks/useUsage.ts`, `@root/src/components/usage/UsageDisplay.tsx`, `@root/src/components/usage/TierBadge.tsx`
- **Downstream:** `/usage` route

---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Usage.Display

### [Signatures]
```tsx
interface UsageDisplayProps {
  className?: string
  showDetailed?: boolean
  compact?: boolean
}

export function UsageDisplay(props: UsageDisplayProps): JSX.Element
export function UsageWarning(props: { className?: string }): JSX.Element | null
```

### [Governance]
- **I18n_Law:** Uses `t()` from useI18n for all text (no hardcoded strings).
- **Color_Law:** Progress bar color changes at 70% (yellow) and 90% (red).
- **Locale_Law:** Dates formatted with user's locale via `toLocaleString`.

### [Implementation Notes]
- Displays progress bar with usage percentage
- Shows remaining messages count
- Displays warning when approaching limit
- UsageWarning component shows banner when at limit or critical

### [Semantic Hash]
Reusable usage display components with progress bar and warning states.

### [Linkage]
- **Upstream:** `@root/src/hooks/useUsage.ts`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`, `@root/src/app/usage/UsageClient.tsx`

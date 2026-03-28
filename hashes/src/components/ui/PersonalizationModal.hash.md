---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Personalization.Modal

### [Signatures]
```tsx
interface PersonalizationModalProps {
  isOpen?: boolean
  onClose?: () => void
}

export function PersonalizationModal(props: PersonalizationModalProps): JSX.Element | null
```

### [Implementation Notes]
- Sidebar navigation with tabs: General, Notifications, Personalization, Apps, Data, Security, Account
- Style selection: Default, Professional, Friendly, Candid, Quirky, Efficient, Cynical
- Characteristic sliders: Warmth, Enthusiasm, Headers & Lists, Emoji
- Custom instructions textarea
- Nickname input
- About me section

### [Semantic Hash]
Modal UI for user personalization settings with style/tone configuration.

### [Linkage]
- **Upstream:** `@root/src/hooks/usePersonalization.ts`, `@root/src/lib/effect/i18n/index.ts`
- **Downstream:** `@root/src/app/personalization/page.tsx`
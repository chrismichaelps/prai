---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Layout.Header

### [Signatures]
```ts
export function Header({ className, transparent, variant }: HeaderProps): JSX.Element

interface HeaderProps {
  className?: string
  transparent?: boolean
  variant?: 'default' | 'chat'
}
```

**Variants:**
- `default` — home/about pages. Shows nav links + open chat CTA.
- `chat` — chat page. Shows model info button only.

### [Governance]
- **Variant_Law:** `variant` prop controls rendering path. Both variants share the same component.
- **Constant_Law:** `GITHUB_REPO_URL` imported from `@root/src/lib/constants.ts`.

### [Semantic Hash]
Top navigation header. Renders brand logo, navigation links, and action buttons. Behavior changes by variant: home vs. chat.

### [Linkage]
- **Upstream:** `@root/src/lib/constants.ts`, `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/store/slices/uiSlice.ts`
- **Downstream:** All page layouts

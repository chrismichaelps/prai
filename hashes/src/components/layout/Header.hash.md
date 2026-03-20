---
State_ID: BigInt(0x2)
Git_SHA: LATEST
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
- **BuildInfo_Law:** Reads `buildHash` from `useBuildInfo()` hook (provided by `BuildInfoProvider`).

### [Semantic Hash]
Top navigation header. Renders brand logo, navigation links, and action buttons. Build hash sourced from `BuildInfoProvider` context.

### [Linkage]
- **Upstream:** `@root/src/lib/constants.ts`, `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/store/slices/uiSlice.ts`, `@root/src/lib/effect/hooks/useBuildInfo.tsx`
- **Downstream:** All page layouts

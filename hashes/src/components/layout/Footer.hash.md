---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Layout.Footer

### [Signatures]
```ts
export function Footer({ className }): JSX.Element
```

### [Governance]
- **Constant_Law:** `GITHUB_REPO_URL` imported from `@root/src/lib/constants.ts`.
- **I18n_Law:** All labels via `useI18n()` t() — no hardcoded strings.
- **BuildInfo_Law:** Reads `buildHash` from `useBuildInfo()`. Displays next to copyright if resolved.

### [Semantic Hash]
Site footer with navigation links, GitHub link, locale switcher, and legal documentation links. Fully internationalized. Build hash displayed next to copyright.

### [Linkage]
- **Upstream:** `@root/src/lib/constants.ts`, `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/lib/effect/hooks/useBuildInfo.tsx`
- **Downstream:** Home and About page layouts

---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Layout.Footer

### [Signatures]
```ts
export function Footer(): JSX.Element
```

### [Governance]
- **Constant_Law:** `GITHUB_REPO_URL` imported from `@root/src/lib/constants.ts`.
- **I18n_Law:** All labels via `useI18n()` t() — no hardcoded strings.

### [Semantic Hash]
Site footer with navigation links, GitHub link, and legal documentation links. Fully internationalized.

### [Linkage]
- **Upstream:** `@root/src/lib/constants.ts`, `@root/src/lib/effect/I18nProvider.tsx`
- **Downstream:** Home and About page layouts

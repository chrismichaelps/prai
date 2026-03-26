---
State_ID: BigInt(0x0fc98ea)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Releases.Client

### [Signatures]
```ts
export function ReleasesPage({ releases }: { releases: Release[] }): JSX.Element
```

### [Governance]
- **Timeline_Aesthetic_Lock:** Enforces a persistent, high-fidelity grid layout (`#090909` background, `white/[0.03]` borders) for the version timeline to match the platform's dark-mode identity.
- **I18n_Boundary:** Strictly resolves all interactive labels (show more/less, breadcrumbs) through the `useI18n` hook.
- **Motion_Timeline_Reveal:** Mandates `whileInView` opacity and y-axis transitions via `framer-motion` for each `TimelineCard`.

### [Semantic Hash]
The primary UI boundary for the community's progress history. It provides an interactive, accessible timeline of platform updates, optimized for readability and visual engagement.

### [Linkage]
- **Dependencies:** `@/lib/effect/I18nProvider`, `framer-motion`, `lucide-react`

---
State_ID: BigInt(0x0fc98cd)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Issues.IssuesClient

### [Signatures]
```ts
export function IssuesPage(): JSX.Element
const IssueList = Object.assign(IssueListRoot, { Filters, Items, Card, NewForm })
```

### [Governance]
- **Matrix_UI_Lock:** Enforces a persistent background glow and layout structure using `framer-motion` and `lucide-react` for brand consistency.
- **State_Silo_Pattern:** Orchestrates all issue operations (fetch, creation, upvoting) exclusively through `issuesSlice` to ensure decoupled state management.
- **I18n_Boundary:** Strictly mandates the use of `useI18n()` for all human-readable strings to support multi-language scalability.

### [Semantic Hash]
The main controller for the Issue Tracker interface. It provides a cohesive UI for reporting, filtering, and interacting with community feedback while maintaining the application's premium aesthetic.

### [Linkage]
- **Dependencies:** `framer-motion`, `lucide-react`, `@/store/slices/issuesSlice`, `@/lib/effect/I18nProvider`, `@/contexts/AuthContext`, `@/components/layout/Header`, `@/components/layout/Footer`

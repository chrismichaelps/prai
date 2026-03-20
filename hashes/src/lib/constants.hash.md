---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Constants

### [Signatures]
```ts
export const GITHUB_REPO_URL: string
```

### [Governance]
- **Constant_Law:** Centralized magic string avoidance. All external URLs go here.

### [Semantic Hash]
Application-level constants. Single source of truth for the GitHub repository URL and any future external link references.

### [Linkage]
- **Upstream:** None
- **Downstream:** `@root/src/components/layout/Header.tsx`, `@root/src/components/layout/Footer.tsx`, `@root/src/app/about/page.tsx`

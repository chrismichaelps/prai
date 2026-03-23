---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.CookieBanner

### [Signatures]
```ts
export function CookieBanner(): JSX.Element
```

### [Governance]
- **ClientOnly_Law:** Uses `'use client'` directive.
- **LocalStorage_Law:** Persists consent in localStorage.

### [Semantic Hash]
Cookie consent banner with accept/reject options.

### [Linkage]
- **Dependencies:** `@root/src/lib/effect/I18nProvider.tsx`

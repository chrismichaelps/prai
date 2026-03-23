---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.NotFound

### [Signatures]
```ts
export default function NotFound(): JSX.Element
```

### [Governance]
- **ClientOnly_Law:** Enforces `'use client'` to support localized string translations (`useI18n`) and Framer Motion entrance animations during fatal route misses.
- **Brand_Alignment:** Matches the IndexPage aesthetic by rendering a full-viewport `hero404` background with a primary/accent gradient overlay.
- **Navigation_Fallback:** Provides distinct calls-to-action (`Home` and `Chat`) to aggressively recover disjointed user sessions.

### [Semantic Hash]
Global 404 Error boundary handler for unmatched Next.js routes. Presents a highly stylized, animated "Page Not Found" experience aligned with PR\\AI branding.

### [Linkage]
- **Dependencies:** `next/link`, `next/image`, `framer-motion`, `lucide-react`, `@/components/layout/Header`, `@/components/layout/Footer`, `@/lib/effect/I18nProvider`

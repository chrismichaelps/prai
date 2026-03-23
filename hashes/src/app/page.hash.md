---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.IndexPage

### [Signatures]
```ts
export default function IndexPage(): JSX.Element
```

### [Governance]
- **ClientOnly_Law:** Enforces `'use client'` to orchestrate `framer-motion` entrance animations and Next.js `useRouter` programmatic navigation.
- **Auth_Conditional_Rendering:** Mounts the primary Call-To-Action (CTA) conditionally based on `<AnimatePresence>` evaluating the `isAuthenticated` hook state.
- **Brand_Aesthetic_Lock:** Binds the `hero-mountains.jpg` background with a mathematically structured tailwind gradient overlay (`from-primary/80 via-primary/60 to-accent/70`).

### [Semantic Hash]
The main PR\\AI Landing Page. It visually establishes the brand identity and routes authenticated users into the AI Chat interface while preserving dynamic, localized text boundaries (`useI18n`).

### [Linkage]
- **Dependencies:** `next/navigation`, `framer-motion`, `@/components/layout/Header`, `@/components/layout/Footer`, `@/lib/effect/I18nProvider`, `@/contexts/AuthContext`

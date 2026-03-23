---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Profile

### [Signatures]
```ts
export const metadata: Metadata
export default function ProfilePage(): JSX.Element
```

### [Governance]
- **SEO_Law:** Contains static profile metadata with robots set to `index: false, follow: false` (Private dashboard).
- **Encapsulation:** Acts purely as a Server Component wrapper forwarding to `ProfileClient`.

### [Semantic Hash]
Server-side container for the user profile route. Provides isolation and SEO boundaries for the authenticated profile dashboard.

### [Linkage]
- **Dependencies:** `@root/src/app/profile/_components/ProfileClient.tsx`, `next` (Metadata)

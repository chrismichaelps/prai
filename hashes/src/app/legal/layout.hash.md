---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.Legal.Layout

### [Signatures]
```ts
export default function LegalLayout({ children }: { children: React.ReactNode }): JSX.Element
```

### [Governance]
- **Static_Route_Law:** Pure server-side layout. Provides a consistent typographical container (`prose`, max-width constraints) for all descending legal documents.
- **Seo_Inheritance:** Inherits global metadata from `RootLayout` but scopes UI changes (like minimal headers) out of the main App flow.

### [Semantic Hash]
Global wrapper for the `/legal/*` routing segment, ensuring consistent spacing and readability for dense text pages like Privacy and Terms.

### [Linkage]
- **Dependencies:** `react`

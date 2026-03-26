---
State_ID: BigInt(0x0fc98ce)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Issues

### [Signatures]
```ts
export const metadata: Metadata
export default function IssuesRoute(): JSX.Element
```

### [Governance]
- **Entry_Point_Law:** Serves as the primary entry point for the `/issues` route, aggregating SEO metadata and rendering the `IssuesPage` client component.

### [Semantic Hash]
The route boundary for the global Issue Tracker. It defines the page-level SEO and ensures the client-side interaction layer is properly mounted.

### [Linkage]
- **Dependencies:** `@/app/issues/IssuesClient`

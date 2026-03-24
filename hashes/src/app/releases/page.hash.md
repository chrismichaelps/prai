---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Releases

### [Signatures]
```tsx
export default function ReleasesPageRoute(): JSX.Element
export const metadata: Metadata
```

### [Metadata]
```ts
{
  title: 'Release Notes | PR\\AI',
  description: 'The latest updates, features, and fixes for the PR\\AI platform.'
}
```

### [Governance]
- **Static_Law:** Page is statically prerendered
- **Server_Law:** Data fetched server-side via `getChangelogReleasesSync()`

### [Semantic Hash]
Server component that fetches changelog data and renders the releases page.

### [Linkage]
- **Upstream:** `getChangelogReleasesSync` from `@/lib/effect/services/Changelog`
- **Downstream:** `ReleasesPage` from `./ReleasesClient`

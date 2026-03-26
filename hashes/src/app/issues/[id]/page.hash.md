---
State_ID: BigInt(0x0fc98d0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Issues.Detail

### [Signatures]
```ts
export const metadata: Metadata
export default async function IssueDetailRoute({ params }): JSX.Element
```

### [Governance]
- **Dynamic_Route_Law:** Orchestrates the asynchronous extraction of `id` parameters to mount the `IssueDetailClient` within the specific issue boundary.

### [Semantic Hash]
The route boundary for detailed issue views. It manages page-level identity and ensures the correct entity ID is propagated to the interaction layer.

### [Linkage]
- **Dependencies:** `@/app/issues/[id]/IssueDetailClient`

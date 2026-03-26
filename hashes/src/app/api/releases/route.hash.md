---
State_ID: BigInt(0x0fc98df)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Api.Releases

### [Signatures]
```ts
export async function GET(): Promise<NextResponse>
```

### [Governance]
- **Changelog_Service_Bridge:** Exposes versioning and update metadata by bridging the `Changelog` service to a public HTTP interface with strict 1-hour cache headers.

### [Semantic Hash]
The public metadata boundary for application updates. It serves the most recent release notes and version history, enabling chronos-aware client features.

### [Linkage]
- **Dependencies:** `@/lib/effect/services/Changelog`, `@/app/api/_lib/constants/status-codes`

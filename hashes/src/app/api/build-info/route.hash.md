---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.BuildInfo

### [Signatures]
```ts
export async function GET(request: NextRequest): Promise<NextResponse>
```

### [Governance]
- **ForceStatic_Law:** Route is `force-static`. Response is cached by Next.js at the edge.
- **ServerOnly_Law:** Uses `fs/promises` — server-side only.
- **Fallback_Law:** Returns `{ buildHash: 'dev' }` if `public/app-version.json` cannot be read (e.g., during `next dev`).

### [Semantic Hash]
API route that reads the app version hash from `public/app-version.json` (written by `scripts/generate-app-version.mjs` post-build). Returns first 12 chars of the SHA-256 hash.

### [Linkage]
- **Upstream:** `public/app-version.json` (written by post-build script)
- **Downstream:** `@root/src/lib/effect/hooks/useBuildInfo.ts`, `@root/src/components/layout/Header.tsx`

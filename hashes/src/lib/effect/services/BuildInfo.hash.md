---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Effect.BuildInfo

### [Signatures]
```ts
export interface BuildInfo {
  readonly buildHash: string
}

export class BuildInfoService extends Effect.Service<BuildInfoService>()("BuildInfo", {
  effect: Effect.gen(function* () {
    const buildHash: string = yield* fetchBuildInfo
    return {
      getBuildHash: () => Effect.succeed(buildHash),
    } as const
  })
}) {}
```

### [Governance]
- **EffectMode_Law:** Uses `effect` constructor mode. Fetches `/api/build-info` via native `fetch` (browser).
- **Caching_Law:** Service is memoized per Layer. `getBuildHash()` returns the cached value synchronously.
- **Fallback_Law:** API route returns `'dev'` during `next dev` (no `.next/app-version.json`).
- **Runtime_Law:** Part of `MainLayer`. Consumed via `runtime.runPromise(BuildInfoService)`.

### [Semantic Hash]
Effect Service that fetches and caches the app build hash from `/api/build-info`. The hash represents the SHA-256 of the `.next/` build output, generated post-build by `scripts/generate-app-version.mjs`.

### [Linkage]
- **Upstream:** `@root/src/app/api/build-info/route.ts` (fetches from `/api/build-info`)
- **Downstream:** `@root/src/components/layout/Header.tsx`, `@root/src/lib/effect/runtime.ts`

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.MemoryApi

### [Signatures]
```ts
export class MemoryApiError extends Error {
  readonly _tag = "MemoryApiError"
  readonly status: number | undefined
  constructor(message: string, status?: number)
}

export interface SaveMemoryPayload {
  key: string
  value: string
  category: MemoryCategory
}

export interface MemoryApi {
  readonly save: (payload: SaveMemoryPayload) => Effect.Effect<void, MemoryApiError>
  readonly forget: (key: string) => Effect.Effect<void, MemoryApiError>
}

export const MemoryApi: Context.Tag<MemoryApi, MemoryApi>
export const MemoryApiLayer: Layer.Layer<MemoryApi>
```

### [Governance]
- **Tag_Law:** `MemoryApi` is a `Context.GenericTag` (not `Effect.Service`) — provide via `Layer.succeed(MemoryApi, impl)` in tests.
- **Constructor_Law:** `MemoryApiError` uses explicit constructor body (not shorthand) due to `erasableSyntaxOnly` TS flag.
- **Transport_Law:** Both `save` and `forget` call `/api/memory` — POST for upsert, DELETE for removal.
- **Error_Law:** HTTP failures yield `MemoryApiError` with `status` from response. Callers use `Effect.catchAll`.

### [Implementation Notes]
- `baseUrl` resolved from `process.env.NEXT_PUBLIC_SITE_URL || AppConstants.DEV_URL`
- `save` → POST `/api/memory` with `{ key, value, category }`
- `forget` → DELETE `/api/memory` with `{ key }`

### [Semantic Hash]
Effect service for reading/writing user `session_memory` via the `/api/memory` internal API. Uses `Context.GenericTag` pattern for testability.

### [Linkage]
- **Upstream:** `@/lib/constants/app-constants`, `@/lib/effect/schemas/memory/SessionMemorySchema`
- **Downstream:** `@/lib/commands/executor`, `@/lib/effect/runtime` (MemoryApiLayer)

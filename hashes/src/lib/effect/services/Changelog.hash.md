---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Effect.Changelog

### [Signatures]
```ts
export interface Release {
  readonly date: string
  readonly content: string
}

export class ChangelogService extends Effect.Service<ChangelogService>()("Changelog", {
  effect: Effect.gen(function* () {
    const getReleases: Effect.Effect<Chunk.Chunk<Release>, ChangelogError>
    return { getReleases }
  })
}) {}
```

### [Governance]
- **Service_Law:** Uses `Effect.Service` pattern with dependency injection.
- **Parser_Law:** `parseReleases` is a pure function with no side effects.
- **Error_Law:** Uses `ChangelogError` for typed error handling.
- **File_Law:** Uses dynamic `import("node:fs/promises")` for Node.js file system access.

### [Dependencies]
- None (self-contained service with internal file system access)

### [Semantic Hash]
Effect-TS service for reading and parsing the CHANGELOG.md file into structured `Release` blocks.

### [Linkage]
- **Upstream:** `ChangelogError` from `@/lib/effect/errors`
- **Downstream:** Page components that display changelog information

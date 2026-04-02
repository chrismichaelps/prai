---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.State.Memory

### [Signatures]
```ts
export const SessionMemorySchema = Schema.Struct({ ... })
export type MemoryExtraction = Schema.Schema.Type<typeof SessionMemorySchema>
```

### [Governance]
- **Type_Law:** Defines precise records (allergies, locations, tones) to guarantee valid structural extraction from past sessions.

### [Semantic Hash]
The structural blueprint for the Session Context facts, defining what properties the AI is permitted to extract and serialize for long-term state.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/memory/SessionMemory.ts\`

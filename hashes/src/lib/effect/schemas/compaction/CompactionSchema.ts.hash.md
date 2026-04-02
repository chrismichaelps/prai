---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Context.Compaction

### [Signatures]
```ts
export const CompactionSchema = Schema.Struct({ ... })
export type CompactionPayload = Schema.Schema.Type<typeof CompactionSchema>
```

### [Governance]
- **Type_Safety_Law:** All compaction structures must be tightly bound to Effect.Schema to guarantee payload shapes across the Context bounds.

### [Semantic Hash]
Data models representing the boundaries and configuration limits of the micro-compaction and auto-compaction algorithms.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/compaction/Compaction.ts\`

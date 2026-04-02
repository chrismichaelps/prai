---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Agent.Coordinator

### [Signatures]
```ts
export const CoordinatorSchema = Schema.Struct({ ... })
export type IntentType = Schema.Schema.Type<typeof IntentTypeSchema>
```

### [Governance]
- **Intent_Law:** Defines a strictly enumerated subset of heuristic intents (\`search\`, \`casual\`, \`analytical\`) strictly enforcing predictable routing.

### [Semantic Hash]
The architectural data structures mapping user inputs to predefined analytical intents required by the Coordinator heuristic router.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/coordinator/Coordinator.ts\`

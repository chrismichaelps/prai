---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.Prompt.OutputEfficiency

### [Signatures]
```ts
export const applyOutputEfficiency: (prompt: string) => string
```

### [Governance]
- **Terse_Law:** Injects structural constraints forcing the LLM to skip conversational fluff and jump straight to the technical core.
- **Composition_Law:** Must be applied immutably as part of the `PromptBuilder` pipeline.

### [Semantic Hash]
The efficiency-focused system instructions prepended to the AI to minimize token output and maximize analytical precision.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/PromptBuilder.ts\`

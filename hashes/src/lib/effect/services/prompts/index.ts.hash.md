---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.Prompt.Index

### [Signatures]
```ts
export * from './cyber_risk'
export * from './output_efficiency'
```

### [Governance]
- **Export_Law:** Opaque API definition bundling prompt partials into a single export boundary.

### [Semantic Hash]
The central registry for all prompt injection templates required by the `PromptBuilder.ts` pipeline.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/services/prompts/cyber_risk.ts\`, \`@root/src/lib/effect/services/prompts/output_efficiency.ts\`
- **Downstream:** \`@root/src/lib/effect/services/PromptBuilder.ts\`

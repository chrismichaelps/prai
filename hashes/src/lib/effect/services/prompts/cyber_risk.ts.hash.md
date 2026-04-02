---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.Prompt.CyberRisk

### [Signatures]
```ts
export const applyCyberRiskRules: (prompt: string) => string
```

### [Governance]
- **Safety_Law:** Injects hard-coded safety constraints preventing the LLM from executing malicious scripts or outputting vulnerable code patterns.
- **Composition_Law:** Must be applied immutably as part of the `PromptBuilder` pipeline.

### [Semantic Hash]
The security-focused system instructions prepended to the AI to guarantee safe, enterprise-grade output.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/PromptBuilder.ts\`

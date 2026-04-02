---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Agent.Skills

### [Signatures]
```ts
export const SkillSchema = Schema.Struct({ ... })
export type SkillDefinition = Schema.Schema.Type<typeof SkillSchema>
```

### [Governance]
- **Injection_Law:** Defines skill payload shapes ensuring standard string templates for the `system` role injection.

### [Semantic Hash]
The payload signature governing Sub-Persona instructions mapped internally by the Skill orchestrator.

### [Linkage]
- **Upstream:** None
- **Downstream:** \`@root/src/lib/effect/services/skills/Skills.ts\`

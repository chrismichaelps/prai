---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Agent.Skills

### [Signatures]
```ts
export class SkillsService extends Effect.Service<SkillsService>()("app/Skills", {
  effect: Effect.gen(function* () { ... })
})

export const injectSkillPrompts: (prompt: string, intent: IntentType) => Effect.Effect<string>
```

### [Governance]
- **Specialization_Law:** Dynamically alters the agent's system prompt by injecting targeted instruction sets (Skills) corresponding to the detected user intent.
- **Composition_Law:** Supports multi-skill aggregation if multiple constraints align (e.g., Coding + Search).

### [Semantic Hash]
The skill delegation orchestrator. Depending on the `CoordinatorService` routing, it injects specialized sub-persona system instructions (cyber-security, code review, local tourism) into the main prompt loop.

### [Linkage]
- **Upstream:** \`@root/src/lib/effect/schemas/skills/SkillSchema.ts\`
- **Downstream:** \`@root/src/app/api/chat/route.ts\`

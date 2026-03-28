---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Logic.Effect.Prompts.Personalization

### [Signatures]
```ts
export const buildPersonalizationPrompt: (prefs: Personalization) => string
```

### [Implementation Notes]
- Converts personalization settings to LLM instruction text
- Maps baseStyle to tone persona (professional, friendly, candid, quirky, efficient, cynical)
- Converts characteristic levels (more/default/less) to modifier instructions
- Includes custom instructions as explicit behavioral rules
- Includes nickname for user address

### [Semantic Hash]
Generates personalization section for system prompt based on user preferences.

### [Linkage]
- **Upstream:** PersonalizationSchema
- **Downstream:** `@root/src/lib/effect/services/PromptBuilder.ts`
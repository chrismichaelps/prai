---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Services.Prompts

### [Signatures]
```ts
export {
  role,
  guardrails,
  rules,
  family_safety,
  search_config,
  thought_process,
  accuracy_and_media,
  action_handling,
  output_format,
  titleSystemPrompt,
  buildPersonalizationPrompt
}
```

### [Semantic Hash]
Prompt building blocks for AI chat including role, safety, rules, media accuracy, output format, and personalization templates.

### [Linkage]
- **Dependencies:** Chat service, Config service
- **Downstream:** `@root/src/lib/effect/services/PromptBuilder.ts`

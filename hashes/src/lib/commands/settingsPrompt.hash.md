---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.SettingsPrompt

### [Signatures]
```ts
export const buildSettingsPrompt = (settings: ChatSettings): string | null
```

### [Governance]
- **Null_Law:** Returns `null` if no settings are active — prevents injecting empty system blocks.
- **Format_Law:** Output is a `[Active Configuration]\n- key: value\n...` block terminated with `Adapt your responses to match these settings.`
- **Placement_Law:** Caller (`chat.ts`) must use `splice(1, 0, ...)` to inject after main system prompt, not `push()`.

### [Implementation Notes]
- Label maps (`PERSONALITY_LABELS`, `MODE_LABELS`, `REGION_LABELS`, `BUDGET_LABELS`) translate Spanish enum values to English for the LLM
- `tripDate` is passed as-is (free-form string)

### [Semantic Hash]
Builds the `[Active Configuration]` system message block from current `ChatSettings`. Returns `null` when no active settings exist.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (ChatSettings type)
- **Downstream:** `@/lib/effect/chat` (generateResponse splice injection)

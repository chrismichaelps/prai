---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Personality

### [Signatures]
```ts
export const personalityCommand: ChatCommand
// name: "/personality", aliases: ["/persona", "/character", "/personalidad"]
// execute(args) → Effect<{ type: "setting", key: "personality", value: Personality, toast: string }, CommandError>
```

### [Governance]
- **Default_Law:** Empty args default to `"guía"` without error.
- **Alias_Law:** English aliases (`"guide"`, `"historian"`, `"adventurer"`) normalized to Spanish values before schema decode.
- **Values:** `"guía"` | `"chef"` | `"historiador"` | `"aventurero"` | `"local"`

### [Semantic Hash]
Slash command for setting the assistant's personality archetype. Supports English alias normalization.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (PersonalitySchema, COMMAND_DEFS.personality)
- **Downstream:** `@/lib/commands/registry`

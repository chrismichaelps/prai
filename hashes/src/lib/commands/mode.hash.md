---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Mode

### [Signatures]
```ts
export const modeCommand: ChatCommand
// name: "/mode", aliases: ["/modo"]
// execute(args) → Effect<{ type: "setting", key: "mode", value: Mode, toast: string }, CommandError>
```

### [Governance]
- **Alias_Law:** English aliases (`"expert"`, `"tourist"`, `"family"`) normalized to Spanish before schema decode.
- **Values:** `"experto"` | `"casual"` | `"turista"` | `"familia"`

### [Semantic Hash]
Slash command for adjusting the assistant's response tone and depth.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (ModeSchema, COMMAND_DEFS.mode)
- **Downstream:** `@/lib/commands/registry`

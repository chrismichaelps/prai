---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.System

### [Signatures]
```ts
export const systemCommand: ChatCommand
// name: "/system", aliases: ["/sistema"]
// execute(args) → Effect<{ type: "system_inject", content: string }, CommandError>
```

### [Governance]
- **Empty_Guard_Law:** Empty args yield `CommandError({ code: "INVALID_ARGS" })`.
- **Inject_Law:** Non-empty args produce `type: "system_inject"` — executor dispatches as Redux `addMessage({ role: "system" })`.
- **Advanced_Law:** Marked as advanced (`argumentHint: "<texto>"`) — direct system prompt injection.

### [Semantic Hash]
Slash command for injecting arbitrary text directly into the assistant system prompt context.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (COMMAND_DEFS.system)
- **Downstream:** `@/lib/commands/registry`

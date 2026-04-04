---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Help

### [Signatures]
```ts
export const helpCommand: ChatCommand
// name: "/help", aliases: ["/ayuda", "/?"]
// execute(args?) → Effect<{ type: "system_inject", content: string }, never>
```

### [Governance]
- **Specific_Law:** If `args` matches a command name/alias, injects a single-command description.
- **List_Law:** Empty args inject a formatted list of all non-hidden commands.
- **Inject_Law:** Always produces `type: "system_inject"` — feedback shown as `FB_INFO` toast by `CommandService`.

### [Semantic Hash]
Slash command for displaying available commands. Supports specific command lookup by name/alias.

### [Linkage]
- **Upstream:** `@/lib/commands/registry` (getCommands)
- **Downstream:** `@/lib/commands/registry`

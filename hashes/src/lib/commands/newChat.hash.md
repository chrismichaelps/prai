---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.NewChat

### [Signatures]
```ts
export const newChatCommand: ChatCommand
// name: "/new", aliases: ["/nuevo"]
// execute() → Effect<{ type: "navigate", path: "/chat" }, never>
```

### [Governance]
- **No_Args_Law:** Ignores all args — always navigates to `/chat`.
- **Navigate_Law:** `executor.ts` handles `type: "navigate"` by setting `window.location.href`.

### [Semantic Hash]
Slash command for starting a new conversation by navigating to `/chat`.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (COMMAND_DEFS.newChat)
- **Downstream:** `@/lib/commands/registry`

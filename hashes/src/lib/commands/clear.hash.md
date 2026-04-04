---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Clear

### [Signatures]
```ts
export const clearCommand: ChatCommand
// name: "/clear", aliases: ["/limpiar", "/reset"]
// execute() → Effect<{ type: "dispatch", action: ReturnType<typeof clearHistory> }, never>
```

### [Governance]
- **No_Args_Law:** Ignores all args — always dispatches `clearHistory()`.
- **Reset_Law:** `clearHistory` action resets `messages`, `suggestions`, `chatSettings` to defaults (see chatSlice).

### [Semantic Hash]
Slash command for clearing the current chat message history and resetting chat settings to defaults.

### [Linkage]
- **Upstream:** `@/store/slices/chatSlice` (clearHistory action)
- **Downstream:** `@/lib/commands/registry`

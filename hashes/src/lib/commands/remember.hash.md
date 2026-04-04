---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Remember

### [Signatures]
```ts
export const rememberCommand: ChatCommand
// name: "/remember", aliases: ["/recordar", "/nota", "/note"]
// execute(args) → Effect<{ type: "memory", key: string, value: string, category: "fact", toast: "Recordado" }, CommandError>
```

### [Governance]
- **Empty_Guard_Law:** Empty args yield `CommandError({ code: "INVALID_ARGS" })`.
- **Key_Law:** Key is `user_note_${Date.now()}` — timestamp suffix allows multiple facts to coexist without collision.
- **Category_Law:** Always uses category `"fact"` — stored in `session_memory` table.
- **Memory_Law:** `executor.ts` handles `type: "memory"` by calling `memApi.save`.

### [Semantic Hash]
Slash command for persisting a user-provided fact to `session_memory`. Multiple calls create distinct entries via timestamp keys.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (COMMAND_DEFS.remember)
- **Downstream:** `@/lib/commands/registry`, `@/lib/commands/executor`, `@/app/api/memory/route`

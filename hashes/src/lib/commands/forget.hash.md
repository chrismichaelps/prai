---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Forget

### [Signatures]
```ts
export const forgetCommand: ChatCommand
// name: "/forget", aliases: ["/olvidar", "/borrar-memoria"]
// execute(args) → Effect<{ type: "memory_delete", key: string, toast: "Olvidado" }, CommandError>
```

### [Governance]
- **Empty_Guard_Law:** Empty args yield `CommandError({ code: "INVALID_ARGS" })`.
- **Key_Law:** `args` is used as the raw key — caller must know the exact key stored.
- **Delete_Law:** `executor.ts` handles `type: "memory_delete"` by calling `memApi.forget`.

### [Semantic Hash]
Slash command for removing a specific entry from `session_memory` by key.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (COMMAND_DEFS.forget)
- **Downstream:** `@/lib/commands/registry`, `@/lib/commands/executor`, `@/app/api/memory/route`

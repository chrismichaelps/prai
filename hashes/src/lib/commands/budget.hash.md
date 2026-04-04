---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Budget

### [Signatures]
```ts
export const budgetCommand: ChatCommand
// name: "/budget", aliases: ["/presupuesto"]
// execute(args) → Effect<{ type: "setting", key: "budget", value: Budget, toast: string }, CommandError>
```

### [Governance]
- **Alias_Law:** English aliases (`"budget"` → `"económico"`, `"moderate"` → `"moderado"`, `"luxury"` → `"lujo"`) normalized before schema decode.
- **MemoryMap_Law:** `executor.ts` cross-writes this setting to `session_memory` with key `budget_preference` / category `"preference"`.
- **Values:** `"económico"` | `"moderado"` | `"lujo"`

### [Semantic Hash]
Slash command for setting the budget tier that filters assistant recommendations.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (BudgetSchema, COMMAND_DEFS.budget)
- **Downstream:** `@/lib/commands/registry`, `@/lib/commands/executor` (SETTING_MEMORY_MAP)

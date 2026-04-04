---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Type.Command

### [Signatures]
```ts
export type CommandCategory =
  | "persona"
  | "mode"
  | "content"
  | "history"
  | "system"
  | "navigation"

export type CommandType = "local" | "prompt" | "setting"

export interface ChatCommand {
  type: CommandType
  name: string
  aliases?: string[]
  description: string
  argumentHint?: string
  category: CommandCategory
  isHidden?: boolean
  isEnabled?: () => boolean
  execute: (
    args: string
  ) => Effect.Effect<CommandResult, CommandError, Redux | ConfigService | ChatApi | I18n>
}
```

### [Governance]
- **Contract_Law:** `ChatCommand.execute` always returns `Effect<CommandResult, CommandError, ...>` — never throws.
- **Category_Law:** Every command belongs to exactly one `CommandCategory`.
- **Type_Law:** `CommandType` discriminates execution strategy: `"setting"` writes Redux/DB, `"prompt"` injects system message, `"local"` dispatches or navigates.

### [Semantic Hash]
Core type contracts for the slash-command system. Defines `ChatCommand` interface and categorical enums consumed by all command implementations.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema`, `@/lib/effect/errors`
- **Downstream:** All command files (`language`, `personality`, `mode`, `region`, `budget`, `trip`, `system`, `clear`, `newChat`, `help`, `remember`, `forget`)

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.Command

### [Signatures]
```ts
export interface ParsedCommand {
  cmd: ChatCommand
  args: string
}

export interface CommandFeedback {
  text: string
  type: 'success' | 'error' | 'info'
}

export class CommandService extends Effect.Service<CommandService>()("CommandService", {
  succeed: {
    getAll: () => ChatCommand[]
    filter: (query: string) => ChatCommand[]
    parse: (value: string) => ParsedCommand | null
    execute: (cmd: ChatCommand, args: string, chatId: string | null) => Effect<void, CommandError, Redux | ChatApi | MemoryApi>
    run: (cmd: ChatCommand, args: string, chatId: string | null) => Effect<CommandFeedback, never, Redux | ChatApi | MemoryApi>
  }
}) {}
```

### [Governance]
- **Parse_Law:** `parse()` returns `null` for non-`/`-prefixed input or unrecognized command names.
- **Execute_Law:** `execute()` runs `cmd.execute(args)` then `applyResult()` — side effects only, no feedback.
- **Run_Law:** `run()` chains execute + `feedbackFromResult` — returns `CommandFeedback`, never fails (catches all errors).
- **Feedback_Law:** `feedbackFromResult` maps each `CommandResult.type` to a toast string using `FB_*` symbols. `"system_inject"` from `/help` gets `FB_INFO`.

### [Implementation Notes]
- `feedbackFromResult` handles all 6 result types: `"setting"`, `"system_inject"`, `"dispatch"`, `"navigate"`, `"memory"`, `"memory_delete"`
- `"memory"` and `"memory_delete"` use `result.toast` directly

### [Semantic Hash]
Effect.Service wrapper around the command system. Provides typed parse/execute/run pipeline with toast feedback generation.

### [Linkage]
- **Upstream:** `@/lib/commands/registry`, `@/lib/commands/executor`, `@/lib/constants/command-figures`
- **Downstream:** `@/lib/effect/runtime` (CommandService.Default), UI command handlers

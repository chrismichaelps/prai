---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Registry

### [Signatures]
```ts
export const getCommands = (): ChatCommand[]
export const filterCommands = (query: string): ChatCommand[]
```

### [Governance]
- **Registry_Law:** `COMMANDS` array is the single source of truth for all available slash commands.
- **Hidden_Law:** `filterCommands` omits `isHidden` commands from both empty-query and search results.
- **Alias_Match_Law:** Filter matches on `name`, `aliases`, and `description` — case-insensitive.

### [Implementation Notes]
- Registered commands: `language`, `personality`, `mode`, `region`, `budget`, `trip`, `system`, `clear`, `newChat`, `help`, `remember`, `forget` (12 total)
- `rememberCommand` and `forgetCommand` added in session_memory integration

### [Semantic Hash]
Central registry of all `ChatCommand` implementations. Provides `getCommands()` for full list and `filterCommands(query)` for palette search.

### [Linkage]
- **Upstream:** All command modules
- **Downstream:** `@/lib/effect/services/CommandService`, `@/lib/commands/help`

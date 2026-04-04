---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Executor

### [Signatures]
```ts
const SETTING_MEMORY_MAP: Record<string, {
  keyPrefix: string
  category: "preference" | "fact" | "itinerary" | "contact"
}>

export const applyResult = (
  result: CommandResult,
  chatId: string | null
): Effect.Effect<void, CommandError, Redux | ChatApi | MemoryApi>
```

### [Governance]
- **Dispatch_Law:** All `CommandResult` variants are handled in `applyResult`; unhandled variants are silently ignored.
- **MemoryMap_Law:** `"setting"` results for `tripDate`, `budget`, and `region` are cross-written to `session_memory` via `SETTING_MEMORY_MAP`.
- **Language_Law:** `"setting"` with `key === "language"` additionally calls `chatApi.updateUserLanguage`.
- **Silent_Fail_Law:** All DB/API side effects use `Effect.catchAll(() => Effect.void)` — never propagate errors upward.
- **Memory_Law:** `"memory"` result calls `memApi.save`; `"memory_delete"` calls `memApi.forget`.

### [Implementation Notes]
- `SETTING_MEMORY_MAP` maps setting keys to memory key prefixes and categories
- `"dispatch"` result dispatches arbitrary Redux `UnknownAction`
- `"navigate"` result sets `window.location.href` (client-side only guard)

### [Semantic Hash]
Command result dispatcher. Translates `CommandResult` union values into side effects: Redux dispatch, DB persistence, language sync, session_memory cross-writes.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema`, `@/lib/effect/services/Redux`, `@/lib/effect/services/ChatApi`, `@/lib/effect/services/MemoryApi`
- **Downstream:** `@/lib/effect/services/CommandService`

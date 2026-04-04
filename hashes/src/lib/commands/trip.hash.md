---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Trip

### [Signatures]
```ts
export const tripCommand: ChatCommand
// name: "/trip", aliases: ["/viaje"]
// execute(args) → Effect<{ type: "setting", key: "tripDate", value: string, toast: string }, CommandError>
```

### [Governance]
- **Clear_Law:** Empty args set `value: ""` with toast `"Fecha de viaje eliminada"` — allows clearing the trip date.
- **MemoryMap_Law:** `executor.ts` cross-writes non-empty `tripDate` to `session_memory` with key `trip_date` / category `"itinerary"`.
- **Free_Form_Law:** No schema validation on the date string — accepts any free-form text.

### [Semantic Hash]
Slash command for setting or clearing the trip date used for contextual recommendations.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (COMMAND_DEFS.trip)
- **Downstream:** `@/lib/commands/registry`, `@/lib/commands/executor` (SETTING_MEMORY_MAP)

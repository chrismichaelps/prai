---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Command.Region

### [Signatures]
```ts
export const regionCommand: ChatCommand
// name: "/region", aliases: ["/región", "/area"]
// execute(args) → Effect<{ type: "setting", key: "region", value: Region, toast: string }, CommandError>
```

### [Governance]
- **Alias_Law:** English aliases (`"north"`, `"south"`, `"east"`, `"west"`, `"all"`) normalized to Spanish before schema decode.
- **MemoryMap_Law:** `executor.ts` cross-writes this setting to `session_memory` with key `region_preference` / category `"preference"`.
- **Values:** `"norte"` | `"sur"` | `"este"` | `"oeste"` | `"metro"` | `"todos"`

### [Semantic Hash]
Slash command for filtering assistant recommendations to a specific Puerto Rico region.

### [Linkage]
- **Upstream:** `@/lib/effect/schemas/CommandSchema` (RegionSchema, COMMAND_DEFS.region)
- **Downstream:** `@/lib/commands/registry`, `@/lib/commands/executor` (SETTING_MEMORY_MAP)

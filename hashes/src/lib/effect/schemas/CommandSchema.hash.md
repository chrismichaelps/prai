---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Effect.Command

### [Signatures]
```ts
export const LanguageSchema: Schema.Literal<["es", "en"]>
export const PersonalitySchema: Schema.Literal<["guía", "chef", "historiador", "aventurero", "local"]>
export const ModeSchema: Schema.Literal<["experto", "casual", "turista", "familia"]>
export const RegionSchema: Schema.Literal<["norte", "sur", "este", "oeste", "metro", "todos"]>
export const BudgetSchema: Schema.Literal<["económico", "moderado", "lujo"]>

export const ChatSettingsSchema: Schema.Struct<{
  language: Schema.optionalWith<...>
  personality: Schema.optional<...>
  mode: Schema.optional<...>
  region: Schema.optional<...>
  budget: Schema.optional<...>
  tripDate: Schema.optional<...>
}>
export type ChatSettings = Schema.Schema.Type<typeof ChatSettingsSchema>
export const DEFAULT_CHAT_SETTINGS: ChatSettings  // { language: "es" }

export const CommandResultSchema: Schema.Union<[
  { type: "setting"; key: string; value: unknown; toast: string },
  { type: "system_inject"; content: string },
  { type: "navigate"; path: string },
  { type: "dispatch"; action: unknown },
  { type: "memory"; key: string; value: string; category: "preference"|"fact"|"itinerary"|"contact"; toast: string },
  { type: "memory_delete"; key: string; toast: string },
]>
export type CommandResult = Schema.Schema.Type<typeof CommandResultSchema>

export const COMMAND_DEFS: { language, personality, mode, region, budget, trip, system, clear, newChat, help, remember, forget }
export const COMMAND_VALUE_SCHEMAS: Record<string, Schema.Schema<any, any>>
```

### [Governance]
- **Schema_Law:** All command value schemas use Effect `Schema.Literal` for strict enum enforcement.
- **Default_Law:** `DEFAULT_CHAT_SETTINGS = { language: "es" }` — only language has a compile-time default.
- **Result_Union_Law:** `CommandResult` is a discriminated union on `type` — exhaustively handled in `executor.ts` and `CommandService.ts`.
- **Memory_Category_Law:** `"memory"` result category is `"preference" | "fact" | "itinerary" | "contact"` — aligns with `session_memory` table schema.

### [Semantic Hash]
Central schema definitions for all slash-command values, settings, and result types. Single source of truth for command definitions (`COMMAND_DEFS`) and their value schemas.

### [Linkage]
- **Upstream:** `effect` (Schema)
- **Downstream:** All command implementations, `@/lib/commands/executor`, `@/lib/effect/services/CommandService`, `@/lib/commands/settingsPrompt`, `@/lib/effect/chat`

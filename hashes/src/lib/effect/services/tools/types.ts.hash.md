---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.ToolTypes

### [Signatures]
```ts
export interface ToolDefinition {
  name: string
  description: string
  parameters: Schema.Schema<any>
  readOnly: boolean
  alwaysLoad: boolean
  isDestructive?: boolean
  searchHint?: string
}

export const PUERTO_RICO_TOOLS: ToolDefinition[]
```

### [Governance]
- **Definition_Law:** Each tool follows the `ToolDefinition` interface with name, description, parameters (Schema), readOnly flag, alwaysLoad flag, optional isDestructive, and optional searchHint.
- **Localization_Law:** All tool descriptions are in Spanish.
- **New_Tool_Law:** `remember_user_fact` — saves user facts for future reference. Non-destructive, not read-only, always loaded. Description: "Guarda un dato personal del usuario para referencia futura."

### [Semantic Hash]
Tool registry for all Puerto Rico tourism tools. Defines 9 tools: search_beaches, search_restaurants, search_events, search_places, search_hotels, search_weather, search_transport, save_favorite, save_itinerary, and remember_user_fact. All descriptions localized to Spanish.

### [Linkage]
- **Upstream:** ToolParamsSchemas
- **Downstream:** `@root/src/app/api/chat/route.ts`, `@root/src/lib/effect/services/tools/executor.ts`

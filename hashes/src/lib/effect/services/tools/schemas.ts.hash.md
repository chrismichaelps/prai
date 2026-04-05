---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.ToolSchemas

### [Signatures]
```ts
export const RememberUserFactParamsSchema: Schema.Schema<...>
export const ToolParamsSchemas: {
  search_beaches: typeof SearchBeachesParamsSchema
  search_restaurants: typeof SearchRestaurantsParamsSchema
  search_events: typeof SearchEventsParamsSchema
  search_places: typeof SearchPlacesParamsSchema
  search_hotels: typeof SearchHotelsParamsSchema
  search_weather: typeof SearchWeatherParamsSchema
  search_transport: typeof SearchTransportParamsSchema
  save_favorite: typeof SaveFavoriteParamsSchema
  save_itinerary: typeof SaveItineraryParamsSchema
  remember_user_fact: typeof RememberUserFactParamsSchema
}
```

### [Governance]
- **Schema_Law:** All tool parameters are validated via Effect Schema.
- **New_Tool_Law:** `remember_user_fact` schema accepts `key` (String), `value` (String), and optional `category` (Literal: "preference" | "fact" | "itinerary" | "contact").

### [Semantic Hash]
Parameter schemas for all Puerto Rico tourism tools. Extended with `RememberUserFactParamsSchema` for the new memory-persistence tool.

### [Change Notes — web search]
- Added `WebSearchParamsSchema` for `web_search` tool
- Added `web_search` to `ToolParamsSchemas`

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.SearchFilter

### [Signatures]
```ts
export type SearchFilters = {
  readonly time?: string
  readonly location?: string
  readonly budget?: string
}

export const hasFilters: (f: SearchFilters) => boolean
export const enrichSearchQuery: (query: string, filters: SearchFilters) => string

export class SearchFilterService extends Effect.Service<SearchFilterService>()("SearchFilter", {
  effect: Effect.gen(function* () {
    const extract: (
      query: string,
      history: ReadonlyArray<ConversationMessage>
    ) => Effect.Effect<SearchFilters, never>
  })
})
```

### [Governance]
- **Effect_Law:** Uses Effect framework with typed error channel (`SearchFilterError`).
- **Extraction_Law:** Only triggers when query length >= `FILTER_EXTRACTION_MIN_QUERY_LENGTH` (10 chars).
- **Enrichment_Law:** `enrichSearchQuery` appends location, time, and budget filters to the original query string for tool execution.
- **Fallback_Law:** Returns empty `{}` on failure or missing API key.
- **Format_Law:** LLM response must be JSON with optional `time`, `location`, `budget` fields.

### [Semantic Hash]
Effect service that extracts search filters (time, location, budget) from user queries using an LLM. Provides utilities to check if filters exist and to enrich search queries with extracted filter context.

### [Linkage]
- **Upstream:** SearchFilterConstants, ApiConstants
- **Downstream:** `@root/src/app/api/chat/route.ts` (Preflight phase, tool execution enrichment)

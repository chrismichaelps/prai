---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.QueryExpansion

### [Signatures]
```ts
export type QueryExpansionResult = {
  readonly semantic: string
  readonly keywords: readonly string[]
}

export class QueryExpansionService extends Effect.Service<QueryExpansionService>()("QueryExpansion", {
  dependencies: [SessionMemoryService.Default],
  effect: Effect.gen(function* () {
    const expand: (
      query: string,
      history: ReadonlyArray<ConversationMessage>
    ) => Effect.Effect<QueryExpansionResult, never>
  })
})
```

### [Governance]
- **Effect_Law:** Uses Effect framework with typed error channel (`QueryExpansionError`).
- **Concurrency_Law:** Semantic rephrase and keyword expansion run concurrently via `Effect.all` with `concurrency: "unbounded"`.
- **Memory_Integration_Law:** Injects user memory context (top 5 entries) into expansion prompts for personalized query reformulation.
- **Fallback_Law:** On failure, returns original query as semantic with empty keywords.
- **Min_Length_Law:** Only triggers when query length >= `QUERY_EXPANSION_MIN_LENGTH` (20 chars).

### [Semantic Hash]
Effect service that rephrases user queries for better semantic search and expands keywords for broader information retrieval. Uses LLM calls to generate both a self-contained semantic query and keyword arrays, incorporating conversation history and user memory context.

### [Linkage]
- **Upstream:** SessionMemoryService, QueryExpansionConstants, ApiConstants
- **Downstream:** `@root/src/app/api/chat/route.ts` (Preflight phase)

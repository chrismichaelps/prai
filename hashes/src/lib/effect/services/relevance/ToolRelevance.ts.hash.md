---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.ToolRelevance

### [Signatures]
```ts
export type ToolResult = {
  readonly toolName: string
  readonly result: string
}

export type RelevanceScore = {
  readonly index: number
  readonly score: number
}

export class ToolRelevanceService extends Effect.Service<ToolRelevanceService>()("ToolRelevance", {
  effect: Effect.gen(function* () {
    const score: (
      query: string,
      results: ToolResult[]
    ) => Effect.Effect<ToolResult[], never>
  })
})
```

### [Governance]
- **Effect_Law:** Uses Effect framework with typed error channel (`ToolRelevanceError`).
- **Scoring_Law:** Scores tool results 0-3 via LLM. Results below `RELEVANCE_MIN_SCORE` (1) are replaced with `RELEVANCE_FILTERED_CONTENT`.
- **Preview_Law:** Only first `RELEVANCE_CONTEXT_PREVIEW` (300) chars of each result sent to LLM.
- **Fallback_Law:** On failure or empty scores, returns original results unchanged.

### [Semantic Hash]
Effect service that evaluates the relevance of tool execution results against the user's query using an LLM. Filters out irrelevant results to keep only useful content for the user.

### [Linkage]
- **Upstream:** ToolRelevanceConstants, ApiConstants
- **Downstream:** `@root/src/app/api/chat/route.ts` (Post-execution phase in both streaming and non-streaming loops)

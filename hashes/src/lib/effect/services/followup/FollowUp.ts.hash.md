---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.FollowUp

### [Signatures]
```ts
export class FollowUpSuggestionsService extends Effect.Service<FollowUpSuggestionsService>()("FollowUp", {
  effect: Effect.gen(function* () {
    const generate: (
      messages: ReadonlyArray<ConversationMessage>
    ) => Effect.Effect<string[], never>
  })
})
```

### [Governance]
- **Effect_Law:** Uses Effect framework with typed error channel (`FollowUpError`).
- **Min_Messages_Law:** Requires at least `FOLLOWUP_MIN_MESSAGES` (2) non-system messages before generating.
- **Context_Law:** Uses last `FOLLOWUP_CONTEXT_MESSAGES` (8) messages, each truncated to 400 chars.
- **Format_Law:** LLM returns JSON with `response_format: { type: "json_object" }`. Suggestions parsed from `{"suggestions": [...]}`.
- **Style_Law:** Suggestions must be topic-style phrases (not questions, not imperatives), max 8 words, no "¿", no "qué tal si", no "y si".
- **Fallback_Law:** Returns empty array on failure or missing API key.

### [Semantic Hash]
Effect service that generates follow-up suggestion pills after the AI completes a response. Uses an LLM to produce 3 natural, topic-style action suggestions based on recent conversation context.

### [Linkage]
- **Upstream:** FollowUpConstants, ApiConstants
- **Downstream:** `@root/src/app/api/chat/route.ts` (Post-flight phase, injected as SSE `<next_actions>` tags)

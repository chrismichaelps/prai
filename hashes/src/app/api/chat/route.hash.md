---
State_ID: BigInt(0x3)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Chat.Completions

### [Signatures]
```ts
export async function POST(req: Request): Promise<Response | NextResponse>
```

### [Governance]
- **Secure_Proxy_Law:** Acts as a Next.js Server-Side proxy to explicitly shield `process.env.OPENROUTER_API_KEY` from the browser bundle.
- **Event_Stream_Law:** Enforces streaming capabilities (`stream: true`) by returning a raw `Response` object with `Content-Type: text/event-stream` and `Cache-Control: no-cache` headers.
- **Header_Identity:** Injects `HTTP-Referer` and `X-Title` to comply with OpenRouter API ranking and identification metrics.
- **Tier_Model_Law:** Selects model based on user's subscription tier. Free tier uses default model, Pro tier uses premium model.
- **Reasoning_Law:** Injects `reasoning: { effort: "low"|"medium" }` based on tier.
- **Plugin_Law:** Only injects web search plugins for Pro tier users.
- **Usage_Law:** Checks user usage before processing; returns 403 if limit reached.
- **HttpStatus_Convention:** Uses `HttpStatus` constants instead of magic numbers for response status codes.
- **Preflight_Law:** Runs `runPreflight` before agentic loop — extracts SessionMemory prompt, QueryExpansion (semantic + keywords), and SearchFilters (time, location, budget). Injects `<search_guidance>` and `<search_filters>` into system prompt.
- **Full_Compaction_Law:** Runs `runFullCompactionIfNeeded` before preflight when message count >= 20. Summarizes conversation via LLM call.
- **PostFlight_Law:** Runs `runPostFlight` after response completion — persists accumulated SessionMemory to Supabase.
- **FollowUp_Law:** Runs `runFollowUps` after successful response — generates 3 suggestion pills via LLM, injected as `<next_actions>` SSE tags.
- **ToolRelevance_Law:** After tool execution, scores read-only tool results for relevance. Filters irrelevant results below minimum score threshold.
- **SearchFilter_Injection_Law:** Enriches search tool queries with extracted filters via `enrichSearchQuery`.
- **Streaming_Parallel_Law:** Read-only tools execute in parallel via `Promise.all`, write tools execute sequentially.

### [Implementation Notes]
- **Model Selection:** Reads from `NEXT_PUBLIC_MODEL_NAME` (free) and `NEXT_PUBLIC_MODEL_NAME_PREMIUM` (pro) env vars.
- **Reasoning Effort:** Free = "low", Pro = "medium".
- **Plugins:** Google Search and Wikipedia only for Pro tier.
- **Auth Flow:** Checks auth, fetches usage, determines tier, then proceeds with chat.
- **Agentic Loops:** Two loops — streaming (SSE) and non-streaming. Both support full compaction, preflight, tool relevance, and post-flight.
- **Tool Execution:** Parsed tool calls separated into read-only (parallel) and write (sequential). Results scored for relevance before returning to LLM.

### [Semantic Hash]
The core AI conduit with tier-based model selection, reasoning effort injection, and web search plugin support for Pro users. Extended with full conversation compaction, query expansion, search filter extraction, tool relevance scoring, follow-up suggestion generation, and cross-session memory persistence. Acts as secure proxy to OpenRouter.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/constants/SubscriptionConstants.ts`, `@root/src/lib/effect/constants/UsageConstants.ts`, `@root/src/lib/effect/constants/compaction/CompactionConstants.ts`, `@root/src/lib/effect/constants/query/QueryExpansionConstants.ts`, `@root/src/lib/effect/constants/relevance/ToolRelevanceConstants.ts`, `@root/src/lib/effect/constants/filters/SearchFilterConstants.ts`, `@root/src/lib/effect/constants/followup/FollowUpConstants.ts`
- **Upstream Services:** QueryExpansionService, ToolRelevanceService, SearchFilterService, FollowUpSuggestionsService, SessionMemoryService, CompactionService
- **Downstream:** UI Chat components via SSE stream

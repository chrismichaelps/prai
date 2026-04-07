---
State_ID: BigInt(0x5)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Route.Chat.Completions

### [Signatures]
```ts
export async function POST(req: Request): Promise<Response | NextResponse>

type AuthResult = {
  userId: string
  canSend: boolean
  tier: SubscriptionTierType      // effective tier (gifted or billing)
  isAdmin: boolean                 // from profiles.is_admin
  usage: Pick<UserUsage, 'messages_used' | 'messages_limit' | 'messages_remaining' | 'usage_percentage' | 'can_send'>
  supabaseClient: SupabaseClient
}
```

### [Governance]
- **Secure_Proxy_Law:** Acts as a Next.js Server-Side proxy to explicitly shield `process.env.OPENROUTER_API_KEY` from the browser bundle.
- **Event_Stream_Law:** Enforces streaming capabilities (`stream: true`) by returning a raw `Response` object with `Content-Type: text/event-stream` and `Cache-Control: no-cache` headers.
- **Header_Identity:** Injects `HTTP-Referer` and `X-Title` to comply with OpenRouter API ranking and identification metrics.
- **Tier_Model_Law:** Selects model based on user's effective subscription tier. Free tier uses default model, Pro / gifted-Pro uses premium model.
- **Reasoning_Law:** Injects `reasoning: { effort: "low"|"medium" }` based on effective tier.
- **Plugin_Law:** Injects web search plugins for Pro tier users, gifted-Pro users, and admin users. Gate is `isAdmin || tier === 'pro'`.
- **Admin_Bypass_Law:** `isAdmin` is fetched from `profiles.is_admin` on every request (separate query after `getUserUsage`). Admins receive all Pro features regardless of their billing tier.
- **Effective_Tier_Law:** `auth.tier` always reflects the effective tier resolved by the `get_user_usage` RPC (gifted > billing). App layer never reads raw `subscription_tier` directly.
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
- **Model Selection:** Reads from `NEXT_PUBLIC_MODEL_NAME` (free) and `NEXT_PUBLIC_MODEL_NAME_PREMIUM` (pro/gifted/admin) env vars.
- **Reasoning Effort:** Free = "low", Pro/gifted/admin = "medium".
- **Plugins:** Web search injected when `isAdmin || tier === 'pro'` — covers billing-pro, gifted-pro, and admin accounts.
- **Auth Flow:** `getAuthAndUsage()` fetches `getUserUsage` (returns effective tier) then queries `profiles.is_admin` in a second call. Both results composed into `AuthResult`.
- **Agentic Loops:** Two loops — streaming (SSE) and non-streaming. Both accept `isAdmin` parameter and apply the same `isAdmin || tier === 'pro'` gate for tool injection.
- **Tool Execution:** Parsed tool calls separated into read-only (parallel) and write (sequential). Results scored for relevance before returning to LLM.

### [Semantic Hash]
The core AI conduit with effective-tier-based model selection, reasoning effort injection, and web search plugin support for Pro, gifted-Pro, and admin users. Fetches `isAdmin` from the DB on every request; both billing Pro and gifted Pro are transparently handled through the effective tier system — zero special-casing needed in most of the route. Extended with full conversation compaction, query expansion, search filter extraction, tool relevance scoring, follow-up suggestion generation, and cross-session memory persistence.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/constants/SubscriptionConstants.ts`, `@root/src/lib/effect/constants/UsageConstants.ts`, `@root/src/lib/effect/constants/compaction/CompactionConstants.ts`, `@root/src/lib/effect/constants/query/QueryExpansionConstants.ts`, `@root/src/lib/effect/constants/relevance/ToolRelevanceConstants.ts`, `@root/src/lib/effect/constants/filters/SearchFilterConstants.ts`, `@root/src/lib/effect/constants/followup/FollowUpConstants.ts`
- **Upstream Services:** QueryExpansionService, ToolRelevanceService, SearchFilterService, FollowUpSuggestionsService, SessionMemoryService, CompactionService
- **Upstream DB:** `public.profiles.is_admin`, `get_user_usage` RPC (effective tier)
- **Downstream:** UI Chat components via SSE stream

### [Change Notes — admin + gifted tier]
- `AuthResult` extended with `isAdmin: boolean` — fetched from `profiles.is_admin` after `getUserUsage`
- Tool injection gate changed from `tier === Pro` to `isAdmin || tier === Pro` in both streaming and non-streaming agentic loops
- `auth.tier` now always reflects effective tier (gifted overrides billing) — transparent to most of the route

### [Change Notes — usage accounting fix]
- `increment_user_usage` RPC now fires only inside `} else {` success branch after `result.success` check — prevents quota burn on failed agentic loops

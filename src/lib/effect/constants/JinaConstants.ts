/** @Constants.Jina */

export const JinaLimits = {
  USER_DAILY_SEARCHES: 5,
  GLOBAL_TOKEN_CAP: 9_500_000,
  ESTIMATED_TOKENS_PER_SEARCH: 3_000,
  ADMIN_DAILY_SEARCHES: 999_999,
  MAX_RESULTS_PER_SEARCH: 5,
} as const

/** @Constants.Jina.Api */
export const JinaApi = {
  BASE_URL: "https://s.jina.ai/",
  /** Name of the Supabase RPC that atomically checks and increments usage. */
  QUOTA_RPC: "check_and_increment_jina_usage",
  GEO_COUNTRY_CODE: "pr",
  LANGUAGE_CODE: "es",
  SEARCH_LOCATION: "Puerto Rico",
} as const

/** @Constants.Jina.QuotaReasons */
export const JinaQuotaReason = {
  OK: "ok",
  ADMIN: "admin",
  GLOBAL_LIMIT_REACHED: "global_limit_reached",
  DAILY_LIMIT_REACHED: "daily_limit_reached",
  USER_NOT_FOUND: "user_not_found",
} as const

/** @Constants.Jina.ToolName */
export const JINA_WEB_SEARCH_TOOL_NAME = "web_search"

/** @Constants.Jina.WebSearchInstruction */
export const WEB_SEARCH_ACTIVE_INSTRUCTION = `\
<web_search_instructions>
Web search is active for this session. When the user asks about current events, \
today's news, recent activities, real-time weather, or any information that may \
have changed recently, you MUST call the web_search tool immediately. \
Do not describe what you are about to search — call the tool directly and use \
its results to answer.

When using search results:
- Summarize the actual news content from each result body, not just the site names.
- When citing a source, prefer the exact URL from lines labeled "Artículo:" (these are specific article paths).
- Lines labeled "Sitio web:" are homepages — do not cite them as a specific article; instead summarize any headlines found in their content.
</web_search_instructions>`

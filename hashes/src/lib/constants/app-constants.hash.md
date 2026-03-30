---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Constants.App

### [Signatures]
```ts
export const AppConstants: {
  DEV_URL: string
  DEFAULT_LOCALE: string
  LOCALE_COOKIE_NAME: string
  DEFAULT_UNKNOWN: string
}

export const TimeConstants: {
  SESSION_CHECK_INTERVAL_MS: number
  USAGE_RESET_INTERVAL_MS: number
  HEALTH_CHECK_TIMEOUT_MS: number
  STREAMSEND_DEBOUNCE_MS: number
  USAGE_TRACK_DEBOUNCE_MS: number
  LOCALE_COOKIE_MAX_AGE: number
  CACHE_MAX_AGE_SECONDS: number
  RETRY_AFTER_SECONDS: number
}

export const LimitConstants: {
  NOTIFICATION_FETCH_LIMIT: number
  ISSUE_FETCH_LIMIT: number
  ISSUE_DEFAULT_LIMIT: number
  ISSUE_COMMENT_FETCH_LIMIT: number
  ISSUE_USER_SEARCH_LIMIT: number
  ISSUE_TITLE_MAX_LENGTH: number
  CHAT_TITLE_MAX_LENGTH: number
  CHAT_TITLE_PREVIEW_LENGTH: number
  CHAT_TITLE_GENERATION_LENGTH: number
  URL_CITATION_MAX_LENGTH: number
  SEARCH_QUERY_MAX_LENGTH: number
  USAGE_INCREMENT_MAX: number
  PAGINATION_MIN_LIMIT: number
  PAGINATION_DEFAULT_LIMIT: number
  PAGINATION_MAX_LIMIT: number
}

export const RateLimitConstants: {
  WINDOW_MS: number
  MAX_REQUESTS: number
}

export const CacheControlConstants: {
  PUBLIC: string
  NO_CACHE: string
  MAX_AGE: string
  S_MAXAGE: string
  STATIC_CACHE: string
  NO_CACHE_HEADER: string
}

export const ContentTypeConstants: {
  JSON: string
  EVENT_STREAM: string
  RSS_XML: string
  HTML: string
  TEXT_PLAIN: string
}

export const SSEConstants: {
  DATA_PREFIX: string
  DATA_DONE: string
  DONE: string
}

export const XmlConstants: {
  VERSION: string
  RSS_NAMESPACE: string
  CONTENT_NAMESPACE: string
}

export const SeoPaths: {
  SITEMAP: string
  ROBOTS: string
  FEED: string
}

export const RobotsConstants: {
  USER_AGENT: string
  ALLOW_ROOT: string
  DISALLOW_API: string
  DISALLOW_PROFILE: string
  DISALLOW_AUTH: string
}

export const LocaleConstants: {
  RSS_LANGUAGE: string
}

export const HttpHeaderConstants: {
  CONTENT_TYPE: string
  AUTHORIZATION: string
  CACHE_CONTROL: string
  RETRY_AFTER: string
  RATE_LIMIT_REMAINING: string
  RATE_LIMIT_RESET: string
  HTTP_REFERER: string
  X_FORWARDED_FOR: string
  X_REAL_IP: string
  USER_AGENT: string
  ACCEPT: string
}

export const DatabaseTables: {
  CHATS: string
  MESSAGES: string
  ISSUES: string
  ISSUE_COMMENTS: string
  ISSUE_UPVOTES: string
  NOTIFICATIONS: string
  PROFILES: string
}

export const ApiConstants: {
  OPENROUTER_BASE_URL: string
  OPENROUTER_CHAT_COMPLETIONS: string
  OPENROUTER_MODELS: string
  OPENROUTER_DEFAULT_MODEL: string
  GITHUB_REPO_URL: string
  GOOGLE_S2_FAVICONS_URL: string
  FAVICON_SIZE: number
}

export const RoutePaths: { ... }

export const SeoConstants: {
  PRIORITY: { ... }
  CHANGE_FREQUENCY: { ... }
}
```

### [Governance]
- **Constant_Law:** Centralized magic values. All hardcoded values go here.

### [Semantic Hash]
Centralized application constants including timeouts, limits, API URLs, routes, SEO config, and HTTP headers. Replaces deprecated `@Lib.Constants`.

### [Linkage]
- **Upstream:** None
- **Downstream:** Used throughout codebase - API routes, hooks, services, middleware
- **Replaces:** `@root/src/lib/constants.ts`

/** @Constant.App */

export const AppConstants = {
  DEV_URL: 'http://localhost:3000',
  DEFAULT_LOCALE: 'es',
} as const

export const TimeConstants = {
  SESSION_CHECK_INTERVAL_MS: 5 * 60 * 1000,
  USAGE_RESET_INTERVAL_MS: 24 * 60 * 60 * 1000,
  HEALTH_CHECK_TIMEOUT_MS: 5_000,
  STREAMSEND_DEBOUNCE_MS: 1_000,
  LOCALE_COOKIE_MAX_AGE: 31536000,
  CACHE_MAX_AGE_SECONDS: 3600,
} as const

export const LimitConstants = {
  NOTIFICATION_FETCH_LIMIT: 20,
  ISSUE_FETCH_LIMIT: 50,
  ISSUE_DEFAULT_LIMIT: 20,
  ISSUE_COMMENT_FETCH_LIMIT: 50,
  CHAT_TITLE_MAX_LENGTH: 30,
  CHAT_TITLE_PREVIEW_LENGTH: 25,
  CHAT_TITLE_GENERATION_LENGTH: 80,
  URL_CITATION_MAX_LENGTH: 200,
  SEARCH_QUERY_MAX_LENGTH: 100,
  USAGE_INCREMENT_MAX: 100,
} as const

export const RateLimitConstants = {
  WINDOW_MS: 60_000,
  MAX_REQUESTS: 10,
} as const

export const CacheControlConstants = {
  PUBLIC: 'public',
  NO_CACHE: 'no-cache',
  MAX_AGE: 'max-age',
  S_MAXAGE: 's-maxage',
} as const

export const DatabaseTables = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  ISSUES: 'issues',
  ISSUE_COMMENTS: 'issue_comments',
  ISSUE_UPVOTES: 'issue_upvotes',
  NOTIFICATIONS: 'notifications',
  PROFILES: 'profiles',
} as const

export const ApiConstants = {
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  OPENROUTER_CHAT_COMPLETIONS: 'https://openrouter.ai/api/v1/chat/completions',
} as const

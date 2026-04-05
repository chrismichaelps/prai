/** @Constant.App */
export const AppConstants = {
  DEV_URL: 'http://localhost:3000',
  DEFAULT_LOCALE: 'es',
  LOCALE_COOKIE_NAME: 'NEXT_LOCALE',
  DEFAULT_UNKNOWN: 'unknown',
} as const

/** @Constant.Time */
export const TimeConstants = {
  SESSION_CHECK_INTERVAL_MS: 5 * 60 * 1000,
  USAGE_RESET_INTERVAL_MS: 24 * 60 * 60 * 1000,
  HEALTH_CHECK_TIMEOUT_MS: 5_000,
  STREAMSEND_DEBOUNCE_MS: 1_000,
  USAGE_TRACK_DEBOUNCE_MS: 1_000,
  LOCALE_COOKIE_MAX_AGE: 31536000,
  CACHE_MAX_AGE_SECONDS: 3600,
  RETRY_AFTER_SECONDS: 1000,
  CHAT_STREAM_TIMEOUT_MS: 90_000,
} as const

/** @Constant.Limit */
export const LimitConstants = {
  NOTIFICATION_FETCH_LIMIT: 20,
  ISSUE_FETCH_LIMIT: 50,
  ISSUE_DEFAULT_LIMIT: 20,
  ISSUE_COMMENT_FETCH_LIMIT: 50,
  ISSUE_USER_SEARCH_LIMIT: 10,
  ISSUE_TITLE_MAX_LENGTH: 120,
  CHAT_TITLE_MAX_LENGTH: 30,
  CHAT_TITLE_PREVIEW_LENGTH: 25,
  CHAT_TITLE_GENERATION_LENGTH: 80,
  URL_CITATION_MAX_LENGTH: 200,
  SEARCH_QUERY_MAX_LENGTH: 100,
  USAGE_INCREMENT_MAX: 100,
  PAGINATION_MIN_LIMIT: 1,
  PAGINATION_DEFAULT_LIMIT: 10,
  PAGINATION_MAX_LIMIT: 50,
} as const

/** @Constant.RateLimit */
export const RateLimitConstants = {
  WINDOW_MS: 60_000,
  MAX_REQUESTS: 10,
} as const

/** @Constant.CacheControl */
export const CacheControlConstants = {
  PUBLIC: 'public',
  NO_CACHE: 'no-cache',
  MAX_AGE: 'max-age',
  S_MAXAGE: 's-maxage',
  STATIC_CACHE: `public, max-age=${TimeConstants.CACHE_MAX_AGE_SECONDS}, s-maxage=${TimeConstants.CACHE_MAX_AGE_SECONDS}`,
  NO_CACHE_HEADER: 'no-cache',
} as const

/** @Constant.ContentType */
export const ContentTypeConstants = {
  JSON: 'application/json',
  EVENT_STREAM: 'text/event-stream',
  RSS_XML: 'application/rss+xml; charset=utf-8',
  HTML: 'text/html',
  TEXT_PLAIN: 'text/plain',
} as const

/** @Constant.SSE */
export const SSEConstants = {
  DATA_PREFIX: 'data: ',
  DATA_DONE: 'data: [DONE]',
  DONE: '[DONE]',
} as const

/** @Constant.ProcessingState */
export const ProcessingStateConstants = {
  ANALYZING: "analyzing",
  SEARCHING: "searching",
  EVALUATING: "evaluating",
  GENERATING: "generating",
} as const

/** @Type.ProcessingState */
export type ProcessingStateValue = typeof ProcessingStateConstants[keyof typeof ProcessingStateConstants]

/** @Constant.XML */
export const XmlConstants = {
  VERSION: '<?xml version="1.0" encoding="UTF-8"?>',
  RSS_NAMESPACE: 'http://www.w3.org/2005/Atom',
  CONTENT_NAMESPACE: 'http://purl.org/rss/1.0/modules/content/',
} as const

/** @Constant.SeoPaths */
export const SeoPaths = {
  SITEMAP: '/sitemap.xml',
  ROBOTS: '/robots.txt',
  FEED: '/releases/feed.xml',
} as const

/** @Constant.Robots */
export const RobotsConstants = {
  USER_AGENT: '*',
  ALLOW_ROOT: '/',
  DISALLOW_API: '/api/',
  DISALLOW_PROFILE: '/profile/',
  DISALLOW_AUTH: '/auth/',
} as const

/** @Constant.Locale */
export const LocaleConstants = {
  RSS_LANGUAGE: 'en-us',
} as const

/** @Constant.HttpHeader */
export const HttpHeaderConstants = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  CACHE_CONTROL: 'Cache-Control',
  RETRY_AFTER: 'Retry-After',
  RATE_LIMIT_REMAINING: 'X-RateLimit-Remaining',
  RATE_LIMIT_RESET: 'X-RateLimit-Reset',
  HTTP_REFERER: 'HTTP-Referer',
  X_FORWARDED_FOR: 'x-forwarded-for',
  X_REAL_IP: 'x-real-ip',
  USER_AGENT: 'user-agent',
  ACCEPT: 'accept',
} as const

/** @Constant.Database */
export const DatabaseTables = {
  CHATS: 'chats',
  MESSAGES: 'messages',
  ISSUES: 'issues',
  ISSUE_COMMENTS: 'issue_comments',
  ISSUE_UPVOTES: 'issue_upvotes',
  NOTIFICATIONS: 'notifications',
  PROFILES: 'profiles',
} as const

/** @Constant.API */
export const ApiConstants = {
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  OPENROUTER_CHAT_COMPLETIONS: 'https://openrouter.ai/api/v1/chat/completions',
  OPENROUTER_MODELS: 'https://openrouter.ai/api/v1/models',
  OPENROUTER_DEFAULT_MODEL: 'openrouter/free',
  GITHUB_REPO_URL: 'https://github.com/chrismichaelps/prai',
  GOOGLE_S2_FAVICONS_URL: 'https://www.google.com/s2/favicons',
  FAVICON_SIZE: 32,
} as const

/** @Constant.RoutePaths */
export const RoutePaths = {
  API: {
    AUTH: {
      BASE: '/api/auth',
      SESSION: '/api/auth/session',
      SIGNIN: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
      CALLBACK: '/api/auth/callback',
    },
    CHAT: {
      BASE: '/api/chat',
      MESSAGES: '/api/chat/messages',
      CHATS: '/api/chat/chats',
      CHATS_ARCHIVED: '/api/chat/chats/archived',
      CHATS_ARCHIVE: '/api/chat/chats/archive',
      CHATS_COUNT: '/api/chat/chats/count',
    },
    USER: {
      BASE: '/api/user',
      USAGE: '/api/user/usage',
      USAGE_INCREMENT: '/api/user/usage/increment',
      PERSONALIZATION: '/api/user/personalization',
    },
    ISSUES: {
      BASE: '/api/issues',
    },
    NOTIFICATIONS: {
      BASE: '/api/notifications',
      COUNT: '/api/notifications/count',
      SEEN: '/api/notifications/seen',
    },
    HEALTH: {
      SUPABASE: '/api/health/supabase',
      OPENROUTER: '/api/health/openrouter',
    },
    RELEASES: '/api/releases',
    USERS: {
      BASE: '/api/users',
      ACCOUNT: '/api/users/account',
      SEARCH: '/api/users/search',
    },
  },
  PAGES: {
    HOME: '/',
    CHAT: '/chat',
    BLOG: '/blog',
    ISSUES: '/issues',
    STATUS: '/status',
    PRICING: '/pricing',
    RELEASES: '/releases',
    ABOUT: '/about',
    USAGE: '/usage',
    PROFILE: '/profile',
  },
} as const

/** @Constant.SEO */
export const SeoConstants = {
  PRIORITY: {
    HOMEPAGE: 1.0,
    HIGH: 0.9,
    MEDIUM_HIGH: 0.8,
    MEDIUM: 0.7,
    MEDIUM_LOW: 0.6,
    LOW: 0.5,
  },
  CHANGE_FREQUENCY: {
    ALWAYS: 'always',
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    NEVER: 'never',
  },
} as const

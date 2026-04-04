import { Data } from "effect"

/** @Error.Effect.Config */
export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.OpenRouter */
export class OpenRouterError extends Data.TaggedError("OpenRouterError")<{
  readonly message: string
  readonly code: number
  readonly rateLimit?: {
    readonly limit: string
    readonly remaining: string
    readonly reset: string
  }
  readonly cause?: unknown
}> {}

/** @Error.Effect.BuildInfo */
export class BuildInfoError extends Data.TaggedError("BuildInfoError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Parse */
export class ParseError extends Data.TaggedError("ParseError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Runtime */
export class RuntimeError extends Data.TaggedError("RuntimeError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Accessibility */
export class AccessibilityError extends Data.TaggedError("AccessibilityError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Seo */
export class SeoError extends Data.TaggedError("SeoError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Auth */
export class AuthError extends Data.TaggedError("AuthError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Changelog */
export class ChangelogError extends Data.TaggedError("ChangelogError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Tool */
export class ToolError extends Data.TaggedError("ToolError")<{
  readonly toolName: string
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Suggestion */
export class SuggestionError extends Data.TaggedError("SuggestionError")<{
  readonly message: string
  readonly reason: "generation" | "filter" | "rate_limit" | "unmounted" | "aborted"
  readonly filterReason?: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.TokenEstimation */
export class TokenEstimationError extends Data.TaggedError("TokenEstimationError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.CostTracking */
export class CostTrackingError extends Data.TaggedError("CostTrackingError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Compaction */
export class CompactionError extends Data.TaggedError("CompactionError")<{
  readonly message: string
  readonly method: "micro" | "full"
  readonly cause?: unknown
}> {}

/** @Error.Effect.QueryExpansion */
export class QueryExpansionError extends Data.TaggedError("QueryExpansionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.ToolRelevance */
export class ToolRelevanceError extends Data.TaggedError("ToolRelevanceError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.SearchFilter */
export class SearchFilterError extends Data.TaggedError("SearchFilterError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.FollowUp */
export class FollowUpError extends Data.TaggedError("FollowUpError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.Command */
export class CommandError extends Data.TaggedError("CommandError")<{
  readonly code: "UNKNOWN_COMMAND" | "INVALID_ARGS" | "EXECUTION_FAILED"
  readonly message: string
  readonly cause?: unknown
}> {}

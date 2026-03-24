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

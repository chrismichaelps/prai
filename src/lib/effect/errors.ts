import { Data } from "effect"

/** @Error.Effect.Config */
export class ConfigError extends Data.TaggedError("ConfigError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

/** @Error.Effect.OpenRouter */
export class OpenRouterError extends Data.TaggedError("OpenRouterError")<{
  readonly message: string
  readonly code?: number
  readonly rateLimit?: {
    readonly limit: string
    readonly remaining: string
    readonly reset: string
  }
  readonly cause?: unknown
}> {}

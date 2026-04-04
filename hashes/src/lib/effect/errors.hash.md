---
State_ID: BigInt(0x4)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Effect.Errors

### [Signatures]
```ts
export class QueryExpansionError extends Data.TaggedError("QueryExpansionError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class ToolRelevanceError extends Data.TaggedError("ToolRelevanceError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class SearchFilterError extends Data.TaggedError("SearchFilterError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class FollowUpError extends Data.TaggedError("FollowUpError")<{
  readonly message: string
  readonly cause?: unknown
}> {}

export class CommandError extends Data.TaggedError("CommandError")<{
  readonly code: "UNKNOWN_COMMAND" | "INVALID_ARGS" | "EXECUTION_FAILED"
  readonly message: string
  readonly cause?: unknown
}> {}
```

### [Governance]
- **Error_Law:** All errors use `Data.TaggedError` — typed in E channel, yieldable in Effect.gen.
- **Export_Law:** Flat exports from `@/lib/effect/errors`.
- **Propagation_Law:** Errors propagate up to handlers via `Effect.catchAll` or `Effect.gen`.
- **Domain_Separation_Law:** New services have their own error types: QueryExpansionError, ToolRelevanceError, SearchFilterError, FollowUpError, CommandError.

### [Semantic Hash]
Domain-level typed error definitions for all Effect services. Extended with `CommandError` for the slash-command system (codes: UNKNOWN_COMMAND, INVALID_ARGS, EXECUTION_FAILED).

### [Linkage]
- **Used by:** All Effect services, `@/lib/commands/*` (CommandError)

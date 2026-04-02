import { Schema } from "effect"

/** @Schema.Effect.Compaction.Method */
export const CompactionMethodSchema = Schema.Literal("micro", "full", "none")

/** @Type.Effect.Compaction.Method */
export type CompactionMethod = Schema.Schema.Type<typeof CompactionMethodSchema>

/** @Schema.Effect.Compaction.Config */
export const CompactionConfigSchema = Schema.Struct({
  autoThreshold: Schema.Number,
  maxToolResultAge: Schema.Number,
  stubText: Schema.String,
  maxOutputTokens: Schema.Number
})

/** @Type.Effect.Compaction.Config */
export type CompactionConfig = Schema.Schema.Type<typeof CompactionConfigSchema>

/** @Schema.Effect.Compaction.Result */
export const CompactionResultSchema = Schema.Struct({
  summary: Schema.optional(Schema.String),
  preTokenCount: Schema.Number,
  postTokenCount: Schema.Number,
  method: CompactionMethodSchema,
  messagesRemoved: Schema.Number,
  messagesKept: Schema.Number
})

/** @Type.Effect.Compaction.Result */
export type CompactionResult = Schema.Schema.Type<typeof CompactionResultSchema>

/** @Schema.Effect.Compaction.BoundaryMarker */
export const CompactionBoundarySchema = Schema.Struct({
  type: Schema.Literal("compaction_boundary"),
  method: CompactionMethodSchema,
  preTokenCount: Schema.Number,
  timestamp: Schema.Number
})

/** @Type.Effect.Compaction.BoundaryMarker */
export type CompactionBoundary = Schema.Schema.Type<typeof CompactionBoundarySchema>

import { Schema } from "effect"

/** @Schema.Effect.SessionMemory.Category */
export const MemoryCategorySchema = Schema.Literal(
  "preference",
  "fact",
  "itinerary",
  "contact"
)

/** @Type.Effect.SessionMemory.Category */
export type MemoryCategory = Schema.Schema.Type<typeof MemoryCategorySchema>

/** @Schema.Effect.SessionMemory.Entry */
export const MemoryEntrySchema = Schema.Struct({
  key: Schema.String,
  value: Schema.String,
  category: MemoryCategorySchema,
  extractedAt: Schema.Number
})

/** @Type.Effect.SessionMemory.Entry */
export type MemoryEntry = Schema.Schema.Type<typeof MemoryEntrySchema>

/** @Schema.Effect.SessionMemory */
export const SessionMemorySchema = Schema.Struct({
  entries: Schema.Array(MemoryEntrySchema),
  conversationSummary: Schema.optional(Schema.String)
})

/** @Type.Effect.SessionMemory */
export type SessionMemory = Schema.Schema.Type<typeof SessionMemorySchema>

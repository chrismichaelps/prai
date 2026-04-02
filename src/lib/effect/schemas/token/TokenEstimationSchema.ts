import { Schema } from "effect"

/** @Schema.Effect.TokenEstimation.Method */
export const TokenEstimationMethodSchema = Schema.Literal("rough", "api")

/** @Type.Effect.TokenEstimation.Method */
export type TokenEstimationMethod = Schema.Schema.Type<typeof TokenEstimationMethodSchema>

/** @Schema.Effect.TokenEstimation.Estimate */
export const TokenEstimateSchema = Schema.Struct({
  text: Schema.String,
  tokens: Schema.Number,
  method: TokenEstimationMethodSchema
})

/** @Type.Effect.TokenEstimation.Estimate */
export type TokenEstimate = Schema.Schema.Type<typeof TokenEstimateSchema>

/** @Schema.Effect.TokenEstimation.CostEntry */
export const CostEntrySchema = Schema.Struct({
  model: Schema.String,
  inputTokens: Schema.Number,
  outputTokens: Schema.Number,
  cost: Schema.Number,
  timestamp: Schema.Number
})

/** @Type.Effect.TokenEstimation.CostEntry */
export type CostEntry = Schema.Schema.Type<typeof CostEntrySchema>

/** @Schema.Effect.TokenEstimation.SessionCost */
export const SessionCostSchema = Schema.Struct({
  entries: Schema.Array(CostEntrySchema),
  totalCost: Schema.Number,
  totalInputTokens: Schema.Number,
  totalOutputTokens: Schema.Number,
  totalTokens: Schema.Number
})

/** @Type.Effect.TokenEstimation.SessionCost */
export type SessionCost = Schema.Schema.Type<typeof SessionCostSchema>

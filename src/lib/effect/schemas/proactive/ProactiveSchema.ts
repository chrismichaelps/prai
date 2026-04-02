import { Schema } from "effect"

/** @Schema.Effect.Proactive.AlertType */
export const ProactiveAlertTypeSchema = Schema.Literal(
  "weather_change",
  "event_reminder",
  "travel_advisory",
  "price_alert"
)

/** @Type.Effect.Proactive.AlertType */
export type ProactiveAlertType = Schema.Schema.Type<typeof ProactiveAlertTypeSchema>

/** @Schema.Effect.Proactive.Priority */
export const ProactivePrioritySchema = Schema.Literal("low", "medium", "high", "critical")

/** @Type.Effect.Proactive.Priority */
export type ProactivePriority = Schema.Schema.Type<typeof ProactivePrioritySchema>

/** @Schema.Effect.Proactive.Alert */
export const ProactiveAlertSchema = Schema.Struct({
  type: ProactiveAlertTypeSchema,
  message: Schema.String,
  priority: ProactivePrioritySchema,
  timestamp: Schema.Number,
  expiresAt: Schema.optional(Schema.Number)
})

/** @Type.Effect.Proactive.Alert */
export type ProactiveAlert = Schema.Schema.Type<typeof ProactiveAlertSchema>

/** @Schema.Effect.Proactive.Config */
export const ProactiveConfigSchema = Schema.Struct({
  enabled: Schema.Boolean,
  tickIntervalMs: Schema.Number,
  categories: Schema.Array(ProactiveAlertTypeSchema),
  throttleMs: Schema.Number
})

/** @Type.Effect.Proactive.Config */
export type ProactiveConfig = Schema.Schema.Type<typeof ProactiveConfigSchema>

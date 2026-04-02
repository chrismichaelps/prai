import { Schema } from "effect"

/** @Schema.Effect.Coordinator.Phase */
export const CoordinatorPhaseSchema = Schema.Literal(
  "research",
  "synthesis",
  "implementation",
  "verification"
)

/** @Type.Effect.Coordinator.Phase */
export type CoordinatorPhase = Schema.Schema.Type<typeof CoordinatorPhaseSchema>

/** @Schema.Effect.Coordinator.WorkerStatus */
export const WorkerStatusSchema = Schema.Literal(
  "pending",
  "running",
  "completed",
  "failed"
)

/** @Type.Effect.Coordinator.WorkerStatus */
export type WorkerStatus = Schema.Schema.Type<typeof WorkerStatusSchema>

/** @Schema.Effect.Coordinator.WorkerTask */
export const WorkerTaskSchema = Schema.Struct({
  id: Schema.String,
  prompt: Schema.String,
  status: WorkerStatusSchema,
  result: Schema.optional(Schema.String),
  error: Schema.optional(Schema.String),
  startedAt: Schema.Number,
  completedAt: Schema.optional(Schema.Number)
})

/** @Type.Effect.Coordinator.WorkerTask */
export type WorkerTask = Schema.Schema.Type<typeof WorkerTaskSchema>

/** @Schema.Effect.Coordinator.State */
export const CoordinatorStateSchema = Schema.Struct({
  workers: Schema.Array(WorkerTaskSchema),
  phase: CoordinatorPhaseSchema,
  totalCost: Schema.Number
})

/** @Type.Effect.Coordinator.State */
export type CoordinatorState = Schema.Schema.Type<typeof CoordinatorStateSchema>

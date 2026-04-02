import { Schema } from "effect"

/** @Schema.Effect.Skill */
export const SkillSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  instructions: Schema.String,
  category: Schema.Literal("tourism", "dining", "events", "transport", "safety", "general"),
  keywords: Schema.Array(Schema.String)
})

/** @Type.Effect.Skill */
export type Skill = Schema.Schema.Type<typeof SkillSchema>

/** @Schema.Effect.Skill.Match */
export const SkillMatchSchema = Schema.Struct({
  skill: SkillSchema,
  relevanceScore: Schema.Number
})

/** @Type.Effect.Skill.Match */
export type SkillMatch = Schema.Schema.Type<typeof SkillMatchSchema>

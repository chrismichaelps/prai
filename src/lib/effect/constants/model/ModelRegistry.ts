/** @Constant.Effect.Model.Registry */

/** @Type.ModelProfile */
export type ModelProfile = {
  readonly contextWindow: number
  readonly maxOutputTokens: number
  readonly inputCostPer1KTokens: number
  readonly outputCostPer1KTokens: number
  readonly supportsReasoning: boolean
  readonly supportsTools: boolean
}

/** @Constant.ModelRegistry */
export const ModelRegistry = {
  free: {
    contextWindow: 16_384,
    maxOutputTokens: 3_000,
    inputCostPer1KTokens: 0,
    outputCostPer1KTokens: 0,
    supportsReasoning: true,
    supportsTools: true,
  },
  pro: {
    contextWindow: 131_072,
    maxOutputTokens: 8_000,
    inputCostPer1KTokens: 0.003,
    outputCostPer1KTokens: 0.015,
    supportsReasoning: true,
    supportsTools: true,
  },
} as const satisfies Record<string, ModelProfile>

export type ModelTierKey = keyof typeof ModelRegistry

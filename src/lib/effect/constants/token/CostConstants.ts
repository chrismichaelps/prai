/** @Constant.Effect.Cost */

/** @Constant.Cost.BytesPerToken */
export const BYTES_PER_TOKEN = {
  text: 4,
  json: 2
} as const

/** @Constant.Cost.DisplayThreshold */
export const COST_DISPLAY_THRESHOLD = 0.50

/** @Constant.Cost.Precision */
export const COST_PRECISION = {
  high: 4,
  low: 2
} as const

/** @Constant.Cost.JsonOverhead */
export const JSON_OVERHEAD_TOKENS = 4

/** @Constant.Cost.MessageOverhead */
export const MESSAGE_ROLE_OVERHEAD_TOKENS = 4

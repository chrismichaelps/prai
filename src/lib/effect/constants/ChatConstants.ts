/** @Constant.Effect.Chat */

export const THINKING_STATUSES = {
  ANALYZING: "chat.thinking.analyzing",
  SEARCHING: "chat.thinking.searching",
  STRUCTURING: "chat.thinking.structuring",
  REFINING: "chat.thinking.refining",
  FINALIZING: "chat.thinking.finalizing",
  PREFIX: "chat.thinking.prefix",
  COMPLETED_PREFIX: "chat.thinking.completed"
} as const

export const THINKING_PHASES = [
  { threshold: 150, status: THINKING_STATUSES.ANALYZING },
  { threshold: 400, status: THINKING_STATUSES.SEARCHING },
  { threshold: 900, status: THINKING_STATUSES.STRUCTURING },
  { threshold: 1600, status: THINKING_STATUSES.REFINING },
] as const

export const DEFAULT_THINKING_STATUS = THINKING_STATUSES.FINALIZING

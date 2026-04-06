/** @Constant.Effect.Compaction */

import type { TierKey } from "../tier/TierPolicy"
import { getSafeContextThreshold } from "../tier/TierPolicy"

/** @Constant.Compaction.AutoThreshold */
export const AUTO_COMPACT_THRESHOLD = 100_000

/** @Constant.Compaction.MicroMaxResults */
export const MICRO_COMPACT_MAX_RESULTS = 5

/** @Constant.Compaction.ToolResultStub */
export const TOOL_RESULT_STUB = "[resultado borrado]"

/** @Constant.Compaction.MaxOutputTokens */
export const COMPACT_MAX_OUTPUT_TOKENS = 8_000

/** @Constant.Compaction.MinMessagesToCompact */
export const MIN_MESSAGES_TO_COMPACT = 4

/** @Constant.Compaction.FullCompactMinMessages */
export const FULL_COMPACT_MIN_MESSAGES = 20

/** @Constant.Compaction.SystemInstruction */
export const COMPACT_SYSTEM_INSTRUCTION = "Eres un asistente que crea resúmenes concisos de conversaciones. Responde solo con el resumen, sin texto adicional."

/** @Constant.Compaction.SummaryPrompt */
export const COMPACT_SUMMARY_PROMPT = `Resume la conversación hasta ahora en un formato conciso que preserve:
1. Preferencias clave del usuario y objetivos declarados
2. Información factual importante discutida
3. Decisiones tomadas y recomendaciones dadas
4. Elementos guardados (favoritos, itinerarios)

Formatea como un resumen estructurado que el asistente pueda usar para continuar la conversación sin problemas.
NO incluyas resultados de herramientas o datos crudos — solo el contexto significativo.
Responde en el mismo idioma que ha estado usando el usuario.`

/** @Logic.Compaction.GetTierContextThreshold */
export const getTierContextThreshold = (tier: TierKey): number =>
  getSafeContextThreshold(tier)

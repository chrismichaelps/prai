/** @Constant.ToolRelevance */

export const RELEVANCE_MIN_SCORE = 1
export const RELEVANCE_MAX_TOKENS = 250
export const RELEVANCE_CONTEXT_PREVIEW = 300

/** @Constant.ToolRelevance.SystemPrompt */
export const RELEVANCE_SYSTEM_PROMPT =
  'Eres un evaluador de relevancia para un asistente de viajes en Puerto Rico. Evalúa cada resultado de herramienta del 0 al 3 según qué tan útil es para responder la consulta del usuario. Escala: 0=irrelevante o engañoso, 1=algo relevante, 2=relevante, 3=muy relevante. Responde ÚNICAMENTE con JSON válido: {"scores": [{"index": 0, "score": 2}]}'

export const RELEVANCE_FILTERED_CONTENT = '{"filtered": "No se encontraron resultados relevantes"}'

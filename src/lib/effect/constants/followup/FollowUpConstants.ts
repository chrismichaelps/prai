/** @Constant.FollowUp */

export const FOLLOWUP_MAX_SUGGESTIONS = 3
export const FOLLOWUP_MAX_TOKENS = 200
export const FOLLOWUP_MIN_MESSAGES = 2
export const FOLLOWUP_CONTEXT_MESSAGES = 8

/** @Constant.FollowUp.SystemPrompt */
export const FOLLOWUP_SYSTEM_PROMPT =
  'Eres un asistente de viajes en Puerto Rico. Genera exactamente 3 sugerencias cortas y naturales que el usuario podría querer explorar a continuación. Las sugerencias deben ser frases breves (máx 8 palabras), sin signos de interrogación, sin "¿", sin "qué tal si", sin "y si", sin imperativos como "revisa", "planifica", "consulta". Hazlas como temas o tópicos, no como órdenes. Ejemplo: "Horarios de guaguas a El Yunque", "Paradas de transporte público cerca", "Rutas familiares en El Yunque". Responde ÚNICAMENTE con JSON válido: {"suggestions": ["sugerencia 1", "sugerencia 2", "sugerencia 3"]}'

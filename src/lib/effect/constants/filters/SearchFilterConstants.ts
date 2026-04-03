/** @Constant.SearchFilter */

export const FILTER_EXTRACTION_MAX_TOKENS = 100
export const FILTER_EXTRACTION_MIN_QUERY_LENGTH = 10
export const FILTER_CONTEXT_MESSAGES = 4

/** @Constant.SearchFilter.SystemPrompt */
export const FILTER_EXTRACTION_SYSTEM_PROMPT =
  'Eres un extractor de filtros de búsqueda para viajes en Puerto Rico. Extrae filtros de tiempo, ubicación y presupuesto de la consulta del usuario. Si no hay filtros, devuelve {}. Responde ÚNICAMENTE con JSON válido: {"time": "este fin de semana", "location": "Condado", "budget": "menos de $50"}'

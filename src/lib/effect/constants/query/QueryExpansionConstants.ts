/** @Constant.QueryExpansion */

export const QUERY_EXPANSION_CONTEXT_MESSAGES = 6
export const QUERY_EXPANSION_MIN_LENGTH = 20

/** @Constant.QueryExpansion.Semantic */
export const SEMANTIC_REPHRASE_MAX_TOKENS = 80

/** @Constant.QueryExpansion.Keywords */
export const KEYWORD_EXPANSION_MAX_TOKENS = 100
export const KEYWORD_EXPANSION_MAX_QUERIES = 3

/** @Constant.QueryExpansion.SemanticSystem */
export const SEMANTIC_REPHRASE_SYSTEM_PROMPT =
  `Eres un asistente especializado en turismo en Puerto Rico. Reformula la última consulta del usuario en una consulta autónoma y autocontenida, adecuada para búsqueda semántica. IMPORTANTE: La fecha actual es ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}. Incorpora esta fecha en consultas de noticias o eventos recientes. Incorpora contexto del historial si es necesario (por ejemplo, 'cómo llego allí' → 'cómo llegar a [lugar mencionado]'). Elimina frases de cortesía. SOLO responde con la consulta reformulada, sin texto adicional.`

/** @Constant.QueryExpansion.KeywordsSystem */
export const KEYWORD_EXPANSION_SYSTEM_PROMPT =
  `Eres un asistente especializado en turismo en Puerto Rico. La fecha actual es ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}. Extrae 1 a 3 conjuntos de palabras clave puras para encontrar información relevante. Solo términos concretos: lugares, actividades, comida, transporte, fechas si son relevantes. Sin lenguaje natural. Responde ÚNICAMENTE con JSON válido en este formato: {"keywords": ["termino1 termino2", "termino3"]}`

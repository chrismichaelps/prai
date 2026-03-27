import type { PuertoRicoSearchOptions, DiscoveryCategory } from "../types/search"
import { Timeframes, Languages } from "../types/search"
import type { ChatMessage } from "@/types/chat"
import {
  CategoryQueries,
  DefaultMediaTypes,
  DefaultLocation,
  DefaultCategory,
  DefaultMediaType,
  SearchInstructions,
  FallbackQuery,
  PrioritySources
} from "../constants/SearchConstants"

export const createSearchContext = (searchOptions: PuertoRicoSearchOptions): string => {
  const date = new Date().toLocaleString('es-PR', {
    timeZone: 'America/Puerto_Rico',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<search_context>
CONSULTA ACTUAL: "${searchOptions.query}"
UBICACIÓN: ${searchOptions.location || DefaultLocation}
CATEGORÍA: ${searchOptions.category || DefaultCategory}
TIPOS DE MEDIA: ${searchOptions.mediaTypes?.join(", ") || DefaultMediaType}
FECHA: ${date}
</search_context>

<fuentes_priorizadas>
${PrioritySources.map(s => `- ${s}`).join('\n')}
</fuentes_priorizadas>

<instrucciones_busqueda>
${SearchInstructions.map((inst, i) => `${i + 1}. ${inst}`).join('\n')}
</instrucciones_busqueda>`
}

export const buildSearchOptions = (
  query: string,
  overrides?: Partial<PuertoRicoSearchOptions>
): PuertoRicoSearchOptions => ({
  query,
  mediaTypes: DefaultMediaTypes as readonly string[] as any,
  timeframe: Timeframes.Recent,
  language: Languages.Spanish,
  realTime: false,
  ...overrides
})

export const getDiscoveryQuery = (category: DiscoveryCategory): string => {
  return CategoryQueries[category] || FallbackQuery
}

export const createSearchMessage = (query: string): ChatMessage => ({
  role: "user",
  content: `Busca información sobre: ${query}. Proporciona detalles actualizados, fuentes y recomendaciones específicas para Puerto Rico.`
})
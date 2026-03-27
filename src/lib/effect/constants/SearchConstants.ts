import type { DiscoveryCategory } from "../types/search"

export const PrioritySources = [
  "discoverpuertorico.com (oficial)",
  "tripadvisor.com/puerto-rico",
  "yelp.com/puerto-rico",
  "elnuevodia.com (noticias locales)",
  "primerahora.com (noticias locales)",
  "youtube.com (contenido de viaje)",
  "instagram.com (contenido actual)"
] as const

export const DefaultMediaTypes = [
  "text",
  "images",
  "videos",
  "news"
] as const satisfies readonly string[]

export const CategoryQueries: Record<DiscoveryCategory, string> = {
  trending: "¿Qué está trending en Puerto Rico ahora? Spots populares y contenido viral",
  events: "¿Qué eventos están happening en Puerto Rico hoy y esta semana?",
  food: "¿Cuáles son los spots de comida más populares en Puerto Rico ahora?",
  beaches: "¿Cuáles son las condiciones actuales de las playas en Puerto Rico?",
  nightlife: "¿Cómo está la vida nocturna en Puerto Rico hoy?",
  culture: "¿Qué experiencias culturales hay disponibles en Puerto Rico?",
  nature: "¿Qué actividades de naturaleza hay en Puerto Rico hoy?",
  news: "¿Cuáles son las últimas noticias sobre turismo en Puerto Rico?"
}

export const DefaultLocation = "Todo Puerto Rico" as const

export const FallbackQuery = "Dame información sobre Puerto Rico" as const

export const SearchInstructions = [
  "Busca información ACTUALIZADA sobre Puerto Rico",
  "Incluye datos específicos: horarios, precios, direcciones, contactos",
  "Recomienda fuentes oficiales para verificar",
  "Proporciona contexto cultural puertorriqueño",
  "Sugiere alternativas si aplica"
] as const

export const DefaultCategory = "turismo general" as const

export const DefaultMediaType = "todos" as const
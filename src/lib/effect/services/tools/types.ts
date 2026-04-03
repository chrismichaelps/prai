/** @Schema.ToolDefinition */

import { Schema, Either, pipe, JSONSchema } from "effect"
import { ToolParamsSchemas } from "./schemas"

/** @Schema.ToolInput */
export const ToolInputSchema = Schema.Struct({
  toolName: Schema.String,
  args: Schema.Record({ key: Schema.String, value: Schema.Unknown })
})

/** @Type.ToolInput */
export interface ToolInput {
  readonly toolName: string
  readonly args: Record<string, unknown>
}

/** @Type.ToolDefinition */
export interface ToolDefinition {
  readonly name: string
  readonly description: string
  readonly parameters: Schema.Schema<unknown, unknown, never>
  readonly readOnly?: boolean
  readonly shouldDefer?: boolean
  readonly alwaysLoad?: boolean
  readonly timeoutMs?: number
  readonly isDestructive?: boolean
  readonly searchHint?: string
  readonly aliases?: string[]
}

/** @Tools.Priority.P0 */
export const PUERTO_RICO_TOOLS: ToolDefinition[] = [
  {
    name: "search_beaches",
    description: "Busca playas en Puerto Rico por ubicación, actividades o características. Úsalo cuando el usuario pregunte sobre playas, natación, surf, snorkel o actividades en la playa.",
    parameters: ToolParamsSchemas.search_beaches,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_restaurants",
    description: "Busca restaurantes en Puerto Rico por tipo de cocina, ubicación o rango de precios. Úsalo cuando el usuario pregunte sobre comida, restaurantes, cocina local o platos específicos.",
    parameters: ToolParamsSchemas.search_restaurants,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_events",
    description: "Busca eventos, festivales, conciertos y vida nocturna en Puerto Rico. Úsalo cuando el usuario pregunte qué está pasando, sobre festivales, música en vivo o salidas nocturnas.",
    parameters: ToolParamsSchemas.search_events,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_places",
    description: "Busca lugares generales, atracciones y actividades turísticas en Puerto Rico. Úsalo para preguntas generales sobre lugares que visitar, atracciones o cosas que hacer.",
    parameters: ToolParamsSchemas.search_places,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_hotels",
    description: "Busca hospedaje en Puerto Rico incluyendo hoteles, resorts y alquileres. Úsalo cuando el usuario pregunte dónde quedarse, hoteles o alojamiento.",
    parameters: ToolParamsSchemas.search_hotels,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_weather",
    description: "Obtén información del tiempo en Puerto Rico. Úsalo cuando el usuario pregunte sobre el clima, la mejor época para visitar o las condiciones actuales.",
    parameters: ToolParamsSchemas.search_weather,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_transport",
    description: "Obtén información de transporte en Puerto Rico. Úsalo para preguntas sobre cómo moverse, alquiler de carro, transporte público o direcciones.",
    parameters: ToolParamsSchemas.search_transport,
    readOnly: true,
    alwaysLoad: true,
    searchHint: "opciones de transporte"
  },
  {
    name: "save_favorite",
    description: "Guarda un lugar en la lista de favoritos del usuario. Úsalo cuando el usuario quiera guardar o marcar un lugar que le gustó.",
    parameters: ToolParamsSchemas.save_favorite,
    readOnly: false,
    alwaysLoad: true,
    isDestructive: false,
    searchHint: "guardar lugar favorito"
  },
  {
    name: "save_itinerary",
    description: "Guarda un itinerario de viaje para los planes del usuario. Úsalo cuando el usuario quiera guardar su plan o agenda de viaje.",
    parameters: ToolParamsSchemas.save_itinerary,
    readOnly: false,
    alwaysLoad: true,
    isDestructive: false,
    searchHint: "guardar itinerario de viaje"
  },
  {
    name: "remember_user_fact",
    description: "Guarda un dato personal del usuario para referencia futura. Úsalo cuando el usuario comparta preferencias, restricciones alimentarias, acompañantes de viaje, presupuesto u otra información personal relevante.",
    parameters: ToolParamsSchemas.remember_user_fact,
    readOnly: false,
    alwaysLoad: true,
    isDestructive: false
  }
]

/** @Tools.Export */
export const TOOLS = PUERTO_RICO_TOOLS

const toolSchemaCacheRef = { current: new Map<string, unknown>() }

/** @Tools.GetCachedSchema */
export function getCachedToolSchema(toolName: string): unknown | undefined {
  return toolSchemaCacheRef.current.get(toolName)
}

/** @Tools.SetCachedSchema */
export function setCachedToolSchema(toolName: string, schema: unknown): void {
  toolSchemaCacheRef.current.set(toolName, schema)
}

/** @Tools.ClearCache */
export function clearToolSchemaCache(): void {
  toolSchemaCacheRef.current.clear()
}

/** @Tools.GetByName */
export function getToolByName(name: string): ToolDefinition | undefined {
  return PUERTO_RICO_TOOLS.find(t => t.name === name)
}

/** @Tools.IsReadOnly */
export function isReadOnlyTool(name: string): boolean {
  const tool = getToolByName(name)
  return tool?.readOnly ?? false
}

/** @Tools.ToOpenRouterFormat */
export function toolsToOpenRouter(): unknown {
  return PUERTO_RICO_TOOLS.map(tool => {
    const cached = getCachedToolSchema(tool.name)
    if (cached) {
      return cached
    }
    
    const jsonSchema = JSONSchema.make(tool.parameters)
    const schema = {
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: jsonSchema
      }
    }
    
    setCachedToolSchema(tool.name, schema)
    return schema
  })
}

/** @Tools.ValidateInput */
export function validateToolInput(toolName: string, args: unknown): { success: boolean; parsed?: Record<string, unknown>; error?: string } {
  const tool = getToolByName(toolName)
  if (!tool) {
    return { success: false, error: `Tool not found: ${toolName}` }
  }

  const result = Schema.decodeUnknownEither(tool.parameters)(args)
  return pipe(
    result,
    Either.match({
      onLeft: (left: unknown) => ({ success: false, error: `Invalid arguments for ${toolName}: ${left}` }),
      onRight: (right: unknown) => ({ success: true, parsed: right as Record<string, unknown> })
    })
  )
}
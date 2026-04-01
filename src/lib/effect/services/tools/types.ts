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
    description: "Search for beaches in Puerto Rico by location, activities, or characteristics. Use this when users ask about beaches, swimming, surfing, snorkeling, or beach activities.",
    parameters: ToolParamsSchemas.search_beaches,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_restaurants",
    description: "Search for restaurants in Puerto Rico by cuisine, location, or price range. Use this when users ask about food, dining, local cuisine, or specific dishes.",
    parameters: ToolParamsSchemas.search_restaurants,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_events",
    description: "Search for events, festivals, concerts, and nightlife in Puerto Rico. Use this when users ask about what's happening, festivals, live music, or nightlife.",
    parameters: ToolParamsSchemas.search_events,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_places",
    description: "Search for general places, attractions, and things to do in Puerto Rico. Use this for general tourism questions about places to visit, attractions, or activities.",
    parameters: ToolParamsSchemas.search_places,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_hotels",
    description: "Search for accommodation in Puerto Rico including hotels, resorts, and rentals. Use this when users ask about where to stay, hotels, or lodging.",
    parameters: ToolParamsSchemas.search_hotels,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_weather",
    description: "Get weather information for Puerto Rico. Use this when users ask about weather, best time to visit, or current conditions.",
    parameters: ToolParamsSchemas.search_weather,
    readOnly: true,
    alwaysLoad: true
  },
  {
    name: "search_transport",
    description: "Get transportation information for Puerto Rico. Use this for how to get around, car rental, public transport, or directions.",
    parameters: ToolParamsSchemas.search_transport,
    readOnly: true,
    alwaysLoad: true,
    searchHint: "transportation options"
  },
  {
    name: "save_favorite",
    description: "Save a place to the user's favorites list. Use this when user wants to save or bookmark a place they liked.",
    parameters: ToolParamsSchemas.save_favorite,
    readOnly: false,
    alwaysLoad: true,
    isDestructive: false,
    searchHint: "save favorite place"
  },
  {
    name: "save_itinerary",
    description: "Save a trip itinerary for the user's travel plans. Use this when user wants to save their travel plan or schedule.",
    parameters: ToolParamsSchemas.save_itinerary,
    readOnly: false,
    alwaysLoad: true,
    isDestructive: false,
    searchHint: "save travel itinerary"
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
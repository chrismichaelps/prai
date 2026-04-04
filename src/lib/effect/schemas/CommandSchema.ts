/** @Schema.Effect.Command */

import { Schema } from "effect"

/** @Schema.Effect.Command.Language */
export const LanguageSchema = Schema.Literal("es", "en")
export type Language = Schema.Schema.Type<typeof LanguageSchema>

/** @Schema.Effect.Command.Personality */
export const PersonalitySchema = Schema.Literal("guía", "chef", "historiador", "aventurero", "local")
export type Personality = Schema.Schema.Type<typeof PersonalitySchema>

/** @Schema.Effect.Command.Mode */
export const ModeSchema = Schema.Literal("experto", "casual", "turista", "familia")
export type Mode = Schema.Schema.Type<typeof ModeSchema>

/** @Schema.Effect.Command.Region */
export const RegionSchema = Schema.Literal("norte", "sur", "este", "oeste", "metro", "todos")
export type Region = Schema.Schema.Type<typeof RegionSchema>

/** @Schema.Effect.Command.Budget */
export const BudgetSchema = Schema.Literal("económico", "moderado", "lujo")
export type Budget = Schema.Schema.Type<typeof BudgetSchema>

/** @Schema.Effect.Command.ChatSettings */
export const ChatSettingsSchema = Schema.Struct({
  language: Schema.optionalWith(LanguageSchema, { default: () => "es" as const }),
  personality: Schema.optional(PersonalitySchema),
  mode: Schema.optional(ModeSchema),
  region: Schema.optional(RegionSchema),
  budget: Schema.optional(BudgetSchema),
  tripDate: Schema.optional(Schema.String),
})
export type ChatSettings = Schema.Schema.Type<typeof ChatSettingsSchema>

export const DEFAULT_CHAT_SETTINGS: ChatSettings = { language: "es" }

/** @Schema.Effect.Command.Result */
export const CommandResultSchema = Schema.Union(
  Schema.Struct({
    type: Schema.Literal("setting"),
    key: Schema.String,
    value: Schema.Unknown,
    toast: Schema.String,
  }),
  Schema.Struct({
    type: Schema.Literal("system_inject"),
    content: Schema.String,
  }),
  Schema.Struct({
    type: Schema.Literal("navigate"),
    path: Schema.String,
  }),
  Schema.Struct({
    type: Schema.Literal("dispatch"),
    action: Schema.Unknown,
  }),
  /** @Schema.Effect.Command.Result.Memory — explicit user memory write */
  Schema.Struct({
    type: Schema.Literal("memory"),
    key: Schema.String,
    value: Schema.String,
    category: Schema.Literal("preference", "fact", "itinerary", "contact"),
    toast: Schema.String,
  }),
  /** @Schema.Effect.Command.Result.MemoryDelete — explicit user memory delete */
  Schema.Struct({
    type: Schema.Literal("memory_delete"),
    key: Schema.String,
    toast: Schema.String,
  }),
)
export type CommandResult = Schema.Schema.Type<typeof CommandResultSchema>

/** @Schema.Effect.Command.ErrorCode */
export const CommandErrorCodeSchema = Schema.Literal(
  "UNKNOWN_COMMAND",
  "INVALID_ARGS",
  "EXECUTION_FAILED"
)
export type CommandErrorCode = Schema.Schema.Type<typeof CommandErrorCodeSchema>

/** @Schema.Effect.Command.Category */
export const CommandCategorySchema = Schema.Literal(
  "persona",
  "mode",
  "content",
  "history",
  "system",
  "navigation"
)
export type CommandCategory = Schema.Schema.Type<typeof CommandCategorySchema>

/** @Schema.Effect.Command.CommandType */
export const CommandTypeSchema = Schema.Literal("local", "prompt", "setting")
export type CommandType = Schema.Schema.Type<typeof CommandTypeSchema>

/** @Schema.Effect.Command.Definition */
export const CommandDefinitionSchema = Schema.Struct({
  name: Schema.String,
  aliases: Schema.Array(Schema.String),
  description: Schema.String,
  argumentHint: Schema.optional(Schema.String),
  category: CommandCategorySchema,
  type: CommandTypeSchema,
  settingKey: Schema.optional(Schema.String),
  valueSchema: Schema.optional(Schema.String),
})
export type CommandDefinition = Schema.Schema.Type<typeof CommandDefinitionSchema>

/** @Const.Command.Definitions */
export const COMMAND_DEFS = {
  language: {
    name: "/language",
    aliases: ["/lang", "/idioma"] as const,
    description: "Cambia el idioma de respuesta del asistente",
    argumentHint: "[es|en]",
    category: "mode" as const,
    type: "setting" as const,
    settingKey: "language",
    valueSchema: "LanguageSchema",
  },
  personality: {
    name: "/personality",
    aliases: ["/persona", "/character", "/personalidad"] as const,
    description: "Define la personalidad y estilo del asistente",
    argumentHint: "[guía|chef|historiador|aventurero|local]",
    category: "persona" as const,
    type: "setting" as const,
    settingKey: "personality",
    valueSchema: "PersonalitySchema",
  },
  mode: {
    name: "/mode",
    aliases: ["/modo"] as const,
    description: "Ajusta el tono y profundidad de las respuestas",
    argumentHint: "[experto|casual|turista|familia]",
    category: "mode" as const,
    type: "setting" as const,
    settingKey: "mode",
    valueSchema: "ModeSchema",
  },
  region: {
    name: "/region",
    aliases: ["/región", "/area"] as const,
    description: "Limita las respuestas a una región de Puerto Rico",
    argumentHint: "[norte|sur|este|oeste|metro|todos]",
    category: "mode" as const,
    type: "setting" as const,
    settingKey: "region",
    valueSchema: "RegionSchema",
  },
  budget: {
    name: "/budget",
    aliases: ["/presupuesto"] as const,
    description: "Establece el rango de presupuesto para recomendaciones",
    argumentHint: "[económico|moderado|lujo]",
    category: "mode" as const,
    type: "setting" as const,
    settingKey: "budget",
    valueSchema: "BudgetSchema",
  },
  trip: {
    name: "/trip",
    aliases: ["/viaje"] as const,
    description: "Indica la fecha de tu viaje para recomendaciones contextuales",
    argumentHint: "<fecha>",
    category: "content" as const,
    type: "setting" as const,
    settingKey: "tripDate",
  },
  system: {
    name: "/system",
    aliases: ["/sistema"] as const,
    description: "Inyecta texto directo al prompt del sistema (avanzado)",
    argumentHint: "<texto>",
    category: "system" as const,
    type: "prompt" as const,
  },
  clear: {
    name: "/clear",
    aliases: ["/limpiar", "/reset"] as const,
    description: "Borra todos los mensajes del chat actual",
    category: "history" as const,
    type: "local" as const,
  },
  newChat: {
    name: "/new",
    aliases: ["/nuevo"] as const,
    description: "Inicia una nueva conversación",
    category: "navigation" as const,
    type: "local" as const,
  },
  help: {
    name: "/help",
    aliases: ["/ayuda", "/?"] as const,
    description: "Muestra los comandos disponibles",
    argumentHint: "[comando]",
    category: "system" as const,
    type: "local" as const,
  },
  remember: {
    name: "/remember",
    aliases: ["/recordar", "/nota", "/note"] as const,
    description: "Guarda un dato en tu memoria persistente para que el asistente lo recuerde",
    argumentHint: "<texto a recordar>",
    category: "system" as const,
    type: "local" as const,
  },
  forget: {
    name: "/forget",
    aliases: ["/olvidar", "/borrar-memoria"] as const,
    description: "Elimina un dato guardado de tu memoria",
    argumentHint: "<clave o texto>",
    category: "system" as const,
    type: "local" as const,
  },
} as const

/** @Const.Command.ValueSchemas */
export const COMMAND_VALUE_SCHEMAS: Record<string, Schema.Schema<any, any>> = {
  LanguageSchema,
  PersonalitySchema,
  ModeSchema,
  RegionSchema,
  BudgetSchema,
}

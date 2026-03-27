import { Schema, Effect, Config as EffectConfig } from "effect"
import { PromptBuilderService } from "./PromptBuilder"

export const ErrorMessagesSchema = Schema.Struct({
  connectionError: Schema.String.pipe(Schema.minLength(1)),
  configError: Schema.String.pipe(Schema.minLength(1)),
  adaptiveParsingError: Schema.String.pipe(Schema.minLength(1))
})

export const ChatRequestConfigSchema = Schema.Struct({
  stream: Schema.Boolean,
  temperature: Schema.Number.pipe(Schema.between(0, 2)),
  maxTokens: Schema.Number.pipe(Schema.int(), Schema.positive())
})

export const ModelConfigsSchema = Schema.Struct({
  default: Schema.String.pipe(Schema.minLength(1)),
  premium: Schema.optional(Schema.String)
})

export const ConfigSchema = Schema.Struct({
  openRouterBaseUrl: Schema.String,
  models: ModelConfigsSchema,
  apiKey: Schema.String,
  siteUrl: Schema.String,
  systemPrompt: Schema.String,
  errorMessages: ErrorMessagesSchema,
  chatRequestConfig: ChatRequestConfigSchema
})

export interface Config extends Schema.Schema.Type<typeof ConfigSchema> { }

export class ConfigService extends Effect.Service<ConfigService>()("Config", {
  dependencies: [PromptBuilderService.Default],
  effect: Effect.gen(function* () {
    const promptBuilder = yield* PromptBuilderService

    const chatConfig = yield* EffectConfig.all({
      stream: EffectConfig.boolean("OPENROUTER_STREAM").pipe(EffectConfig.withDefault(true)),
      temperature: EffectConfig.number("OPENROUTER_TEMPERATURE").pipe(EffectConfig.withDefault(0.9)),
      maxTokens: EffectConfig.integer("OPENROUTER_MAX_TOKENS").pipe(EffectConfig.withDefault(3000))
    })

    const models = yield* EffectConfig.all({
      default: EffectConfig.string("NEXT_PUBLIC_MODEL_NAME").pipe(EffectConfig.withDefault("openrouter/free")),
      premium: EffectConfig.string("NEXT_PUBLIC_MODEL_NAME_PREMIUM").pipe(EffectConfig.withDefault(""))
    })

    const openRouterBaseUrl = yield* EffectConfig.string("NEXT_PUBLIC_OPENROUTER_BASE_URL").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_OPENROUTER_BASE_URL"))
    )
    const apiKey = yield* EffectConfig.string("NEXT_PUBLIC_OPENROUTER_API_KEY").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_OPENROUTER_API_KEY"))
    )
    const siteUrl = yield* EffectConfig.string("NEXT_PUBLIC_SITE_URL").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_SITE_URL"))
    )

    const systemPrompt = promptBuilder.compose(`
<dynamic_capabilities>
  - Puedes inventar nuevos tipos de JSON en el futuro siempre que respetes la estructura {"type": "...", "data": {...}}.
  - El sistema está diseñado para escalar sin tocar el código fuente.
</dynamic_capabilities>
`)

    return {
      openRouterBaseUrl,
      models,
      apiKey,
      siteUrl,
      systemPrompt,
      errorMessages: {
        connectionError: "Lo sentimos, hubo un problema con la conexión. Por favor, inténtalo de nuevo.",
        configError: "Error de configuración. Por favor, verifica los parámetros del sistema.",
        adaptiveParsingError: "Hubo un error al procesar el contenido, pero puedo seguir asistiéndote."
      },
      chatRequestConfig: chatConfig
    }
  })
}) { }

export type ConfigType = Config
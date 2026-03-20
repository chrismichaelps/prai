import { Effect, Config as EffectConfig, Schema } from "effect"
import { ConfigSchema } from "../schemas/ConfigSchema"
import type { Config } from "../schemas/ConfigSchema"
import { PromptBuilderService } from "./PromptBuilder"

/** @Namespace.Config.Service */
export class ConfigService extends Effect.Service<ConfigService>()("Config", {
  dependencies: [PromptBuilderService.Default],
  effect: Effect.gen(function* () {
    const promptBuilder = yield* PromptBuilderService

    /** @Logic.Config.EnvRead */
    const openRouterBaseUrl = yield* EffectConfig.string("NEXT_PUBLIC_OPENROUTER_BASE_URL").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_OPENROUTER_BASE_URL"))
    )
    const modelName = yield* EffectConfig.string("NEXT_PUBLIC_MODEL_NAME").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_MODEL_NAME"))
    )
    const apiKey = yield* EffectConfig.string("NEXT_PUBLIC_OPENROUTER_API_KEY").pipe(
      Effect.mapError(() => new Error("Missing NEXT_PUBLIC_OPENROUTER_API_KEY"))
    )
    const siteUrl = yield* EffectConfig.string("NEXT_PUBLIC_SITE_URL").pipe(
      Effect.orElseSucceed(() => "https://prai.vercel.app")
    )

    const systemPrompt = promptBuilder.compose(`
<dynamic_capabilities>
  - Puedes inventar nuevos tipos de JSON en el futuro siempre que respetes la estructura {"type": "...", "data": {...}}.
  - El sistema está diseñado para escalar sin tocar el código fuente.
</dynamic_capabilities>
`)

    const errorMessages = {
      connectionError: "Lo sentimos, hubo un problema con la conexión. Por favor, inténtalo de nuevo.",
      configError: "Error de configuración. Por favor, verifica los parámetros del sistema.",
      adaptiveParsingError: "Hubo un error al procesar el contenido, pero puedo seguir asistiéndote."
    }

    const decoded = yield* Schema.decodeUnknown(ConfigSchema)({
      openRouterBaseUrl,
      modelName,
      apiKey,
      siteUrl,
      systemPrompt,
      errorMessages
    })

    return decoded as Config
  })
}) { }

/** @Logic.Config.Compatibility */
export type ConfigType = Config

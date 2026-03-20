---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Config

### [Signatures]
```ts
export class ConfigService extends Effect.Service<ConfigService>()("Config", {
  dependencies: [PromptBuilderService.Default],
  effect: Effect.gen(function* () { ... })
}) {}

export type ConfigType = Config
```

**Resolved Shape (from ConfigSchema):**
```ts
interface Config {
  readonly openRouterBaseUrl: string
  readonly modelName: string
  readonly apiKey: string
  readonly systemPrompt: string
  readonly errorMessages: {
    readonly connectionError: string
    readonly configError: string
    readonly adaptiveParsingError: string
  }
}
```

### [Governance]
- **Layer_Law:** `ConfigService.Default` lists `PromptBuilderService.Default` as a hard dependency.
- **Export_Law:** Single class + `ConfigType` alias. Consumed via tag yield*.
- **Transformation_Law:** Reads Next.js static envs via Effect.Config → decodes via Schema → composes systemPrompt.

### [Implementation Notes]
- **Environment Variables:** Environment variables are strictly accessed via the Effect Config module (e.g., `Config.string("NEXT_PUBLIC_...")`) rather than direct `process.env` reads.

### [Semantic Hash]
Bootstraps the application configuration object by reading environment variables, validating with Schema, and injecting the composed system prompt from PromptBuilderService.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/PromptBuilder.ts`
- **Downstream:** `@root/src/lib/effect/services/OpenRouter.ts`, `@root/src/lib/effect/chat.ts`, `@root/src/lib/effect/runtime.ts`

---
State_ID: BigInt(0x4)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Runtime

### [Signatures]
```ts
export const ConfigLayer: Layer.Layer<ConfigLayerType, never, never>
export const nextJsConfigProvider: ConfigProvider
export type AppEnvironment = Layer.Layer.Success<typeof MainLayer>
export const runtime: ManagedRuntime.ManagedRuntime<AppEnvironment, never>
```

### [Governance]
- **Dependency_Injection_Law:** Defines the single source of truth for all global Effect environments (`MainLayer`). Merges BaseLayer (Redux, PromptBuilder, HttpClient) with Service layers (Voice, I18n, BuildInfo, Config, OpenRouter, Seo).
- **Env_Resolution:** Exploits `ConfigProvider.fromMap` targeting `process.env.NEXT_PUBLIC_*` exclusively. This guarantees Prerender immunity in Next.js builds.
- **Escape_Hatch:** `runtime` is instantiated via `ManagedRuntime.make(MainLayer as any)` to satisfy complex TypeScript inferred unions while suppressing Node vs Browser build timeouts.
- **Context_Layer_Law:** Services registered in MainLayer: `QueryExpansionService`, `ToolRelevanceService`, `SearchFilterService`, `FollowUpSuggestionsService`, `MemoryApiLayer`, `CommandService.Default`.

### [Semantic Hash]
The absolute root of the Effect TypeScript architecture. Orchestrates service instantiation for all global services including the command system (`CommandService.Default`), memory API (`MemoryApiLayer`), query expansion, tool relevance, search filters, and follow-up suggestions.

### [Linkage]
- **Dependencies:** `@effect/platform-browser`, `ConfigService`, `OpenRouter`, `Redux`, `PromptBuilder`, `VoiceServiceLive`, `I18nLive`, `BuildInfoService`, `SeoService`, `QueryExpansionService`, `ToolRelevanceService`, `SearchFilterService`, `FollowUpSuggestionsService`, `MemoryApiLayer`, `CommandService.Default`
- **New in this session:** `MemoryApiLayer` (`@/lib/effect/services/MemoryApi`), `CommandService.Default` (`@/lib/effect/services/CommandService`)

---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Logic.Effect.Runtime

### [Signatures]
```ts
export const runtime: AppRuntime
export type AppEnvironment = Layer.Layer.Success<typeof MainLayer>
export type AppRuntime = ManagedRuntime.ManagedRuntime<AppEnvironment, never>
```

**Layer Graph:**
```
BaseLayer = PromptBuilderService.Default + Redux.Default + BrowserHttpClient.layerXMLHttpRequest
ConfigLayer = ConfigService.Default ← PromptBuilderService.Default
MainLayer = BaseLayer + ConfigLayer + VoiceServiceLive + I18nLive
           + OpenRouter.Default ← ConfigLayer ← BaseLayer
```

### [Governance]
- **Runtime_Law:** `ManagedRuntime.make(MainLayer)` — correct usage for React/browser context.
- **Type_Law:** `as any` on MainLayer cast is a VIOLATION. Use `Layer.Layer.Success<typeof MainLayer>` for proper type derivation.

### [Implementation Notes]
- **Runtime Type Safety:** `AppEnvironment` relies strictly on `Layer.Layer.Success<typeof MainLayer>` inside `ManagedRuntime` to avoid type erasure.

### [Semantic Hash]
Constructs and exports the singleton ManagedRuntime used by ChatProvider to execute all Effect-based operations in the browser context.

### [Linkage]
- **Upstream:** All services (Config, OpenRouter, Redux, Voice, I18n, PromptBuilder, BrowserHttpClient)
- **Downstream:** `@root/src/lib/effect/ChatProvider.tsx`, `@root/src/lib/effect/I18nProvider.tsx`

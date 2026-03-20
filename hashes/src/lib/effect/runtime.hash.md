---
State_ID: BigInt(0x3)
Git_SHA: LATEST
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
           + BuildInfoService.Default
           + OpenRouter.Default ← ConfigLayer ← BaseLayer
```

**ConfigProvider Entries:**
- `NEXT_PUBLIC_OPENROUTER_BASE_URL`, `NEXT_PUBLIC_MODEL_NAME`, `NEXT_PUBLIC_OPENROUTER_API_KEY`, `NEXT_PUBLIC_SITE_URL`

### [Governance]
- **Runtime_Law:** `ManagedRuntime.make(MainLayer)` — correct usage for React/browser context.
- **Type_Law:** `as any` on MainLayer cast is a VIOLATION. Use `Layer.Layer.Success<typeof MainLayer>` for proper type derivation.
- **BuildInfo_Law:** `BuildInfoService` is part of `MainLayer`. Consumed by `BuildInfoProvider` in `layout.tsx` via `runtime.runPromise`. Exposed to components via `useBuildInfo` hook.

### [Implementation Notes]
- **Runtime Type Safety:** `AppEnvironment` relies strictly on `Layer.Layer.Success<typeof MainLayer>` inside `ManagedRuntime` to avoid type erasure.
- **Build Hash:** `BuildInfoService.Default` in `MainLayer`. Hash generated post-build by `scripts/generate-app-version.mjs`, served via `/api/build-info`.

### [Semantic Hash]
Constructs and exports the singleton ManagedRuntime used by ChatProvider to execute all Effect-based operations in the browser context.

### [Linkage]
- **Upstream:** All services (Config, OpenRouter, Redux, Voice, I18n, PromptBuilder, BrowserHttpClient, BuildInfo)
- **Downstream:** `@root/src/lib/effect/ChatProvider.tsx`, `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/components/layout/Header.tsx`

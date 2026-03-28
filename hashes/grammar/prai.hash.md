---
Language: Project DNA
Fidelity: 100% (Architectural Anchor)
State_ID: BigInt(0x2)
Grammar_Lock: "@root/hashes/grammar/prai.hash.md"
---

/** PR/AI.Grammar.Project - Linguistic DNA anchor for the PR/AI Application */

## [Namespace.AdaptiveCards]

### [AdaptiveCardsSchema.ts]
- **Core_Schemas**: `Base`, `Tourism`, `Photos`, `Video`, `Suggestions`, `News`, `Radio`.
- **CardType**: Literals for polymorphic dispatch.
- **DNA_Anchor**: `@Schema.AdaptiveCards`

### [AdaptiveCard.tsx]
- **Pattern**: Senior Compound Component (`AdaptiveCard.Root`, `.Media`, `.Header`, `.Content`, `.Actions`).
- **Context**: `AdaptiveCardContext` providing `{ type, data }`.
- **Animation**: `framer-motion` (initial fade-in/y-offset).
- **Styling**: Tailwind CSS + `cn` utility.
- **DNA_Anchor**: `@Component.AdaptiveCard`

### [SourcesSidebar.tsx]
- **Pattern**: Animated Drawer (`framer-motion`).
- **Logic**: Displays searchable source cards with snippets and favicons.
- **Trigger**: Dispatched via `openSources` action from `MessageBubble`.
- **DNA_Anchor**: `@Component.SourcesSidebar`

## [Namespace.Effect]

### [Services]
- **PromptBuilderService**: Dynamic system prompt composition via base templates. (`@Service.Effect.PromptBuilder`)
- **ConfigService**: Centralized environment variable management via Schema. Injects PromptBuilder. (`@Service.Effect.Config`)
- **OpenRouter**: OpenAI-compatible streaming chat completion via HTTP API. Returns `Stream<string, OpenRouterError>`. (`@Service.OpenRouter`)
- **VoiceService**: Web Speech API abstraction natively wrapped in Effect async boundaries for cross-browser speech recognition. (`@Service.Voice`)
- **I18nService**: Strictly typed, environment-injected dictionary resolution supporting multiple regions (North America, Latino). (`@Service.I18n`)
- **Redux**: Singleton bridge allowing Effect execution graphs to synchronously dispatch strong-typed actions and read RootState. (`@Service.Redux`)
- **BuildInfoService**: Fetches app version hash from `/api/build-info`. Cached in Layer. (`@Service.Effect.BuildInfo`)

### [Providers]
- **BuildInfoProvider**: Bridges `BuildInfoService` to the React tree. Initializes via `useEffect` + `runtime.runPromise`. Provides `{ buildHash: string | null }` via context. (`@UI.Provider.BuildInfo`)
- **I18nProvider**: Bridges `I18nService` to the React tree. Provides `{ locale, t, setLocale }`. (`@UI.Provider.I18n`)
- **ChatProvider**: Bridges chat effects (`initChat`, `sendChatMessage`) to the React tree. Provides `{ sendMessage, clearHistory, startVoice, stopVoice }`. (`@Context.Effect.Chat`)

### [Hooks]
- **useBuildInfo**: Context accessor for `buildHash`. Returns `string | null` (null until resolved). (`@UI.Hook.BuildInfo`)
- **useI18n**: Context accessor for i18n `{ locale, t, setLocale }`. (`@UI.Hook.I18n`)
- **useChatActions**: Context accessor for chat actions. (`@Context.Effect.Chat`)

### [Error Strategy (errors.ts)]
- **Pattern**: `Data.TaggedError` for all domain failures (e.g., `ConfigError`, `OpenRouterError`, `ParseError`).
- **DNA_Anchor**: `@Error.Effect`

## [Namespace.State] (Redux)
- **Store**: Standard Toolkit `configureStore` wrapped by the Effect Execution Graph.
- **Slices**: `chatSlice` (message history, streaming chunks, and research sources), `uiSlice` (menus, theme, tooltips), `authSlice` (user auth state), `issuesSlice` (issue tracking).

## [Namespace.Build]

### [scripts/generate-app-version.mjs]
- **Pattern**: Post-build ESM script. Hashes `.next/` output with SHA-256. Excludes `/cache/`, `/server/`, blur images.
- **Output**: Writes `{ version, generated }` to `public/app-version.json`.
- **Trigger**: Runs after `next build` via `package.json` build script.
- **DNA_Anchor**: `@Script.AppVersion`

### [/api/build-info]
- **Pattern**: Next.js App Router API route (`force-static`). Reads `public/app-version.json`.
- **Fallback**: Returns `{ buildHash: 'dev' }` during `next dev` (no file).
- **DNA_Anchor**: `@Route.BuildInfo`

## [Architectural_Laws]

### 1. Structural Laws
- **Compound_Component_Law**: UI components with multiple states/parts MUST use the Compound Component pattern with React Context for flexibility (e.g., `AdaptiveCard`).
- **Polymorphic_Dispatch_Law**: Card types MUST be dispatched via schema-aligned literals to ensure type safety in renderers.
- **Service_Tag_Law**: Effect services MUST extend `Effect.Service<T>()("Tag", { effect: ... })` for clean dependency injection and contextual aliasing.
- **Neutral_Language_Law**: ALL user-facing text and prompts MUST use professional, neutral Spanish (avoiding regionalisms), structured via the `I18nService`.

### 2. FMCF Governance Laws
- **Export_Law (Encapsulation)**: Internal layer logic MUST remain opaque. Providers (like `ChatProvider` and `I18nProvider`) only expose necessary `useCallback` memoized standard Promise closures to the React tree.
- **Transformation_Law (Mappers)**: Domain data mapping MUST happen strictly inside the Effect graph boundaries (e.g., parsing raw SSE string streams into `MessageBubble` payloads) before dispatching to Redux or React.
- **Propagation_Law (Error Handling)**: Raw native errors must NEVER leak to the console. They must be caught, tagged via `Data.TaggedError`, and funneled through `Effect.catchAll` into either a UI error state or `Effect.logWarning().`

### 3. Build Info Laws
- **BuildHash_Law**: App version hash is derived from `.next/` build output (SHA-256), not git. Changes only when actual artifacts change.
- **ProviderPattern_Law**: BuildInfo is a first-class Effect Service in `MainLayer`, consumed via `BuildInfoProvider` context — NOT imported directly in components.
- **NullDefault_Law**: `buildHash` is `string | null` in context. Components handle null (no fallback string) to avoid premature values.

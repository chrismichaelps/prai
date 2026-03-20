---
Language: Project DNA
Fidelity: 100% (Architectural Anchor)
State_ID: BigInt(0x1)
Grammar_Lock: "@root/hashes/grammar/prai.hash.md"
---

/** PR/AI.Grammar.Project - Linguistic DNA anchor for the PR/AI Application */

## [Namespace.AdaptiveCards]

### [AdaptiveCardsSchema.ts]
- **Core_Schemas**: `Base`, `Tourism`, `Photos`, `Video`, `Suggestions`, `News`, `Radio`.
- **CardType**: Literals for polymorphic dispatch.
- **DNA_Anchor**: `@Namespace.AdaptiveCards.Schema`

### [AdaptiveCard.tsx]
- **Pattern**: Senior Compound Component (`AdaptiveCard.Root`, `.Media`, `.Header`, `.Content`, `.Actions`).
- **Context**: `AdaptiveCardContext` providing `{ type, data }`.
- **Animation**: `framer-motion` (initial fade-in/y-offset).
- **Styling**: Tailwind CSS + `cn` utility.
- **DNA_Anchor**: `@Component.AdaptiveCard`

## [Namespace.Effect]

### [Services]
- **PromptBuilderService**: Dynamic system prompt composition via base templates. (`@Namespace.PromptBuilder.Service`)
- **ConfigService**: Centralized environment variable management via Schema. Injects PromptBuilder. (`@Namespace.Config.Service`)
- **OpenRouter**: OpenAI-compatible streaming chat completion via HTTP API. Returns `Stream<string, OpenRouterError>`. (`@Service.OpenRouter`)
- **VoiceService**: Web Speech API abstraction natively wrapped in Effect async boundaries for cross-browser speech recognition. (`@Service.Voice`)
- **I18nService**: Strictly typed, environment-injected dictionary resolution supporting multiple regions (North America, Latino). (`@Service.I18n`)
- **Redux**: Singleton bridge allowing Effect execution graphs to synchronously dispatch strong-typed actions and read RootState. (`@Service.Redux`)

### [Error Strategy (errors.ts)]
- **Pattern**: `Data.TaggedError` for all domain failures (e.g., `ConfigError`, `OpenRouterError`, `ParseError`).
- **DNA_Anchor**: `@Namespace.Effect.Errors`

## [Namespace.State] (Redux)
- **Store**: Standard Toolkit `configureStore` wrapped by the Effect Execution Graph.
- **Slices**: `chatSlice` (message history and streaming chunks), `uiSlice` (menus, theme, tooltips), `passportSlice` (user auth state).

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

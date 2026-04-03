---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.PromptBuilder

### [Signatures]
```ts
export class PromptBuilderService extends Effect.Service<PromptBuilderService>()("PromptBuilder", {
  effect: Effect.gen(function* () {
    const compose: (
      _t: (key: string, params?: Record<string, string>) => string,
      extraCapabilities?: string,
      personalization?: Personalization
    ) => string
    return { compose } as const
  })
}) {}
```

**Interface:**
```ts
interface PromptBuilderShape {
  readonly compose: (_t: (key: string, params?: Record<string, string>) => string, extraCapabilities?: string, personalization?: Personalization) => string
}
```

### [Governance]
- **Layer_Law:** Exposed via `PromptBuilderService.Default`. No external dependencies.
- **Export_Law:** Single Effect.Service class export. Consumed via tag yield*.
- **Transformation_Law:** Pure string composition — no I/O, no side effects.
- **Personalization_Law:** Injects personalization section into system prompt when provided.
- **I18n_Law:** Accepts translation function `_t` for localized prompt composition.

### [Semantic Hash]
Builds the LLM system prompt string by composing domain template sections. Includes role, safety, rules, guardrails, media accuracy, output format, and personalization templates. Accepts an i18n translation function for localized prompt building.

### [Linkage]
- **Upstream:** None
- **Downstream:** `@root/src/lib/effect/services/Config.ts` (dependency injection)

### [Quality Notes]
- Pure service with no external I/O — ideal candidate for `Effect.Service` with sync: () => ...
- Template strings are static at runtime — could be memoized at compile time.

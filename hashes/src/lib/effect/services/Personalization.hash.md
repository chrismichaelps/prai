---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Effect.Personalization

### [Signatures]
```ts
export class PersonalizationService extends Effect.Service<PersonalizationService>()("Personalization", {
  effect: Effect.gen(function* () {
    const loadPersonalization: (userId: string) => Effect.Effect<Personalization, ChatDbError>
    const savePersonalization: (userId: string, prefs: unknown) => Effect.Effect<Personalization, ChatDbError>
    const getPersonalization: () => Effect.Effect<Personalization>
  })
})
```

### [Governance]
- **Effect_Law:** Uses Effect framework with typed error channel.
- **Schema_Law:** Validates incoming preferences via PersonalizationSchema before save.

### [Semantic Hash]
Effect service for loading and saving user personalization to Supabase profiles.preferences JSON column.

### [Linkage]
- **Upstream:** PersonalizationSchema, Supabase client
- **Downstream:** `@root/src/lib/effect/services/PromptBuilder.ts`, `@root/src/lib/effect/chat.ts`
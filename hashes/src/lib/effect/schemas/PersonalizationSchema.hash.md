---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Schema.Effect.Personalization

### [Signatures]
```ts
export const BaseStyleSchema = S.Literal("default", "professional", "friendly", "candid", "quirky", "efficient", "cynical")
export const CharacteristicLevelSchema = S.Literal("more", "default", "less")

export const PersonalizationSchema = S.Struct({
  baseStyle: S.optionalWith(BaseStyleSchema, { default: () => "default" }),
  warm: S.optionalWith(CharacteristicLevelSchema, { default: () => "default" }),
  enthusiastic: S.optionalWith(CharacteristicLevelSchema, { default: () => "default" }),
  headersAndLists: S.optionalWith(CharacteristicLevelSchema, { default: () => "default" }),
  emoji: S.optionalWith(CharacteristicLevelSchema, { default: () => "default" }),
  customInstructions: S.optionalWith(S.String, { default: () => "" }),
  nickname: S.optionalWith(S.String, { default: () => "" }),
  aboutMe: S.optionalWith(S.String, { default: () => "" }),
})

export type Personalization = S.Schema.Type<typeof PersonalizationSchema>
export const DEFAULT_PERSONALIZATION: Personalization = { ... }
```

### [Governance]
- **Schema_Law:** All fields have defaults via `optionalWith`.

### [Semantic Hash]
Effect Schema for user personalization settings including base style, characteristics, custom instructions, and nickname.

### [Linkage]
- **Upstream:** User preferences from database
- **Downstream:** `@root/src/lib/effect/services/prompts/personalization.ts`, `@root/src/lib/effect/services/Personalization.ts`, `@root/src/hooks/usePersonalization.ts`
import { Schema as S } from "effect"

/** @Schema.Effect.Personalization */
export const BaseStyleSchema = S.Literal(
  "default",
  "professional",
  "friendly",
  "candid",
  "quirky",
  "efficient",
  "cynical"
)

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

export const DEFAULT_PERSONALIZATION: Personalization = {
  baseStyle: "default",
  warm: "default",
  enthusiastic: "default",
  headersAndLists: "default",
  emoji: "default",
  customInstructions: "",
  nickname: "",
  aboutMe: "",
}

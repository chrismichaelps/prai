import { S } from "@/app/api/_lib/validation"

export const SupportedLanguageSchema = S.Literal("en", "es")

export const DisplayNameSchema = S.optional(S.String)
export const BioSchema = S.optional(S.String)
export const LanguageSchema = S.optional(SupportedLanguageSchema)

export const UpdateProfileSchema = S.Struct({
  userId: S.String.pipe(
    S.filter((s: string) => s.trim().length > 0, { message: () => "userId is required" })
  ),
  display_name: DisplayNameSchema,
  bio: BioSchema,
  language: LanguageSchema
})

export type UpdateProfile = S.Schema.Type<typeof UpdateProfileSchema>

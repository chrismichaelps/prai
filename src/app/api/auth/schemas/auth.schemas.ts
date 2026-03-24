/** @Type.Api.Auth.Schema */
import { S } from "@/app/api/_lib/validation"

export const AuthCallbackSchema = S.Struct({
  code: S.optional(S.String),
  error: S.optional(S.String),
  error_description: S.optional(S.String),
  error_code: S.optional(S.String),
  state: S.optional(S.String)
})

export type AuthCallback = S.Schema.Type<typeof AuthCallbackSchema>

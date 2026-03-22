import { Schema } from "effect"

/** @Type.Effect.Auth.User */
export const UserSchema = Schema.Struct({
  id: Schema.String,
  email: Schema.optional(Schema.String),
  user_metadata: Schema.optional(Schema.Struct({
    name: Schema.optional(Schema.String),
    avatar_url: Schema.optional(Schema.String),
    full_name: Schema.optional(Schema.String)
  }))
})

export type User = Schema.Schema.Type<typeof UserSchema>

/** @Type.Effect.Auth.Session */
export const SessionSchema = Schema.Struct({
  access_token: Schema.String,
  refresh_token: Schema.String,
  expires_in: Schema.Number,
  expires_at: Schema.optional(Schema.Number),
  token_type: Schema.String,
  user: UserSchema
})

export type Session = Schema.Schema.Type<typeof SessionSchema>

/** @Type.Effect.Auth.AuthState */
export const AuthStateSchema = Schema.Struct({
  user: Schema.optional(UserSchema),
  session: Schema.optional(SessionSchema),
  isLoading: Schema.Boolean,
  isAuthenticated: Schema.Boolean
})

export type AuthState = Schema.Schema.Type<typeof AuthStateSchema>

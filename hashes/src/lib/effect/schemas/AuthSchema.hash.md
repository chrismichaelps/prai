---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Effect.Schemas.Auth

### [Signatures]
```ts
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

/** @Type.Effect.Auth.Profile */
export const ProfileSchema = Schema.Struct({
  id: Schema.String,
  display_name: Schema.optional(Schema.String),
  bio: Schema.optional(Schema.String),
  language: Schema.optional(Schema.String),
  avatar_url: Schema.optional(Schema.String),
  created_at: Schema.optional(Schema.String),
  updated_at: Schema.optional(Schema.String)
})

/** @Type.Effect.Auth.Session */
export const SessionSchema = Schema.Struct({
  access_token: Schema.String,
  refresh_token: Schema.String,
  expires_in: Schema.Number,
  expires_at: Schema.optional(Schema.Number),
  token_type: Schema.String,
  user: UserSchema
})

/** @Type.Effect.Auth.AuthState */
export const AuthStateSchema = Schema.Struct({
  user: Schema.optional(UserSchema),
  session: Schema.optional(SessionSchema),
  isLoading: Schema.Boolean,
  isAuthenticated: Schema.Boolean
})

export type User = Schema.Schema.Type<typeof UserSchema>
export type Profile = Schema.Schema.Type<typeof ProfileSchema>
export type Session = Schema.Schema.Type<typeof SessionSchema>
export type AuthState = Schema.Schema.Type<typeof AuthStateSchema>
```

### [Governance]
- **Schema_Law:** Utilizes `@effect/schema` for compile-time generation and runtime validation of core authentication entities.
- **Supabase_Sync_Law:** The structure mirrors Supabase JWT payloads (`User`, `Session`) and public row shapes (`Profile`), ensuring predictable ingestion down the data flow.

### [Semantic Hash]
Strongly-typed deterministic effect-schema variants for Supabase Authentication and Profile entities. Serves as the validation barrier between the Remote Postgres Context and Local UI state.

### [Linkage]
- **Dependencies:** `effect/Schema`

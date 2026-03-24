/** @Type.Api.Validation.Schemas */
import * as S from "effect/Schema"

export const MessageRoleSchema = S.Literal("system", "user", "assistant")
export type MessageRole = S.Schema.Type<typeof MessageRoleSchema>

export const MessageSchema = S.Struct({
  role: MessageRoleSchema,
  content: S.String,
  name: S.optional(S.String)
})

export type Message = S.Schema.Type<typeof MessageSchema>

export const UuidSchema = S.String.pipe(
  S.filter((s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s), { message: () => "Invalid UUID format" })
)

export type Uuid = S.Schema.Type<typeof UuidSchema>

export const NonEmptyStringSchema = S.String.pipe(
  S.filter((s: string) => s.trim().length > 0, { message: () => "String cannot be empty" })
)

export type NonEmptyString = S.Schema.Type<typeof NonEmptyStringSchema>

export const PositiveIntSchema = S.Number.pipe(
  S.filter((n: number) => Number.isInteger(n) && n > 0, { message: () => "Must be a positive integer" })
)

export type PositiveInt = S.Schema.Type<typeof PositiveIntSchema>

export const PaginationSchema = S.Struct({
  page: S.optional(PositiveIntSchema),
  limit: S.optional(
    S.Number.pipe(
      S.filter((n: number) => Number.isInteger(n) && n >= 1 && n <= 100, { message: () => "Limit must be between 1 and 100" })
    )
  )
})

export type Pagination = S.Schema.Type<typeof PaginationSchema>

export { S }

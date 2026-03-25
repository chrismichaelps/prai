/** @Type.Api.ServiceErrors */
import { Data } from "effect"

export class IssueDbError extends Data.TaggedError("IssueDbError")<{
  readonly error: unknown
}> {}

export class NotificationDbError extends Data.TaggedError("NotificationDbError")<{
  readonly error: unknown
}> {}

export class UsersDbError extends Data.TaggedError("UsersDbError")<{
  readonly error: unknown
}> {}

export class ChatDbError extends Data.TaggedError("ChatDbError")<{
  readonly error: unknown
}> {}

export class AccountDbError extends Data.TaggedError("AccountDbError")<{
  readonly error: unknown
}> {}

import { Schema } from "effect"

/** @Type.Effect.Issue.Status */
export const IssueStatus = Schema.Literal("open", "in_progress", "closed")
export type IssueStatus = Schema.Schema.Type<typeof IssueStatus>

/** @Type.Effect.Issue.Label */
export const IssueLabel = Schema.Literal("bug", "feature", "question", "docs")
export type IssueLabel = Schema.Schema.Type<typeof IssueLabel>

/** @Type.Effect.Issue.Comment */
export const IssueCommentSchema = Schema.Struct({
  id: Schema.String,
  issue_id: Schema.String,
  user_id: Schema.String,
  body: Schema.String,
  is_admin_reply: Schema.Boolean,
  created_at: Schema.String,
  deleted_at: Schema.optional(Schema.String),
  author: Schema.optional(
    Schema.Struct({
      display_name: Schema.optional(Schema.String),
      avatar_url: Schema.optional(Schema.String),
      is_admin: Schema.optional(Schema.Boolean),
    })
  ),
})
export type IssueComment = Schema.Schema.Type<typeof IssueCommentSchema>

/** @Type.Effect.Issue */
export const IssueSchema = Schema.Struct({
  id: Schema.String,
  user_id: Schema.String,
  title: Schema.String,
  body: Schema.optional(Schema.String),
  status: IssueStatus,
  label: Schema.optional(IssueLabel),
  is_pinned: Schema.Boolean,
  upvotes: Schema.Number,
  created_at: Schema.String,
  updated_at: Schema.String,
  author: Schema.optional(
    Schema.Struct({
      display_name: Schema.optional(Schema.String),
      avatar_url: Schema.optional(Schema.String),
      is_admin: Schema.optional(Schema.Boolean),
    })
  ),
  comments: Schema.optional(Schema.Array(IssueCommentSchema)),
  user_has_upvoted: Schema.optional(Schema.Boolean),
  comment_count: Schema.optional(Schema.Number),
})
export type Issue = Schema.Schema.Type<typeof IssueSchema>

/** @Type.Effect.Issue.CreateInput */
export const CreateIssueSchema = Schema.Struct({
  title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(120)),
  body: Schema.optional(Schema.String),
  label: Schema.optional(IssueLabel),
})
export type CreateIssueInput = Schema.Schema.Type<typeof CreateIssueSchema>

/** @Type.Effect.Issue.UpdateInput */
export const UpdateIssueSchema = Schema.Struct({
  status: Schema.optional(IssueStatus),
  label: Schema.optional(IssueLabel),
  is_pinned: Schema.optional(Schema.Boolean),
  title: Schema.optional(Schema.String.pipe(Schema.minLength(1), Schema.maxLength(120))),
  body: Schema.optional(Schema.String),
})
export type UpdateIssueInput = Schema.Schema.Type<typeof UpdateIssueSchema>

/** @Type.Effect.Issue.CreateCommentInput */
export const CreateCommentSchema = Schema.Struct({
  body: Schema.String.pipe(Schema.minLength(1)),
})
export type CreateCommentInput = Schema.Schema.Type<typeof CreateCommentSchema>

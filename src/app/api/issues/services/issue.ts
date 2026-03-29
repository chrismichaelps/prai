import { Effect, pipe } from "effect"
import { createClient } from "@/lib/supabase/server"
import { UuidSchema, NonEmptyStringSchema, S } from "@/app/api/_lib/validation/common"
import { IssueDbError } from "@/app/api/_lib/errors/services"

export { IssueDbError }
export type IssueServiceError = IssueDbError

const MentionDispatchSchema = S.Struct({
  commentId: S.optional(UuidSchema),
  issueId: UuidSchema,
  actorId: UuidSchema,
  body: NonEmptyStringSchema,
})

type MentionDispatchParams = S.Schema.Type<typeof MentionDispatchSchema>

/** @Logic.Issues.ListQuery */
interface ListIssuesOptions {
  status?: string
  label?: string
  userId?: string | null
  page: number
  limit: number
}

/** @Logic.Issues.Service */
export const issueService = {

  /** @Logic.Api.Issues.List */
  listIssues: ({ status, label, userId, page, limit }: ListIssuesOptions) => {
    const from = (page - 1) * limit
    const to = from + limit - 1
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()

          const resolvedUserId = userId === "me" ? user?.id : userId

          let query = supabase
            .from("issues")
            .select(`
              id, user_id, title, status, label, is_pinned, upvotes, created_at, updated_at,
              author:profiles!issues_user_id_fkey(display_name, avatar_url),
              comment_count:issue_comments(count)
            `, { count: "exact" })
            .order("is_pinned", { ascending: false })
            .order("created_at", { ascending: false })
            .range(from, to)

          if (status) query = query.eq("status", status)
          if (label) query = query.eq("label", label)
          if (resolvedUserId) query = query.eq("user_id", resolvedUserId)

          const { data, error, count } = await query
          if (error) throw new IssueDbError({ error })

          let upvotedIds = new Set<string>()
          if (user && data?.length) {
            const ids = data.map((i: { id: string }) => i.id)
            const { data: upvotes } = await supabase
              .from("issue_upvotes")
              .select("issue_id")
              .eq("user_id", user.id)
              .in("issue_id", ids)
            if (upvotes) upvotedIds = new Set(upvotes.map((u: { issue_id: string }) => u.issue_id))
          }

          const issues = (data ?? []).map((issue: Record<string, unknown>) => ({
            ...issue,
            comment_count: (issue.comment_count as { count: number }[])?.[0]?.count ?? 0,
            user_has_upvoted: upvotedIds.has(issue.id as string),
          }))

          return { issues, total: count ?? 0, page, limit }
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    )
  },

  /** @Logic.Issues.Create */
  createIssue: (userId: string, title: string, body?: string, label?: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("issues")
            .insert({ user_id: userId, title: title.trim(), body, label: label ?? null })
            .select()
            .single()

          if (error) throw new IssueDbError({ error })

          // mention notification dispatch for issue body
          if (data?.id && body) {
            Effect.runFork(
              issueService.dispatchMentionNotifications(
                null,
                data.id,
                userId,
                body
              )
            )
          }

          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.Detail */
  getIssueById: (id: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()

          const { data, error } = await supabase
            .from("issues")
            .select(`
              *,
              author:profiles!issues_user_id_fkey(display_name, avatar_url, is_admin),
              comments:issue_comments(
                id, user_id, body, is_admin_reply, created_at, deleted_at,
                author:profiles!issue_comments_user_id_fkey(display_name, avatar_url, is_admin)
              )
            `)
            .eq("id", id)
            .order("created_at", { referencedTable: "issue_comments", ascending: true })
            .single()

          if (error) throw new IssueDbError({ error })

          let user_has_upvoted = false
          if (user) {
            const { data: upvote } = await supabase
              .from("issue_upvotes")
              .select("issue_id")
              .eq("issue_id", id)
              .eq("user_id", user.id)
              .maybeSingle()
            user_has_upvoted = !!upvote
          }

          return { ...data, user_has_upvoted }
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.Update */
  updateIssue: (
    id: string,
    userId: string,
    updates: { title?: string; body?: string; status?: string; label?: string; is_pinned?: boolean }
  ) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("issues")
            .update(updates)
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single()
          if (error) throw new IssueDbError({ error })
          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.Delete */
  deleteIssue: (id: string, userId: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { error } = await supabase
            .from("issues")
            .delete()
            .eq("id", id)
            .eq("user_id", userId)
          if (error) throw new IssueDbError({ error })
          return { success: true }
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.AddComment */
  addComment: (issueId: string, userId: string, body: string, isAdminReply: boolean) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("issue_comments")
            .insert({ issue_id: issueId, user_id: userId, body: body.trim(), is_admin_reply: isAdminReply })
            .select(`
              id, issue_id, user_id, body, is_admin_reply, created_at, deleted_at,
              author:profiles!issue_comments_user_id_fkey(display_name, avatar_url, is_admin)
            `)
            .single()
          if (error) throw new IssueDbError({ error })

          // mention notification dispatch never blocks the HTTP response
          if (data?.id) {
            Effect.runFork(
              issueService.dispatchMentionNotifications(
                data.id,
                issueId,
                userId,
                body
              )
            )
          }

          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.UpdateComment */
  updateComment: (commentId: string, userId: string, body: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          
          const { data: existing, error: fetchError } = await supabase
            .from("issue_comments")
            .select("user_id")
            .eq("id", commentId)
            .single()
          
          if (fetchError || !existing) {
            throw new IssueDbError({ error: "Comment not found" })
          }
          
          if (existing.user_id !== userId) {
            throw new IssueDbError({ error: "Not authorized to edit this comment" })
          }

          const { data, error } = await supabase
            .from("issue_comments")
            .update({ body: body.trim() })
            .eq("id", commentId)
            .select(`
              id, issue_id, user_id, body, is_admin_reply, created_at, deleted_at,
              author:profiles!issue_comments_user_id_fkey(display_name, avatar_url, is_admin)
            `)
            .single()
          
          if (error) throw new IssueDbError({ error })
          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.DeleteComment - Soft delete, keeps mentions & notifications */
  deleteComment: (commentId: string, userId: string, isAdmin: boolean) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          
          const { data: existing, error: fetchError } = await supabase
            .from("issue_comments")
            .select("user_id, deleted_at")
            .eq("id", commentId)
            .single()
          
          if (fetchError || !existing) {
            throw new IssueDbError({ error: "Comment not found" })
          }
          
          if (existing.deleted_at) {
            throw new IssueDbError({ error: "Comment already deleted" })
          }
          
          if (existing.user_id !== userId && !isAdmin) {
            throw new IssueDbError({ error: "Not authorized to delete this comment" })
          }

          const { data, error } = await supabase
            .from("issue_comments")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", commentId)
            .select(`
              id, issue_id, user_id, body, is_admin_reply, created_at, deleted_at,
              author:profiles!issue_comments_user_id_fkey(display_name, avatar_url, is_admin)
            `)
            .single()
          
          if (error) throw new IssueDbError({ error })
          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.MentionDispatch */
  dispatchMentionNotifications: (
    commentId: string | null,
    issueId: string,
    actorId: string,
    body: string
  ): Effect.Effect<void, IssueDbError> =>
    pipe(
      Effect.try({
        try: () => {
          const params: MentionDispatchParams = {
            commentId: commentId ?? undefined,
            issueId,
            actorId,
            body,
          }
          return S.decodeSync(MentionDispatchSchema)(params)
        },
        catch: (e) => new IssueDbError({ error: e }),
      }),
      Effect.flatMap((validated) =>
        Effect.sync(() => {
          const bodyText = validated.body ?? ''
          const mentionMatches = bodyText.matchAll(/\B@([a-z0-9_-]+)/gi)
          const mentions = [...new Set([...mentionMatches].map((m) => m[1]?.toLowerCase() ?? '').filter(Boolean))]
          return { mentions, validated }
        })
      ),
      Effect.filterOrFail(
        ({ mentions }) => mentions.length > 0,
        () => new IssueDbError({ error: "No mentions found" })
      ),
      Effect.flatMap(({ mentions, validated }) =>
        Effect.tryPromise({
          try: async () => {
            const supabase = await createClient()
            const { data: profiles, error: profileError } = await supabase
              .from("profiles")
              .select("id")
              .in("handle", mentions)

            if (profileError) throw profileError

            const recipientIds = (profiles ?? [])
              .map((p) => p.id)
              .filter((id) => id !== validated.actorId)

            if (recipientIds.length === 0) return

            const { error: notificationError } = await supabase
              .from("notifications")
              .insert(
                recipientIds.map((recipient_id) => ({
                  type: "mention" as const,
                  recipient_id,
                  actor_id: validated.actorId,
                  issue_id: validated.issueId,
                  comment_id: validated.commentId,
                }))
              )

            if (notificationError) throw notificationError
          },
          catch: (e) => new IssueDbError({ error: e }),
        })
      ),
      Effect.catchAll((error) =>
        Effect.sync(() => {
          console.error("[notifications] mention dispatch failed", error)
        })
      )
    ),

  /** @Logic.Issues.SearchProfiles */
  searchProfiles: (q: string, excludeUserId: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data, error } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .ilike("display_name", `%${q}%`)
            .neq("id", excludeUserId)
            .order("display_name")
            .limit(10)
          if (error) throw new IssueDbError({ error })
          return data ?? []
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.ToggleUpvote */
  toggleUpvote: (issueId: string, userId: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data: existing } = await supabase
            .from("issue_upvotes")
            .select("issue_id")
            .eq("issue_id", issueId)
            .eq("user_id", userId)
            .maybeSingle()

          if (existing) {
            const { error } = await supabase
              .from("issue_upvotes")
              .delete()
              .eq("issue_id", issueId)
              .eq("user_id", userId)
            if (error) throw new IssueDbError({ error })
            return { upvoted: false }
          } else {
            const { error } = await supabase
              .from("issue_upvotes")
              .insert({ issue_id: issueId, user_id: userId })
            if (error) throw new IssueDbError({ error })
            return { upvoted: true }
          }
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),

  /** @Logic.Issues.GetProfile */
  getProfile: (userId: string) =>
    pipe(
      Effect.tryPromise({
        try: async () => {
          const supabase = await createClient()
          const { data } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", userId)
            .single()
          return data
        },
        catch: (e) => new IssueDbError({ error: e }),
      })
    ),
}

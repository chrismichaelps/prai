'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bug,
  ChevronUp,
  Circle,
  FileText,
  HelpCircle,
  ArrowLeft,
  Lightbulb,
  Loader2,
  Pin,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MentionInput } from '@/components/mentions/MentionInput'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import { cn, timeAgo } from '@/lib/utils'
import MarkdownIt from 'markdown-it'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchIssueDetail,
  toggleUpvote,
  updateIssueStatus,
  addComment,
  updateComment,
  deleteComment,
  clearDetail,
  deleteIssue,
} from '@/store/slices/issuesSlice'
import type { IssueComment } from '@/store/slices/issuesSlice'
import type { Issue } from '@/lib/effect/schemas/IssueSchema'

/** @Logic.Issues.Detail.Markdown */
const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

function highlightMentions(content: string): string {
  return content.replace(
    /@([a-zA-Z0-9_-]+)/g,
    '<span class="mention">@$1</span>',
  )
}

/** @Logic.Issues.Detail.Constants */
const LABEL_META: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  bug: { icon: Bug, color: 'text-red-400', bg: 'bg-red-400/10' },
  feature: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  question: { icon: HelpCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  docs: { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10' },
}

const STATUS_COLORS: Record<string, string> = {
  open: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  in_progress: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  closed: 'text-white/30 bg-white/5 border-white/10',
}

function Avatar({
  name,
  url,
  size = 7,
}: {
  name?: string
  url?: string
  size?: number
}) {
  const initials = (name ?? '?')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0 relative border border-white/10`}
    >
      {url ? (
        <Image src={url} alt={name ?? ''} fill className="object-cover" />
      ) : (
        <span className="text-white text-[10px] font-bold">{initials}</span>
      )}
    </div>
  )
}

function MarkdownBody({ content }: { content: string }) {
  const rendered = md.render(content)
  const withMentions = highlightMentions(rendered)
  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-white/70"
      dangerouslySetInnerHTML={{ __html: withMentions }}
    />
  )
}

function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}

/** @Logic.Issues.Detail.Context */
interface IssueDetailContextValue {
  issueId: string
  issue: Issue
}
const IssueDetailContext = createContext<IssueDetailContextValue | null>(null)
function useIssueDetail() {
  const ctx = useContext(IssueDetailContext)
  if (!ctx) throw new Error('Must be inside IssueDetail')
  return ctx
}

/** @Logic.Issues.Detail.Root */
function IssueDetailRoot({
  issueId,
  children,
}: {
  issueId: string
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentIssue, detailLoading, detailError } = useAppSelector(
    (s) => s.issues,
  )

  useEffect(() => {
    dispatch(fetchIssueDetail(issueId))
    return () => {
      dispatch(clearDetail())
    }
  }, [issueId, dispatch])

  useEffect(() => {
    if (detailError) router.push('/issues')
  }, [detailError, router])

  const comments = useAppSelector((s) => s.issues.comments)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scrollToHash = () => {
        const hash = window.location.hash.slice(1)
        if (hash) {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            el.classList.add('ring-2', 'ring-yellow-400/50')
            setTimeout(
              () => el.classList.remove('ring-2', 'ring-yellow-400/50'),
              2000,
            )
          }
        }
      }

      if (comments.length > 0) {
        scrollToHash()
      } else {
        const timer = setTimeout(scrollToHash, 500)
        return () => clearTimeout(timer)
      }
    }
  }, [comments])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('ring-2', 'ring-yellow-400/50')
          setTimeout(
            () => el.classList.remove('ring-2', 'ring-yellow-400/50'),
            2000,
          )
        }
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (detailLoading || !currentIssue) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    )
  }

  return (
    <IssueDetailContext.Provider value={{ issueId, issue: currentIssue }}>
      {children}
    </IssueDetailContext.Provider>
  )
}

/** @Logic.Issues.Detail.Header */
function IssueDetailHeader() {
  const { t } = useI18n()
  const { issue } = useIssueDetail()
  const author = issue.author as
    | { display_name?: string; avatar_url?: string; is_admin?: boolean }
    | undefined
  const labelMeta = issue.label ? LABEL_META[issue.label] : null
  const LabelIcon = labelMeta?.icon

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {issue.is_pinned && (
          <span className="flex items-center gap-1 text-yellow-400/80 text-[10px] font-bold uppercase tracking-wider">
            <Pin className="w-2.5 h-2.5" /> {t('issues.pinned')}
          </span>
        )}
        {labelMeta && LabelIcon && (
          <span
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
              labelMeta.bg,
              labelMeta.color,
            )}
          >
            <LabelIcon className="w-3.5 h-3.5" />
            {t(`issues.label.${issue.label}` as 'issues.label.bug')}
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
            STATUS_COLORS[issue.status],
          )}
        >
          <Circle className="w-1.5 h-1.5 fill-current" />
          {t(`issues.${issue.status}` as 'issues.open')}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
        {issue.title}
      </h1>

      <div className="flex items-center gap-3">
        <Avatar name={author?.display_name} url={author?.avatar_url} size={6} />
        <span className="text-sm text-white/40">
          {t('issues.opened_by')}{' '}
          <span className="text-white/60 font-medium">
            {author?.display_name ?? 'User'}
          </span>
          {' · '}
          {timeAgo(issue.created_at)}
        </span>
      </div>
    </div>
  )
}

/** @Logic.Issues.Detail.Body */
function IssueDetailBody() {
  const { issue } = useIssueDetail()
  if (!issue.body) return null
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-5 mb-8">
      <MarkdownBody content={issue.body} />
    </div>
  )
}

/** @Logic.Issues.Detail.Actions */
function IssueDetailActions() {
  const { t } = useI18n()
  const { user } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { issue, issueId } = useIssueDetail()
  const { upvoting, updatingStatus } = useAppSelector((s) => s.issues)

  const isOwner = user?.id === issue.user_id

  const handleDelete = async () => {
    if (!window.confirm(t('issues.confirm_delete'))) {
      return
    }
    const result = await dispatch(deleteIssue({ issueId }))
    if (deleteIssue.fulfilled.match(result)) {
      router.push('/issues')
    }
  }

  return (
    <div className="flex items-center gap-3 mb-10">
      <button
        onClick={() => dispatch(toggleUpvote(issueId))}
        disabled={!user || upvoting}
        title={!user ? t('issues.login_to_upvote') : undefined}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all',
          issue.user_has_upvoted
            ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400'
            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white',
          !user && 'opacity-40 cursor-not-allowed',
        )}
      >
        {upvoting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5" />
        )}
        {issue.upvotes} {t('issues.upvotes')}
      </button>

      {user && isOwner && (
        <div className="flex gap-2 ml-auto">
          {issue.status === 'open' && (
            <button
              disabled={updatingStatus}
              onClick={() =>
                dispatch(updateIssueStatus({ issueId, status: 'in_progress' }))
              }
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/20 transition disabled:opacity-50"
            >
              {t('issues.mark_in_progress')}
            </button>
          )}
          {issue.status !== 'closed' && (
            <button
              disabled={updatingStatus}
              onClick={() =>
                dispatch(updateIssueStatus({ issueId, status: 'closed' }))
              }
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              {t('issues.close_issue')}
            </button>
          )}
          {issue.status === 'closed' && (
            <button
              disabled={updatingStatus}
              onClick={() =>
                dispatch(updateIssueStatus({ issueId, status: 'open' }))
              }
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
            >
              {t('issues.reopen_issue')}
            </button>
          )}

          {isOwner && (
            <button
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** @Logic.Issues.Detail.Comment */
function IssueDetailComment({ comment }: { comment: IssueComment }) {
  const { t } = useI18n()
  const { user, profile } = useAuth()
  const dispatch = useAppDispatch()
  const { issueId } = useIssueDetail()
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [saving, setSaving] = useState(false)

  const isDeleted = Boolean((comment as { deleted_at?: string }).deleted_at)
  const isAuthor = user?.id === comment.user_id
  const isAdmin = profile?.is_admin === true
  const canDelete = (isAuthor || isAdmin) && !isDeleted

  const handleSave = async () => {
    if (!editBody.trim() || editBody === comment.body) {
      setIsEditing(false)
      return
    }
    setSaving(true)
    const result = await dispatch(
      updateComment({ issueId, commentId: comment.id, body: editBody }),
    )
    if (updateComment.fulfilled.match(result)) {
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleCancel = () => {
    setEditBody(comment.body)
    setIsEditing(false)
  }

  return (
    <motion.div
      id={`comment-${comment.id}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border p-4 transition-all',
        comment.is_admin_reply
          ? 'border-yellow-400/20 bg-yellow-400/5'
          : 'border-white/5 bg-white/[0.02]',
      )}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar
          name={comment.author?.display_name}
          url={comment.author?.avatar_url}
          size={6}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {comment.author?.display_name ?? 'User'}
            </span>
            {comment.author?.is_admin && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                {t('auth.role_admin')}
              </span>
            )}
            {comment.is_admin_reply && !comment.author?.is_admin && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400/80 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                {t('issues.admin_reply')}
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/30">
            {isDeleted ? t('issues.deleted') : timeAgo(comment.created_at)}
          </span>
        </div>
        {canDelete && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              {t('common.edit')}
            </button>
            <button
              onClick={async () => {
                if (
                  confirm(
                    t('issues.confirm_delete_comment') ||
                      'Delete this comment?',
                  )
                ) {
                  await dispatch(
                    deleteComment({ issueId, commentId: comment.id }),
                  )
                }
              }}
              className="text-white/30 hover:text-red-400 text-xs transition-colors"
            >
              {t('common.delete') || 'Delete'}
            </button>
          </div>
        )}
      </div>
      {isDeleted ? (
        <p className="text-white/30 italic text-sm">{t('issues.comment_deleted') || 'This comment was deleted'}</p>
      ) : isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 text-sm focus:outline-none focus:border-yellow-400/50 resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !editBody.trim()}
              className="px-3 py-1.5 bg-yellow-400 text-black text-xs font-medium rounded-lg hover:bg-yellow-300 transition disabled:opacity-40"
            >
              {saving ? t('common.saving') || 'Saving...' : t('common.save') || 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-3 py-1.5 text-white/40 text-xs hover:text-white/70 transition disabled:opacity-40"
            >
              {t('common.cancel') || 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <MarkdownBody content={comment.body} />
      )}
    </motion.div>
  )
}

/** @Logic.Issues.Detail.CommentList */
function IssueDetailCommentList() {
  const { t } = useI18n()
  const comments = useAppSelector((s) => s.issues.comments)

  return (
    <div className="space-y-3 mb-6">
      <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
        {comments.length}{' '}
        {comments.length === 1 ? t('issues.comment') : t('issues.comments')}
      </h2>
      {comments.map((comment) => (
        <IssueDetailComment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

/** @Logic.Issues.Detail.CommentComposer */
function IssueDetailCommentComposer() {
  const { t } = useI18n()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { issueId } = useIssueDetail()
  const submittingComment = useAppSelector((s) => s.issues.submittingComment)
  const [body, setBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  if (!user) {
    return (
      <div className="text-center py-6 text-xs text-white/30 italic border border-white/5 rounded-2xl backdrop-blur-sm">
        {t('issues.sign_in_to_post')}
      </div>
    )
  }

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const userName =
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'User'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    const result = await dispatch(addComment({ issueId, body }))
    if (addComment.fulfilled.match(result)) {
      setBody('')
      setShowPreview(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex items-start gap-3">
      {/* Author avatar */}
      <div className="flex-shrink-0 pt-0.5">
        <Avatar name={userName} url={avatarUrl} size={8} />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-white/10 pb-1">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors',
              !showPreview
                ? 'text-white bg-white/10'
                : 'text-white/40 hover:text-white/70',
            )}
          >
            {t('issues.write') || 'Write'}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!body.trim()}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors',
              showPreview
                ? 'text-white bg-white/10'
                : 'text-white/40 hover:text-white/70 disabled:opacity-30',
            )}
          >
            {t('issues.preview') || 'Preview'}
          </button>
        </div>

        {/* Editor / Preview */}
        {showPreview ? (
          <div className="min-h-[100px] p-3 rounded-xl border border-white/10 bg-white/[0.02] prose prose-invert prose-sm max-w-none">
            {body.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: md.render(body) }} />
            ) : (
              <p className="text-white/30 italic">
                {t('issues.nothing_to_preview') || 'Nothing to preview'}
              </p>
            )}
          </div>
        ) : (
          <MentionInput
            value={body}
            onChange={setBody}
            rows={3}
            placeholder={t('issues.comment_placeholder')}
          />
        )}

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/20">
            {t('issues.markdown_supported')}
          </span>
          <button
            type="submit"
            disabled={submittingComment || !body.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition disabled:opacity-40"
          >
            {submittingComment ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {t('issues.submit_comment')}
          </button>
        </div>
      </div>
    </form>
  )
}

/** @Logic.Issues.Detail.Assignment */
const IssueDetail = Object.assign(IssueDetailRoot, {
  Header: IssueDetailHeader,
  Body: IssueDetailBody,
  Actions: IssueDetailActions,
  CommentList: IssueDetailCommentList,
  Comment: IssueDetailComment,
  CommentComposer: IssueDetailCommentComposer,
})

/** @Logic.Issues.Detail.Page */
export function IssueDetailClient({ issueId }: { issueId: string }) {
  const { t } = useI18n()

  return (
    <IssueDetail issueId={issueId}>
      <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
        <Background />

        <div className="relative z-10 flex flex-col min-h-screen font-body">
          <Header transparent={true} variant="issues" />

          <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
            <div className="max-w-3xl">
              <Link
                href="/issues"
                className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 mb-8 transition group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                {t('issues.back')}
              </Link>

              <IssueDetail.Header />
              <IssueDetail.Body />
              <IssueDetail.Actions />

              <div className="mb-8">
                <IssueDetail.CommentList />
                <IssueDetail.CommentComposer />
              </div>
            </div>
          </section>

          <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
        </div>
      </main>
    </IssueDetail>
  )
}

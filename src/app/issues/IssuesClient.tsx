'use client'

import React, { createContext, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bug,
  ChevronUp,
  Circle,
  FileText,
  Filter,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  Pin,
  Plus,
  Send,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MentionInput } from '@/components/mentions/MentionInput'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import { cn, timeAgo } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchIssues,
  createIssue,
  setFilter,
  setShowNewForm,
  toggleUpvote,
} from '@/store/slices/issuesSlice'
import type { IssueFilter } from '@/store/slices/issuesSlice'
import type { Issue, IssueLabel } from '@/lib/effect/schemas/IssueSchema'
import { useState } from 'react'

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
    .map((n) => n[0])
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

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border',
        STATUS_COLORS[status],
      )}
    >
      <Circle className="w-1.5 h-1.5 fill-current" />
      {t(`issues.${status}` as 'issues.open')}
    </span>
  )
}

function LabelBadge({ label }: { label: string }) {
  const { t } = useI18n()
  const meta = LABEL_META[label]
  if (!meta) return null
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold',
        meta.bg,
        meta.color,
      )}
    >
      <Icon className="w-3 h-3" />
      {t(`issues.label.${label}` as 'issues.label.bug')}
    </span>
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

/** @Logic.Issues.List.Context */
interface IssueListContextValue {
  refresh: () => void
}
const IssueListContext = createContext<IssueListContextValue | null>(null)

/** @Logic.Issues.List.Root */
function IssueListRoot({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { filter, page } = useAppSelector((s) => s.issues)

  const refresh = useCallback(() => {
    dispatch(fetchIssues({ filter, page }))
  }, [dispatch, filter, page])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <IssueListContext.Provider value={{ refresh }}>
      {children}
    </IssueListContext.Provider>
  )
}

/** @Logic.Issues.List.Filters */
function IssueListFilters() {
  const { t } = useI18n()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const filter = useAppSelector((s) => s.issues.filter)

  const statuses = [
    { key: '', label: t('issues.all') },
    { key: 'open', label: t('issues.open') },
    { key: 'in_progress', label: t('issues.in_progress') },
    { key: 'closed', label: t('issues.closed') },
  ]

  function updateFilter(patch: Partial<IssueFilter>) {
    dispatch(setFilter({ ...filter, ...patch }))
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <Filter className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
      {statuses.map((s) => (
        <button
          key={s.key}
          onClick={() => updateFilter({ status: s.key || undefined })}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
            (filter.status ?? '') === s.key
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white',
          )}
        >
          {s.label}
        </button>
      ))}
      {user && (
        <button
          onClick={() => updateFilter({ mine: !filter.mine })}
          className={cn(
            'ml-auto px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
            filter.mine
              ? 'bg-white text-black'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white',
          )}
        >
          {t('issues.mine')}
        </button>
      )}
    </div>
  )
}

/** @Logic.Issues.List.Card */
function IssueListCard({ issue }: { issue: Issue }) {
  const { t } = useI18n()
  const author = issue.author as
    | { display_name?: string; avatar_url?: string }
    | undefined
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return
    dispatch(toggleUpvote(issue.id))
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col sm:flex-row sm:items-start gap-5 p-5 md:p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer backdrop-blur-xl"
    >
      <div className="flex sm:flex-col items-center gap-2 sm:gap-1 flex-shrink-0 min-w-[2rem] text-center">
        <button
          onClick={handleUpvote}
          className={cn(
            'p-1.5 rounded-lg transition-all',
            issue.user_has_upvoted
              ? 'bg-yellow-400/10 text-yellow-400'
              : 'text-white/20 hover:text-white/60 hover:bg-white/5',
          )}
        >
          <ChevronUp className="w-5 h-5 flex-shrink-0" />
        </button>
        <span
          className={cn(
            'text-xs font-bold w-full',
            issue.user_has_upvoted ? 'text-yellow-400' : 'text-white/40',
          )}
        >
          {issue.upvotes}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {issue.is_pinned && (
            <span className="flex items-center gap-1 text-yellow-400/80 text-[10px] font-bold uppercase tracking-wider">
              <Pin className="w-2.5 h-2.5" />
              {t('issues.pinned')}
            </span>
          )}
          {issue.label && <LabelBadge label={issue.label} />}
          <StatusBadge status={issue.status} />
        </div>
        <h3 className="text-sm font-semibold text-white group-hover:text-white/90 truncate leading-snug mb-1.5">
          {issue.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <div className="flex items-center gap-1.5">
            <Avatar
              name={author?.display_name}
              url={author?.avatar_url}
              size={4}
            />
            <span>{author?.display_name ?? 'User'}</span>
          </div>
          <span>{timeAgo(issue.created_at)}</span>
          {(issue.comment_count ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {issue.comment_count}{' '}
              {issue.comment_count === 1
                ? t('issues.comment')
                : t('issues.comments')}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/** @Logic.Issues.List.Items */
function IssueListItems() {
  const { t } = useI18n()
  const { issues, listLoading } = useAppSelector((s) => s.issues)

  if (listLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-20 space-y-1">
        <p className="text-white/20 text-sm">{t('issues.no_issues')}</p>
        <p className="text-white/10 text-xs">{t('issues.be_first')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      {issues.map((issue) => (
        <Link key={issue.id} href={`/issues/${issue.id}`} className="block focus:outline-none transition-transform active:scale-[0.99]">
          <IssueListCard issue={issue} />
        </Link>
      ))}
    </div>
  )
}

/** @Logic.Issues.List.NewForm */
function IssueListNewForm({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { filter, page } = useAppSelector((s) => s.issues)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [label, setLabel] = useState<IssueLabel | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const userName =
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'User'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError(t('issues.new_title'))
      return
    }
    setSubmitting(true)
    setError('')
    const result = await dispatch(
      createIssue({ title, body, label: label || undefined }),
    )
    if (createIssue.rejected.match(result)) {
      setError(result.payload as string)
      setSubmitting(false)
      return
    }
    // refresh list after creation
    dispatch(fetchIssues({ filter, page }))
    onClose()
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6 backdrop-blur-2xl shadow-2xl"
    >
      {/* Author header */}
      <div className="flex items-center gap-3 mb-5">
        <Avatar name={userName} url={avatarUrl} size={8} />
        <div>
          <p className="text-sm font-semibold text-white leading-tight">
            {userName}
          </p>
          <p className="text-[11px] text-white/30">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
            {t('issues.new_title')}
          </label>
          <input
            type="text"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('issues.new_title_placeholder')}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition"
          />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
            {t('issues.new_body')}
          </label>
          <MentionInput
            rows={4}
            value={body}
            onChange={setBody}
            placeholder={t('issues.new_body_placeholder')}
          />
        </div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5 block">
              {t('issues.new_label')}
            </label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value as IssueLabel)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition"
            >
              <option value="" className="bg-[#111]">
                —
              </option>
              {(['bug', 'feature', 'question', 'docs'] as IssueLabel[]).map(
                (l) => (
                  <option key={l} value={l} className="bg-[#111]">
                    {t(`issues.label.${l}` as 'issues.label.bug')}
                  </option>
                ),
              )}
            </select>
          </div>
          <div className="flex gap-2 pb-0.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition"
            >
              {t('issues.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {t('issues.submit')}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </form>
    </motion.div>
  )
}

/** @Logic.Issues.List.Assignment */
const IssueList = Object.assign(IssueListRoot, {
  Filters: IssueListFilters,
  Items: IssueListItems,
  Card: IssueListCard,
  NewForm: IssueListNewForm,
})

/** @Logic.Issues.List.ActionBar */
function IssueListActionBar({ onToggleForm }: { onToggleForm: () => void }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const total = useAppSelector((s) => s.issues.total)

  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-xs text-white/20">
        {total} {total === 1 ? 'reporte' : 'reportes'}
      </span>
      {user ? (
        <button
          onClick={onToggleForm}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('issues.new')}
        </button>
      ) : (
        <span className="text-xs text-white/30 italic">
          {t('issues.sign_in_to_post')}
        </span>
      )}
    </div>
  )
}

/** @Logic.Issues.Page */
export function IssuesPage() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const showNewForm = useAppSelector((s) => s.issues.showNewForm)

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} variant="issues" />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <PraiLogo white size={18} animate />
              <span className="text-white/10 font-thin">|</span>
              <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest">
                {t('issues.title')}
              </span>
            </div>

            <div className="border-b border-white/5 pb-12 mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {t('issues.title')}
              </h1>
              <p className="text-[15px] text-white/40 font-medium font-body leading-relaxed">
                {t('issues.subtitle')}
              </p>
            </div>

            <IssueList>
              <IssueListActionBar
                onToggleForm={() => dispatch(setShowNewForm(!showNewForm))}
              />

              <AnimatePresence>
                {showNewForm && (
                  <IssueList.NewForm
                    onClose={() => dispatch(setShowNewForm(false))}
                  />
                )}
              </AnimatePresence>

              <IssueList.Filters />
              <IssueList.Items />
            </IssueList>
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
      </div>
    </main>
  )
}

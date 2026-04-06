'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertCircle, Globe } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useUsage } from '@/hooks/useUsage'
import type { UserUsage } from '@/hooks/useUsage'
import { TierBadge } from '@/components/usage/TierBadge'
import { cn } from '@/lib/utils'
import type { JinaUsage } from '@/app/api/user/usage/jina/route'

/** @Hook.Usage.Jina */
function useJinaUsage(isAuthenticated: boolean) {
  const [data, setData] = useState<JinaUsage | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  const fetch_ = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const res = await fetch('/api/user/usage/jina')
      if (res.ok) setData(await res.json())
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && !fetchedRef.current) {
      fetchedRef.current = true
      void fetch_()
    }
  }, [isAuthenticated, fetch_])

  return { data, loading }
}

/** @UI.Usage.Background */
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

/** @UI.Usage.ProgressBar */
function UsageBar({
  label,
  value,
  max,
  color = 'bg-brand-blue',
}: {
  label: string
  value: number
  max: number
  color?: string
}) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end text-sm">
        <span className="text-white/40 font-bold uppercase tracking-[0.1em] text-[10px]">
          {label}
        </span>
        <div className="flex items-baseline gap-1.5 font-black text-white">
          <span className="text-lg">{value}</span>
          <span className="text-white/20 font-medium text-xs">/ {max}</span>
        </div>
      </div>
      <div className="h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            type: 'spring',
            stiffness: 45,
            damping: 18,
            mass: 1.2,
            delay: 0.2,
          }}
          className={cn(
            'h-full rounded-full relative group shadow-[0_0_15px_rgba(255,255,255,0.05)]',
            color,
          )}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-shimmer" />
        </motion.div>
      </div>
    </div>
  )
}

/** @UI.Usage.StatCard */
function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-colors shadow-2xl relative overflow-hidden group"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {color && (
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]',
                color,
              )}
            />
          )}
          <span className="text-white/30 text-[11px] font-bold uppercase tracking-[0.1em]">
            {label}
          </span>
        </div>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      </div>

      {/* Subtle background glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
    </motion.div>
  )
}

/** @UI.Usage.Warning */
function UsageWarning() {
  const { t } = useI18n()
  const { usage, isAtWarning, isAtCritical } = useUsage()

  if (!usage || (!isAtWarning && !isAtCritical)) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-2xl mb-8',
        isAtCritical
          ? 'bg-red-500/10 border-red-500/20 text-red-400'
          : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
      )}
    >
      <div
        className={cn(
          'p-2 rounded-xl',
          isAtCritical ? 'bg-red-500/20' : 'bg-yellow-400/20',
        )}
      >
        <AlertCircle className="w-5 h-5 shrink-0" />
      </div>
      <div>
        <p className="font-bold text-sm tracking-tight">
          {isAtCritical ? t('usage.reached_limit') : t('usage.almost_limit')}
        </p>
        <p className="text-[11px] opacity-60 font-medium">
          {t('usage.daily_reset_notice')}
        </p>
      </div>
    </motion.div>
  )
}

/** @UI.Usage.JinaCard */
function JinaUsageCard({
  data,
  loading,
  locale,
  t,
}: {
  data: JinaUsage | null
  loading: boolean
  locale: string
  t: (key: string) => string
}) {
  if (loading && !data) {
    return (
      <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/5 border-t-white/30 rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const { searches_used, searches_remaining, daily_limit, reset_at } = data
  const percentage = Math.min((searches_used / daily_limit) * 100, 100)
  const barColor =
    percentage >= 90
      ? 'bg-red-500'
      : percentage >= 60
        ? 'bg-yellow-400'
        : 'bg-brand-blue'

  return (
    <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white/40" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {t('usage.web_search_title')}
            </h2>
            <p className="text-[11px] text-white/20 font-medium mt-0.5">
              {t('usage.web_search_description')}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'text-[10px] font-black px-2.5 py-1 rounded-lg border',
            percentage >= 90
              ? 'text-red-400 bg-red-400/10 border-red-400/20'
              : percentage >= 60
                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                : 'text-white bg-white/5 border-white/10',
          )}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end text-sm">
          <span className="text-white/40 font-bold uppercase tracking-[0.1em] text-[10px]">
            {t('usage.web_searches_used')}
          </span>
          <div className="flex items-baseline gap-1.5 font-black text-white">
            <span className="text-lg">{searches_used}</span>
            <span className="text-white/20 font-medium text-xs">
              / {daily_limit}
            </span>
          </div>
        </div>
        <div className="h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              type: 'spring',
              stiffness: 45,
              damping: 18,
              mass: 1.2,
              delay: 0.3,
            }}
            className={cn(
              'h-full rounded-full relative shadow-[0_0_15px_rgba(255,255,255,0.05)]',
              barColor,
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-shimmer" />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-white/20 flex items-center gap-2 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {t('usage.web_search_reset')}{' '}
          <span className="text-white/40">
            {reset_at
              ? new Date(reset_at).toLocaleString(locale, {
                  dateStyle: 'long',
                  timeStyle: 'short',
                  hour12: true,
                })
              : '-'}
          </span>
        </span>
        <div className="flex items-baseline gap-1 font-black text-white">
          <span className="text-base">{searches_remaining}</span>
          <span className="text-white/20 font-medium text-[10px] ml-1">
            {t('usage.web_searches_remaining')}
          </span>
        </div>
      </div>
    </div>
  )
}

/** @UI.Usage.DailyCostCard */
function DailyCostCard({
  usage,
  locale,
  t,
}: {
  usage: UserUsage
  locale: string
  t: (key: string) => string
}) {
  const { daily_cost_usd, daily_cost_budget_usd } = usage

  if (daily_cost_budget_usd <= 0) return null

  const percentage = Math.min(
    (daily_cost_usd / daily_cost_budget_usd) * 100,
    100,
  )
  const barColor =
    percentage >= 90
      ? 'bg-red-500'
      : percentage >= 60
        ? 'bg-yellow-400'
        : 'bg-brand-blue'

  return (
    <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-white/40 text-sm">$</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {t('usage.daily_cost_title')}
            </h2>
            <p className="text-[11px] text-white/20 font-medium mt-0.5">
              {t('usage.daily_cost_description')}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'text-[10px] font-black px-2.5 py-1 rounded-lg border',
            percentage >= 90
              ? 'text-red-400 bg-red-400/10 border-red-400/20'
              : percentage >= 60
                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                : 'text-white bg-white/5 border-white/10',
          )}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end text-sm">
          <span className="text-white/40 font-bold uppercase tracking-[0.1em] text-[10px]">
            {t('usage.daily_cost_used')}
          </span>
          <div className="flex items-baseline gap-1.5 font-black text-white">
            <span className="text-lg">${daily_cost_usd.toFixed(2)}</span>
            <span className="text-white/20 font-medium text-xs">
              / ${daily_cost_budget_usd.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="h-3 bg-white/5 border border-white/5 rounded-full overflow-hidden p-[3px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              type: 'spring',
              stiffness: 45,
              damping: 18,
              mass: 1.2,
              delay: 0.3,
            }}
            className={cn(
              'h-full rounded-full relative shadow-[0_0_15px_rgba(255,255,255,0.05)]',
              barColor,
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-shimmer" />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="text-white/20 flex items-center gap-2 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {t('usage.daily_cost_reset')}{' '}
          <span className="text-white/40">
            {usage.last_reset_date
              ? new Date(usage.last_reset_date).toLocaleString(locale, {
                  dateStyle: 'long',
                  timeStyle: 'short',
                  hour12: true,
                })
              : '-'}
          </span>
        </span>
        <div className="flex items-baseline gap-1 font-black text-white">
          <span className="text-base">
            ${(daily_cost_budget_usd - daily_cost_usd).toFixed(2)}
          </span>
          <span className="text-white/20 font-medium text-[10px] ml-1">
            {t('usage.daily_cost_budget')}
          </span>
        </div>
      </div>
    </div>
  )
}

/** @UI.Usage.Content */
function UsageContent() {
  const { locale, t } = useI18n()
  const { usage, loading, isAuthenticated } = useUsage()
  const { data: jinaData, loading: jinaLoading } = useJinaUsage(isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-2">
          {t('auth.sign_in')}
        </h2>
        <p className="text-white/30 text-[13px] max-w-xs px-4">
          {t('usage.sign_in_required')}
        </p>
      </div>
    )
  }

  if (loading && !usage) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!usage) return null

  const getBarColor = () => {
    if (usage.usage_percentage >= 90) return 'bg-red-500 shadow-red-500/20'
    if (usage.usage_percentage >= 70)
      return 'bg-yellow-400 shadow-yellow-400/20'
    return 'bg-white shadow-white/20'
  }

  return (
    <div className="space-y-6">
      <UsageWarning />

      <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {t('usage.title')}
            </h2>
            <TierBadge tier={usage.subscription_tier} />
          </div>
          <span
            className={cn(
              'text-[10px] font-black px-2.5 py-1 rounded-lg border',
              usage.usage_percentage >= 90
                ? 'text-red-400 bg-red-400/10 border-red-400/20'
                : usage.usage_percentage >= 70
                  ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                  : 'text-white bg-white/5 border-white/10',
            )}
          >
            {usage.usage_percentage.toFixed(0)}%
          </span>
        </div>

        <UsageBar
          label={t('usage.messages_used')}
          value={usage.messages_used}
          max={usage.messages_limit}
          color={getBarColor()}
        />

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[11px]">
          <span className="text-white/20 flex items-center gap-2 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {t('usage.last_reset')}{' '}
            <span className="text-white/40">
              {usage.last_reset_date
                ? new Date(usage.last_reset_date).toLocaleString(locale, {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    hour12: true,
                  })
                : '-'}
            </span>
          </span>
          <span className="text-white/20 flex items-center gap-2 font-medium">
            {t('usage.next_reset')}{' '}
            <span className="text-white/40">
              {usage.next_reset_date
                ? new Date(usage.next_reset_date).toLocaleString(locale, {
                    dateStyle: 'long',
                    timeStyle: 'short',
                    hour12: true,
                  })
                : '-'}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t('usage.remaining_label')}
          value={usage.messages_remaining}
          color="bg-white/20"
        />
        <StatCard
          label={t('usage.limit_label')}
          value={usage.messages_limit}
          color="bg-white/20"
        />
      </div>

      <JinaUsageCard
        data={jinaData}
        loading={jinaLoading}
        locale={locale}
        t={t}
      />

      <DailyCostCard usage={usage} locale={locale} t={t} />

      <div className="text-center pt-8">
        <Link
          href="/issues"
          className="inline-flex items-center gap-2 text-white/20 hover:text-white/40 text-[11px] font-bold uppercase tracking-wider transition-colors"
        >
          {t('usage.report_quota_issue')}
        </Link>
      </div>
    </div>
  )
}

/** @UI.Usage.Main */
export function UsagePage() {
  const { t } = useI18n()

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <PraiLogo white size={18} animate />
              <span className="text-white/10 font-thin">|</span>
              <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest">
                {t('usage.title')}
              </span>
            </div>

            <div className="border-b border-white/5 pb-12 mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {t('usage.title')}
              </h1>
              <p className="text-[15px] text-white/40 font-medium font-body leading-relaxed max-w-2xl">
                {t('usage.description')}
              </p>
            </div>

            <UsageContent />
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
      </div>
    </main>
  )
}

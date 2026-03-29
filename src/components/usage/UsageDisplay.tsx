'use client'

/** @UI.Usage.Display */

import React from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useUsage } from '@/hooks/useUsage'
import { cn } from '@/lib/utils'

interface UsageDisplayProps {
  className?: string
  showDetailed?: boolean
  compact?: boolean
}

export function UsageDisplay({ className, showDetailed = true, compact = false }: UsageDisplayProps) {
  const { t } = useI18n()
  const { usage, loading, isAtLimit, isAtWarning, isAtCritical, fetchUsage } = useUsage()

  React.useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  const getProgressColor = () => {
    if (!usage) return 'bg-brand-blue'
    if (usage.usage_percentage >= 90) return 'bg-red-500'
    if (usage.usage_percentage >= 70) return 'bg-yellow-500'
    return 'bg-brand-blue'
  }

  const getProgressTrackColor = () => {
    if (!usage) return 'bg-white/10'
    if (usage.usage_percentage >= 90) return 'bg-red-500/20'
    if (usage.usage_percentage >= 70) return 'bg-yellow-500/20'
    return 'bg-white/10'
  }

  if (loading && !usage) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-2 bg-white/10 rounded-full w-full" />
      </div>
    )
  }

  if (!usage) return null

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showDetailed && !compact && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">
            {t('usage.title')}
          </span>
          <span className={cn(
            "font-medium",
            isAtCritical ? "text-red-400" : isAtWarning ? "text-yellow-400" : "text-white/70"
          )}>
            {usage.messages_used} / {usage.messages_limit}
          </span>
        </div>
      )}

      <div className={cn(
        "relative h-2 rounded-full overflow-hidden",
        getProgressTrackColor()
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(usage.usage_percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "absolute left-0 top-0 h-full rounded-full",
            getProgressColor()
          )}
        />
      </div>

      {showDetailed && !compact && (
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-xs",
            isAtCritical ? "text-red-400" : isAtWarning ? "text-yellow-400" : "text-white/40"
          )}>
            {isAtLimit 
              ? t('usage.limit_reached')
              : `${usage.messages_remaining} ${t('usage.messages')} ${t('usage.remaining').toLowerCase()}`
            }
          </span>
          
          {isAtWarning && (
            <span className="text-xs text-yellow-400">
              {t('usage.warning')}
            </span>
          )}
        </div>
      )}

      {compact && (
        <div className="text-center">
          <span className={cn(
            "text-xs font-bold",
            isAtCritical ? "text-red-400" : isAtWarning ? "text-yellow-400" : "text-white/50"
          )}>
            {usage.messages_remaining}
          </span>
        </div>
      )}
    </div>
  )
}

export function UsageWarning({ className }: { className?: string }) {
  const { t } = useI18n()
  const { usage, isAtWarning, isAtCritical } = useUsage()

  if (!usage || (!isAtWarning && !isAtCritical)) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
        isAtCritical 
          ? "bg-red-500/20 border border-red-500/30 text-red-300" 
          : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-300",
        className
      )}
    >
      {isAtCritical 
        ? t('usage.reached_limit_messages')
        : t('usage.almost_limit_messages')
      }
    </motion.div>
  )
}

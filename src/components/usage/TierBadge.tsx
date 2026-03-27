'use client'

import { SubscriptionTier } from '@/lib/effect/constants/SubscriptionConstants'
import { cn } from '@/lib/utils'

interface TierBadgeProps {
  tier?: string
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  if (!tier) return null

  const isPro = tier === SubscriptionTier.Pro
  const isFree = tier === SubscriptionTier.Free

  if (!isPro && !isFree) return null

  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0",
        isPro
          ? "bg-yellow-400/20 text-yellow-400"
          : "bg-white/10 text-white/60",
        className
      )}
    >
      {isPro ? 'PRO' : 'FREE'}
    </span>
  )
}

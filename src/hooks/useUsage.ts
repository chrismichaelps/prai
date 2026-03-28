'use client'

/** @Hook.UseUsage */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/types/database.types'
import type { SubscriptionTierType, ResetIntervalType } from '@/lib/effect/constants/SubscriptionConstants'

export type UserUsage = Database["public"]["Functions"]["get_user_usage"]["Returns"][number] & {
  subscription_tier?: SubscriptionTierType
  reset_interval?: ResetIntervalType
  next_reset_date?: string
}

export function useUsage() {
  const { isAuthenticated } = useAuth()
  const [usage, setUsage] = useState<UserUsage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  const fetchUsage = useCallback(async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/usage')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch usage')
      }
      const data: UserUsage = await response.json()
      setUsage(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch usage')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const incrementUsage = useCallback(async (amount?: number) => {
    if (!isAuthenticated) return

    try {
      const response = await fetch('/api/user/usage/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount || 1 })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to increment usage')
      }
      const data: UserUsage = await response.json()
      setUsage(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment usage')
      return null
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && !fetchedRef.current) {
      fetchedRef.current = true
      fetchUsage()
    }
  }, [isAuthenticated, fetchUsage])

  return {
    usage,
    loading,
    error,
    fetchUsage,
    incrementUsage,
    setUsage,
    isAuthenticated,
    canSend: usage?.can_send ?? true,
    isAtLimit: !usage?.can_send,
    isAtWarning: usage !== null && (usage.messages_remaining ?? 0) <= 5 && (usage.messages_remaining ?? 0) > 0,
    isAtCritical: usage !== null && (usage.messages_remaining ?? 0) <= 0
  }
}

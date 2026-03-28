'use client'

/** @Hook.UsePersonalization */

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DEFAULT_PERSONALIZATION, type Personalization } from '@/lib/effect/schemas/PersonalizationSchema'

export function usePersonalization() {
  const { isAuthenticated } = useAuth()
  const [personalization, setPersonalization] = useState(DEFAULT_PERSONALIZATION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPersonalization = useCallback(async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/personalization')
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch personalization')
      }
      const data: Personalization = await response.json()
      setPersonalization(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personalization')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const savePersonalization = useCallback(async (newPrefs: Personalization) => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: newPrefs })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save personalization')
      }
      const data: Personalization = await response.json()
      setPersonalization(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save personalization')
      return null
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchPersonalization()
    }
  }, [isAuthenticated, fetchPersonalization])

  return {
    personalization,
    loading,
    error,
    fetchPersonalization,
    savePersonalization,
    setPersonalization
  }
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@/lib/effect/schemas/AuthSchema'
import { TimeConstants } from '@/lib/constants/app-constants'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

/** @Hook.Auth.FetchSession */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  })

  /** @Logic.Auth.FetchSession */
  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session')
      const data = await res.json()
      setState({
        user: data.user,
        session: data.session,
        isLoading: false,
        isAuthenticated: !!data.session
      })
    } catch (_error) {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    fetchSession()

    const checkInterval = setInterval(fetchSession, TimeConstants.SESSION_CHECK_INTERVAL_MS)
    return () => clearInterval(checkInterval)
  }, [fetchSession])

  /** @Logic.Auth.SignIn */
  const signIn = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/signin', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        console.error('Sign in error:', data.error)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }, [])

  /** @Logic.Auth.SignOut */
  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  return {
    ...state,
    signIn,
    signOut
  }
}

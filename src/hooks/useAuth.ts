'use client'

import { useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@/lib/effect/schemas/AuthSchema'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  })

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
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  useEffect(() => {
    fetchSession()

    const checkInterval = setInterval(fetchSession, 5 * 60 * 1000)
    return () => clearInterval(checkInterval)
  }, [fetchSession])

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

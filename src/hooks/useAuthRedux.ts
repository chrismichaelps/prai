'use client'

import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchSession, setSession, reset } from '@/store/slices/authSlice'
import { createClient } from '@supabase/supabase-js'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/** @Hook.Auth.Redux */
export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, session, isLoading, isAuthenticated, error, initialized } = useAppSelector(
    (state) => state.auth
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchSession())
    }
  }, [dispatch, initialized])

  useEffect(() => {
    if (!initialized) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession({ 
        user: session?.user as User | null, 
        session: session as Session | null 
      }))
    })

    return () => subscription.unsubscribe()
  }, [dispatch, supabase, initialized])

  /** @Logic.Auth.Redux.SignIn */
  const handleSignIn = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`
        }
      })
      if (error) throw error
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Sign in error:', err)
    }
  }, [supabase])

  /** @Logic.Auth.Redux.SignOut */
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      dispatch(reset())
      window.location.href = '/'
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }, [supabase, dispatch])

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    initialized,
    signIn: handleSignIn,
    signOut: handleSignOut
  }
}

'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@/lib/effect/schemas/AuthSchema'

/** @Context.Auth */
interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  initialized: boolean
  signIn: (callbackUrl?: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** @Provider.Auth */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabaseRef = useRef<ReturnType<typeof import('@/lib/supabase/client').createSupabaseBrowserClient> | null>(null)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (supabaseRef.current) return
    
    import('@/lib/supabase/client').then(({ createSupabaseBrowserClient }) => {
      supabaseRef.current = createSupabaseBrowserClient()
      initAuth(supabaseRef.current)
    })

    function initAuth(supabase: NonNullable<typeof supabaseRef.current>) {
      if (hasInitialized.current) return
      hasInitialized.current = true

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user as User)
          setSession(session as unknown as Session)
          const callbackUrl = sessionStorage.getItem('authCallbackUrl')
          if (callbackUrl) {
            sessionStorage.removeItem('authCallbackUrl')
            router.replace(callbackUrl)
          }
        }
        setIsLoading(false)
        setInitialized(true)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user as User)
          setSession(session as unknown as Session)
          const callbackUrl = sessionStorage.getItem('authCallbackUrl')
          if (callbackUrl) {
            sessionStorage.removeItem('authCallbackUrl')
            router.replace(callbackUrl)
          }
        } else {
          setUser(null)
          setSession(null)
        }
        setIsLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [router])

  const signIn = useCallback((callbackUrl?: string) => {
    if (callbackUrl) {
      sessionStorage.setItem('authCallbackUrl', callbackUrl)
    }
    supabaseRef.current?.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`
      }
    })
  }, [])

  const signOut = useCallback(async () => {
    await supabaseRef.current?.auth.signOut()
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    router.push('/')
  }, [router])

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    initialized,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/** @Hook.Auth */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

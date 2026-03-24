'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session, Profile } from '@/lib/effect/schemas/AuthSchema'
import { PostgRErrorCodes } from '@/lib/effect/constants/PostgRErrorCodes'

/** @Context.Auth */
interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  initialized: boolean
  signIn: (callbackUrl?: string) => void
  signOut: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** @Provider.Auth */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const supabaseRef = useRef<ReturnType<typeof import('@/lib/supabase/client').createSupabaseBrowserClient> | null>(null)
  const hasInitialized = useRef(false)

  /** @Logic.UI.Auth.FetchProfile */
  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = supabaseRef.current
    if (!supabase) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data as unknown as Profile)
    } else if (error?.code === PostgRErrorCodes.SINGLETON_NOT_FOUND) {
      const { data: userData } = await supabase.auth.getUser()
      const avatarUrl = userData?.user?.user_metadata?.avatar_url

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId, avatar_url: avatarUrl })
        .select()
        .single()

      if (!insertError && newProfile) {
        setProfile(newProfile as unknown as Profile)
      }
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return
    await fetchProfile(user.id)
  }, [user?.id, fetchProfile])

  useEffect(() => {
    if (hasInitialized.current) return
    
    hasInitialized.current = true

    import('@/lib/supabase/client')
      .then(({ createSupabaseBrowserClient }) => {
        if (!supabaseRef.current) {
          supabaseRef.current = createSupabaseBrowserClient()
        }
        return supabaseRef.current
      })
      .then((supabase) => {
        return supabase.auth.getSession()
          .then(({ data: { session } }) => {
            if (session?.user) {
              setUser(session.user as unknown as User)
              setSession(session as unknown as Session)
              fetchProfile(session.user.id)
            }
            setIsLoading(false)
            setInitialized(true)
          })
          .then(() => supabase)
      })
      .then((supabase) => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            setUser(session.user as unknown as User)
            setSession(session as unknown as Session)
            fetchProfile(session.user.id)
          } else {
            setUser(null)
            setSession(null)
            setProfile(null)
          }
          setIsLoading(false)
        })
        return () => subscription.unsubscribe()
      })
      .catch(() => {
        setIsLoading(false)
        setInitialized(true)
      })
  }, [fetchProfile])

  /** @Logic.UI.Auth.SignIn */
  const signIn = useCallback(async (callbackUrl?: string) => {
    if (callbackUrl) {
      sessionStorage.setItem('authCallbackUrl', callbackUrl)
    }
    
    try {
      const res = await fetch('/api/auth/signin', { 
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json()
      
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert('Sign in failed: ' + data.error)
      }
    } catch (err) {
      console.error('Sign in failed:', err)
    }
  }, [])

  /** @Logic.UI.Auth.SignOut */
  const signOut = useCallback(async () => {
    supabaseRef.current?.auth.signOut()
    
    if (typeof document !== 'undefined') {
      document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    
    setUser(null)
    setSession(null)
    setProfile(null)
    
    window.location.href = '/'
  }, [])

  const value: AuthContextValue = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    initialized,
    signIn,
    signOut,
    refreshProfile
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

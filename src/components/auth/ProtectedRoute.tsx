'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

/** @Component.Auth.ProtectedRoute */
interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, initialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (initialized && !isLoading && !isAuthenticated) {
      const callbackUrl = typeof window !== 'undefined' ? window.location.pathname : ''
      const url = new URL(redirectTo, window.location.origin)
      url.searchParams.set('callbackUrl', callbackUrl)
      router.replace(url.toString())
    }
  }, [initialized, isLoading, isAuthenticated, redirectTo, router])

  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'

/** @Component.Auth.ProtectedRoute */
interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, initialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const redirectUrl = useMemo(() => {
    if (!initialized || isLoading || isAuthenticated) return null
    const url = new URL(redirectTo, typeof window !== 'undefined' ? window.location.origin : '')
    url.searchParams.set('callbackUrl', pathname)
    return url.toString()
  }, [initialized, isLoading, isAuthenticated, redirectTo, pathname])

  useEffect(() => {
    if (redirectUrl) {
      router.replace(redirectUrl)
    }
  }, [redirectUrl, router])

  const content = useMemo(() => {
    if (!initialized || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#090909]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )
    }
    if (!isAuthenticated) return null
    return <>{children}</>
  }, [initialized, isLoading, isAuthenticated, children])

  return content
}

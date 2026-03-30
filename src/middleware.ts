import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { AppConstants, TimeConstants } from '@/lib/constants/app-constants'

export async function middleware(request: NextRequest) {
  /** @Middleware.SyncLocaleCookie */
  const hasLocale = request.cookies.has(AppConstants.LOCALE_COOKIE_NAME)
  
  if (!hasLocale) {
    const response = NextResponse.next()
    response.cookies.set(AppConstants.LOCALE_COOKIE_NAME, AppConstants.DEFAULT_LOCALE, { path: '/', maxAge: TimeConstants.LOCALE_COOKIE_MAX_AGE })
    return response
  }

  /** @Middleware.RefreshSession */
  const supabaseResponse = await updateSession(request)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

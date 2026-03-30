import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { AppConstants, TimeConstants } from '@/lib/constants/app-constants'

export async function middleware(request: NextRequest) {
  // Sync NEXT_LOCALE cookie if missing
  const hasLocale = request.cookies.has('NEXT_LOCALE')
  
  if (!hasLocale) {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', AppConstants.DEFAULT_LOCALE, { path: '/', maxAge: TimeConstants.LOCALE_COOKIE_MAX_AGE })
    return response
  }

  // Update session and refresh cookies
  const supabaseResponse = await updateSession(request)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

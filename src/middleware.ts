import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** @Logic.Middleware.I18n */
export function middleware(request: NextRequest) {
  // Sync NEXT_LOCALE cookie if missing
  const hasLocale = request.cookies.has('NEXT_LOCALE')
  
  if (!hasLocale) {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', 'es', { path: '/', maxAge: 31536000 })
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'
import { HttpStatus } from '@/app/api/_lib/constants/status-codes'
import { checkRateLimit } from '../_lib/utils/rate-limit'

export const dynamic = 'force-static'

/** @Route.Api.Releases */
/** @Route.Api.Releases.GET */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown'
  
  const rateLimit = checkRateLimit(clientIp)
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: HttpStatus.TOO_MANY_REQUESTS,
        headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) }
      }
    )
  }

  try {
    const releases = getChangelogReleasesSync()

    const formattedReleases = releases.map((release) => ({
      version: release.date,
      content: release.content,
      date: release.date,
    }))

    return NextResponse.json(formattedReleases, {
      status: HttpStatus.OK,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    })
  } catch (error) {
    console.error('[ReleasesAPI] Error fetching releases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch releases' },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    )
  }
}

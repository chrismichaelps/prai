import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'
import { HttpStatus } from '@/app/api/_lib/constants/status-codes'
import { checkRateLimit, getClientIp } from '../_lib/utils/rate-limit'
import { CacheControlConstants, HttpHeaderConstants, ContentTypeConstants } from '@/lib/constants/app-constants'

export const dynamic = 'force-static'

/** @Route.Api.Releases */
/** @Route.Api.Releases.GET */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(request)
  
  const rateLimit = checkRateLimit(clientIp)
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: HttpStatus.TOO_MANY_REQUESTS,
        headers: { [HttpHeaderConstants.RETRY_AFTER]: String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) }
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
        [HttpHeaderConstants.CACHE_CONTROL]: CacheControlConstants.STATIC_CACHE,
        [HttpHeaderConstants.CONTENT_TYPE]: ContentTypeConstants.JSON,
        [HttpHeaderConstants.RATE_LIMIT_REMAINING]: String(rateLimit.remaining),
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

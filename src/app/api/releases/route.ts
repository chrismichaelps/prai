import { NextResponse } from 'next/server'
import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'
import { HttpStatus } from '@/app/api/_lib/constants/status-codes'

/** @Route.Api.Releases */
export async function GET(): Promise<NextResponse> {
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

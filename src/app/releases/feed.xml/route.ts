import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'
import { HttpStatus } from '@/app/api/_lib/constants/status-codes'
import { checkRateLimit, getClientIp } from '@/app/api/_lib/utils/rate-limit'
import { CacheControlConstants, HttpHeaderConstants, ContentTypeConstants, XmlConstants, LocaleConstants } from '@/lib/constants/app-constants'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''
const SITE_TITLE = 'PR\\AI Release Notes'
const SITE_DESCRIPTION = 'The latest updates, features, and fixes for the PR\\AI platform.'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRSSItem(release: { date: string; content: string }): string {
  const pubDate = new Date(release.date).toUTCString()
  const items = release.content
    .split('\n')
    .filter((line) => line.trim())
    .map((item) => `<li>${escapeXml(item.trim())}</li>`)
    .join('\n')

  return `
    <item>
      <title>Release ${release.date}</title>
      <link>${SITE_URL}/releases</link>
      <guid isPermaLink="true">${SITE_URL}/releases#${release.date}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>
        <![CDATA[
          <ul>${items}</ul>
        ]]>
      </description>
    </item>
  `.trim()
}

function generateRSS(releases: Array<{ date: string; content: string }>): string {
  const items = releases.map(generateRSSItem).join('\n')

  return `${XmlConstants.VERSION}
<rss version="2.0" xmlns:atom="${XmlConstants.RSS_NAMESPACE}" xmlns:content="${XmlConstants.CONTENT_NAMESPACE}">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/releases</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${LocaleConstants.RSS_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/releases/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/favicon.png</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${SITE_URL}/releases</link>
    </image>
    ${items}
  </channel>
</rss>`
}

/** @Route.Feed.RSS */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(request)
  
  const rateLimit = checkRateLimit(clientIp)
  
  if (!rateLimit.allowed) {
    return new NextResponse(`${XmlConstants.VERSION}<error>Too many requests</error>`, {
      status: HttpStatus.TOO_MANY_REQUESTS,
      headers: {
        [HttpHeaderConstants.CONTENT_TYPE]: ContentTypeConstants.RSS_XML,
        [HttpHeaderConstants.RETRY_AFTER]: String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      },
    })
  }

  try {
    const releases = getChangelogReleasesSync()
    const rss = generateRSS(releases)

    return new NextResponse(rss, {
      status: HttpStatus.OK,
      headers: {
        [HttpHeaderConstants.CONTENT_TYPE]: ContentTypeConstants.RSS_XML,
        [HttpHeaderConstants.CACHE_CONTROL]: CacheControlConstants.STATIC_CACHE,
        [HttpHeaderConstants.RATE_LIMIT_REMAINING]: String(rateLimit.remaining),
      },
    })
  } catch (error) {
    console.error('[RSSFeed] Error generating RSS feed:', error)
    return new NextResponse(`${XmlConstants.VERSION}<error>Failed to generate RSS feed</error>`, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}

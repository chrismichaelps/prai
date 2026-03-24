import { NextResponse } from 'next/server'
import { getChangelogReleasesSync } from '@/lib/effect/services/Changelog'

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

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/releases</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
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
export async function GET(): Promise<NextResponse> {
  try {
    const releases = getChangelogReleasesSync()
    const rss = generateRSS(releases)

    return new NextResponse(rss, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('[RSSFeed] Error generating RSS feed:', error)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate RSS feed</error>', {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}

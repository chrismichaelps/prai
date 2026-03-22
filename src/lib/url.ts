import type { SearchResult } from "@/types/chat"

const URL_RE = /(https?:\/\/[^\s<>"]+(?:\([^)\s]*\))*)/g
const TRAILING_PUNCT_RE = /[.,;:?!'"`]+$/
const MEDIA_HOSTNAMES = /^(www\.)?(youtube\.com|youtube\.be|youtu\.be|img\.youtube\.com|spotify\.com|open\.spotify\.com|soundcloud\.com|vimeo\.com)$/

const sanitizeUrl = (raw: string): string | null => {
  let cleaned = raw.replace(TRAILING_PUNCT_RE, "")
  const openParens = (cleaned.match(/[(]/g) || []).length
  const closeParens = (cleaned.match(/[)]/g) || []).length
  const diff = openParens - closeParens
  if (diff > 0) cleaned = cleaned + ")".repeat(diff)
  if (cleaned.length < 12) return null
  try {
    const { hostname } = new URL(cleaned)
    if (MEDIA_HOSTNAMES.test(hostname)) return null
    return hostname.includes(".") || hostname === "localhost" ? cleaned : null
  } catch {
    return null
  }
}

export const extractUrls = (text: string): string[] => {
  const urls: string[] = []
  for (const m of text.matchAll(URL_RE)) {
    const url = sanitizeUrl(m[1] ?? "")
    if (url) urls.push(url)
  }
  return [...new Set(urls)]
}

export const toSource = (url: string, verified = false): SearchResult => {
  try {
    const domain = new URL(url).hostname.replace("www.", "")
    return {
      title: domain, url, source: domain, verified,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    }
  } catch {
    return { title: url, url, verified }
  }
}

export const deduplicateSources = (sources: SearchResult[]): SearchResult[] =>
  [...new Map(sources.map((s) => [s.url, s])).values()]

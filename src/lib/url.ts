import type { SearchResult } from "@/types/chat"
import { ApiConstants } from "@/lib/constants/app-constants"

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

export const toSource = (
  url: string, 
  verified = false, 
  title?: string, 
  snippet?: string
): SearchResult => {
  try {
    const domain = new URL(url).hostname.replace("www.", "")
    return {
      title: title || domain,
      url, 
      source: domain, 
      verified,
      snippet,
      icon: `${ApiConstants.GOOGLE_S2_FAVICONS_URL}?domain=${domain}&sz=${ApiConstants.FAVICON_SIZE}`
    }
  } catch {
    return { title: title || url, url, verified, snippet }
  }
}

export const deduplicateSources = (sources: SearchResult[]): SearchResult[] =>
  [...new Map(sources.map((s) => [s.url, s])).values()]

---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Url

### [Signatures]
```ts
export const extractUrls: (text: string) => string[]
export const toSource: (url: string, verified?: boolean) => SearchResult
export const deduplicateSources: (sources: SearchResult[]) => SearchResult[]
```

### [Governance]
- **Regex_Law:** URL regex `/(https?:\/\/[^\s<>"]+(?:\([^)\s]*\))*)/g` matches HTTP(S) URLs with balanced parentheses for Wikipedia-style links.
- **Sanitization_Law:** `sanitizeUrl` validates URLs via `new URL()` constructor, strips trailing punctuation, and auto-balances parentheses.
- **MediaFilter_Law:** URLs from youtube, spotify, soundcloud, and vimeo are excluded from extraction.
- **MinimumLength_Law:** URLs must be at least 12 characters after sanitization to be considered valid.

### [Implementation Notes]
- **ParenthesisFix:** When URL has more `(` than `)`, missing closing parens are automatically added before validation.
- **TrailingPunct:** Stripped characters: `.,;:?!'"` + backtick.
- **Hostname:** Must contain `.` or be `localhost` to be considered valid.
- **Deduplication:** Returns unique URLs via `Set`.
- **Media Hostnames:** `youtube.com`, `youtube.be`, `youtu.be`, `img.youtube.com`, `spotify.com`, `open.spotify.com`, `soundcloud.com`, `vimeo.com`.

### [Semantic Hash]
Provides URL extraction from text with media filtering, balanced parenthesis handling, and deduplication. Converts URLs to `SearchResult` format with favicon icons.

### [Linkage]
- **Used by:** `@root/src/lib/effect/chat.ts`
- **Types:** `@root/src/types/chat.ts` (`SearchResult`)

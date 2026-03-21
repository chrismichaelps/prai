---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Logic.Effect.Chat

### [Signatures]
```ts
export const initChat: Effect<void, never, ConfigService | Redux>
export const sendChatMessage: (content: string) => Effect<void, never, OpenRouter | Redux | ConfigService>
export const regenerateResponse: Effect<void, never, OpenRouter | Redux | ConfigService>
```

**Internal:**
```ts
const generateResponse: Effect<void, never, OpenRouter | Redux>
// Reused by sendChatMessage and regenerateResponse
```

### [Governance]
- **Generator_Law:** Uses `Effect.gen` + `yield*` for linear flow — COMPLIANT.
- **Stream_Law:** `Stream.runForEach` for SSE chunk consumption, wrapped with `Effect.catchAll(() => Effect.void)` — stream errors absorbed, callers handle via their own `catchAll`.
- **Error_Law:** `Effect.catchAll` at pipeline end on `sendChatMessage` and `regenerateResponse`.
- **UrlExtraction_Law:** `extractUrls` from `@/lib/url` filters media hostnames (youtube, spotify, soundcloud, vimeo) to prevent non-reference URLs from appearing in sources.
- **Favicon_Law:** Every `SearchResult` created MUST include the `icon` field set to `https://www.google.com/s2/favicons?domain=${domain}&sz=32`. Display layer handles fallback via `onError` hiding broken image, showing Globe icon.

### [Implementation Notes]
- **State Isolation:** All conversational state inside streams relies exclusively on Effect `Ref` instances.
- **Z-Index:** SourcesSidebar uses `z-[110]` to appear above Header's `z-[100]`.
- **UrlExtraction:** Uses `@/lib/url` utilities (`extractUrls`, `toSource`, `deduplicateSources`) with `trackUrls` and `scanContent` helpers for O(n) streaming with Set-based dedup.
- **Favicon Service:** Google S2 Favicons API — falls back to Globe icon on image error.
- **Media Filter:** `MEDIA_HOSTNAMES` regex in `@/lib/url` excludes youtube, youtube.com, youtu.be, img.youtube.com, spotify.com, open.spotify.com, soundcloud.com, vimeo.com from source extraction.
- **Regenerate_Law:** `regenerateResponse` reuses `generateResponse` without re-adding the user message.
- **Action Validity:** Redux dispatches strictly match schema types.

### [Semantic Hash]
Manages the full chat lifecycle: initialize system prompt, stream SSE from OpenRouter, parse reasoning/content deltas, extract AdaptiveCard JSON blocks, extract and deduplicate URLs with O(n) sliding window, dispatch all state mutations via Redux.

### [Linkage]
- **Upstream:** `OpenRouter`, `ConfigService`, `Redux`, `chatSlice`, `@/lib/url`
- **Downstream:** `@root/src/lib/effect/ChatProvider.tsx`

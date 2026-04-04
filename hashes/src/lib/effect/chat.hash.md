---
State_ID: BigInt(0x6)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Logic.Effect.Chat

### [Signatures]
```ts
export const initChat: Effect<void, never, ConfigService | Redux>
export const sendChatMessage: (content: string, personalization?: Personalization) => Effect<void, never, OpenRouter | Redux | ConfigService | ChatApi>
export const regenerateResponse: (personalization?: Personalization) => Effect.Effect<void, never, OpenRouter | Redux | ConfigService>
```

**Internal:**
```ts
const generateResponse: (sessionId?: string, personalization?: Personalization) => Effect<void, OpenRouterError | void, OpenRouter | Redux>
// Accepts optional sessionId for OpenRouter session tracking and personalization for system prompt injection
```

**Internal:**
```ts
const generateResponse: (sessionId?: string) => Effect<void, OpenRouterError | void, OpenRouter | Redux>
// Accepts optional sessionId for OpenRouter session tracking

const trackUrls: (urls: string[], verified: boolean) => Effect<void>
// Adds novel URLs to sourcesRef (dedup via seenUrlsRef), does NOT dispatch to Redux

const syncSources: () => Effect<void>
// Reads sourcesRef and dispatches to Redux via updateLastMessage
```

### [Governance]
- **Generator_Law:** Uses `Effect.gen` + `yield*` for linear flow — COMPLIANT.
- **Stream_Law:** `Stream.runForEach` for SSE chunk consumption — errors propagate through error channel to caller.
- **Error_Law:** `Effect.catchAll` at pipeline end on `sendChatMessage` and `regenerateResponse` uses `instanceof OpenRouterError` check to dispatch to Redux `uiSlice.apiError` via `setApiError` or `chatSlice.setError` for unknown errors.
- **Session_Law:** Passes `currentChatId` as `session_id` to OpenRouter for grouping generations into sessions.
- **Usage_Law:** Tracks usage via POST to `/api/user/usage/increment` after stream completes.
- **UrlExtraction_Law:** `extractUrls` from `@/lib/url` filters media hostnames (youtube, spotify, soundcloud, vimeo) and handles balanced parentheses in URLs (e.g., Wikipedia). Always extracts all URLs including those at chunk boundaries.
- **Favicon_Law:** Every `SearchResult` created MUST include the `icon` field set to `https://www.google.com/s2/favicons?domain=${domain}&sz=32`. Display layer handles fallback via `onError` hiding broken image, showing Globe icon.
- **SyncLaw:** `syncSources()` is called after every source mutation to ensure Redux state is updated. This guarantees the SourcesPill renders consistently.
- **SourceDispatch_Law:** Sources are dispatched to Redux via `syncSources()` in 3 places: (1) after citations, (2) after content scan, (3) after post-stream extraction.

### [Implementation Notes]
- **State Isolation:** All conversational state inside streams relies exclusively on Effect `Ref` instances.
- **Z-Index:** SourcesSidebar uses `z-[110]`, ErrorToast uses `z-[120]`.
- **UrlExtraction:** Uses `@/lib/url` utilities (`extractUrls`, `toSource`) with `trackUrls` and `scanContent` helpers for O(n) streaming with Set-based dedup. Post-stream extraction from full content catches URLs missed during streaming window.
- **UrlRegex:** `/(https?:\/\/[^\s<>"]+(?:\([^)\s]*\))*)/g` — matches URLs with balanced parentheses for Wikipedia-style links.
- **ParenthesisFix:** `sanitizeUrl` adds missing closing parentheses when URL has more opening than closing parens.
- **Favicon Service:** Google S2 Favicons API — falls back to Globe icon on image error.
- **Media Filter:** `MEDIA_HOSTNAMES` regex excludes youtube, youtube.com, youtu.be, img.youtube.com, spotify.com, open.spotify.com, soundcloud.com, vimeo.com from source extraction.
- **Regenerate_Law:** `regenerateResponse` reuses `generateResponse` without re-adding the user message.
- **Action Validity:** Redux dispatches strictly match schema types.
- **ErrorHandling:** OpenRouter errors (400, 401, 402, 403, 408, 429, 500, 502, 503) dispatched via `setApiError` to `uiSlice.apiError`. Displayed in `ErrorToast` component with i18n mapping `error.api.{code}`. Unknown errors dispatched via `setError` to `chatSlice.error`.
- **ParseErrors:** Malformed SSE lines logged at debug level (`Effect.logDebug`) and skipped — stream continues processing remaining chunks.

### [Semantic Hash]
Manages the full chat lifecycle: initialize system prompt, stream SSE from OpenRouter, parse reasoning/content deltas, extract AdaptiveCard JSON blocks, extract and deduplicate URLs with O(n) sliding window, dispatch all state mutations via Redux.

### [Linkage]
- **Upstream:** `OpenRouter`, `ConfigService`, `Redux`, `ChatApi`, `chatSlice`, `@/lib/url`, `@/lib/commands/settingsPrompt`
- **Downstream:** `@root/src/lib/effect/ChatProvider.tsx`

### [Change Notes — session_memory + settings integration]
- `buildSettingsPrompt(chatSettings)` imported and injected via `splice(1, 0, ...)` after main system prompt (not `push()`)
- `flushTagBuffer` return type explicitly `string[]` — consistent for both stream-done and mid-stream paths
- Client-side chat.ts now uses `fetch` + SSE directly (removed OpenRouter service dependency)

---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Logic.I18n.Dictionary

### [Signatures]
```ts
const dictionary: Record<Locale, Record<string, string>>
export const I18nLive: Layer.Layer<I18n>
export const translate: (locale: Locale, key: string) => string
```

**Supported Locales:** `"es"` | `"en"`

**Key Namespaces:**
- `brand.*` — brand name/slogan/tagline
- `nav.*` — header navigation labels
- `hero.*` — landing page hero section
- `chat.*` — chat UI and status messages
- `footer.*` — footer section labels
- `cookies.*` — cookie consent banner
- `privacy.*` / `terms.*` / `legal.cookies.*` — legal pages
- `404.*` — not found page
- `info.*` — model transparency toast
- `about.*` — about page content

### [Governance]
- **Fallback_Law:** `dictionary[locale]?.[key] || key` — missing key shows raw key string (visible bug).
- **Locale_Law:** Cookie `NEXT_LOCALE` sets and reads locale. Synced with Next.js middleware.

### [SIG_ID: MISSING_KEY_FALLBACK]
> ℹ️ INFO: On missing key, the raw key string is displayed (e.g., "footer.explore"). This is the expected fallback behavior but exposes i18n gaps to users.

### [Semantic Hash]
Static dictionary of all UI strings in Spanish and English. Provides I18nLive layer and translate() helper for server-side usage.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/services/I18n.ts`
- **Downstream:** `@root/src/lib/effect/I18nProvider.tsx`, `@root/src/lib/effect/runtime.ts`

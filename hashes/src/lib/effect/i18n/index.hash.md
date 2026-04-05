---
State_ID: BigInt(0x0fc98de)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.I18nProvider

### [Signatures]
```ts
const dictionary: Record<Locale, Record<string, string>> = {
  es: { ... },
  en: { ... }
}

export const I18nLive = Layer.effect(I18n, ...)
```

### [Governance]
- **Language_Law:** Defines all global linguistic keys. English and Spanish are fully mirrored.
- **Strict_Typing:** Keys are dynamically inferred via `keyof typeof dictionaries.es`.
- **Locale_Sync:** Automatically synchronizes with cookie storage `NEXT_LOCALE`.

### [Semantic Hash]
Global localization context managing translations for Auth, Profile, Nav, Chat, Legal, Usage, Personalization, and Command domains.

### [Change Notes — lint/i18n fixes]
- Added `a11y.enable_web_search` and `a11y.disable_web_search` keys
- Added `chat.web_search_label` for web search toggle
- Added `chat.stopped` for interrupted responses
- Added `chat.dismiss` for message dismissal
- Added `usage.web_search_*` keys for web search usage tracking

### [Linkage]
- **Dependencies:** `react`, `js-cookie`

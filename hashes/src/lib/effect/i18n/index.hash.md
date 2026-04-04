---
State_ID: BigInt(0x0fc98dd)
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

### [Change Notes — command integration]
- Added `command.*` i18n keys for command feedback messages
- Added `chat.regenerate` key for regenerate response button

### [Linkage]
- **Dependencies:** `react`, `js-cookie`

---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.I18nProvider

### [Signatures]
```ts
export const dictionaries = { en: { ... }, es: { ... } } as const
export type Locale = keyof typeof dictionaries
export type TranslationKey = keyof typeof dictionaries.es
export const I18nContext: React.Context<I18nContextType | undefined>

export function useI18n(): I18nContextType
export function I18nProvider(props: { children: React.ReactNode; initialLocale?: Locale }): JSX.Element
```

### [Governance]
- **Language_Law:** Defines all global linguistic keys. English and Spanish are fully mirrored.
- **Strict_Typing:** Keys are dynamically inferred via `keyof typeof dictionaries.es`.
- **Locale_Sync:** Automatically synchronizes with cookie storage `NEXT_LOCALE`.

### [Semantic Hash]
Global localization context managing translations for Auth, Profile, Nav, Chat, and Legal domains.

### [Linkage]
- **Dependencies:** `react`, `js-cookie`

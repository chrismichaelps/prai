---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Lib.Api.Profile.Schemas

### [Signatures]
```ts
export const SupportedLanguageSchema: Schema<"en" | "es">
export const UpdateProfileSchema: Schema<{ userId: string; display_name?: string; bio?: string; language?: Locale }>
```

### [Governance]
- **Schema_Law:** Profile updates validated against `UpdateProfileSchema`.
- **Language_Law:** Only `en` and `es` locales are supported.
- **Required_Law:** `userId` is required; other fields are optional.

### [Semantic Hash]
Effect-TS schemas for profile update requests.

### [Linkage]
- **Upstream:** `@/app/api/_lib/validation`
- **Downstream:** `src/app/api/profile/route.ts`

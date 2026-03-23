---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @App.Legal.Privacy

### [Signatures]
```ts
export default function PrivacyPage(): JSX.Element
```

### [Governance]
- **Static_Page_Law:** Generates purely static HTML at build time. No client-side hooks or interactive states allowed.
- **Copy_Integrity:** Strictly implements the PR\\AI official privacy legal copy, anchoring the application to real-world data collection laws.

### [Semantic Hash]
The Privacy Policy document. Defines the contract between the PR\\AI AI Assistant and the user regarding PII, telemetry, and Supabase database storage rules.

### [Linkage]
- **Dependencies:** `@/components/layout/Header`, `@/components/layout/Footer`, `@/lib/effect/I18nProvider` (for localized legal text)

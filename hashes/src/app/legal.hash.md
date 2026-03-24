---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Legal

### [Routes]
| Handler | Description |
|---------|-------------|
| `layout.tsx` | Legal pages layout |
| `terms/page.tsx` | Terms of service |
| `privacy/page.tsx` | Privacy policy |
| `cookies/page.tsx` | Cookie policy |

### [Governance]
- **I18n_Law:** All text content via `useI18n()`.
- **Static_Law:** Static content pages - no authentication required.

### [Semantic Hash]
Legal documents section containing terms, privacy policy, and cookie policy.

### [Linkage]
- **Upstream:** `useI18n` provider
- **Downstream:** Footer links

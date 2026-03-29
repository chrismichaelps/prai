---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.Blog

### [Routes]
| Handler | Description |
|---------|-------------|
| `page.tsx` | Main blog list with localized post pre-fetching |
| `[slug]/page.tsx` | Specific blog post page with dual-locale content |

### [Governance]
- **Locale_Law:** All blog routes must fetch both `Locales.EN` and `Locales.ES` to support client-side toggling.
- **Static_Law:** Pages are marked `force-static` for maximum performance.
- **Visual_Law:** Uses the "anaranjado" glow aesthetic as defined in `BlogList`.

### [Semantic Hash]
Bilingual blog section for PR\AI. Features a minimalist, horizontal list layout and a banner-focused detail view. Content is served from localized MDX files.

### [Linkage]
- **Upstream:** `BlogService`, `Header`, `Footer`, `useI18n`
- **Downstream:** Individual blog post pages at `/blog/[slug]`

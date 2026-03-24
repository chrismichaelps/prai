---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @Route.About

### [Routes]
| Handler | Description |
|---------|-------------|
| `page.tsx` | About page with app description |

### [Governance]
- **UI_Law:** Full-page hero with background image from `@/assets`.
- **I18n_Law:** All text content via `useI18n()`.
- **Action_Law:** CTA buttons link to `/chat` and GitHub repo.

### [Semantic Hash]
Public about page at `/about` showcasing app mission, description, and call-to-action.

### [Linkage]
- **Upstream:** `Header`, `Footer` components, `useI18n`
- **Downstream:** Chat page, GitHub repo

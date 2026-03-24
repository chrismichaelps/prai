---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/next.hash.md"
---

## @UI.Page.Releases

### [Signatures]
```tsx
export function ReleasesPage({ releases }: { releases: Release[] }): JSX.Element

function ExpandableContent({ content }: { content: string }): JSX.Element
function truncateAtWordBoundary(content: string, maxChars: number): string

const MAX_CHARS_PREVIEW = 300
```

### [Components]
| Component | Description |
|-----------|-------------|
| `ReleasesPage` | Main page wrapper with Context provider |
| `Background` | Glowing background effects (fixed position) |
| `Breadcrumb` | Logo and follow button row |
| `HeroHeader` | Hero section with title, subtitle, social actions |
| `SocialActions` | RSS and API feed buttons with links to endpoints |
| `Timeline` | Container for release cards |
| `TimelineCard` | Individual release with motion animation |
| `ExpandableContent` | Expandable/collapsible content with truncation |
| `VersionInfo` | Version number and product label |
| `DateColumn` | Sticky date display |
| `LogoColumn` | AI avatar column |
| `Content` | Markdown renderer using markdown-it |

### [Context]
- **ReleasesContext:** Provides `releases` array to all children

### [Features]
- **ExpandableContent:** When content exceeds 300 characters:
  - Shows truncated preview with gradient fade effect
  - "Ver más" button to expand full content
  - "Ver menos" button to collapse with smooth scroll-to-top
  - Uses `scrollIntoView` for smooth scrolling on collapse
- **SocialActions:** RSS and API feed buttons linking to:
  - `/releases/feed.xml` - RSS feed endpoint
  - `/api/releases` - JSON API endpoint

### [Governance]
- **Context_Law:** Uses React Context for state sharing
- **I18n_Law:** All text via `useI18n()`
- **Animation_Law:** Uses Framer Motion for staggered animations
- **Truncation_Law:** HTML tags preserved during truncation via `truncateAtWordBoundary`

### [Semantic Hash]
Release notes page with timeline layout, expandable content, animated cards, and markdown rendering.

### [Linkage]
- **Upstream:** `Release` type from `@/lib/effect/services/Changelog`
- **Downstream:** Layout components (Header, Footer)
- **Feed Endpoints:** Links to `/releases/feed.xml` and `/api/releases`

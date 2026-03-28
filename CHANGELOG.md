# Changelog

## 2026-03-28

- Added per-user message usage tracking system with daily/monthly resets and tier-based limits (#67)
- Added subscription tier support (Free/Pro) with tier-based model selection in chat API
- Added reasoning effort injection based on tier (low for free, medium for pro)
- Added web search plugins only for Pro tier users
- Added usage page with progress bars, last/next reset dates with user locale times
- Added tier badges in usage view, profile, and avatar dropdown
- Added personalization feature allowing users to customize AI response style and tone (#69)
- Added base style options: Default, Professional, Friendly, Candid, Quirky, Efficient, Cynical
- Added characteristic adjustments: warmth, enthusiasm, headers/lists, emoji usage
- Added custom instructions and nickname fields for personalized AI interactions
- Added PersonalizationModal UI with sidebar navigation for settings
- Added /personalization page route with full settings interface
- Added API endpoints for personalization (GET/POST /api/user/personalization)
- Added Effect Schema validation to personalization API endpoints
- Added shimmer animation for usage progress bar loading states
- Added session_id support to OpenRouter for conversation tracking and debug chains

## 2026-03-27

- Added full 1:1 FMCF Hash Registry conformity ensuring all `src/` modules strictly mirror corresponding `.hash.md` architectural contracts
- Improved `atlas.graph.json` registry map by manually refining dependency node reasons with context-specific rationale
- Configured OpenRouter native web search with structured contexts for richer tourism domain accuracy
- Fixed chat UI usability bugs during active streaming (improved markdown link visibility and removed aggressive auto-scroll hijacking)

## 2026-03-26

- Fixed chat memory loss bugs to preserve messages when archiving and restoring chat sessions (#60)
- Added Effect-native telemetry logging and tracing via `@vercel/otel` and `Effect.withSpan` (#59)

## 2026-03-25

- Added core issue tracker frontend and database migrations (#47)
- Added complete notification system v2 and v3 featuring optimistic read status and accurately synchronized unread badges (#43, #51)
- Added user search functionality and synchronized database types (#44)
- Added admin badges and restricted issue status updates to administrative roles only (#42)
- Added optimistic UI updates for appending and editing issue comments to avoid full-screen reloads (#50)
- Removed monolithic tracking of `supabase/` definitions to clean up repository state (#54, #48)
- Added `google-site-verification` meta tag for SEO indexing

## 2026-03-24

- Added dedicated Release Notes UI implementation, Metadata blocks, and API endpoints (#38)
- Fixed Google OAuth authentication flows using popup mode, One Tap, and server-side sign-in fallbacks to improve production stability
- Fixed Supabase client import resolution paths for robust build environments (#40)

## 2026-03-23

- Added comprehensive validation layer integrated into `src/app/api/_lib/validation/` (`common.ts` and `params.ts`)
- Added shared HTTP status codes to `constants/status-codes.ts`
- Added strongly typed application errors in `errors/index.ts` (`SupabaseError`, `ValidationError`, `ChatDbError`, `NotFoundError`)
- Added `toNextResponse` and `exitResponse` utilities in `response/index.ts` to standardize Effect-TS error transitions
- Changed Chat Domain API (`src/app/api/chat/`) to return standardized `204 No Content` for successful `DELETE`/`PATCH` operations instead of empty JSON
- Improved Chat Domain handlers by isolating business logic into `services/chat.ts`
- Added schema registries in `schemas/chat.schemas.ts`, `chat-completions.schemas.ts`, and `message.schemas.ts`
- Added `route.ts` for profile lifecycle management in Profile Domain API
- Added strict validation via `schemas/profile.schemas.ts`, `schemas/auth.schemas.ts` and `schemas/index.ts`
- Changed Auth Domain API `signin`, `signout`, `session`, and `callback` routes to unify with architectural namespaces
- Added **MANDATORY** architectural namespace comments (`/** @Route.Api.* */`, `@Logic.*`, `@Type.Database.*`, `@UI.*`, `@Service.*`, `@Layer.*`) across the entire codebase
- Improved citation extraction limits for external resources and live TV sources
- Added support for localized regional media streams extraction
- Improved Chat Container by integrating `usePathname` and `router.replace` to guarantee URL-to-Redux synchronization
- Added logic where auto-creation functionality immediately triggers when navigating to `/chat` with a blank state
- Improved `ResizeObserver` loops to dynamically trace streaming state securely
- Improved sidebar reliability by centralizing robust error toasts with safe fallbacks
- Fixed ActiveVoice and error states by synchronizing directly into the component mount
- Added an `archive all` and `delete all` data lifecycle flow with destructive action confirmations in `ProfileClient.tsx`
- Improved localization by persisting user language preference seamlessly across React navigation boundaries (`toLocale()`)
- Changed "Mi Chat" to "Profile" in Header Dropdown and Mobile navigation
- Added `/profile` dashboard with Condado dusk background matching Home page
- Changed proxy user schemas to official `@supabase/supabase-js` Auth types
- Added `User` dropdown (Profile, Sign Out) in Header when authenticated
- Added Google OAuth sign-in directly from the `Header.tsx` dropdown
- Removed legacy sign-in infrastructure (`/auth/signin`, `/api/auth/signin`)
- Removed green color from success/verified icons across the app, replacing with primary brand color
- Improved "New Chat" button UI in the Chat Sidebar with a premium glassmorphic `SquarePen` icon
- Removed the date display from history items in the Chat Sidebar
- Improved Chat Sidebar header layout by grouping actions on the right
- Added semantic hashes inside the root `hashes/` directory targeting 56 files across the API to map code transformations safely
- Added `.hash.md` tracking parameters for all API schemas, `errors/index.ts`, `response/index.ts`, and `validation/common.ts`
- Changed core authentication routes (`signin/page.hash.md`) to be re-mapped
- Added `S.decodeUnknown` for untyped input validation across API routes (**Decode_Law**)
- Improved flexible schema validation supporting optional fields and explicit undefined unions (**Optional_Law**)
- Enforced streaming capabilities via raw `Response` objects with `Content-Type: text/event-stream` (**Event_Stream_Law**)
- Implemented `Effect.runPromiseExit` for deterministic success and failure handling (**Exit_Law**)
- Added active token revocation via `supabase.auth.signOut()` on server (**Session_Termination_Law**)
- Changed NextResponse cookie proxy to aggressively scrub local HTTP-only session identifiers (**Cookie_Purge_Law**)
- Added secure read-only endpoint for Client AuthContext hydration without exposing Anon Key (**State_Hydration_Law**)
- Added Server-Side proxy shielding `process.env.OPENROUTER_API_KEY` from browser exposure (**Secure_Proxy_Law**)
- Added exclusive exchange flow for Supabase OAuth `code` grant to secure user sessions (**OAuth_Exchange_Law**)

## 2026-03-22

- Added comprehensive error handling with toast UI (#22)
- Added capturing of both pre-stream (HTTP status) and mid-stream (SSE) errors
- Improved error handling by mapping errors to localized messages for user-friendly display
- Added `ErrorToast` component for premium error notification UI
- Added error categorization (rate limits, auth failures, API errors)
- Improved error handling by integrating with Effect-TS for structured error propagation
- Added dynamic sitemap generation at `/sitemap.xml` (#3)
- Added robots.txt configuration at `/robots.txt`
- Added all public routes to sitemap: `/`, `/about`, `/legal/*`, `/chat`
- Added build hash generation for cache busting
- Added static route accuracy validation
- Improved Puerto Rico tourism content prompts (#0bdbf9f)
- Changed Adaptive Card type definitions for better type safety
- Added support for dynamic content sourcing based on user queries
- Fixed mobile responsiveness for banner positioning and width (#0fe5238)
- Fixed `siteUrl` to allow empty string in `ConfigSchema` (#0d15357)
- Fixed sitemap generation with try-catch fallback for build-time config errors
- Fixed sitemap and robots.txt to be dynamic and avoid build-time config errors
- Fixed build hash generation before build for static route accuracy
- Fixed Next.js security vulnerabilities (#816a6b9): CVE-2025-66478, CVE-2025-55184, CVE-2025-55183, CVE-2025-67779
- Changed production source maps to be disabled (#87da4ac)
- Changed gitignore to include map files
- Removed numerous UI component and Effect AI testing dependencies
- Changed codebase to remove legacy dependencies

## 2026-03-21

- Added 'time-travel' message editing capability (#11)
- Changed conversation history to truncate from edited message point
- Added re-generation of AI responses from edited message
- Improved UI with focus-border removal
- Added full ES/EN localization for editing interface
- Changed Redux state management for message replacement
- Added senior-level chat stream cancellation using Effect's Fiber interruption (#14)
- Added functional Stop button to chat input UI
- Improved Redux state synchronization via Effect.ensuring
- Added visual feedback for cancelled streams
- Added proper cleanup of streaming resources
- Added real-time URL extraction from AI responses (#c92a0a9)
- Added `SourcesSidebar` component for displaying references
- Changed chat service with cursor-based URL scanner
- Added seen-set to prevent duplicate URLs during streaming
- Fixed source sidebar displaying partial URL chunks during streaming (#19)
- Added refined Sidebar z-index and image fallbacks
- Added video anti-hallucination prompt rules (#8eb6531)
- Added search buttons for video content verification
- Added fallback search for artist/culture information
- Improved content verification prompts
- Added sidebar components for research state (#f043e45)
- Added citation management UI
- Added real-time source tracking during AI responses
- Fixed source sidebar duplication issue (#607a9a8)
- Fixed UI/i18n refinements for sidebar components

## 2026-03-20

- Changed base background to solid black with layered amber radial-gradient system (#12)
- Improved scrolling with custom thin scrollbars
- Added browser-level dark mode consistency (`color-scheme`)
- Improved layout stabilization with dedicated scrollbar gutter handling
- Added new `media_search` block type into AdaptiveCard schema
- Added search engine fallback links when direct media URLs unavailable
- Changed monolithic prompt templates into modular structure under `src/lib/effect/services/prompts/` (`role.ts`, `rules.ts`, `guardrails.ts`, `action_handling.ts`, `output_format.ts`, `thought_process.ts`, `accuracy_and_media.ts`, `family_safety.ts`)
- Improved copy-to-clipboard functionality with immediate visual confirmation
- Changed hardcoded UI strings into centralized i18n provider
- Added `BuildInfo` service for build metadata (#e697839)
- Added version hashing system for cache busting
- Added build info display in UI footer
- Improved mobile navigation with responsive menu (#47e41aa)
- Improved branding elements across all pages
- Improved touch interactions on mobile devices
- Removed unused Plus icon from chat input (#15)
- Changed action bar layout for correct alignment
- Changed legacy `@Namespace` tags to standardized `@Route`, `@Logic`, `@UI`, `@Type` annotations (#ace6034)
- Changed standard `Error` to Effect `TaggedErrors` in services and providers (#723bded)
- Changed i18n strings and logic hashes (#302d99a)
- Changed all application URLs to `prai-tourism.com` with dynamic API referer (#bc82984)
- Removed dark background color class from body element (#f8973d7)
- Added dynamic copyright year and footer formatting (#38dbc93)
- Fixed ambient glows and container box artifacts (#970ed6e)
- Changed CookieBanner style to unified and neutral phrasing (#3852f69)
- Fixed minor refinements and logic adjustments (#ff5c845)
- Added technical documentation in `docs/README.md` (#114a823)
- Changed README.md with project details and authorship (#c23d27c)
- Added comprehensive contributing guidelines (#0e31a0e)
- Added security policy documentation
- Added funding policy documentation
- Added MIT License (#777792a)
- Changed package.json description and keywords (#722855c)
- Fixed FUNDING.yml URL to use full URL format (#f6a0e34)

## 2026-03-19

- Added PR/AI - Puerto Rico Tourism AI Assistant
- Added the world's first AI-powered Puerto Rico tourism guide
- Added Effect-TS architecture for type-safe AI interactions
- Added adaptive chat interface with rich media support
- Added internationalization support (English and Spanish)
- Added OpenRouter API integration for AI-powered responses
- Added responsive UI with Framer Motion animations
- Added legal pages (Terms, Privacy, Cookies)

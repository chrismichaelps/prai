# Contributing to PR/AI: The Grammar-First Architecture

Thank you for your interest in contributing to PR/AI. This document provides an extensive guide to our development philosophy, architectural standards, and the **Grammar-First** approach that governs this codebase.

PR/AI is built as a high-fidelity, high-performance AI guide for Puerto Rico, leveraging the **Effect** framework for logic and **Next.js** for the user interface. Consistency is our primary objective.

---

## 1. The Core Philosophy: Grammar-First Development

In this project, implementation code is downstream from architectural definitions. We use a system of **Grammar Shards** (located in `hashes/grammar/`) to define the "Linguistic DNA" of every module before any logic is written.

### 1.1 Why Grammar Matters
Grammar shards act as the source of truth for:
- **Signatures**: The exact types and interfaces a service must expose.
- **Governance**: The rules governing how a service interacts with the rest of the system.
- **Laws**: Explicit architectural constraints (e.g., "Must use `Effect.Service`", "Must use `Data.TaggedError`").
- **Fidelity**: A metric indicating if the documentation is an anchor or a draft.

### 1.2 The Anatomy of a Grammar Shard
Every `.hash.md` file in the `hashes/grammar/` directory follows a strict schema:
- **Language**: The technology or domain (e.g., TypeScript, Effect, Next.js).
- **Fidelity**: Usually `100% (Architectural Anchor)` for core project DNA.
- **Grammar_Lock**: A self-referential path ensuring the anchor cannot be moved or renamed without detection.
- **Namespaces**: Grouped definitions of roles and services.
- **DNA_Anchor**: A unique identifier (e.g., `@Service.OpenRouter`) used in the `.atlas.graph.json` to map impacts.

### 1.3 How to Contribute with Grammar
Before you write a single line of code in `src/`:
1.  **Locate the Grammar**: Find the relevant `.hash.md` file in `hashes/grammar/` (e.g., `prai.hash.md`).
2.  **Align Your Design**: Ensure your proposed changes do not violate the established `Architectural_Laws`.
3.  **Update the Grammar**: If your feature introduces a new pattern or service, you MUST first update the grammar shard to define its role and interface.
4.  **Register the DNA**: Ensure any new service tags are added to the namespace definitions in `prai.hash.md`.

---

## 2. Directory Structure & Organization

Consistency in file placement is mandatory. Our structure mirrors the implementation and its documentation.

### 2.1 The Implementation: `/src`
- `src/app/`: Next.js App Router (Layouts, Pages, API Routes).
- `src/components/`: React UI components (structured via Atomic or Compound patterns).
- `src/lib/effect/`: The heart of the application logic. All side-effectful code lives here.
- `src/lib/effect/services/`: Modular, injectable Effect services.
- `src/store/`: Redux state management (slices, hooks, and store configuration).

### 2.2 The Registry: `/hashes`
- `hashes/src/`: A 1:1 mirror of the `src/` directory containing `.hash.md` files for every module.
- `hashes/grammar/`: The architectural anchors and "DNA" of the project.
- `atlas.graph.json`: The global dependency and impact map.
- `local.map.json`: The local file-to-hash mapping registry.

---

## 3. Technical Standards & Compliance

### 3.1 The Effect Framework
We use Effect to ensure our logic is testable, type-safe, and resilient.
- **Services**: MUST be defined using the `Effect.Service` class pattern with `accessors: true`.
- **Layers**: Dependencies MUST be provided via `Layer`. Avoid raw singleton imports for logic.
- **Error Handling**: Use `Data.TaggedError`. Raw `throw` or unhandled `Promise.reject` is prohibited.
- **Asynchrony**: Prefer `Effect.promise` or `Effect.async` over raw `async/await` wherever possible to maintain traceablity.
- **Logging**: Use `Effect.logDebug`, `Effect.logInfo`, and `Effect.logWarning` instead of `console.log`.

### 3.2 State Management: The Redux Bridge
PR/AI uses a unique "Bridge" pattern for state management:
- **Redux** is the source of truth for the UI and global application state.
- **Effect** is the orchestrator of all state changes and business logic.
- **The Redux Service**: Access the store via the `@Service.Redux` bridge. This service exposes:
    - `dispatch(action)`: Wraps Redux dispatch in an Effect.
    - `getState()`: Wraps `store.getState()` in an Effect.
- **Slices**: Use Redux Toolkit for defining slices. Keep state minimal and derivable where possible.

### 3.3 UI & Design System
- **Compound Components**: For complex UI (like `AdaptiveCard`), use the Compound Component pattern (Root, Media, Header, etc.) with React Context.
- **Performance Laws**:
    - Use `React.memo` for list items (e.g., `MessageBubble`).
    - Use `next/dynamic` for heavy components (e.g., `AdaptiveCard`) to ensure fluidity during message streaming.
- **Styling**: Tailwind CSS is used for utility-first styling, but core design tokens in `tailwind.config.ts` must be respected.
- **Animations**: Use `framer-motion` for micro-interactions and enter/exit transitions.

### 3.4 Adaptive Cards Specification
Our AI communicates using polymorphic Adaptive Cards.
- **Schema**: Defined in `src/lib/effect/schemas/AdaptiveCardsSchema.ts`.
- **Media**: All media (Images, Videos, News) MUST provide fallback mechanisms as defined in the `AdaptiveCard.Media` grammar.
- **Extension**: To add a new card type, register the literal in the grammar before implementing the renderer.

---

## 4. Linguistic Consistency

PR/AI is a localized experience for a global audience.
- **Bi-lingual Support**: All user-facing text must support both **Spanish** and **English**.
- **Neutrality**: Maintain a professional, informative, and neutral tone. avoid AI-generative "fluff" or overly robotic responses.
- **I18n Service**: Use the `I18nService` for all string resolutions. Never hardcode strings in components.
- ** Regionalisms**: Strictly avoid regional slang unless it is part of a specific heritage content shard.

---

## 5. Development Workflow

### 5.1 Environment Setup
We use `pnpm` for fast, efficient package management.
1.  **Node.js**: Use the version specified in `.nvmrc` (v20+ recommended).
2.  **pnpm**: Version 8+ or 9 is required. Check `.npmrc` for configuration details.
3.  **Setup**:
    ```bash
    pnpm install
    ```

### 5.2 Mandatory Commands
- `pnpm dev`: Start the development server locally.
- `pnpm build`: Validate that the project compiles for production.
- `pnpm typecheck`: Run the strict TypeScript compiler check. **Zero errors required.**
- `pnpm lint`: Ensure code style compliance.

### 5.3 Git Standards
- **Branching**: Use `feature/`, `fix/`, or `refactor/` prefixes (e.g., `feature/voice-recognition`).
- **Commits**: Use professional, concise messages.
- **FMCF Commit Format (Legacy)**: If you possess a State_ID, use the Fibonacci Matrix format for structural shifts:
    `git commit -m "FMCF:[State_ID] | Ref:[SHA] | Delta:[Intent] | Grammar:[Lang_Ref]"`

---

## 6. Pull Request Requirements (The Checklist)

To ensure your PR is accepted, verify the following:
1.  **Grammar Alignment**: Does your code perfectly match the signatures defined in `hashes/grammar/`?
2.  **Zero Type Errors**: Does `pnpm run typecheck` pass flawlessly?
3.  **Registry Synchronization**: Have you updated the mirroring `.hash.md` files in `hashes/src/`?
4.  **Performance Integrity**: Does the message stream remain fluid during rendering?
5.  **Documentation Standards**: Does every new service or export have a `/** @Tag */` JSDoc header?
6.  **Linguistic Check**: Are all new strings added to the `I18n` dictionaries in both languages?

---

## 7. Security, Privacy & Safety

- **Data Boundaries**: Never leak environment variables to the client. Use `Effect.Config` to manage secrets.
- **Sanitization**: All user input MUST be sanitized via Effect's schema parsing or `DOMPurify` before rendering.
- **Security Policy**: Refer to `SECURITY.md` for our vulnerability disclosure process.

---

## 8. Common Patterns & Troubleshooting

### Why is my Effect not running?
- Ensure you are actually executing the Effect via `ManagedRuntime` or passing it to an Effect-native entry point.
- Check if you've provided all necessary `Layers` in the environment.

### Why is the UI not updating with Redux?
- Ensure you are using the `useAppSelector` hook for reactive updates.
- Verify that your Effect-based dispatch has successfully completed without errors.

---

## 9. Final Word on Professionalism

PR/AI is a senior-level project. We value:
- **Concision**: Say more with less code.
- **Clarity**: Explicit types over clever hacks.
- **Resilience**: Design for the "edge case" from the start.

---
*Developed with excellence for the island of Puerto Rico. 🇵🇷*

---
### Appendix: Grammar Shard References
| Shard Name | Path | Coverage |
| --- | --- | --- |
| Project DNA | `hashes/grammar/prai.hash.md` | Global Laws, Namespaces, App Patterns |
| Effect Logic | `hashes/grammar/effect.hash.md` | Service Tags, Layers, Error Rules |
| TypeScript | `hashes/grammar/typescript.hash.md` | Type Constraints, Module Laws |
| Next.js UI | `hashes/grammar/next.hash.md` | Routing, hydration, dynamic laws |

---
**Document Status:** 100% Fidelity Architectural Anchor
**Last Updated:** March 2026

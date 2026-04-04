---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Const.Command.Figures

### [Signatures]
```ts
export const TEARDROP_ASTERISK: string  // '✻'
export const SPINNER_VERBS: string[]    // 30 present-tense Spanish verbs
export const COMPLETION_VERBS: string[] // 8 past-tense Spanish verbs
export const PIPE_PENDING: string       // '□'
export const PIPE_RUNNING: string       // '▪'
export const PIPE_DONE: string          // '✓'
export const PIPE_ERROR: string         // '✗'
export const SPINNER_FRAMES: string[]   // ['·', '✢', '✳', '✶', '✻', '✽']
export const PROMPT_CHAR: string        // '❯'
export const COMMAND_CATEGORY_ICONS: Record<string, string>
export const FB_OK: string   // '✓'
export const FB_ERR: string  // '✗'
export const FB_INFO: string // '·'
export const FB_NAV: string  // '›'
export const SPINNER_FRAME_INTERVAL_MS: number  // 120
export const SWEEP_DURATION_MS: number          // 1500
export const SWEEP_COUNT: number                // 2
export const TOTAL_ANIMATION_MS: number         // 3000
export const SETTLED_GREY: string               // 'rgb(153, 153, 153)'
export function hueToRgb(hue: number): string
```

### [Governance]
- **Verb_Pool_Law:** Two pools — 30 SPINNER_VERBS (present-tense, shown while running) and 8 COMPLETION_VERBS (past-tense, shown on completion). Pools are frozen at component spawn via `pickVerbs()`.
- **Icon_Law:** `COMMAND_CATEGORY_ICONS` maps all 6 categories to Unicode star/arrow symbols.
- **Feedback_Law:** `FB_*` symbols used by `CommandService.feedbackFromResult` for toast text.
- **Color_Law:** `hueToRgb` converts HSL (s=0.7, l=0.6) to `rgb(r,g,b)` string for pipeline step colors.

### [Semantic Hash]
All visual constants for the command palette and pipeline animation: verb pools, pipe state icons, spinner frames, feedback symbols, timing constants, and color utilities.

### [Linkage]
- **Downstream:** `@/components/chat/CommandInput`, `@/lib/effect/services/CommandService`

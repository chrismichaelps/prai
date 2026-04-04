---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Command.Input

### [Signatures]
```tsx
interface CommandInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCommandExecute: (cmd: ChatCommand, args: string) => Promise<CommandFeedback>
  placeholder?: string
  disabled?: boolean
}

type PipelineState = 'pending' | 'running' | 'done' | 'error'

interface PipelineStep {
  text: string
  state: PipelineState
  verb?: string
  elapsed?: number
}

function pickVerbs(): { present: string; past: string }
const TypewriterText: React.FC<{ text: string; speed?: number }>
```

### [Governance]
- **Palette_Law:** Input prefixed with `/` triggers `CommandPalette` with `filterCommands(query)` results.
- **Execute_Law:** Selecting a command from palette calls `onCommandExecute(cmd, args)` — returns `CommandFeedback` for toast display.
- **Pipeline_Law:** Running commands render a pipeline step list with `▪ Verb… · Xs` (running) → `✓ VerbPast en Xs` (done).
- **Color_Law:** Running bullet (`▪`) and verb label use `rgb(215,119,87)` (Claude orange) with `animate-pulse`. Elapsed counter uses `rgba(215,119,87,0.45)`.
- **Verb_Law:** `pickVerbs()` frozen at step spawn — same present/past verb pair used throughout a step's lifecycle.
- **Typewriter_Law:** Feedback toast text revealed character-by-character at 22ms/char.

### [Implementation Notes]
- `PIPE_RUNNING = '▪'` with `text-[rgb(215,119,87)] animate-pulse` Tailwind class
- `PIPE_DONE = '✓'`, `PIPE_ERROR = '✗'`, `PIPE_PENDING = '□'`
- Elapsed timer uses `setInterval(1000)` while step is in `running` state
- CommandPalette navigated via ↑↓ keys, selected via Enter/Tab

### [Semantic Hash]
Chat input component with integrated slash-command palette, animated pipeline step display, and typewriter feedback toasts. Visual style matches Claude terminal orange theme.

### [Linkage]
- **Upstream:** `@/components/chat/CommandPalette`, `@/lib/commands/registry`, `@/lib/constants/command-figures`, `@/lib/effect/services/CommandService`
- **Downstream:** `@/components/chat/ChatContainer`

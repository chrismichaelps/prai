---
State_ID: BigInt(0x1)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Command.Palette

### [Signatures]
```tsx
interface CommandPaletteProps {
  commands: ChatCommand[]
  selectedIndex: number
  onSelect: (cmd: ChatCommand) => void
  onNavigate: (index: number) => void
  isOpen: boolean
}

export const CommandPalette: React.FC<CommandPaletteProps>
```

### [Governance]
- **Keyboard_Law:** Handles `ArrowDown`, `ArrowUp`, `Enter`/`Tab` (select), `Escape` (close via `onSelect({})`) — all with `preventDefault`.
- **Scroll_Law:** `useEffect` auto-scrolls selected item into view on `selectedIndex` change.
- **Render_Guard:** Returns `null` if `!isOpen` or `commands.length === 0`.
- **Mouse_Law:** `onMouseDown` uses `preventDefault` to prevent textarea blur on palette click.
- **Selection_Style:** Selected row uses `bg-orange-500/15`; others use `hover:bg-white/5`.

### [Implementation Notes]
- Framer Motion `AnimatePresence` with `initial/animate/exit` `{ opacity, y: 8 }` at 0.12s
- `role="listbox"` / `data-selected` for accessibility
- Category icons from `COMMAND_CATEGORY_ICONS`
- Positioned `absolute bottom-full` above the input

### [Semantic Hash]
Dropdown command palette rendered above the chat input. Keyboard-navigable list of filtered slash commands with category icons and animated entry/exit.

### [Linkage]
- **Upstream:** `@/lib/commands/types`, `@/lib/constants/command-figures`
- **Downstream:** `@/components/chat/CommandInput`

/** @UI.Command.Palette */

'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ChatCommand } from '@/lib/commands/types'
import { COMMAND_CATEGORY_ICONS } from '@/lib/constants/command-figures'

interface CommandPaletteProps {
  commands: ChatCommand[]
  selectedIndex: number
  onSelect: (cmd: ChatCommand) => void
  onNavigate: (index: number) => void
  isOpen: boolean
}

/** @Component.Command.Palette */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  selectedIndex,
  onSelect,
  onNavigate,
  isOpen,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && ref.current) {
      const selected = ref.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, isOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        onNavigate(Math.min(selectedIndex + 1, commands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        onNavigate(Math.max(selectedIndex - 1, 0))
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (commands[selectedIndex]) onSelect(commands[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onSelect({} as ChatCommand)
      }
    },
    [commands, selectedIndex, onSelect, onNavigate]
  )

  if (!isOpen || commands.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.12 }}
        onKeyDown={handleKeyDown}
        className="absolute z-[100] bottom-full left-0 right-0 mb-2 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/40"
        role="listbox"
      >
        {commands.map((cmd, i) => (
          <button
            key={cmd.name}
            data-selected={i === selectedIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(cmd)}
            onMouseEnter={() => onNavigate(i)}
            className={cn(
              'w-full px-3 py-2.5 text-left transition-colors',
              i === selectedIndex ? 'bg-orange-500/15' : 'hover:bg-white/5',
              i !== commands.length - 1 && 'border-b border-white/5'
            )}
            role="option"
            aria-selected={i === selectedIndex}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{COMMAND_CATEGORY_ICONS[cmd.category] || ''}</span>
              <span className="text-sm font-semibold text-white/90">{cmd.name}</span>
              {cmd.argumentHint && (
                <span className="text-xs text-orange-400/60 font-mono">{cmd.argumentHint}</span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5 ml-7">{cmd.description}</p>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

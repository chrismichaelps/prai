/** @UI.Command.Input */

'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommandPalette } from './CommandPalette'
import { filterCommands } from '@/lib/commands/registry'
import type { ChatCommand } from '@/lib/commands/types'
import type { CommandFeedback } from '@/lib/effect/services/CommandService'
import { cn } from '@/lib/utils'
import {
  COMMAND_CATEGORY_ICONS,
  SPINNER_FRAMES,
  SPINNER_VERBS,
  COMPLETION_VERBS,
  PIPE_PENDING,
  PIPE_RUNNING,
  PIPE_DONE,
  PIPE_ERROR,
} from '@/lib/constants/command-figures'

interface CommandInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onCommandExecute: (cmd: ChatCommand, args: string) => Promise<CommandFeedback>
  placeholder?: string
  disabled?: boolean
}

/** @Type.Pipeline.Step */
type PipelineState = 'pending' | 'running' | 'done' | 'error'

interface PipelineStep {
  text: string
  state: PipelineState
  verb?: string
  elapsed?: number
}

/** @Logic.Pipeline.RandomVerbs */
function pickVerbs(): { present: string; past: string } {
  const present =
    SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)]!
  const past =
    COMPLETION_VERBS[Math.floor(Math.random() * COMPLETION_VERBS.length)]!
  return { present, past }
}

/** @Component.Command.TypewriterText */
const TypewriterText: React.FC<{ text: string; speed?: number }> = ({
  text,
  speed = 22,
}) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(0)
    if (!text) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) clearInterval(timer)
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return (
    <span>
      {text.slice(0, count)}
      {count < text.length && (
        <span className="inline-block w-[1ch] animate-pulse opacity-70">_</span>
      )}
    </span>
  )
}

/** @Component.Pipeline.StepIcon */
const StepIcon: React.FC<{ state: PipelineState }> = ({ state }) => {
  const char =
    state === 'running'
      ? PIPE_RUNNING
      : state === 'done'
        ? PIPE_DONE
        : state === 'error'
          ? PIPE_ERROR
          : PIPE_PENDING
  return (
    <span
      className={cn(
        'font-mono shrink-0 w-[1ch]',
        state === 'running' && 'text-[rgb(215,119,87)] animate-pulse',
        state === 'done' && 'text-white/50',
        state === 'error' && 'text-red-400',
        state === 'pending' && 'text-white/25',
      )}
    >
      {char}
    </span>
  )
}

/** @Component.Pipeline.Row */
const PipelineRow: React.FC<{
  step: PipelineStep
  index: number
  isLast: boolean
}> = ({ step, index, isLast }) => {
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (step.state !== 'running') return
    startRef.current = Date.now()
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 500)
    return () => clearInterval(id)
  }, [step.state])

  // Row 0 done = completion summary line ("Explored for 2s") — always dim
  // Row 1+ done = result text — typewriter on last line
  const isCompletionSummary = index === 0 && step.state === 'done'
  const isResultLine = isLast && step.state === 'done'

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="flex items-baseline gap-1.5 leading-snug"
    >
      <StepIcon state={step.state} />
      <span
        className={cn(
          'font-mono text-[15px]',
          step.state === 'running' && 'text-[rgb(215,119,87)]',
          step.state === 'error' && 'text-red-400',
          isCompletionSummary && 'text-white/35',
          isResultLine && 'text-white',
        )}
      >
        {step.state === 'running' && step.verb ? (
          <>
            <span>{step.verb}&hellip;</span>
            {elapsed > 0 && (
              <span className="text-[rgba(215,119,87,0.45)] ml-2">
                · {elapsed}s
              </span>
            )}
          </>
        ) : isResultLine ? (
          <TypewriterText text={step.text} speed={18} />
        ) : (
          <span>{step.text}</span>
        )}
      </span>
    </motion.div>
  )
}

/** @Component.Command.Input */
export const CommandInput: React.FC<CommandInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCommandExecute,
  placeholder = 'Ask about Puerto Rico...',
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [slashQuery, setSlashQuery] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)

  /** @UI.Pipeline.Steps */
  const [pipeline, setPipeline] = useState<PipelineStep[] | null>(null)

  /** @UI.Command.Input.SpinnerAnim */
  const [spinnerFrame, setSpinnerFrame] = useState(0)
  useEffect(() => {
    const id = setInterval(
      () => setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length),
      120,
    )
    return () => clearInterval(id)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const matches = useMemo(
    () => (slashQuery !== null ? filterCommands(slashQuery) : []),
    [slashQuery],
  )

  const isCommandMode = value.startsWith('/')
  const hasPipeline = pipeline !== null && pipeline.length > 0

  const clearPipeline = useCallback(() => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setPipeline(null)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }, [])

  /**
   * @Logic.Pipeline.Run
   * Mirrors the claude-src two-pool pattern:
   *   Phase 1 (running): `▪ Exploring…  · 2s`  — present verb + live timer
   *   Phase 2 (done):    `✓ Explored for 2s`    — past verb + frozen duration (dim)
   *                      `✓ {result text}`       — typewriter reveal on second line
   * Verbs are frozen at spawn (not re-randomized per render).
   */
  const runPipeline = useCallback(
    async (execute: () => Promise<CommandFeedback>) => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)

      // Freeze both verbs at spawn — same as claude-src
      const { present, past } = pickVerbs()
      const startMs = Date.now()

      // Phase 1: running — present verb + live elapsed
      setPipeline([{ text: '', state: 'running', verb: present }])

      let fb: CommandFeedback
      try {
        fb = await execute()
      } catch {
        setPipeline([
          { text: `${past} for 0s`, state: 'error' },
          { text: 'Error al ejecutar el comando', state: 'error' },
        ])
        feedbackTimer.current = setTimeout(clearPipeline, 4500)
        return
      }

      // Freeze elapsed at completion — "Explorado en 2s" style
      const elapsedS = Math.max(1, Math.round((Date.now() - startMs) / 1000))
      const completionLine = `${past} en ${elapsedS}s`

      // Phase 2: done — dim completion summary + result text
      const finalState: PipelineState = fb.type === 'error' ? 'error' : 'done'
      setPipeline([
        { text: completionLine, state: 'done' },
        { text: fb.text, state: finalState },
      ])

      const duration = fb.type === 'error' ? 4500 : 3200
      feedbackTimer.current = setTimeout(clearPipeline, duration)
    },
    [clearPipeline],
  )

  useEffect(
    () => () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    },
    [],
  )

  const detectSlash = useCallback((val: string) => {
    const lastSlash = val.lastIndexOf('/')
    if (lastSlash === -1) {
      setPaletteOpen(false)
      setSlashQuery(null)
      return
    }
    const beforeSlash = val.slice(0, lastSlash)
    if (lastSlash !== 0 && !/\s$/.test(beforeSlash)) {
      setPaletteOpen(false)
      setSlashQuery(null)
      return
    }
    const query = val.slice(lastSlash + 1)
    if (query.includes(' ')) {
      setPaletteOpen(false)
      setSlashQuery(null)
      return
    }
    setSlashQuery(query)
    setPaletteOpen(true)
    setSelectedIndex(0)
  }, [])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value
      onChange(val)
      detectSlash(val)
      requestAnimationFrame(autoResize)
    },
    [onChange, detectSlash, autoResize],
  )

  useEffect(() => {
    autoResize()
  }, [value, autoResize])

  /** @Logic.Command.Execute */
  const executeCommand = useCallback(
    (cmd: ChatCommand, args: string) => {
      onChange('')
      setPaletteOpen(false)
      setSlashQuery(null)
      void runPipeline(() => onCommandExecute(cmd, args))
    },
    [onCommandExecute, onChange, runPipeline],
  )

  /** @Logic.Command.Fill */
  const fillCommand = useCallback(
    (cmd: ChatCommand) => {
      const filled = cmd.name + ' '
      onChange(filled)
      setPaletteOpen(false)
      setSlashQuery(null)
      requestAnimationFrame(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        el.setSelectionRange(filled.length, filled.length)
      })
    },
    [onChange],
  )

  /** @Logic.Command.Apply */
  const applyCommand = useCallback(
    (cmd: ChatCommand, inlineArgs?: string) => {
      if (cmd.argumentHint && !inlineArgs) {
        fillCommand(cmd)
      } else {
        executeCommand(cmd, inlineArgs ?? '')
      }
    },
    [fillCommand, executeCommand],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (paletteOpen && matches.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((p) => Math.min(p + 1, matches.length - 1))
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((p) => Math.max(p - 1, 0))
          return
        }
        if (e.key === 'Tab') {
          e.preventDefault()
          const cmd = matches[selectedIndex]
          if (cmd) fillCommand(cmd)
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          const cmd = matches[selectedIndex]
          if (cmd) applyCommand(cmd)
          return
        }
        if (e.key === 'Escape') {
          e.preventDefault()
          setPaletteOpen(false)
          setSlashQuery(null)
          return
        }
      }

      if (e.key === 'Enter' && !e.shiftKey && !paletteOpen) {
        e.preventDefault()
        if (value.startsWith('/')) {
          const [rawCmd, ...rest] = value.slice(1).split(/\s+/)
          if (rawCmd) {
            const cmdName = '/' + rawCmd.toLowerCase()
            const cmd =
              filterCommands(rawCmd).find(
                (c) => c.name === cmdName || c.aliases?.includes(cmdName),
              ) ?? null
            if (cmd) {
              applyCommand(cmd, rest.join(' ').trim() || undefined)
              return
            }
          }
        }
        onSubmit()
      }
    },
    [
      paletteOpen,
      matches,
      selectedIndex,
      value,
      fillCommand,
      applyCommand,
      onSubmit,
    ],
  )

  const handleSelect = useCallback(
    (cmd: ChatCommand) => {
      if (!cmd.name) {
        setPaletteOpen(false)
        setSlashQuery(null)
        return
      }
      applyCommand(cmd)
    },
    [applyCommand],
  )

  useEffect(() => {
    if (paletteOpen) setSelectedIndex(0)
  }, [slashQuery, paletteOpen])

  const matchedCmd = isCommandMode
    ? matches.find((c) => {
        const q = value.split(/\s/)[0] || ''
        return c.name === q || c.aliases?.includes(q)
      })
    : null

  return (
    <div className="relative w-full">
      {/* Command palette — above the input */}
      <CommandPalette
        commands={matches}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        onNavigate={setSelectedIndex}
        isOpen={paletteOpen}
      />

      {/* Terminal input wrapper */}
      <div
        className={cn(
          'flex items-start gap-2.5 py-4 px-4',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onClick={() => !hasPipeline && textareaRef.current?.focus()}
      >
        {/* Spinner glyph */}
        <span className="text-xs text-white/30 select-none mt-[3px] font-mono shrink-0">
          {SPINNER_FRAMES[spinnerFrame]}
        </span>

        {/* Input / pipeline area */}
        <div className="relative flex-1 min-h-[26px]">
          {/* Textarea — hidden while pipeline is active */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isCommandMode
                ? (matchedCmd?.argumentHint ?? 'args...')
                : placeholder
            }
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none bg-transparent text-[17px] transition-colors',
              '!outline-none !ring-0 !shadow-none !border-none !border-0 border-transparent',
              'focus:outline-none focus:ring-0 focus:border-transparent',
              'placeholder:text-white/20 font-sans leading-relaxed',
              isCommandMode
                ? 'text-white/80 font-mono tracking-tight'
                : 'text-white',
              disabled && 'cursor-not-allowed',
              hasPipeline && 'invisible',
            )}
            style={{ outline: 'none', boxShadow: 'none' }}
          />

          {/* Blinking block cursor (hidden during pipeline or when input has content) */}
          {!hasPipeline && (
            <motion.span
              animate={{ opacity: cursorVisible ? 1 : 0 }}
              transition={{ duration: 0.1 }}
              className={cn(
                'absolute bottom-0.5 w-2 h-5 rounded-sm pointer-events-none',
                isCommandMode ? 'bg-white/60' : 'bg-white/60',
              )}
            />
          )}

          {/* ── Pipeline — sequential steps replacing textarea while command runs ── */}
          <AnimatePresence>
            {hasPipeline && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.4, ease: 'easeOut' },
                }}
                transition={{ duration: 0.08 }}
                className="absolute inset-0 flex flex-col justify-center gap-[3px] py-0.5"
              >
                {pipeline!.map((step, i) => (
                  <PipelineRow
                    key={i}
                    step={step}
                    index={i}
                    isLast={i === pipeline!.length - 1}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Argument hint — only while typing command name, before args */}
        {!hasPipeline &&
          matchedCmd?.argumentHint &&
          value.split(/\s/).length <= 1 && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-mono text-white/25 whitespace-nowrap mt-[3px] shrink-0"
            >
              {matchedCmd.argumentHint}
            </motion.span>
          )}
      </div>

      {/* ── Mode status bar — shown at bottom when palette is open ── */}
      <AnimatePresence>
        {paletteOpen && !hasPipeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-2 flex items-center gap-2"
          >
            <span className="text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase select-none">
              -- / COMANDOS --
            </span>
            {matches.length > 0 && (
              <span className="text-[10px] font-mono text-white/15">
                {COMMAND_CATEGORY_ICONS[matches[0]!.category]}{' '}
                {matches[0]!.name}
                {matches.length > 1 && ` +${matches.length - 1}`}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick category pills when typing / */}
      {isCommandMode && matches.length > 0 && !paletteOpen && !hasPipeline && (
        <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
          {matches.slice(0, 4).map((cmd) => (
            <button
              key={cmd.name}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(cmd.name + ' ')
                textareaRef.current?.focus()
              }}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-colors font-mono"
            >
              {COMMAND_CATEGORY_ICONS[cmd.category]} {cmd.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

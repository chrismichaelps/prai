'use client'

/** @UI.Mentions.MentionInput */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MentionUser {
  id: string
  display_name: string
  handle: string
  avatar_url?: string | null
}

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  disabled?: boolean
}

/** @Logic.Mentions.Debounce */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function MentionInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
  disabled,
}: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // @mention state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState(0)
  const [results, setResults] = useState<MentionUser[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(mentionQuery, 200)

  /** @Logic.Mentions.Search */
  useEffect(() => {
    if (debouncedQuery === null || debouncedQuery.length === 0) {
      setResults([])
      return
    }
    let cancelled = false
    setIsLoading(true)
    fetch(`/api/users/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data: { users?: MentionUser[] }) => {
        if (!cancelled) {
          setResults(data.users ?? [])
          setActiveIndex(0)
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  /** @Logic.Mentions.DetectTrigger */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      onChange(text)

      const cursor = e.target.selectionStart ?? text.length
      // Walk back from cursor to find the nearest @ that starts a mention (word boundary)
      let i = cursor - 1
      while (i >= 0 && text[i] !== '@' && text[i] !== ' ' && text[i] !== '\n')
        i--

      if (i >= 0 && text[i] === '@' && (i === 0 || /\s/.test(text[i - 1]!))) {
        const query = text.slice(i + 1, cursor)
        setMentionStart(i)
        setMentionQuery(query)
      } else {
        setMentionQuery(null)
        setResults([])
      }
    },
    [onChange],
  )

  /** @Logic.Mentions.SelectUser */
  const selectUser = useCallback(
    (user: MentionUser) => {
      const before = value.slice(0, mentionStart)
      const after = value.slice(
        textareaRef.current?.selectionStart ?? mentionStart,
      )
      const inserted = `${before}@${user.handle} ${after}`
      onChange(inserted)
      setMentionQuery(null)
      setResults([])
      // Restore focus and move cursor to after the inserted mention
      requestAnimationFrame(() => {
        const pos = before.length + user.handle.length + 2 // @handle + space
        textareaRef.current?.focus()
        textareaRef.current?.setSelectionRange(pos, pos)
      })
    },
    [value, mentionStart, onChange],
  )

  /** @Logic.Mentions.KeyNav */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!results.length || mentionQuery === null) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (results[activeIndex]) {
          e.preventDefault()
          selectUser(results[activeIndex])
        }
      }
      if (e.key === 'Escape') {
        setMentionQuery(null)
        setResults([])
      }
    },
    [results, mentionQuery, activeIndex, selectUser],
  )

  // Close popover on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setMentionQuery(null)
        setResults([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showPopover = mentionQuery !== null && (isLoading || results.length > 0)

  return (
    <div className="relative w-full" ref={popoverRef}>
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white',
          'placeholder:text-white/20 focus:outline-none focus:border-white/20 transition resize-none',
          className,
        )}
      />

      {/* @mention popover */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 bottom-full mb-1 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-4 gap-2 text-white/30 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Searching…
              </div>
            ) : (
              <ul role="listbox" className="py-1">
                {results.map((user, idx) => (
                  <li
                    key={user.id}
                    role="option"
                    aria-selected={idx === activeIndex}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectUser(user)
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors text-sm',
                      idx === activeIndex
                        ? 'bg-white/[0.07] text-white'
                        : 'text-white/70 hover:bg-white/5',
                    )}
                  >
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.display_name}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 flex-shrink-0">
                        {user.display_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="font-medium">
                        {user.display_name}
                      </span>
                      <span className="text-[11px] text-white/40 leading-none">
                        @{user.handle}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

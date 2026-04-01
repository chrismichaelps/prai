'use client'

/** @UI.Chat.Container */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { addChat, setCurrentChat } from '@/store/slices/chatSlice'
import { useChatActions } from '@/lib/effect/ChatProvider'
import { DiscoveryLoader } from './DiscoveryLoader'
import { useI18n } from '@/lib/effect/I18nProvider'
import { MemoizedMessageBubble } from './MessageBubble'
import { SourcesSidebar } from './SourcesSidebar'
import { useAiSuggestions } from '@/hooks/useAiSuggestions'
import {
  ArrowDown,
  AlertCircle,
  Loader2,
  Mic,
  Square,
  X,
  ChevronRight,
} from 'lucide-react'
/** @Module.UI.Motion */
import { motion } from 'framer-motion'
/** @Module.UI.Utils */
import { cn } from '@/lib/utils'
/** @Module.Context.Auth */
import { useAuth } from '@/contexts/AuthContext'
/** @Module.Next.Navigation */
import { useRouter, usePathname } from 'next/navigation'
/** @Module.Hook.Usage */
import { useUsage } from '@/hooks/useUsage'
import { usePersonalization } from '@/hooks/usePersonalization'
import { useHaptics } from '@/hooks/useHaptics'
import type { UserUsage } from '@/hooks/useUsage'

/** @UI.Chat.AdaptiveCard.Lazy */
const AdaptiveCard = dynamic(
  () => import('./AdaptiveCard').then((m) => ({ default: m.AdaptiveCard })),
  {
    ssr: false,
    loading: () => null,
  },
)

/** @UI.Chat.Root */
export const Chat = {
  Root: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <main
      className={cn(
        'flex-1 flex flex-col min-h-0 relative overflow-hidden',
        className,
      )}
    >
      {children}
    </main>
  ),
  /** @UI.Chat.Messages */
  Messages: ({
    children,
    scrollAreaRef,
    innerRef,
    onScroll,
    className,
    t,
  }: {
    children: React.ReactNode
    scrollAreaRef: React.RefObject<HTMLDivElement | null>
    innerRef?: React.RefObject<HTMLDivElement | null>
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
    className?: string
    t: (key: string) => string
  }) => (
    <div
      ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
      onScroll={onScroll}
      className={cn('flex-1 overflow-y-auto relative z-20', className)}
      style={{ scrollbarGutter: 'stable', overscrollBehaviorY: 'contain' }}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label={t('a11y.chat_messages')}
    >
      <div
        ref={innerRef as React.RefObject<HTMLDivElement>}
        className="w-full max-w-4xl mx-auto space-y-12 md:space-y-20 px-6 py-10 pb-20"
      >
        {children}
      </div>
    </div>
  ),
  /** @UI.Chat.Input */
  Input: ({
    value,
    onChange,
    onSend,
    isLoading,
    showScrollButton,
    onScrollToBottom,
    suggestions,
    textareaRef,
    isRecording,
    onMicClick,
    stopResponse,
    t,
    isAtLimit,
    isAuthenticated,
    usage,
    isUsageVisible,
    onToggleUsage,
    haptics,
  }: {
    value: string
    onChange: (val: string) => void
    onScrollToBottom: () => void
    suggestions?: { label: string; action?: string }[]
    onSend: (text?: string) => void
    isLoading: boolean
    showScrollButton: boolean
    textareaRef: React.RefObject<HTMLTextAreaElement>
    isRecording: boolean
    onMicClick: () => void
    stopResponse: () => void
    t: (key: string) => string
    isAtLimit: boolean
    isAuthenticated: boolean
    usage: UserUsage | null
    isUsageVisible: boolean
    onToggleUsage: () => void
    haptics?: { light: () => void; medium: () => void }
  }) => (
    <footer className="w-full h-fit flex flex-col items-center z-30 pointer-events-none pb-12 px-6">
      {showScrollButton && (
        <button
          onClick={() => {
            haptics?.light()
            onScrollToBottom()
          }}
          aria-label={t('a11y.scroll_bottom')}
          className="pointer-events-auto mb-10 bg-white/5 border border-white/10 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl hover:bg-white/10 transition-all group active:scale-95"
        >
          <ArrowDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </button>
      )}

      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        {/* @UI.Chat.Suggestions */}
        {!isLoading && suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {suggestions.map((suggestion, idx) => (
              <button
                key={suggestion.label + idx}
                onClick={() => {
                  haptics?.light()
                  onSend(suggestion.action || suggestion.label)
                }}
                className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[13px] font-bold text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all shadow-xl flex items-center gap-3 group active:scale-95"
              >
                <span>{suggestion.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-all transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        )}

        {/* @UI.Chat.Usage.Pill */}
        {isAuthenticated && usage && isUsageVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full pointer-events-auto"
          >
            <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-t-[1.5rem] border-b-0 px-6 py-3 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2 text-[13px] text-white/40 overflow-hidden">
                <span className="font-bold text-white shrink-0">
                  {usage.messages_remaining}{' '}
                  {t('usage.remaining_label').toLowerCase()}{' '}
                  {t('usage.messages').toLowerCase()}.
                </span>
                <span className="truncate opacity-60 hidden sm:inline">
                  {t('usage.daily_reset_notice')}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={onToggleUsage}
                  aria-label={t('a11y.close_usage')}
                  className="text-white/20 hover:text-white/60 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* @UI.Chat.Input.Box */}
        <div
          className={cn(
            'w-full bg-[#1a1a1a] shadow-2xl pointer-events-auto flex flex-col border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group overflow-hidden',
            isAuthenticated && usage && isUsageVisible
              ? 'rounded-b-[1.5rem]'
              : 'rounded-[1.5rem]',
            isAtLimit && 'opacity-50',
          )}
        >
          <div className="flex-1 flex flex-col px-1.5 max-h-[400px]">
            {/** @UI.Chat.Input.Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isAtLimit) {
                  e.preventDefault()
                  onSend()
                }
              }}
              rows={1}
              disabled={isAtLimit}
              className={cn(
                'flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[17px] font-normal py-5 px-5 text-white placeholder:text-white/20 resize-none font-sans leading-relaxed transition-[height] duration-200 overflow-hidden',
                isAtLimit && 'opacity-50 cursor-not-allowed',
              )}
              placeholder={
                isAtLimit
                  ? t('usage.limit_reached') || 'Límite alcanzado'
                  : t('chat.placeholder')
              }
              style={{ height: 'auto', outline: 'none', boxShadow: 'none' }}
            />
          </div>

          {/* @UI.Chat.Actions */}
          <div className="flex items-center justify-end px-3 pb-3">
            <div className="flex items-center gap-2">
              {/** @UI.Chat.Action.Mic */}
              <button
                onClick={() => {
                  haptics?.light()
                  onMicClick()
                }}
                aria-label={
                  isRecording
                    ? t('a11y.stop_recording')
                    : t('a11y.start_recording')
                }
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 relative',
                  isRecording
                    ? 'text-primary bg-primary/10'
                    : 'text-white/20 hover:text-white/50',
                )}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                )}
                <Mic
                  className={cn('w-5 h-5', isRecording && 'animate-pulse')}
                />
              </button>
              {/** @UI.Chat.Action.Send */}
              <button
                onClick={() => {
                  haptics?.medium()
                  if (isLoading) {
                    stopResponse()
                  } else {
                    onSend()
                  }
                }}
                disabled={(!isLoading && !value.trim()) || isAtLimit}
                aria-label={
                  isLoading ? t('a11y.stop_response') : t('a11y.send_message')
                }
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative overflow-hidden group shrink-0',
                  (!isLoading && !value.trim()) || isAtLimit
                    ? 'bg-white/5 text-white/10'
                    : 'bg-white/10 text-white hover:bg-white hover:text-slate-950 active:scale-95',
                )}
              >
                {isLoading ? (
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white/20 animate-spin absolute" />
                    <Square className="w-3 h-3 text-white fill-white group-hover:text-slate-950 group-hover:fill-slate-950 transition-colors" />
                  </div>
                ) : (
                  <ArrowDown className="w-5 h-5 -rotate-90 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  ),
}

/** @UI.Chat.Container.Main */
export const ChatContainer: React.FC = () => {
  const { messages, isLoading, error, activeAdaptiveData, currentChatId } =
    useAppSelector((state) => state.chat)
  /** @UI.Hooks.ChatActions */
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { sendMessage, stopResponse, editMessage, startVoice, stopVoice } =
    useChatActions()
  const { t } = useI18n()
  const { usage, isAtLimit, setUsage } = useUsage()
  const { personalization } = usePersonalization()
  const haptics = useHaptics()
  const [isUsageVisible, setIsUsageVisible] = useState(true)
  const [userInput, setUserInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLockedToBottom, setIsLockedToBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const { aiSuggestions, clearSuggestions } = useAiSuggestions(
    messages,
    isLoading,
  )

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const createNewChat = useCallback(async () => {
    if (!user) return null
    try {
      const res = await fetch('/api/chat/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: t('chat.new_chat') || 'New Chat',
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      dispatch(addChat(data))
      dispatch(setCurrentChat(data.id))
      router.push(`/chat/${data.id}`)
      return data.id
    } catch (err) {
      console.error('Error creating chat:', err)
      return null
    }
  }, [user, dispatch, router, t])

  const ensureChatExists = useCallback(async () => {
    if (currentChatId) {
      if (!pathname.includes(currentChatId)) {
        router.replace(`/chat/${currentChatId}`)
      }
      return currentChatId
    }
    return await createNewChat()
  }, [currentChatId, createNewChat, router, pathname])

  /** @Logic.Chat.Input.Resize */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const nextHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${nextHeight}px`

      /** @UI.Chat.ScrollHandling */
      if (nextHeight > 400) {
        textareaRef.current.style.overflowY = 'auto'
      } else {
        textareaRef.current.style.overflowY = 'hidden'
      }
    }
  }, [userInput])

  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 120

    setIsLockedToBottom(isAtBottom)
    setShowScrollButton(!isAtBottom && scrollHeight > clientHeight * 1.5)
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior,
      })
    }
  }, [])

  /** @UI.Chat.ScrollSync */
  useEffect(() => {
    if (isLockedToBottom) {
      scrollToBottom('auto')
    }
  }, [messages, activeAdaptiveData, isLockedToBottom, scrollToBottom])

  /** @UI.Chat.LoadingState.ScrollSync */
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('smooth')
    }
  }, [isLoading, scrollToBottom])

  /** @UI.Chat.ResizeObserver */
  useEffect(() => {
    if (!textareaRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        if (isLockedToBottom) {
          scrollToBottom('auto')
        }
      }
    })

    if (innerContainerRef.current) {
      observer.observe(innerContainerRef.current)
    }
    return () => observer.disconnect()
  }, [isLockedToBottom, scrollToBottom])

  /** @Logic.Chat.EnsureChatOnMount */
  useEffect(() => {
    if (user && !currentChatId) {
      ensureChatExists()
    }
  }, [user, currentChatId, ensureChatExists])

  const handleMicClick = () => {
    if (isRecording) {
      stopVoice()
      setIsRecording(false)
    } else {
      setIsRecording(true)
      startVoice((text, isFinal) => {
        setUserInput(text)
        if (isFinal) {
          setIsRecording(false)
          stopVoice()
        }
      })
    }
  }

  const handleSend = useCallback(
    async (text?: string) => {
      if (isRecording) {
        /** @UI.Chat.MicCleanup */
        handleMicClick()
      }
      const content = text || userInput
      if (!content.trim() || isAtLimit) return

      haptics.medium()
      // Optimistic usage update
      if (usage && usage.messages_remaining > 0) {
        setUsage({
          ...usage,
          messages_used: usage.messages_used + 1,
          messages_remaining: usage.messages_remaining - 1,
          usage_percentage: Math.min(
            ((usage.messages_used + 1) / usage.messages_limit) * 100,
            100,
          ),
          can_send: usage.messages_remaining - 1 > 0,
        })
      }

      setUserInput('')
      clearSuggestions()
      setIsLockedToBottom(true)

      await ensureChatExists()
      await sendMessage(content, personalization)
      scrollToBottom('smooth')
    },
    [
      isRecording,
      userInput,
      isAtLimit,
      usage,
      setUsage,
      ensureChatExists,
      sendMessage,
      scrollToBottom,
      handleMicClick,
      personalization,
      haptics,
    ],
  )

  return (
    <Chat.Root>
      <Chat.Messages
        scrollAreaRef={scrollAreaRef}
        innerRef={innerContainerRef}
        onScroll={handleScroll}
        t={t}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-32 animate-in fade-in duration-1000" />
        )}

        {messages.map((msg, index) => (
          <MemoizedMessageBubble
            key={index}
            message={msg}
            index={index}
            onEdit={(idx, content) =>
              editMessage(idx, content, personalization)
            }
            onStop={stopResponse}
          />
        ))}

        {activeAdaptiveData.length > 0 &&
          activeAdaptiveData.map((adaptive, idx) => (
            <div
              key={idx}
              className="py-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <AdaptiveCard
                type={adaptive.type}
                data={adaptive.data}
                onAction={handleSend}
              />
            </div>
          ))}

        {isLoading && (
          <div className="flex flex-col space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-2xl overflow-hidden">
                <DiscoveryLoader />
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-white/50 font-black">
                {t('chat.loading')}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-6 rounded-2xl animate-pulse max-w-sm shadow-2xl">
              <span className="text-base italic text-white/40 tracking-wider font-light">
                {t('chat.discovering')}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-sm flex items-center gap-4 border border-red-100 shadow-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Suggestions handled by Chat.Input pills */}
      </Chat.Messages>

      <Chat.Input
        value={userInput}
        onChange={setUserInput}
        onSend={handleSend}
        isLoading={isLoading}
        showScrollButton={showScrollButton}
        onScrollToBottom={() => scrollToBottom('smooth')}
        textareaRef={textareaRef}
        isRecording={isRecording}
        onMicClick={handleMicClick}
        stopResponse={stopResponse}
        t={t}
        isAtLimit={isAtLimit}
        isAuthenticated={!!user}
        usage={usage}
        isUsageVisible={isUsageVisible}
        onToggleUsage={() => setIsUsageVisible(false)}
        haptics={haptics}
        suggestions={aiSuggestions.map((s) => ({ label: s }))}
      />
      <SourcesSidebar />
    </Chat.Root>
  )
}

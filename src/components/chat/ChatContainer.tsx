'use client'

/** @UI.Chat.Container */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/store/hooks'
import { useChatActions } from '@/lib/effect/ChatProvider'
import { DiscoveryLoader } from './DiscoveryLoader'
import { useI18n } from '@/lib/effect/I18nProvider'
import { MemoizedMessageBubble } from './MessageBubble'
import { ArrowDown, AlertCircle, Loader2, Plus, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

/** @UI.Chat.AdaptiveCard.Lazy */
const AdaptiveCard = dynamic(
  () => import('./AdaptiveCard').then((m) => ({ default: m.AdaptiveCard })),
  {
    ssr: false,
    loading: () => null,
  },
)

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
  Messages: ({
    children,
    scrollAreaRef,
    innerRef,
    onScroll,
    className,
  }: {
    children: React.ReactNode
    scrollAreaRef: React.RefObject<HTMLDivElement | null>
    innerRef?: React.RefObject<HTMLDivElement | null>
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
    className?: string
  }) => (
    <div
      ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
      onScroll={onScroll}
      className={cn(
        'flex-1 overflow-y-auto relative z-20',
        className,
      )}
      style={{ scrollbarGutter: 'stable', overscrollBehaviorY: 'contain' }}
    >
      <div
        ref={innerRef as React.RefObject<HTMLDivElement>}
        className="w-full max-w-4xl mx-auto space-y-12 md:space-y-20 px-6 py-10 pb-20"
      >
        {children}
      </div>
    </div>
  ),
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
    t,
  }: {
    value: string
    onChange: (val: string) => void
    onScrollToBottom: () => void
    suggestions?: any[]
    onSend: (text?: string) => void
    isLoading: boolean
    showScrollButton: boolean
    textareaRef: React.RefObject<HTMLTextAreaElement>
    isRecording: boolean
    onMicClick: () => void
    t: (key: string) => string
  }) => (
    <footer className="w-full h-fit flex flex-col items-center z-30 pointer-events-none pb-12 px-6">
      {showScrollButton && (
        <button
          onClick={onScrollToBottom}
          className="pointer-events-auto mb-10 bg-white/5 border border-white/10 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl hover:bg-white/10 transition-all group active:scale-95"
        >
          <ArrowDown className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
        </button>
      )}

      <div className="w-full max-w-2xl flex flex-col items-center space-y-6">
        {/* @UI.Chat.Suggestions */}
        {!isLoading && suggestions && suggestions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {suggestions.map((suggestion: any, idx: number) => (
              <button
                key={suggestion.id || idx}
                onClick={() => onSend(suggestion.text)}
                className="px-5 py-2.5 rounded-2xl bg-[#1a1a1a] border border-white/[0.08] text-xs font-bold text-white/40 hover:bg-white/5 hover:text-white transition-all shadow-xl flex items-center gap-3 group"
              >
                <span>{suggestion.text}</span>
                <ArrowDown className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-2px] group-hover:translate-x-0" />
              </button>
            ))}
          </div>
        )}

        {/* @UI.Chat.Input */}
        <div className="w-full bg-[#1a1a1a] shadow-2xl pointer-events-auto flex flex-col border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group overflow-hidden rounded-[1.5rem]">
          <div className="flex-1 flex flex-col px-1.5 max-h-[400px]">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSend()
                }
              }}
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-[17px] font-normal py-5 px-5 text-white placeholder:text-white/20 resize-none font-sans leading-relaxed transition-[height] duration-200 overflow-hidden"
              placeholder={t('chat.placeholder')}
              style={{ height: 'auto', outline: 'none', boxShadow: 'none' }}
            />
          </div>

          {/* @UI.Chat.Actions */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-0.5">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-all active:scale-90">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMicClick}
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
              <button
                onClick={() => onSend()}
                disabled={(!value.trim() && !isLoading) || isLoading}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative overflow-hidden group shrink-0',
                  isLoading || !value.trim()
                    ? 'bg-white/5 text-white/10'
                    : 'bg-white/10 text-white hover:bg-white hover:text-slate-950 active:scale-95',
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-white/20 animate-spin" />
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

export const ChatContainer: React.FC = () => {
  const { messages, isLoading, error, activeAdaptiveData } = useAppSelector(
    (state) => state.chat,
  )
  const { sendMessage, startVoice, stopVoice } = useChatActions()
  const { t } = useI18n()

  const [userInput, setUserInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLockedToBottom, setIsLockedToBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  /** @UI.Chat.LoadingState */
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('smooth')
    }
  }, [isLoading, scrollToBottom])

  /** @UI.Chat.ResizeObserver */
  useEffect(() => {
    if (!innerContainerRef.current) return

    const observer = new ResizeObserver(() => {
      if (isLockedToBottom) {
        scrollToBottom('auto')
      }
    })

    observer.observe(innerContainerRef.current)
    return () => observer.disconnect()
  }, [isLockedToBottom, scrollToBottom])

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

  const handleSend = async (text?: string) => {
    if (isRecording) {
      /** @UI.Chat.MicCleanup */
      handleMicClick()
    }
    const finalContent = text || userInput
    if (!finalContent.trim() || isLoading) return

    setUserInput('')
    setIsLockedToBottom(true)
    await sendMessage(finalContent)
    scrollToBottom('smooth')
  }

  return (
    <Chat.Root>
      <Chat.Messages
        scrollAreaRef={scrollAreaRef}
        innerRef={innerContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-32 animate-in fade-in duration-1000" />
        )}

        {messages.map((msg, index: number) => (
          <MemoizedMessageBubble key={index} message={msg} />
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
        t={t}
      />
    </Chat.Root>
  )
}

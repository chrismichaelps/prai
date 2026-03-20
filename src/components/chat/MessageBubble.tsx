'use client'

/** @UI.Chat.Bubble */

import React, { useMemo, useState } from 'react'
import { useI18n } from '@/lib/effect/I18nProvider'
import MarkdownIt from 'markdown-it'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hooks'
import { openSources } from '@/store/slices/chatSlice'
import type { ChatMessage, SearchResult } from '@/types/chat'
import {
  Copy,
  ChevronRight,
  FileText,
  CheckCircle2,
  Search,
  Globe,
} from 'lucide-react'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

interface MessageBubbleProps {
  message: ChatMessage & {
    metadata?: {
      thought?: string
      thoughtDuration?: string
      steps?: { type: 'analyzed' | 'plan' | 'search'; label: string }[]
      sources?: SearchResult[]
      searchQuery?: string
    }
  }
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { t } = useI18n()
  if (message.role === 'system') return null
  const isUser = message.role === 'user'
  const [isThoughtOpen, setIsThoughtOpen] = useState(false)

  const dispatch = useAppDispatch()
  const [isCopied, setIsCopied] = useState(false)

  const strippedContent = useMemo(() => {
    /** @UI.Chat.StripJson */
    return message.content.replace(/```json[\s\S]*?(?:```|$)/g, '').trim()
  }, [message.content])

  const htmlContent = useMemo(() => {
    return { __html: md.render(strippedContent) }
  }, [strippedContent])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(strippedContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const thoughtUrls = useMemo(() => {
    if (!message.metadata?.thought) return []
    const urlRegex = /(https?:\/\/[^\s)<>"]+)/g
    const matches = message.metadata.thought.match(urlRegex)
    return Array.from(new Set(matches || []))
  }, [message.metadata?.thought])

  return (
    <div
      className={cn(
        'group relative w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500',
        isUser ? 'flex flex-col items-end' : 'flex flex-col items-start',
      )}
    >
      {/* @UI.Chat.Bubble.Content */}
      <div className={cn('max-w-[92%] md:max-w-[85%] relative w-full')}>
        {/* @UI.Chat.Bubble.Actions */}
        {!isUser && (
          <div className="absolute -top-1 w-full flex justify-end pointer-events-none z-10">
            <button
              onClick={copyToClipboard}
              className="pointer-events-auto px-2 py-1 flex items-center gap-1.5 text-white/20 hover:text-white/60 transition-all rounded-lg hover:bg-white/5 active:scale-95 text-[11px] font-bold uppercase tracking-widest"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                  <span className="text-white/90">{t('chat.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  {t('chat.copy')}
                </>
              )}
            </button>
          </div>
        )}

        {/* @UI.Chat.Bubble.User */}
        {isUser && (
          <div className="flex flex-col items-end">
            <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-[2rem] px-6 py-4 text-white/90 text-[17px] font-normal shadow-2xl inline-block max-w-2xl">
              {message.content}
            </div>
          </div>
        )}

        {/* @UI.Chat.Bubble.Assistant */}
        {!isUser && (
          <div className="flex flex-col space-y-4 w-full">
            {/* @UI.Chat.Bubble.Process */}
            <div className="flex flex-col space-y-2.5">
              {/* @UI.Chat.Bubble.Thought */}
              {message.metadata?.thought && (
                <div className="flex flex-col">
                  <button
                    onClick={() => setIsThoughtOpen(!isThoughtOpen)}
                    className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-[14px] font-medium group/btn py-1"
                  >
                    <motion.div
                      animate={{ rotate: isThoughtOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover/btn:text-white/50" />
                    </motion.div>
                    <span>
                      {(() => {
                        const val = message.metadata?.thoughtDuration
                        if (!val) return t('chat.thinking')
                        if (val.startsWith('status:')) {
                          return `${t('chat.thinking.prefix')} ${t(val.split(':')[1] || 'chat.thinking.analyzing')}`
                        }
                        if (val.startsWith('completed:')) {
                          return `${t('chat.thinking.completed')} ${val.split(':')[1] || ''}`
                        }
                        return val
                      })()}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isThoughtOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 py-3 pb-5 border-l border-white/10 pl-5">
                          {/* Render Thought Text */}
                          <div className="text-white/40 text-[14px] leading-relaxed font-light italic whitespace-pre-wrap">
                            {message.metadata.thought}
                          </div>

                          {/* Render URL Bubbles */}
                          {thoughtUrls.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5">
                              <div className="flex items-center gap-2 text-white/30 text-[12px] uppercase tracking-wider font-bold mb-3">
                                <Search className="w-3.5 h-3.5" />
                                <span>{t('chat.sources')}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {thoughtUrls.map((url, i) => {
                                  try {
                                    const domain = new URL(
                                      url,
                                    ).hostname.replace('www.', '')
                                    return (
                                      <a
                                        key={i}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[12px] font-medium text-white/50 hover:text-white transition-all hover:scale-105 active:scale-95"
                                      >
                                        <Globe className="w-3 h-3" />
                                        <span>{domain}</span>
                                      </a>
                                    )
                                  } catch (e) {
                                    return null
                                  }
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* @UI.Chat.Bubble.Status */}
              {message.metadata?.steps?.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 text-white/60 font-medium text-[15px] pl-1 animate-in slide-in-from-left-2 duration-500"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {step.type === 'analyzed' && (
                      <CheckCircle2 className="w-4 h-4 text-white/30" />
                    )}
                    {step.type === 'plan' && (
                      <FileText className="w-4 h-4 text-white/30" />
                    )}
                    {step.type === 'search' && (
                      <Search className="w-4 h-4 text-white/30" />
                    )}
                  </div>
                  <span className="text-[14px] tracking-tight">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* @UI.Chat.Bubble.Response */}
            <div
              className={cn(
                'prose prose-p:leading-relaxed prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/[0.05]',
                'prose-code:before:content-none prose-code:after:content-none prose-code:text-white/80 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md',
                'prose-headings:text-[17px] prose-headings:font-black prose-headings:mb-3 prose-headings:mt-6 prose-headings:text-white/90',
                'prose-strong:text-white/90 prose-strong:font-black',
                'prose-ul:list-disc prose-ul:pl-5 prose-li:marker:text-white/20',
                'font-sans text-[17px] font-normal max-w-none text-white/90 leading-relaxed selection:bg-white/10',
              )}
              dangerouslySetInnerHTML={htmlContent}
            />

            {/* @UI.Chat.Bubble.SourcesPill */}
            {!isUser &&
              (message.metadata?.sources?.filter(
                (s) => s.url && s.url.startsWith('http'),
              ).length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-white/[0.03]">
                  <button
                    onClick={() => {
                      dispatch(
                        openSources({
                          query:
                            message.metadata?.searchQuery ||
                            message.content.slice(0, 50),
                          sources:
                            message.metadata?.sources?.filter(
                              (s) => s.url && s.url.startsWith('http'),
                            ) || [],
                        }),
                      )
                    }}
                    className="group/sources flex items-center gap-2.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300 hover:bg-white/10 active:scale-95 shadow-xl"
                  >
                    {/* Favicon Stack */}
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {(message.metadata?.sources?.slice(0, 3) || []).map(
                        (s, i) => (
                          <div
                            key={i}
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-black bg-white/10 backdrop-blur-xl flex items-center justify-center"
                          >
                            {s.icon ? (
                              <img
                                src={s.icon}
                                alt=""
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : (
                              <Globe className="h-3 w-3 text-white/40" />
                            )}
                          </div>
                        ),
                      )}
                      {(!message.metadata?.sources ||
                        message.metadata.sources.length === 0) && (
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-black bg-white/10 backdrop-blur-xl flex items-center justify-center">
                          <Globe className="h-3 w-3 text-white/40" />
                        </div>
                      )}
                    </div>

                    <span className="text-[13px] font-bold text-white/50 group-hover/sources:text-white transition-colors">
                      {message.metadata?.sources?.filter(
                        (s) => s.url && s.url.startsWith('http'),
                      ).length ?? 0}{' '}
                      {t('chat.sources')}
                    </span>

                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover/sources:text-white/60 transition-all transform group-hover/sources:translate-x-0.5" />
                  </button>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export const MemoizedMessageBubble = React.memo(MessageBubble)

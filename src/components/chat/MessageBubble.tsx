'use client'

/** @UI.Chat.Bubble */

import React, { useMemo, useState } from 'react'
import { useI18n } from '@/lib/effect/I18nProvider'
import MarkdownIt from 'markdown-it'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/chat'
import { Copy, ChevronRight, FileText, CheckCircle2, Search } from 'lucide-react'

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
    }
  }
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { t } = useI18n()
  if (message.role === 'system') return null
  const isUser = message.role === 'user'
  const [isThoughtOpen, setIsThoughtOpen] = useState(false)

  const htmlContent = useMemo(() => {
    /** @UI.Chat.StripJson */
    const strippedContent = message.content.replace(/```json[\s\S]*?(?:```|$)/g, '').trim()
    return { __html: md.render(strippedContent) }
  }, [message.content])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div
      className={cn(
        'group relative w-full mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500',
        isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'
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
              <Copy className="w-3.5 h-3.5" />
              {t('chat.copy')}
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
                         <div className="ml-6 py-3 pb-5 text-white/30 text-[14px] leading-relaxed font-light border-l border-white/10 pl-5 italic">
                          {message.metadata.thought}
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
                    {step.type === 'analyzed' && <CheckCircle2 className="w-4 h-4 text-white/30" />}
                    {step.type === 'plan' && <FileText className="w-4 h-4 text-white/30" />}
                    {step.type === 'search' && <Search className="w-4 h-4 text-white/30" />}
                  </div>
                  <span className="text-[14px] tracking-tight">{step.label}</span>
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
          </div>
        )}
      </div>
    </div>
  )
}

export const MemoizedMessageBubble = React.memo(MessageBubble)

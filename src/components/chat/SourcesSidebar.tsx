'use client'

/** @UI.Chat.SourcesSidebar */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DOMPurify from 'isomorphic-dompurify'
import MarkdownIt from 'markdown-it'
import { X, Search, Globe, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeSources } from '@/store/slices/chatSlice'
import { cn } from '@/lib/utils'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

export const SourcesSidebar: React.FC = () => {
  const { isSourcesOpen, selectedSources } = useAppSelector(
    (state) => state.chat,
  )
  const dispatch = useAppDispatch()
  const { t } = useI18n()

  const htmlQuery = React.useMemo(() => {
    if (!selectedSources?.query) return { __html: '' }
    const html = md.render(selectedSources.query)
    return { __html: DOMPurify.sanitize(html) }
  }, [selectedSources?.query])

  if (!selectedSources && isSourcesOpen) return null

  return (
    <AnimatePresence>
      {isSourcesOpen && (
        <>
          {/* Backdrop for Mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSources())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-black border-l border-white/10 z-[150] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="text-[17px] font-black tracking-tight text-white/90">
                {t('chat.sources')}
              </h2>
              <button
                onClick={() => dispatch(closeSources())}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
              {/* Search Context */}
              {selectedSources?.query && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-white/20">
                    <Search className="w-3.5 h-3.5" />
                    <span>{t('chat.search_context')}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div
                      className={cn(
                        'prose prose-p:leading-relaxed prose-invert max-w-none text-white/80',
                        'prose-headings:text-base prose-headings:font-black prose-headings:mb-2 prose-headings:mt-4 prose-headings:text-white/90',
                        'prose-strong:text-white/90 prose-strong:font-black',
                        'text-[15px] font-medium leading-relaxed italic',
                      )}
                      dangerouslySetInnerHTML={htmlQuery}
                    />
                  </div>
                </div>
              )}

              {/* Sources List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/20">
                    {selectedSources?.sources.filter(
                      (s) => s.url && s.url.startsWith('http'),
                    ).length || 0}{' '}
                    {t('chat.sources').toLowerCase()}
                  </div>
                </div>

                <div className="grid gap-4">
                  {selectedSources?.sources.map((source, idx) => {
                    const hasValidUrl =
                      source.url && source.url.startsWith('http')
                    const domain = hasValidUrl
                      ? (() => {
                          try {
                            return new URL(source.url).hostname.replace(
                              'www.',
                              '',
                            )
                          } catch {
                            return source.url
                          }
                        })()
                      : source.title || source.source || 'Unknown'

                    return hasValidUrl ? (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'group/card flex gap-3 rounded-2xl p-4 transition-all duration-300 hover:translate-x-1',
                          source.verified
                            ? 'bg-[#1a1a1a]/40 hover:bg-[#1a1a1a]/80 border border-white/[0.05] hover:border-primary/20'
                            : 'bg-[#1a1a1a]/40 hover:bg-[#1a1a1a]/60 border border-white/[0.05] hover:border-white/10',
                        )}
                      >
                        {/* Favicon */}
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center p-1.5 overflow-hidden shrink-0 mt-0.5">
                          {source.icon ? (
                            <img
                              src={source.icon}
                              alt=""
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement
                                img.style.display = 'none'
                                const globe = img.nextElementSibling as HTMLElement | null
                                if (globe) globe.style.removeProperty('display')
                              }}
                            />
                          ) : null}
                          <Globe
                            className="w-3.5 h-3.5 text-white/30"
                            style={{ display: source.icon ? 'none' : undefined }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[14px] font-semibold leading-snug group-hover/card:text-white transition-colors line-clamp-2 text-white/90">
                              {source.title || domain}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-white/15 group-hover/card:text-white/40 transition-colors shrink-0 mt-0.5" />
                          </div>

                          {source.snippet && (
                            <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2 font-light">
                              {source.snippet}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 mt-0.5">
                            {source.verified && (
                              <CheckCircle2 className="w-3 h-3 text-primary/70 shrink-0" />
                            )}
                            <span className="text-[11px] font-medium text-white/35 group-hover/card:text-white/55 transition-colors truncate">
                              {domain}
                            </span>
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div
                        key={idx}
                        className="block bg-[#1a1a1a]/40 border border-white/[0.05] rounded-2xl p-4 opacity-40 cursor-not-allowed"
                        title="Source URL not verified"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-[15px] font-bold text-white/50 leading-snug line-clamp-2">
                              {source.title}
                            </h3>
                            <Globe className="w-4 h-4 text-white/10 shrink-0 mt-1" />
                          </div>
                          {source.snippet && (
                            <p className="text-[13px] text-white/30 leading-relaxed line-clamp-3 font-light">
                              {source.snippet}
                            </p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[12px] font-medium text-white/30">
                              {t('chat.no_sources')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {(!selectedSources ||
                    selectedSources.sources.length === 0) && (
                    <div className="py-20 text-center">
                      <p className="text-white/20 text-sm italic tracking-widest uppercase">
                        {t('chat.no_sources')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

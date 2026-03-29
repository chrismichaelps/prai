'use client'

import React, { createContext, useContext, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Rss, Code } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import MarkdownIt from 'markdown-it'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { cn } from '@/lib/utils'
import type { Release } from '@/lib/effect/services/Changelog'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const MAX_CHARS_PREVIEW = 300

/** @Type.Releases.Context */
interface ReleasesContextValue {
  releases: Release[]
}

const ReleasesContext = createContext<ReleasesContextValue | null>(null)

/** @Logic.Releases.UseContext */
function useReleases() {
  const context = useContext(ReleasesContext)
  if (!context) {
    throw new Error('useReleases must be used within ReleasesProvider')
  }
  return context
}

/** @UI.Releases.Background */
function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}

/** @UI.Releases.Breadcrumb */
function Breadcrumb() {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-3 mb-4">
      <PraiLogo white={true} size={18} animate={true} />
      <span className="text-white/10 font-thin">|</span>
      <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest">
        {t('releases.all_notes')}
      </span>
    </div>
  )
}

/** @UI.Releases.SocialActions */
function SocialActions() {
  const { t } = useI18n()
  const socialActions = [
    { label: t('releases.rss_feed'), icon: Rss, color: 'bg-[#ff9900]', href: '/releases/feed.xml' },
    { label: t('releases.api_feed'), icon: Code, color: 'bg-[#667788]', href: '/api/releases' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-[12px] font-bold text-white/40 mr-2 self-center">
        {t('releases.get_feed')}
      </span>
      {socialActions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold text-white transition-all hover:scale-105 active:scale-95',
            action.color,
          )}
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </a>
      ))}
    </div>
  )
}

/** @UI.Releases.Header */
function HeroHeader() {
  const { t } = useI18n()

  return (
    <div className="border-b border-white/5 pb-12 mb-12">
      <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
        {t('releases.title')}
      </h1>
      <p className="text-[15px] text-white/40 mb-8 font-medium">
        {t('releases.subtitle')}
      </p>
      <SocialActions />
    </div>
  )
}

/** @UI.Releases.Content */
function Content({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none font-sans leading-relaxed selection:bg-white/10',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(content)) }}
    />
  )
}

/** @UI.Releases.DateColumn */
function DateColumn({ date }: { date: string }) {
  return (
    <div className="order-2 md:order-1">
      <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors block md:sticky md:top-32">
        {new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })}
      </span>
    </div>
  )
}

/** @UI.Releases.LogoColumn */
function LogoColumn() {
  return (
    <div className="hidden md:flex justify-center order-1 md:order-2">
      <div className="sticky top-[124px] w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/60 shadow-2xl backdrop-blur-xl group-hover:border-white/20 transition-all overflow-hidden">
        <PraiLogo white={true} size={18} className="scale-90" />
      </div>
    </div>
  )
}

/** @UI.Releases.VersionInfo */
function VersionInfo() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-0.5 mb-6">
      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
        {t('releases.product.code')} by {t('brand.name')}
      </span>
    </div>
  )
}

/** @UI.Releases.ExpandableContent */
function ExpandableContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)

  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
  const isLongContent = plainText.length > MAX_CHARS_PREVIEW

  const handleCollapse = () => {
    setIsExpanded(false)
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isExpanded) {
    return (
      <div ref={cardRef} className="space-y-6">
        <div className="bg-white/5 border border-white/[0.03] p-6 rounded-2xl shadow-2xl backdrop-blur-3xl">
          <Content
            content={content}
            className="prose-md text-white/90 prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:leading-relaxed prose-strong:text-white prose-strong:font-black"
          />
        </div>
        <button
          onClick={handleCollapse}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white/70 transition-all group"
        >
          <ChevronDown className="w-3.5 h-3.5 rotate-180 group-hover:-translate-y-0.5 transition-transform" />
          <span>{t('common.show_less')}</span>
        </button>
      </div>
    )
  }

  if (!isLongContent) {
    return (
      <div className="bg-white/5 border border-white/[0.03] p-6 rounded-2xl shadow-2xl backdrop-blur-3xl">
        <Content
          content={content}
          className="prose-md text-white/90 prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:leading-relaxed prose-strong:text-white prose-strong:font-black"
        />
      </div>
    )
  }

  const truncatedContent = truncateAtWordBoundary(content, MAX_CHARS_PREVIEW)

  return (
    <div className="bg-white/5 border border-white/[0.03] p-6 rounded-2xl shadow-2xl backdrop-blur-3xl">
      <div className="relative">
        <Content
          content={truncatedContent}
          className="prose-md text-white/90 prose-p:leading-relaxed prose-li:leading-relaxed prose-ul:leading-relaxed prose-strong:text-white prose-strong:font-black [&_ul]:max-h-48 [&_ul]:overflow-hidden"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/5 via-white/5/90 to-transparent pointer-events-none" />
      </div>
      <button
        onClick={() => setIsExpanded(true)}
        className="mt-[-2rem] relative z-10 mx-auto block w-fit flex items-center gap-2 px-5 py-2.5 bg-[#090909] border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-white/70 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group shadow-lg"
      >
        <span>{t('common.show_more')}</span>
        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  )
}

/** @Logic.Releases.TruncateMarkdown */
function truncateAtWordBoundary(content: string, maxChars: number): string {
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\n/g, ' ')
    .trim()

  if (plainText.length <= maxChars) return content

  let charCount = 0
  let inTag = false
  let result = ''
  let i = 0

  while (i < content.length && charCount < maxChars) {
    const char = content[i]

    if (char === '<') {
      inTag = true
      result += char
    } else if (char === '>') {
      inTag = false
      result += char
    } else if (!inTag) {
      result += char
      if (char !== ' ' && charCount > 0) {
        charCount++
      } else if (char === ' ') {
        charCount++
      }
    } else {
      result += char
    }

    i++
  }

  result = result.replace(/\s+\S*$/, '') + '...'

  const openTags: string[] = []
  const tagRegex = /<(\/?)([\w-]+)[^>]*>/g
  let match

  while ((match = tagRegex.exec(result)) !== null) {
    const tagName = match[2]
    if (match[1] === '/') {
      openTags.pop()
    } else if (
      tagName &&
      !['br', 'hr', 'img', 'input', 'li'].includes(tagName.toLowerCase())
    ) {
      openTags.push(tagName)
    }
  }

  while (openTags.length > 0) {
    const tag = openTags.pop()
    if (tag) result += `</${tag}>`
  }

  return result
}

/** @UI.Releases.TimelineCard */
function TimelineCard({ release, index }: { release: Release; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      className="grid grid-cols-1 md:grid-cols-[160px_60px_1fr] gap-6 md:gap-12 group"
    >
      <DateColumn date={release.date} />
      <LogoColumn />
      <div className="order-3 md:order-3">
        <VersionInfo />
        <ExpandableContent content={release.content} />
      </div>
    </motion.div>
  )
}

/** @UI.Releases.Timeline */
function Timeline() {
  const { releases } = useReleases()

  return (
    <div className="space-y-32">
      {releases.map((release, idx) => (
        <TimelineCard key={release.date} release={release} index={idx} />
      ))}
    </div>
  )
}

/** @UI.Page.Releases */
export function ReleasesPage({ releases }: { releases: Release[] }) {
  return (
    <ReleasesContext.Provider value={{ releases }}>
      <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
        <Background />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header transparent={true} variant="releases" />

          <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
            <Breadcrumb />
            <HeroHeader />
            <Timeline />
          </section>

          <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
        </div>
      </main>
    </ReleasesContext.Provider>
  )
}

export type { Release }

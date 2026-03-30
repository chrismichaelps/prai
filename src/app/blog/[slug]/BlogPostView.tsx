/** @UI.Blog.PostView */

'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { Locales } from '@/lib/effect/services/I18n'
import DOMPurify from 'isomorphic-dompurify'
import MarkdownIt from 'markdown-it'
import type { BlogPost } from '@/lib/effect/services/Blog'

interface BlogPostViewProps {
  enPost: BlogPost
  esPost: BlogPost
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

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

export function BlogPostView({ enPost, esPost }: BlogPostViewProps) {
  const { t, locale } = useI18n()
  const post = locale === Locales.EN ? enPost : esPost

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === Locales.ES ? 'es-PR' : 'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    },
  )

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} variant="issues" />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
          <div className="max-w-4xl mx-auto">
            {/* Top Meta Bar */}
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white/80 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t('blog.back')}
              </Link>

              <div className="text-sm font-medium text-white/30">
                {formattedDate} {t('blog.author_by')} {post.author}
              </div>
            </div>

            {/* Title Section */}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            {/* Post Banner / Hero */}
            {post.image && (
              <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl shadow-black/50 bg-white/[0.02]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto block object-contain opacity-95 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="max-w-none">
              <div
                className="prose prose-invert prose-sm md:prose-lg max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                  prose-p:text-white/80 prose-p:leading-relaxed 
                  prose-strong:text-white prose-strong:font-bold
                  prose-li:text-white/80 prose-code:text-yellow-400 
                  prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 
                  prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(md.render(post.content)) }}
              />
            </div>
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
      </div>
    </main>
  )
}

/** @UI.Blog.List */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { Locales } from '@/lib/effect/services/I18n'
import type { BlogPost } from '@/lib/effect/services/Blog'

interface BlogListProps {
  enPosts: readonly BlogPost[]
  esPosts: readonly BlogPost[]
}

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

function BlogItem({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col md:flex-row gap-6 p-4 md:p-0 rounded-3xl md:rounded-none transition-all"
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" />

      {/* Post Image */}
      {post.image && (
        <div className="flex-shrink-0 w-full md:w-48 lg:w-48 aspect-square relative overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/20 bg-white/[0.03]">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="flex flex-col justify-center flex-1 py-1">
        <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-2 leading-tight">
          {post.title}
        </h2>

        <p className="text-sm md:text-base text-white/50 line-clamp-2 leading-relaxed mb-3 font-medium">
          {post.description}
        </p>

        <span className="text-xs md:text-sm text-white/30 font-medium">
          {new Date(post.date).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </div>
    </motion.div>
  )
}

export function BlogList({ enPosts, esPosts }: BlogListProps) {
  const { t, locale } = useI18n()
  const posts = locale === Locales.EN ? enPosts : esPosts

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} variant="issues" />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
          <div className="max-w-4xl">
            {/* Hero Breadcrumb */}
            <div className="flex items-center gap-3 mb-4">
              <PraiLogo white size={18} animate />
              <span className="text-white/10 font-thin">|</span>
              <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest">
                {t('blog.title')}
              </span>
            </div>

            {/* Title Section */}
            <div className="mb-16">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {t('blog.title')}
              </h1>
              <p className="text-lg text-white/40 max-w-2xl leading-relaxed font-medium">
                {t('blog.subtitle')}
              </p>
            </div>

            {/* Post List */}
            <div className="grid grid-cols-1 gap-12 md:gap-16">
              {posts.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  <p className="text-white/30 text-sm font-medium">
                    {t('blog.no_posts')}
                  </p>
                </div>
              ) : (
                posts.map((post) => <BlogItem key={post.slug} post={post} />)
              )}
            </div>
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
      </div>
    </main>
  )
}

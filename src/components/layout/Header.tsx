'use client'

/** @UI.Layout.TopAppBar */

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, Info } from 'lucide-react'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hooks'
import { setModelInfoVisible } from '@/store/slices/uiSlice'

/** @UI.Layout.Header */
import { GITHUB_REPO_URL } from '@/lib/constants'

export function Header({
  className,
  transparent = true,
  variant = 'default',
}: {
  className?: string
  transparent?: boolean
  variant?: 'default' | 'chat'
}) {
  const router = useRouter()
  const { t } = useI18n()
  const dispatch = useAppDispatch()

  const navLinks = [
    { label: t('nav.about'), key: 'about', href: '/about' },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex items-center justify-between px-6 md:px-10 py-5 w-full z-50',
        !transparent &&
          'bg-white/70 backdrop-blur-xl border-b border-white/10',
        className,
      )}
    >
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push('/')}
          >
            <PraiLogo white={transparent} animate={true} />
            {variant === 'chat' && (
              <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                <span className="text-white/60 font-medium tracking-tight">
                  {t('nav.initial_chat')}
                </span>
              </div>
            )}
          </div>

          {variant === 'default' && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1 text-sm transition-colors font-medium',
                    transparent
                      ? 'text-primary-foreground/80 hover:text-primary-foreground'
                      : 'text-slate-600 hover:text-brand-blue',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {variant === 'chat' ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(setModelInfoVisible(true))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 group"
              >
                <Info className="w-4 h-4 text-white/70 group-hover:text-white" />
                <span className="hidden sm:inline">{t('nav.info')}</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push('/chat')}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 text-sm font-bold border rounded-xl transition-all shadow-xl',
                  transparent
                    ? 'text-primary-foreground border-primary-foreground/30 hover:bg-white/10'
                    : 'text-white bg-brand-blue border-transparent hover:scale-105 active:scale-95',
                )}
              >
                {t('nav.open_chat')}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}

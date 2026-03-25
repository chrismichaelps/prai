'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  Info,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  Bug,
} from 'lucide-react'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useBuildInfo } from '@/lib/effect/hooks/useBuildInfo'
import { cn } from '@/lib/utils'
import { useAppDispatch } from '@/store/hooks'
import { setModelInfoVisible } from '@/store/slices/uiSlice'
import { useAuth } from '@/contexts/AuthContext'
import { NotificationBell } from '@/components/notifications/NotificationBell'

/** @UI.Layout.Header */
import type { HeaderVariant } from '@/types/ui'

export function Header({
  className,
  transparent = true,
  variant = 'default',
  onMenuClick,
}: {
  className?: string
  transparent?: boolean
  variant?: HeaderVariant
  onMenuClick?: () => void
}) {
  const router = useRouter()
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buildHash = useBuildInfo()
  const { user, isAuthenticated, signIn, signOut, profile } = useAuth()

  const isAdmin = profile?.is_admin === true

  /** @Logic.UI.Auth.CallbackUrl */
  const getCallbackUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('callbackUrl') || undefined
    }
    return undefined
  }

  const navLinks = [
    { label: t('nav.about'), key: 'about', href: '/about' },
    { label: t('nav.releases'), key: 'releases', href: '/releases' },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  /** @Logic.UI.Lifecycle.ClickOutside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const avatarUrl = user?.user_metadata?.avatar_url
  const userName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    t('auth.explorer')
  const initials = userName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex items-center justify-between px-6 md:px-10 py-5 w-full z-[100]',
        !transparent && 'bg-white/70 backdrop-blur-xl border-b border-white/10',
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

          {(variant === 'default' || variant === 'releases') && (
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
                    variant === link.key ? 'text-white' : '',
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
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 group"
                  aria-label="Menu"
                >
                  <Menu className="w-4 h-4 text-white/70 group-hover:text-white" />
                </button>
              )}
              <button
                onClick={() => dispatch(setModelInfoVisible(true))}
                className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 group"
                aria-label="Model Info"
              >
                <Info className="w-4 h-4 text-white/70 group-hover:text-white" />
              </button>
            </div>
          ) : (
            <>
              {/* Desktop & Mobile Actions */}
              <div className="flex items-center gap-2 md:gap-3">
                <AnimatePresence mode="wait">
                  {isAuthenticated ? (
                    <motion.div
                      key="authenticated"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 md:gap-3"
                    >
                      <button
                        onClick={() => router.push('/chat')}
                        className={cn(
                          'hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors',
                          transparent
                            ? 'text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10'
                            : 'text-white border-transparent bg-brand-blue hover:scale-[1.02] active:scale-[0.98]',
                        )}
                      >
                        {t('nav.open_chat')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Notification Bell */}
                      <NotificationBell />

                      {/* Avatar Dropdown */}
                      <div
                        className="relative"
                        ref={dropdownRef}
                      >
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 transition-all focus:outline-none focus:ring-2',
                            transparent
                              ? 'border-primary-foreground/30 focus:ring-primary-foreground/30'
                              : 'border-brand-blue/30 focus:ring-brand-blue/30',
                          )}
                        >
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={userName}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={cn(
                                'w-full h-full flex items-center justify-center text-xs font-semibold',
                                transparent
                                  ? 'bg-primary-foreground/20 text-primary-foreground'
                                  : 'bg-brand-blue/10 text-brand-blue',
                              )}
                            >
                              {initials}
                            </div>
                          )}
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className={cn(
                                "fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-[76px] md:top-full md:mt-2 w-auto md:w-56",
                                "bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110] origin-top md:origin-top-right transform-gpu"
                              )}
                            >
                              <div className="px-4 py-3 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white truncate">
                                    {userName}
                                  </p>
                                  <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                                    isAdmin 
                                      ? "bg-yellow-400/20 text-yellow-400" 
                                      : "bg-white/10 text-white/40"
                                  )}>
                                    {isAdmin ? t('auth.role_admin') : t('auth.role_user')}
                                  </span>
                                </div>
                                <p className="text-xs text-white/40 truncate">
                                  {user?.email}
                                </p>
                              </div>

                              <div className="py-2">
                                <button
                                  onClick={() => {
                                    setIsDropdownOpen(false)
                                    router.push('/issues')
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-400/70 hover:text-yellow-400 hover:bg-yellow-400/5 transition-colors border-b border-white/5"
                                >
                                  <Bug className="w-4 h-4" />
                                  {t('nav.issues')}
                                </button>
                                <button
                                  onClick={() => {
                                    setIsDropdownOpen(false)
                                    router.push('/profile')
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  <User className="w-4 h-4" />
                                  {t('auth.profile')}
                                </button>
                                <button
                                  onClick={() => {
                                    setIsDropdownOpen(false)
                                    signOut()
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                                >
                                  <LogOut className="w-4 h-4" />
                                  {t('auth.sign_out')}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unauthenticated"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => signIn(getCallbackUrl())}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors',
                          transparent
                            ? 'text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10'
                            : 'text-white border-transparent bg-brand-blue hover:scale-[1.02] active:scale-[0.98]',
                        )}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        {t('auth.sign_in')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={toggleMenu}
                  className={cn(
                    'md:hidden p-2 rounded-xl transition-all active:scale-90 z-[120]',
                    transparent || isMenuOpen
                      ? 'text-white hover:bg-white/10'
                      : 'text-slate-900 hover:bg-slate-100',
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        <X className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ scale: 0.5, rotate: 90, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0.5, rotate: -90, opacity: 0 }}
                        transition={{ type: 'spring', damping: 15 }}
                      >
                        <Menu className="w-6 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[100] md:hidden flex flex-col"
          >
            {/* Background Layer */}
            <div className="absolute inset-0 bg-[#090909] z-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-accent/70 opacity-40 z-[-1]" />
            <div className="absolute inset-0 backdrop-blur-3xl z-[-1]" />

            {/* Header Mirror for Mobile Open State */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <PraiLogo white={true} animate={false} />
              <div className="w-10 h-10" />
            </div>

            <div className="flex-1 flex flex-col justify-center px-10 gap-16 overflow-y-auto py-10">
              <div className="flex flex-col gap-8">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30 font-display">
                  {t('nav.menu')}
                </span>

                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="group flex items-end gap-4"
                      >
                        <span className="text-6xl sm:text-7xl font-display font-bold text-white leading-[1.05] tracking-tighter group-hover:text-primary transition-colors">
                          {link.label}
                        </span>
                        <div className="mb-3 h-0.5 w-0 group-hover:w-12 bg-primary transition-all duration-500" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <span className="text-xs font-black uppercase tracking-[0.4em] text-white/30 font-display">
                  {t('nav.actions')}
                </span>

                <AnimatePresence mode="wait">
                  {isAuthenticated ? (
                    <motion.div
                      key="mobile-authenticated"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <button
                        onClick={() => {
                          toggleMenu()
                          router.push('/chat')
                        }}
                        className="group flex items-center gap-3 text-white text-3xl font-display font-bold hover:opacity-80 transition-opacity relative w-fit"
                      >
                        {t('nav.open_chat')}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        <span className="block h-[2px] w-full bg-white/50 absolute -bottom-2 left-0" />
                      </button>

                      <button
                        onClick={() => {
                          toggleMenu()
                          router.push('/profile')
                        }}
                        className="group flex items-center gap-3 text-white text-3xl font-display font-bold hover:opacity-80 transition-opacity relative w-fit"
                      >
                        {t('auth.profile')}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        <span className="block h-[2px] w-full bg-white/50 absolute -bottom-2 left-0" />
                      </button>

                      <button
                        onClick={() => {
                          toggleMenu()
                          signOut()
                        }}
                        className="group flex items-center gap-3 text-red-400/70 text-2xl font-display font-bold hover:opacity-80 transition-opacity relative w-fit"
                      >
                        <LogOut className="w-5 h-5" />
                        {t('auth.sign_out')}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mobile-unauthenticated"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => {
                          toggleMenu()
                          signIn(getCallbackUrl())
                        }}
                        className="group flex items-center gap-3 text-white text-3xl font-display font-bold hover:opacity-80 transition-opacity relative w-fit"
                      >
                        {t('auth.sign_in_with_google')}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        <span className="block h-[2px] w-full bg-white/50 absolute -bottom-2 left-0" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="p-10 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-white/20 text-[10px] font-medium uppercase tracking-[0.2em]">
                  © {new Date().getFullYear()} {t('brand.name')}
                </span>
                {buildHash && (
                  <span className="text-white/10 text-[10px] font-medium">
                    Build: {buildHash}
                  </span>
                )}
              </div>
              <PraiLogo white={true} animate={false} size={24} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

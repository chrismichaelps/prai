'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  FileText,
  Bug,
  PenLine,
  BarChart3,
  Palette,
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useUsage } from '@/hooks/useUsage'
import { PersonalizationNestedView } from './PersonalizationNestedView'
import { TierBadge } from '@/components/usage/TierBadge'
import { cn } from '@/lib/utils'

interface SidebarProfileProps {
  onSignOut?: () => void
}

export function SidebarProfile({ onSignOut }: SidebarProfileProps) {
  const { t } = useI18n()
  const { user, profile, signOut } = useAuth()
  const { usage, fetchUsage } = useUsage()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'main' | 'help' | 'personalization'>('main')
  const [direction, setDirection] = useState(0)
  const popoverRef = useRef<HTMLDivElement>(null)

  const isAdmin = profile?.is_admin === true

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false)
        setActiveTab('main')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  if (!user) return null

  const userName =
    profile?.display_name ||
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    t('auth.explorer')
  const userHandle = `@${user.email?.split('@')[0] || 'user'}`
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleSignOut = () => {
    setIsPopoverOpen(false)
    if (onSignOut) onSignOut()
    signOut()
  }

  const navigateToTab = (newTab: 'main' | 'help' | 'personalization') => {
    const order = { main: 0, help: 1, personalization: 2 }
    setDirection(order[newTab] > order[activeTab] ? 1 : -1)
    setActiveTab(newTab)
  }

  const menuVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 },
  }

  const tabVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <div
      className="relative mt-auto p-4 border-t border-white/10"
      ref={popoverRef}
    >
      {/* Profile Bar Trigger */}
      <button
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5 active:scale-[0.98] ${isPopoverOpen ? 'bg-white/5' : ''}`}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg border border-white/10 relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-white text-xs font-bold">{initials}</span>
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {userName}
          </p>
        </div>
      </button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isPopoverOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              layout: { duration: 0.3 }
            }}
            className="absolute bottom-full left-4 bg-[#0d0d0d] border border-white/20 rounded-2xl shadow-2xl w-[280px] mb-2 overflow-hidden z-[60] backdrop-blur-3xl"
          >
            <div className="relative overflow-hidden">
              <AnimatePresence
                initial={false}
                custom={direction}
              >
                {activeTab === 'main' && (
                  <motion.div
                    key="main"
                    custom={direction}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="p-2 space-y-1"
                  >
                    {/* Popover Header */}
                    <div className="p-3 flex items-center gap-3 border-b border-white/5 mb-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden border border-white/10 relative">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white truncate">
                            {userName}
                          </p>
                          <TierBadge tier={usage?.subscription_tier} />
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0",
                            isAdmin 
                              ? "bg-yellow-400/20 text-yellow-400" 
                              : "bg-white/10 text-white/40"
                          )}>
                            {isAdmin ? t('auth.role_admin') : t('auth.role_user')}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 truncate">
                          {userHandle}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsPopoverOpen(false)
                        window.open('/profile', '_blank')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm group"
                    >
                      <div className="w-4 h-4 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-yellow-500">
                          {initials[0]}
                        </span>
                      </div>
                      <span>{t('auth.profile')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsPopoverOpen(false)
                        window.open('/usage', '_blank')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm group"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>{t('nav.usage')}</span>
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                      onClick={() => navigateToTab('help')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4" />
                        <span>{t('auth.help')}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 text-white/80 hover:text-red-400 transition-all text-sm mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('auth.sign_out')}</span>
                    </button>
                  </motion.div>
                )}

                {activeTab === 'help' && (
                  <motion.div
                    key="help"
                    custom={direction}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="p-2 space-y-1"
                  >
                    <button
                      onClick={() => navigateToTab('main')}
                      className="w-full flex items-center gap-2 p-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all text-xs font-bold uppercase tracking-wider mb-2"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>{t('chat.back_to_menu') || 'Back'}</span>
                    </button>

                    <button
                      onClick={() => navigateToTab('personalization')}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                    >
                      <Palette className="w-4 h-4" />
                      <span>{t('personalization.title')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPopoverOpen(false)
                        window.open('/releases', '_blank')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                    >
                      <PenLine className="w-4 h-4" />
                      <span>{t('nav.releases')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPopoverOpen(false)
                        window.open('/legal/terms', '_blank')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t('auth.terms_policies')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPopoverOpen(false)
                        window.open('/issues', '_blank')
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-all text-sm"
                    >
                      <Bug className="w-4 h-4" />
                      <span>{t('auth.report_bug')}</span>
                    </button>
                  </motion.div>
                )}

                {activeTab === 'personalization' && (
                  <motion.div
                    key="personalization"
                    custom={direction}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="p-2"
                  >
                    <PersonalizationNestedView onBack={() => navigateToTab('help')} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

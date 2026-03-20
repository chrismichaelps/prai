'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/lib/effect/I18nProvider'

/** @UI.Component.CookieBanner */
export function CookieBanner() {
  const { t } = useI18n()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('prai-cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('prai-cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('prai-cookie-consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 120,
            mass: 0.8,
          }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full origin-bottom-right"
        >
          <div className="bg-[#090909]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Cookie className="w-5 h-5 opacity-80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-display font-bold text-lg leading-tight mb-1.5">
                    {t('cookies.title')}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed font-medium">
                    {t('cookies.desc')}
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white/20 hover:text-white transition-colors p-1"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-white text-[#090909] py-3 rounded-2xl text-sm font-black hover:bg-white/90 active:scale-95 transition-all shadow-xl"
                >
                  {t('cookies.accept')}
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-3 rounded-2xl text-sm font-bold text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  {t('cookies.decline')}
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex justify-center">
                <Link
                  href="/legal/cookies"
                  className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 hover:text-white/40 transition-colors"
                >
                  {t('cookies.view')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

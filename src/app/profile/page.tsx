'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, LogOut, User as UserIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import heroImage from '@/assets/condado-ocean-dusk.png'

/** @Route.Profile */
export default function ProfilePage() {
  const router = useRouter()
  const { t } = useI18n()
  const { user, signOut } = useAuth()

  const avatarUrl = user?.user_metadata?.avatar_url
  const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || t('auth.explorer')
  const email = user?.email

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden bg-[#090909]">
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={t('hero.alt_condado')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-[#090909]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header transparent />

          <section className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 max-w-5xl mx-auto pt-32 pb-24 w-full">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl mb-6 relative bg-white/5 flex items-center justify-center"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-white/50" />
                )}
              </motion.div>

              {/* User Info */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-2 mb-10"
              >
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                  {userName}
                </h1>
                <p className="text-white/60 text-lg font-medium">{email}</p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col w-full gap-4"
              >
                <button
                  onClick={() => router.push('/chat')}
                  className="group flex items-center justify-center gap-3 w-full bg-white text-black font-bold text-lg py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg cursor-pointer"
                >
                  {t('nav.open_chat')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-3 w-full bg-white/5 text-red-400 font-bold text-lg py-4 px-6 rounded-2xl border border-white/10 hover:bg-red-400/10 hover:border-red-400/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  {t('auth.sign_out')}
                </button>
              </motion.div>
            </motion.div>
          </section>

          <Footer className="mt-auto bg-transparent border-t-0 py-10" />
        </div>
      </main>
    </ProtectedRoute>
  )
}

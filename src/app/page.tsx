'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import heroImage from '@/assets/hero-mountains.jpg'

/** @Route.IndexPage */
export default function IndexPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { isAuthenticated } = useAuth()

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={t('hero.alt_mountains')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-accent/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <Header />

        {/* Hero Section */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 max-w-5xl">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-primary-foreground leading-[1.05] mb-6"
          >
            {t('brand.name')}
            <br />
            {t('brand.slogan')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-primary-foreground/85 max-w-xl mb-10 leading-relaxed"
          >
            {t('brand.tagline')}
          </motion.p>

          <AnimatePresence>
            {isAuthenticated && (
              <motion.nav
                key="cta"
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-8"
              >
                <button
                  onClick={() => router.push('/chat')}
                  className="group flex items-center gap-2 text-primary-foreground font-medium hover:opacity-80 transition-opacity relative"
                >
                  {t('hero.cta_chat')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span className="block h-px w-full bg-primary-foreground/50 absolute -bottom-1 left-0" />
                </button>
              </motion.nav>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        <Footer className="mt-auto bg-transparent border-t-0 pt-32 pb-16" />
      </div>
    </main>
  )
}

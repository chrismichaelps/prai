'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Github, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { GITHUB_REPO_URL } from '@/lib/constants'
import heroImage from '@/assets/condado-ocean-dusk.png'

/** @Route.About */
export default function AboutPage() {
  const router = useRouter()
  const { t } = useI18n()

  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden" role="main" aria-label="About page">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Condado Ocean Water"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-accent/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <Header />

        {/* About Section */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 max-w-5xl pt-32 pb-24">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-primary-foreground leading-[1.05] mb-6"
          >
            {t('about.title')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl sm:text-2xl text-primary-foreground/90 max-w-2xl mb-12 leading-tight font-medium italic"
          >
            {t('about.subtitle')}
          </motion.p>

          <div className="space-y-8 max-w-3xl">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-primary-foreground/80 leading-relaxed font-light"
            >
              {t('about.description.p1')}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-primary-foreground/80 leading-relaxed font-light"
            >
              {t('about.description.p2')}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg text-primary-foreground/80 leading-relaxed font-light border-l-2 border-primary-foreground/20 pl-6 italic"
            >
              {t('about.description.p3')}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-8"
          >
            <button
              onClick={() => router.push('/chat')}
              className="group flex items-center gap-2 text-primary-foreground font-bold hover:opacity-80 transition-opacity relative"
            >
              {t('hero.cta_chat')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span className="block h-px w-full bg-primary-foreground/50 absolute -bottom-1 left-0" />
            </button>

            <a 
              href={GITHUB_REPO_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <Terminal className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer className="mt-auto bg-transparent border-t-0 pt-32 pb-16" />
      </div>
    </main>
  )
}

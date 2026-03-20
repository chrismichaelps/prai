"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useI18n } from '@/lib/effect/I18nProvider';
import hero404 from '@/assets/404-hero.png';

/** @Page.Error.404 */
export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Background image + overlay (Synced with Branding Sync) */}
      <div className="absolute inset-0">
        <Image
          src={hero404}
          alt={t('404.alt')}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-accent/80" />
      </div>

      {/* Content Structure (Identical to IndexPage) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 max-w-5xl mx-auto w-full">
           <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             className="space-y-8"
           >
             <h1 className="text-8xl md:text-9xl font-display font-black text-white/20 leading-none select-none">
               404
             </h1>
             <div className="space-y-4">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                 {t('404.title')}
               </h2>
               <p className="text-xl text-white/70 max-w-lg leading-relaxed">
                 {t('404.desc')}
               </p>
             </div>

             <div className="flex flex-col sm:flex-row items-start gap-4 pt-8">
               <Link 
                 href="/"
                 className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-2xl"
               >
                 <Home className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                 {t('404.back')}
               </Link>
               <Link 
                 href="/chat"
                 className="group flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300"
               >
                 {t('404.ask')}
                 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
               </Link>
             </div>
           </motion.div>
        </main>

        <Footer className="mt-auto bg-transparent border-t-0 pt-32 pb-16" />
      </div>
    </div>
  );
}

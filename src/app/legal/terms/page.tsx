"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/effect/I18nProvider';

/** @Page.Legal.Terms */
export default function TermsPage() {
  const { t } = useI18n();
  return (
    <article className="max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
          {t('terms.title')}
        </h1>
        <p className="text-lg text-white/60 mb-16 max-w-xl font-sans leading-relaxed">
          {t('terms.subtitle')}
        </p>

        <section className="space-y-16">
          <section className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">01</span>
              {t('terms.s1.title')}
            </h2>
            <p className="text-white/70 leading-relaxed font-sans text-lg">
              {t('terms.s1.desc')}
            </p>
          </section>

          <section className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">02</span>
              {t('terms.s2.title')}
            </h2>
            <p className="text-white/70 leading-relaxed font-sans text-lg">
              {t('terms.s2.desc')}
            </p>
          </section>

          <section className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">03</span>
              {t('terms.s3.title')}
            </h2>
            <p className="text-white/70 leading-relaxed font-sans text-lg">
              {t('terms.s3.desc')}
            </p>
          </section>

          <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-3xl border border-white/10 max-w-3xl">
            <h3 className="text-xl font-bold text-white mb-4 font-display">{t('terms.note.title')}</h3>
            <p className="text-white/60 font-sans leading-relaxed">
              {t('terms.note.desc')}
            </p>
          </div>
        </section>
      </motion.div>
    </article>
  );
}

"use client";

import Link from 'next/link'
import { Github } from 'lucide-react'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useBuildInfo } from '@/lib/effect/hooks/useBuildInfo'
import { cn } from '@/lib/utils'
import { ApiConstants } from '@/lib/constants/app-constants'
import { Locales } from '@/lib/effect/services/I18n'

interface FooterProps {
  className?: string;
}

/** @UI.Layout.Footer */
export function Footer({ className = "" }: FooterProps) {
  const { t, locale, setLocale } = useI18n();
  const buildHash = useBuildInfo();

  return (
    <footer className={cn("w-full bg-slate-900 text-white/70 py-16 px-6 md:px-10 lg:px-16 border-t border-white/5", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* @UI.Layout.Footer.Brand */}
          <div className="md:col-span-2 space-y-6">
            <PraiLogo white className="scale-110 origin-left" />
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              {t('footer.description')}
            </p>
          </div>

          {/* @UI.Layout.Footer.Explore */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.explore')}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/releases" className="text-sm hover:text-white transition-colors">
                  {t('nav.releases')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-white transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-sm hover:text-white transition-colors">
                  {t('footer.chat')}
                </Link>
              </li>
            </ul>
          </div>

          {/* @UI.Layout.Footer.Status */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('status.title')}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/status" className="text-sm hover:text-white transition-colors">
                  {t('status.subtitle')}
                </Link>
              </li>
            </ul>
          </div>

          {/* @UI.Layout.Footer.Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('footer.legal')}</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/legal/terms" className="text-sm hover:text-white transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-sm hover:text-white transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm hover:text-white transition-colors">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* @UI.Layout.Footer.Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} PR\AI. {t('footer.rights')}
            </p>
            {buildHash && (
              <p className="inline-flex font-mono text-[10px] uppercase tracking-widest bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 bg-clip-text text-transparent opacity-80 border-l border-white/10 pl-3">
                Build: {buildHash}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Locale Switcher */}
            <div className="flex p-1 bg-white/5 rounded-full border border-white/10" role="group" aria-label={t('a11y.language_selector')}>
              <button
                onClick={() => setLocale(Locales.ES)}
                aria-label={t('a11y.switch_spanish')}
                aria-pressed={locale === Locales.ES}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  locale === Locales.ES ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                es
              </button>
              <button
                onClick={() => setLocale(Locales.EN)}
                aria-label={t('a11y.switch_english')}
                aria-pressed={locale === Locales.EN}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  locale === Locales.EN ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                en
              </button>
            </div>
            
            <div className="flex gap-6">
              <a 
                href={ApiConstants.GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('a11y.github')}
                className="text-white/30 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

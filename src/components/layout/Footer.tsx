"use client";

import Link from 'next/link'
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

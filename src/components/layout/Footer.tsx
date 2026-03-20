"use client";

import Link from 'next/link'
import { Github } from 'lucide-react'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { cn } from '@/lib/utils'
import { GITHUB_REPO_URL } from '@/lib/constants'

interface FooterProps {
  className?: string;
}

/** @UI.Layout.Footer */
export function Footer({ className = "" }: FooterProps) {
  const { t, locale, setLocale } = useI18n();

  return (
    <footer className={cn("w-full bg-slate-900 text-white/70 py-16 px-6 md:px-10 lg:px-16 border-t border-white/5", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
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
                <Link href="/chat" className="text-sm hover:text-white transition-colors">
                  {t('footer.chat')}
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
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} PR\AI. {t('footer.rights')}
          </p>

          <div className="flex items-center gap-6">
            {/* Locale Switcher */}
            <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
              <button
                onClick={() => setLocale('es')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  locale === 'es' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                es
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  locale === 'en' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                en
              </button>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                {/* Twitter Icon placeholder */}
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                {/* Instagram Icon placeholder */}
              </a>
              <a 
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
              >
                <span className="sr-only">Github</span>
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

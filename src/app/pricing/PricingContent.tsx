'use client'

import DOMPurify from 'isomorphic-dompurify'
import { useI18n } from '@/lib/effect/I18nProvider'
import { Locales } from '@/lib/effect/services/I18n'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PraiLogo } from '@/components/brand/PraiLogo'

interface PricingContentProps {
  esContent: string
  enContent: string
}

/** @UI.Pricing.Background */
function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]" />
    </div>
  )
}

/** @UI.Pricing.Main */
export function PricingContent({ esContent, enContent }: PricingContentProps) {
  const { locale, t } = useI18n()
  const content = locale === Locales.EN ? enContent : esContent

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-4xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-700">
          <div className="w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-3 mb-12">
              <PraiLogo white size={18} animate />
              <span className="text-white/10 font-thin">|</span>
              <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]">
                {t('pricing.title')}
              </span>
            </div>

            {/* Markdown Content */}
            <div
              className={cn(
                'prose prose-invert max-w-none',
                'prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight',
                'prose-p:text-white/60 prose-p:leading-relaxed prose-p:text-lg',
                'prose-strong:text-white prose-strong:font-black',
                'prose-ul:text-white/60 prose-li:my-2',
                'prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none',
                'prose-hr:border-white/5 prose-hr:my-10',
              )}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-10 pb-10" />
      </div>
    </main>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PraiLogo } from '@/components/brand/PraiLogo'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { checkAllHealth } from '@/store/slices/healthSlice'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/** @UI.Status.Background */
function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: '1s' }}
      />
    </div>
  )
}

/** @UI.Status.ServiceRow */
function ServiceRow({
  name,
  service,
}: {
  name: string
  service: {
    status: 'ok' | 'error' | 'loading'
    error?: string
    lastChecked?: string
  }
}) {
  const { t } = useI18n()

  const statusColors = {
    ok: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    error: 'text-red-400 bg-red-400/10 border-red-400/20',
    loading: 'text-white/30 bg-white/5 border-white/10 animate-pulse',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all backdrop-blur-xl"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-white tracking-tight leading-none uppercase">
          {name}
        </h3>
        {service.lastChecked && (
          <p className="text-[11px] text-white/30 font-medium tracking-wide">
            {t('status.last_checked')}:{' '}
            {new Date(service.lastChecked).toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start sm:items-end gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors',
            statusColors[service.status],
          )}
        >
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              service.status === 'ok'
                ? 'bg-emerald-400'
                : service.status === 'error'
                  ? 'bg-red-400'
                  : 'bg-white/20',
            )}
          />
          {service.status === 'ok' && t('status.online')}
          {service.status === 'error' && t('status.offline')}
          {service.status === 'loading' && t('status.checking')}
        </span>

        {service.error && (
          <p className="text-[11px] text-red-400 font-bold max-w-xs text-left sm:text-right leading-relaxed">
            {service.error}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/** @Page.Status */
export default function StatusClient() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const { supabase, openrouter } = useAppSelector((state) => state.health)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    dispatch(checkAllHealth())
  }, [dispatch])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const isLoading =
    supabase.status === 'loading' || openrouter.status === 'loading'

  const handleRefresh = () => {
    if (!isLoading && cooldown === 0) {
      dispatch(checkAllHealth())
      setCooldown(10)
    }
  }

  return (
    <main className="relative min-h-screen bg-[#090909] overflow-x-hidden selection:bg-white/10 selection:text-white">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen font-body">
        <Header transparent={true} variant="issues" />

        <section className="flex-1 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto pt-32 pb-40 w-full animate-in fade-in duration-1000">
          <div className="max-w-3xl">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 mb-8 transition group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              {t('status.back_home')}
            </Link>

            {/* Hero Breadcrumb */}
            <div className="flex items-center gap-3 mb-4">
              <PraiLogo white size={18} animate />
              <span className="text-white/10 font-thin">|</span>
              <span className="text-[13px] font-bold text-white/40 uppercase tracking-widest">
                {t('status.title')}
              </span>
            </div>

            {/* Header section */}
            <div className="border-b border-white/5 pb-10 mb-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-none">
                    {t('status.title')}
                  </h1>
                  <p className="text-[15px] text-white/40 font-medium font-body leading-relaxed max-w-2xl">
                    {t('status.subtitle')}
                  </p>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isLoading || cooldown > 0}
                  className="flex items-center justify-center gap-2 min-w-[120px] px-5 py-2.5 rounded-xl text-sm font-black bg-white text-black hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 tracking-tight"
                >
                  {isLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  )}
                  {isLoading ? t('status.checking') : cooldown > 0 ? `(${cooldown}s)` : t('status.refresh')}
                </button>
              </div>
            </div>

            {/* List area */}
            <div className="space-y-4">
              <ServiceRow name="Supabase Infrastructure" service={supabase} />
              <ServiceRow name="OpenRouter API Gateway" service={openrouter} />
            </div>
          </div>
        </section>

        <Footer className="mt-auto bg-transparent border-t border-white/[0.03] pt-40 pb-16" />
      </div>
    </main>
  )
}

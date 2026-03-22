'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { User as UserIcon, Pencil, Check, X, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import heroImage from '@/assets/condado-ocean-dusk.png'
import { useToast } from '@/components/ui/ToastProvider'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

function getSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function ProfileClient() {
  const { t, locale, setLocale } = useI18n()
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const { showToast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || user?.user_metadata?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [language, setLanguage] = useState(profile?.language || 'es')

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const currentDisplayName = profile?.display_name || user?.user_metadata?.name || user?.user_metadata?.full_name || t('auth.explorer')
  const currentBio = profile?.bio || ''
  const email = user?.email

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setBio(profile.bio || '')
      setLanguage(profile.language || 'es')
    }
  }, [profile])

  const handleLocaleChange = useCallback((newLocale: string) => {
    setLanguage(newLocale)
    setLocale(newLocale as 'es' | 'en')
  }, [setLocale])

  const handleEdit = useCallback(() => {
    setDisplayName(profile?.display_name || user?.user_metadata?.name || '')
    setBio(profile?.bio || '')
    setLanguage(profile?.language || 'es')
    setIsEditing(true)
  }, [profile, user])

  const handleSave = useCallback(async () => {
    if (!user?.id) return
    
    setIsSaving(true)
    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName, bio, language })
        .eq('id', user.id)

      if (error) throw error
      
      setLocale(language as 'es' | 'en')
      showToast(t('profile.saved'), 'success')
      setIsEditing(false)
      refreshProfile?.()
    } catch {
      showToast(t('profile.save_error'), 'error')
    } finally {
      setIsSaving(false)
    }
  }, [user, displayName, bio, language, showToast, t, refreshProfile, setLocale])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden bg-[#090909]">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Condado Ocean" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-[#090909]/90" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header transparent />

          <section className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 max-w-5xl mx-auto pt-32 pb-24 w-full">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-md bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl"
            >
              {isEditing ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-display font-bold text-white">
                      {t('profile.edit_title')}
                    </h2>
                    <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                      <button
                        onClick={() => handleLocaleChange('es')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          language === 'es' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        ES
                      </button>
                      <button
                        onClick={() => handleLocaleChange('en')}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          language === 'en' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-white/50 text-sm mb-2 font-medium">
                        {t('profile.display_name')}
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all"
                        placeholder={currentDisplayName}
                      />
                    </div>

                    <div>
                      <label className="block text-white/50 text-sm mb-2 font-medium">
                        {t('profile.bio')}
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all resize-none h-28"
                        placeholder={t('profile.bio_placeholder')}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      {t('profile.save')}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 px-5 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-white">
                      {t('profile.title')}
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                        <button
                          onClick={() => handleLocaleChange('es')}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            language === 'es' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          ES
                        </button>
                        <button
                          onClick={() => handleLocaleChange('en')}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            language === 'en' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          EN
                        </button>
                      </div>
                      <button
                        onClick={handleEdit}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-8">
                    <motion.div 
                      className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-white/5 flex items-center justify-center"
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={currentDisplayName} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-12 h-12 text-white/40" />
                      )}
                    </motion.div>
                    <span className="text-white/40 text-xs mt-2">{t('profile.avatar_hint')}</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-white/40 text-xs mb-1 font-medium uppercase tracking-wider">
                        {t('profile.display_name')}
                      </p>
                      <p className="text-xl font-semibold text-white">{currentDisplayName}</p>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs mb-1 font-medium uppercase tracking-wider">
                        {t('profile.email')}
                      </p>
                      <p className="text-white/70">{email}</p>
                    </div>

                    <div>
                      <p className="text-white/40 text-xs mb-1 font-medium uppercase tracking-wider">
                        {t('profile.bio')}
                      </p>
                      <p className="text-white/70 whitespace-pre-wrap">
                        {currentBio || <span className="italic text-white/40">{t('profile.no_bio')}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </section>

          <Footer className="mt-auto bg-transparent border-t-0 py-10" />
        </div>
      </main>
    </ProtectedRoute>
  )
}

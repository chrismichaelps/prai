'use client'

/** @Component.ProfileClient */
import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { User as UserIcon, Pencil, Check, X, Loader2, Trash2, Archive, AlertTriangle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useI18n } from '@/lib/effect/I18nProvider'
import type { Locale } from '@/lib/effect/services/I18n'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import heroImage from '@/assets/condado-ocean-dusk.png'
import { useToast } from '@/components/ui/ToastProvider'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setChats } from '@/store/slices/chatSlice'
import { useUsage } from '@/hooks/useUsage'
import { TierBadge } from '@/components/usage/TierBadge'

const toLocale = (value: string | undefined | null, fallback: Locale = 'es'): Locale => {
  if (value === 'es' || value === 'en') return value
  return fallback
}

export function ProfileClient() {
  const { t, setLocale } = useI18n()
  const { user, profile, isLoading, refreshProfile, signOut } = useAuth()
  const { showToast } = useToast()
  const dispatch = useAppDispatch()
  const chats = useAppSelector(state => state.chat.chats)
  const { usage, fetchUsage } = useUsage()
  const [chatsCount, setChatsCount] = useState(0)
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || user?.user_metadata?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [language, setLanguage] = useState<Locale>(toLocale(profile?.language))
  const [showDataControl, setShowDataControl] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [confirmHandle, setConfirmHandle] = useState('')

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const currentDisplayName = profile?.display_name || user?.user_metadata?.name || user?.user_metadata?.full_name || t('auth.explorer')
  const currentBio = profile?.bio || ''
  const email = user?.email

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setBio(profile.bio || '')
      setLanguage(toLocale(profile.language))
    }
  }, [profile])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  useEffect(() => {
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/chat/chats/count?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setChatsCount(data.count || 0))
        .catch(() => setChatsCount(chats.length))
    }
  }, [user, chats.length])

  const handleDeleteAllChats = async () => {
    if (!user) return
    if (!confirm(t('profile.confirm_delete_all_chats') || 'Are you sure you want to delete all your chats? This cannot be undone.')) return
    
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/chat/chats?userId=${user.id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      
      dispatch(setChats([]))
      setChatsCount(0)
      showToast(t('profile.all_chats_deleted') || 'All chats deleted', 'success')
    } catch (err) {
      console.error('Error deleting chats:', err)
      showToast(t('profile.delete_error') || 'Failed to delete chats', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || !profile?.handle) return
    if (confirmHandle !== profile.handle) {
      showToast(t('profile.handle_mismatch') || 'Handle does not match', 'error')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmHandle: profile.handle })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      showToast(t('profile.account_deleted') || 'Account deleted successfully', 'success')
      signOut()
      window.location.href = '/'
    } catch (err) {
      console.error('Error deleting account:', err)
      showToast(t('profile.delete_account_error') || 'Failed to delete account', 'error')
    } finally {
      setIsDeleting(false)
      setShowDeleteAccount(false)
    }
  }

  /** @Logic.UI.Chat.ArchiveAll */
  const handleArchiveAllChats = async () => {
    if (!user) return
    if (!confirm(t('profile.confirm_archive_all_chats') || 'Are you sure you want to archive all your chats?')) return
    
    setIsDeleting(true)
    try {
      const res = await fetch('/api/chat/chats/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })
      
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      
      dispatch(setChats([]))
      setChatsCount(0)
      showToast(t('profile.all_chats_archived') || 'All chats archived', 'success')
    } catch (err) {
      console.error('Error archiving chats:', err)
      showToast(t('profile.archive_error') || 'Failed to archive chats', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLocaleChange = useCallback((newLocale: string) => {
    const locale = toLocale(newLocale)
    setLanguage(locale)
    setLocale(locale)
  }, [setLocale])

  const handleEdit = useCallback(() => {
    setDisplayName(profile?.display_name || user?.user_metadata?.name || '')
    setBio(profile?.bio || '')
    setLanguage(toLocale(profile?.language))
    setIsEditing(true)
  }, [profile, user])

  /** @Logic.UI.Profile.Save */
  const handleSave = useCallback(async () => {
    if (!user?.id) return
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          display_name: displayName,
          bio,
          language
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      
      setLocale(language)
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
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold text-white">{currentDisplayName}</p>
                        <TierBadge tier={usage?.subscription_tier} />
                      </div>
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

                    {/* Data Control Section */}
                    <div className="pt-6 border-t border-white/10">
                      <button
                        onClick={() => setShowDataControl(!showDataControl)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
                          {t('profile.data_control') || 'Data Control'}
                        </p>
                        <span className="text-white/40 text-sm">
                          {chatsCount} {t('profile.chats') || 'chats'}
                        </span>
                      </button>

                      {showDataControl && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <button
                            onClick={handleArchiveAllChats}
                            disabled={isDeleting || chatsCount === 0}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-all disabled:opacity-50"
                          >
                            <Archive className="w-5 h-5" />
                            <span className="font-medium">{t('profile.archive_all_chats') || 'Archive All Chats'}</span>
                          </button>
                          
                          <button
                            onClick={handleDeleteAllChats}
                            disabled={isDeleting || chatsCount === 0}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                            <span className="font-medium">{t('profile.delete_all_chats') || 'Delete All Chats'}</span>
                          </button>

                          {chatsCount > 0 && (
                            <p className="text-white/30 text-xs text-center flex items-center justify-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              {t('profile.data_warning') || 'This action cannot be undone'}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Delete Account Section */}
                    <div className="pt-6 border-t border-red-500/20 mt-6">
                      <p className="text-white/30 text-xs mb-3">{t('profile.danger_zone') || 'Danger Zone'}</p>
                      <button
                        onClick={() => setShowDeleteAccount(true)}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 rounded-xl text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-medium">{t('profile.delete_account') || 'Delete Account'}</span>
                      </button>
                      <p className="text-white/30 text-xs mt-2 text-center">
                        {t('profile.delete_account_warning') || 'This will permanently delete your account and all data'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </section>

          <Footer className="mt-auto bg-transparent border-t-0 py-10" />

          {/* Delete Account Modal */}
          {showDeleteAccount && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteAccount(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {t('profile.delete_account') || 'Delete Account'}
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  {t('profile.delete_account_confirm') || 'This action cannot be undone. All your data will be permanently deleted.'}
                </p>
                <div className="mb-4">
                  <label className="text-white/40 text-xs uppercase tracking-wider">
                    {t('profile.type_handle')} (@{profile?.handle})
                  </label>
                  <input
                    type="text"
                    value={confirmHandle}
                    onChange={(e) => setConfirmHandle(e.target.value)}
                    placeholder={profile?.handle}
                    className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteAccount(false)
                      setConfirmHandle('')
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 font-medium transition-colors"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || confirmHandle !== profile?.handle}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('profile.delete_account') || 'Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}

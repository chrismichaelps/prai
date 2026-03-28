'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronRight, User, Settings2, Shield, Database, Bell, LayoutGrid, Palette } from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { Personalization } from '@/lib/effect/schemas/PersonalizationSchema'
import { DEFAULT_PERSONALIZATION } from '@/lib/effect/schemas/PersonalizationSchema'

type SidebarTab = 'general' | 'notifications' | 'personalization' | 'apps' | 'data' | 'security' | 'parental' | 'account'

interface PersonalizationModalProps {
  isOpen?: boolean
  onClose?: () => void
}

export function PersonalizationModal({ isOpen = true, onClose }: PersonalizationModalProps) {
  const { t } = useI18n()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SidebarTab>('personalization')
  const [personalization, setPersonalization] = useState(DEFAULT_PERSONALIZATION)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadPersonalization = async () => {
      try {
        const res = await fetch('/api/user/preferences')
        if (res.ok) {
          const data = await res.json()
          if (data.preferences) {
            setPersonalization({ ...DEFAULT_PERSONALIZATION, ...data.preferences })
          }
        }
      } catch (err) {
        console.error('Failed to load personalization:', err)
      }
    }

    loadPersonalization()
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: personalization })
      })
    } catch (err) {
      console.error('Failed to save personalization:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = <K extends keyof Personalization>(field: K, value: Personalization[K]) => {
    setPersonalization(prev => ({ ...prev, [field]: value }))
  }

  const tabs: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
    { id: 'general', icon: <Settings2 className="w-4 h-4" />, label: t('personalization.sidebar.general') },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: t('personalization.sidebar.notifications') },
    { id: 'personalization', icon: <Palette className="w-4 h-4" />, label: t('personalization.sidebar.personalization') },
    { id: 'apps', icon: <LayoutGrid className="w-4 h-4" />, label: t('personalization.sidebar.apps') },
    { id: 'data', icon: <Database className="w-4 h-4" />, label: t('personalization.sidebar.data') },
    { id: 'security', icon: <Shield className="w-4 h-4" />, label: t('personalization.sidebar.security') },
    { id: 'account', icon: <User className="w-4 h-4" />, label: t('personalization.sidebar.account') },
  ]

  const baseStyles = [
    { id: 'default', label: t('personalization.options.default'), desc: t('personalization.options.default_desc') },
    { id: 'professional', label: t('personalization.options.professional'), desc: t('personalization.options.professional_desc') },
    { id: 'friendly', label: t('personalization.options.friendly'), desc: t('personalization.options.friendly_desc') },
    { id: 'candid', label: t('personalization.options.candid'), desc: t('personalization.options.candid_desc') },
    { id: 'quirky', label: t('personalization.options.quirky'), desc: t('personalization.options.quirky_desc') },
    { id: 'efficient', label: t('personalization.options.efficient'), desc: t('personalization.options.efficient_desc') },
  ]

  const levels = [
    { id: 'more', label: t('personalization.options.more') },
    { id: 'default', label: t('personalization.options.default') },
    { id: 'less', label: t('personalization.options.less') },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="personalization-title"
        className="relative w-[90vw] max-w-4xl h-[80vh] bg-[#1a1a1a] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden flex"
      >
        <button
          onClick={onClose}
          aria-label={t('a11y.close_personalization')}
          className="absolute top-4 right-4 text-white/20 hover:text-white/40 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-64 border-r border-white/5 bg-white/[0.02] p-4 overflow-y-auto">
          <h2 id="personalization-title" className="text-lg font-semibold text-white mb-6 px-2">{t('personalization.title')}</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  activeTab === tab.id 
                    ? "bg-white/10 text-white" 
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                )}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'personalization' && (
            <div className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('personalization.content.style_title')}
                </h3>
                <p className="text-sm text-white/40 mb-4">
                  {t('personalization.content.style_desc')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {baseStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateField('baseStyle', style.id as Personalization['baseStyle'])}
                      className={cn(
                        "p-3 rounded-xl text-left transition-all border",
                        personalization.baseStyle === style.id
                          ? "border-brand-blue bg-brand-blue/10"
                          : "border-white/5 hover:border-white/10 bg-white/5"
                      )}
                    >
                      <div className="text-sm font-medium text-white">{style.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('personalization.content.chars_title')}
                </h3>
                <p className="text-sm text-white/40 mb-4">
                  {t('personalization.content.chars_desc')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{t('personalization.content.warm')}</span>
                    <div className="flex gap-1">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => updateField('warm', level.id as Personalization['warm'])}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-lg transition-all",
                            personalization.warm === level.id
                              ? "bg-brand-blue text-white"
                              : "bg-white/5 text-white/40 hover:text-white"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{t('personalization.content.enthusiastic')}</span>
                    <div className="flex gap-1">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => updateField('enthusiastic', level.id as Personalization['enthusiastic'])}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-lg transition-all",
                            personalization.enthusiastic === level.id
                              ? "bg-brand-blue text-white"
                              : "bg-white/5 text-white/40 hover:text-white"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{t('personalization.content.headers')}</span>
                    <div className="flex gap-1">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => updateField('headersAndLists', level.id as Personalization['headersAndLists'])}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-lg transition-all",
                            personalization.headersAndLists === level.id
                              ? "bg-brand-blue text-white"
                              : "bg-white/5 text-white/40 hover:text-white"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{t('personalization.content.emoji')}</span>
                    <div className="flex gap-1">
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => updateField('emoji', level.id as Personalization['emoji'])}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-lg transition-all",
                            personalization.emoji === level.id
                              ? "bg-brand-blue text-white"
                              : "bg-white/5 text-white/40 hover:text-white"
                          )}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('personalization.content.about_title')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/50 mb-2 block">
                      {t('personalization.content.nickname')}
                    </label>
                    <input
                      type="text"
                      value={personalization.nickname}
                      onChange={(e) => updateField('nickname', e.target.value)}
                      placeholder={t('personalization.content.nickname')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-blue transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('personalization.content.instructions_title')}
                </h3>
                <p className="text-sm text-white/40 mb-4">
                  {t('personalization.content.instructions_desc')}
                </p>
                <textarea
                  value={personalization.customInstructions}
                  onChange={(e) => updateField('customInstructions', e.target.value)}
                  placeholder={t('personalization.content.instructions_desc')}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-blue transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSaving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          )}

          {activeTab !== 'personalization' && (
            <div className="flex items-center justify-center h-full text-white/30">
              <p>{tabs.find(t => t.id === activeTab)?.label}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

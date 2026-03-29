'use client'

/** @UI.Chat.PersonalizationNestedView */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronDown,
  Check,
  Info,
  User,
  MessageSquare,
  Sparkles,
  Palette,
} from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { usePersonalization } from '@/hooks/usePersonalization'
import { cn } from '@/lib/utils'
import type { Personalization } from '@/lib/effect/schemas/PersonalizationSchema'

interface PersonalizationNestedViewProps {
  onBack: () => void
}

export function PersonalizationNestedView({
  onBack,
}: PersonalizationNestedViewProps) {
  const { t } = useI18n()
  const { personalization, savePersonalization, loading } = usePersonalization()
  const [tempPrefs, setTempPrefs] = useState(personalization)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  /** @UI.Chat.Personalization.SyncLocalState */
  React.useEffect(() => {
    if (personalization) {
      setTempPrefs(personalization)
    }
  }, [personalization])

  const hasChanges =
    JSON.stringify(tempPrefs) !== JSON.stringify(personalization)

  const updateField = <K extends keyof Personalization>(
    field: K,
    value: Personalization[K],
  ) => {
    setTempPrefs((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    await savePersonalization(tempPrefs)
  }

  const baseStyles = [
    {
      id: 'default',
      label: t('personalization.options.default'),
      desc: t('personalization.options.default_desc'),
    },
    {
      id: 'professional',
      label: t('personalization.options.professional'),
      desc: t('personalization.options.professional_desc'),
    },
    {
      id: 'friendly',
      label: t('personalization.options.friendly'),
      desc: t('personalization.options.friendly_desc'),
    },
    {
      id: 'candid',
      label: t('personalization.options.candid'),
      desc: t('personalization.options.candid_desc'),
    },
    {
      id: 'quirky',
      label: t('personalization.options.quirky'),
      desc: t('personalization.options.quirky_desc'),
    },
    {
      id: 'efficient',
      label: t('personalization.options.efficient'),
      desc: t('personalization.options.efficient_desc'),
    },
    {
      id: 'cynical',
      label: t('personalization.options.cynical'),
      desc: t('personalization.options.cynical_desc'),
    },
  ]

  const levels: { id: Personalization['warm']; label: string }[] = [
    { id: 'more', label: t('personalization.options.more') },
    { id: 'default', label: t('personalization.options.default') },
    { id: 'less', label: t('personalization.options.less') },
  ]

  const characteristics = [
    {
      id: 'warm',
      label: t('personalization.content.warm'),
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'enthusiastic',
      label: t('personalization.content.enthusiastic'),
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'headersAndLists',
      label: t('personalization.content.headers'),
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'emoji',
      label: t('personalization.content.emoji'),
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
  ]

  return (
    <div className="flex flex-col max-h-[450px]">
      {/* @UI.Chat.Personalization.Header */}
      <button
        onClick={onBack}
        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider mb-2"
      >
        <ChevronLeft className="w-3 h-3" />
        <span>{t('chat.back_to_menu') || 'Back'}</span>
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full ml-auto mr-2"
          />
        )}
      </button>
      {/* @UI.Chat.Personalization.Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
        {/* @UI.Chat.Personalization.BaseStyle */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3 h-3" />
            {t('personalization.content.style_title')}
          </label>
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(openDropdown === 'style' ? null : 'style')
              }
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/[0.07] border border-white/10 hover:border-white/20 transition-all text-sm text-white"
            >
              <span>
                {baseStyles.find((s) => s.id === tempPrefs.baseStyle)?.label}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  openDropdown === 'style' && 'rotate-180',
                )}
              />
            </button>
            <AnimatePresence>
              {openDropdown === 'style' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-[#242424] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                >
                  {baseStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        updateField(
                          'baseStyle',
                          style.id as Personalization['baseStyle'],
                        )
                        setOpenDropdown(null)
                      }}
                      className="w-full flex flex-col items-start p-2.5 hover:bg-white/5 text-sm transition-all text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={cn(
                            tempPrefs.baseStyle === style.id
                              ? 'text-yellow-500 font-bold'
                              : 'text-white/80',
                          )}
                        >
                          {style.label}
                        </span>
                        {tempPrefs.baseStyle === style.id && (
                          <Check className="w-3 h-3 text-yellow-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-white/30 line-clamp-1">
                        {style.desc}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* @UI.Chat.Personalization.Characteristics */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            {t('personalization.content.chars_title')}
          </label>
          <div className="space-y-4">
            {characteristics.map((char) => (
              <div key={char.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{char.label}</span>
                </div>
                <div className="flex p-0.5 rounded-xl bg-black/60 border border-white/5">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() =>
                        updateField(char.id as keyof Personalization, level.id)
                      }
                      className={cn(
                        'flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all',
                        tempPrefs[char.id as keyof Personalization] === level.id
                          ? 'bg-yellow-500/10 text-yellow-500 shadow-lg'
                          : 'text-white/20 hover:text-white/40',
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* @UI.Chat.Personalization.AboutUser */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3 h-3" />
              {t('personalization.content.nickname')}
            </label>
            <div className="relative group">
              <input
                type="text"
                value={tempPrefs.nickname}
                onChange={(e) => updateField('nickname', e.target.value)}
                placeholder={t('personalization.content.nickname')}
                className="w-full bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-white/30 tracking-wider flex items-center gap-2">
              <span className="text-white/60">
                {t('personalization.content.about_me')}
              </span>
            </label>
            <textarea
              value={tempPrefs.aboutMe}
              onChange={(e) => updateField('aboutMe', e.target.value)}
              placeholder={t('personalization.content.about_me_desc')}
              rows={3}
              className="w-full bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all resize-none custom-scrollbar"
            />
          </div>
        </div>

        {/** @UI.Chat.Personalization.CustomInstructions */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            {t('personalization.content.instructions_title')}
          </label>
          <textarea
            value={tempPrefs.customInstructions}
            onChange={(e) => updateField('customInstructions', e.target.value)}
            placeholder={t('personalization.content.instructions_desc')}
            rows={4}
            className="w-full bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 transition-all resize-none custom-scrollbar"
          />
        </div>
      </div>
      {/** @UI.Chat.Personalization.Footer */}
      <div className="p-2 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {hasChanges ? (
            <motion.button
              key="save-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleSave}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-yellow-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-yellow-500/10"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: 'linear',
                    }}
                    className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full"
                  />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {t('common.save')}
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="info-tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <Info className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/40 leading-relaxed italic">
                {t('personalization.content.style_desc')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

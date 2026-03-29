'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearApiError } from '@/store/slices/uiSlice'

/** @UI.Component.ErrorToast */
export function ErrorToast() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const apiError = useAppSelector((state) => state.ui.apiError)

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        dispatch(clearApiError())
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [apiError, dispatch])

  return (
    <AnimatePresence>
      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          role="alert"
          aria-live="assertive"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[120] max-w-md w-auto sm:w-full"
        >
          <div className="bg-[#1a1a1a] border border-white/[0.08] shadow-2xl pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-[1.5rem]">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-white/40" />
            </div>
            <p className="flex-1 text-sm text-white/60 leading-relaxed">
              {apiError.code ? t(`error.api.${apiError.code}`) || apiError.message : apiError.message || t('error.api.unknown')}
            </p>
            <button
              onClick={() => dispatch(clearApiError())}
              className="text-white/20 hover:text-white/40 transition-colors p-1 shrink-0"
              aria-label={t('error.api.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

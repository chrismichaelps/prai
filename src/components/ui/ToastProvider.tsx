'use client'

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const { t } = useI18n()
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
      animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
      exit={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
      transition={{
        type: 'spring',
        damping: 18,
        stiffness: 120,
        mass: 0.8,
      }}
      className="bg-[#090909]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />

      <div className="relative z-10 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl ${toast.type === 'success' ? 'bg-primary/10 border border-primary/20' : 'bg-red-500/10 border border-red-500/20'} flex items-center justify-center shrink-0`}>
          {toast.type === 'success' ? (
            <Check className="w-5 h-5 text-primary" />
          ) : (
            <X className="w-5 h-5 text-red-400" />
          )}
        </div>
        <p className="flex-1 text-white font-medium text-sm">
          {toast.message}
        </p>
        <button
          onClick={onDismiss}
          className="text-white/20 hover:text-white transition-colors p-1 shrink-0"
          aria-label={t('a11y.close')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function ToastProvider({ children }: React.PropsWithChildren<object>) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toasts.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-[100] max-w-sm w-auto sm:w-full origin-bottom sm:origin-bottom-right flex flex-col gap-3">
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onDismiss={() => dismissToast(toast.id)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setModelInfoVisible } from '@/store/slices/uiSlice'

/** @UI.Component.ModelInfoBanner */
export function ModelInfoBanner() {
  const { t } = useI18n()
  const dispatch = useAppDispatch()
  const isVisible = useAppSelector((state) => state.ui.isModelInfoVisible)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
          transition={{ 
            type: 'spring', 
            damping: 18, 
            stiffness: 120,
            mass: 0.8
          }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full origin-bottom-right"
        >
          <div className="bg-[#090909]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            {/* Background Glow - Soft & Premium */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                  <Info className="w-5 h-5 opacity-80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-display font-bold text-lg leading-tight mb-1.5">
                    {t('info.title')}
                  </h3>
                  <div className="space-y-4">
                    <p className="text-white/50 text-sm leading-relaxed font-medium">
                      {t('info.description')}
                    </p>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20">
                        {t('info.limitation')}
                      </p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(setModelInfoVisible(false))}
                  className="text-white/20 hover:text-white transition-colors p-1"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => dispatch(setModelInfoVisible(false))}
                  className="flex-1 bg-white text-[#090909] py-3 rounded-2xl text-sm font-black hover:bg-white/90 active:scale-95 transition-all shadow-xl"
                >
                  {t('cookies.accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

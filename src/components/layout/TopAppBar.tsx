'use client'

/** @UI.Layout.TopAppBar */

import { Search, UserCircle } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'
import { PraiLogo } from '@/components/brand/PraiLogo'

export function TopAppBar() {
  const activeTab = useAppSelector((state) => state.ui.activeTab)

  return (
    <header className="flex justify-between items-center px-12 py-6 w-full sticky top-0 z-30 bg-white/70 backdrop-blur-xl dark:bg-neutral-900/70 border-b border-transparent transition-opacity">
      <div className="flex items-center space-x-8">
        <PraiLogo className="scale-90" />
        <nav className="hidden md:flex space-x-6">
          <a
            href="#"
            className={cn(
              'font-sans uppercase tracking-widest text-[10px]',
              activeTab === 'chat'
                ? 'text-[#0050EF]'
                : 'text-neutral-400 hover:opacity-70',
            )}
          >
            Conversación
          </a>
          <a
            href="#"
            className="font-sans uppercase tracking-widest text-[10px] text-neutral-400 hover:opacity-70"
          >
            Archivos
          </a>
          <a
            href="#"
            className="font-sans uppercase tracking-widest text-[10px] text-neutral-400 hover:opacity-70"
          >
            Multimedia
          </a>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group">
          <Search className="w-5 h-5 text-neutral-400 group-hover:text-[#0050EF] cursor-pointer" />
        </div>
        <UserCircle className="w-5 h-5 text-neutral-900 dark:text-white cursor-pointer" />
      </div>
    </header>
  )
}

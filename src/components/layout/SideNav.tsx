'use client'

/** @UI.Component.Layout.SideNav */

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Newspaper,
  Compass,
  Radio,
  CreditCard,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setActiveTab } from '@/store/slices/uiSlice'
import { PraiLogo } from '@/components/brand/PraiLogo'

const navItems = [
  { id: 'news', icon: Newspaper, label: 'Noticias' },
  { id: 'tourism', icon: Compass, label: 'Turismo' },
  { id: 'radio', icon: Radio, label: 'Radio' },
  { id: 'passport', icon: CreditCard, label: 'Pasaporte' },
]

export const SideNav = () => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const activeTab = useAppSelector((state) => state.ui.activeTab)

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col p-8 animate-in slide-in-from-left duration-700">
      {/* @UI.Layout.SideNav.Logo */}
      <Link href="/" className="flex flex-col mb-14 group">
        <PraiLogo className="mb-1" />
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-blue/60 ml-1">
          Tu Pana AI
        </p>
      </Link>

      <div className="flex-1 flex flex-col space-y-10">
        {/* @UI.Layout.SideNav.Main */}
        <nav className="space-y-2">
          <Link
            href="/"
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium group',
              pathname === '/'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </Link>

          <Link
            href="/chat"
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium group',
              pathname === '/chat'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Wepa Chat</span>
          </Link>
        </nav>

        {/* @UI.Layout.SideNav.Features */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 px-4">
            Descubre la Isla
          </p>
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch(setActiveTab(item.id))
                  }}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-medium',
                    isActive
                      ? 'bg-slate-900 text-white shadow-xl'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* @UI.Layout.SideNav.Bottom */}
      <div className="pt-8 border-t border-slate-100 space-y-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors text-sm font-medium">
          <Settings className="w-4 h-4" />
          <span>Configuración</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500/60 hover:bg-red-50 transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

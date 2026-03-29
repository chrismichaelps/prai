'use client'

/** @UI.Notifications */
import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageSquare, AtSign, CheckCheck, ChevronRight } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { useNotifications } from '@/hooks/useNotifications'
import type { Notification } from '@/hooks/useNotifications'
import { useI18n } from '@/lib/effect/I18nProvider'

interface NotificationContextValue {
  open: boolean
  toggle: () => void
  close: () => void
  notifications: Notification[]
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
  markSeen: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

/** @UI.Notifications.Root */
export function NotificationBell({ children }: { children?: React.ReactNode }) {
  const { notifications, unreadCount, markRead, markAllRead, markSeen } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (open) {
      markSeen()
    }
  }, [open, markSeen])

  const toggle = () => setOpen((o) => !o)
  const close = () => setOpen(false)

  return (
    <NotificationContext.Provider value={{ open, toggle, close, notifications, unreadCount, markRead, markAllRead, markSeen }}>
      <div className="relative" ref={ref}>
        {children ? (
          React.Children.map(children, (child) =>
            React.cloneElement(child as React.ReactElement, { open, toggle })
          )
        ) : (
          <>
            <NotificationBell.Toggle open={open} />
            <NotificationBell.List />
          </>
        )}
      </div>
    </NotificationContext.Provider>
  )
}

/** @UI.Notifications.Toggle */
export function NotificationToggle({ open: _open }: { open?: boolean }) {
  const { unreadCount, toggle } = useContext(NotificationContext)!
  const { t } = useI18n()
  return (
    <button
      onClick={toggle}
      aria-label={t('a11y.notifications')}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors focus:outline-none"
    >
      <Bell className="w-4 h-4 text-white/60" />
      {unreadCount > 0 && (
        <motion.span
          key={unreadCount}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400 text-[9px] font-black text-black"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
    </button>
  )
}

/** @UI.Notifications.TypeIcon */
function NotifIcon({ type }: { type: string }) {
  if (type === 'mention' || type === 'issue_mentioned') return <AtSign className="w-3.5 h-3.5 text-yellow-400/70" />
  return <MessageSquare className="w-3.5 h-3.5 text-white/40" />
}

/** @UI.Notifications.Item */
function NotifItem({ notif }: { notif: Notification }) {
  const { markRead, close } = useContext(NotificationContext)!
  
  const handleClick = () => {
    if (!notif.is_read) markRead(notif.id)
    close()
  }

  const issueId = notif.issue_id ?? notif.resource_id
  const commentId = notif.resource_type === 'comment' ? notif.resource_id : notif.comment_id
  const href = commentId
    ? `/issues/${issueId}#comment-${commentId}`
    : `/issues/${issueId}`

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'flex items-start gap-3 px-4 py-3 transition-all hover:bg-white/[0.05] border-b border-white/[0.04] last:border-0 relative',
        !notif.is_read ? 'bg-white/[0.03]' : 'opacity-60'
      )}
    >
      <div className="relative flex-shrink-0">
        {notif.actor_avatar_url ? (
          <Image src={notif.actor_avatar_url} alt={notif.actor_handle ?? 'User'} width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-white/10" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
            <NotifIcon type={notif.type} />
          </div>
        )}
        {!notif.is_read && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-[#141414]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-white/70 leading-snug line-clamp-2">
          {notif.body || notif.title || 'New notification'}
        </p>
        <p className="text-[11px] text-white/30 mt-1.5 flex items-center gap-2">
          {timeAgo(notif.created_at)}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
    </Link>
  )
}

/** @UI.Notifications.List */
export function NotificationList() {
  const { open, close, notifications, unreadCount, markAllRead } = useContext(NotificationContext)!

  const unreadNotifications = notifications.filter(n => !n.is_read)
  const readNotifications = notifications.filter(n => n.is_read)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-[76px] md:top-full md:mt-3 w-auto md:w-80 lg:w-96",
            "bg-[#141414]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] origin-top md:origin-top-right transform-gpu",
            "max-h-[50vh] md:max-h-[70vh] flex flex-col"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-widest">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={() => { markAllRead(); close() }}
                className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/70 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent min-h-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-white/20">
                <Bell className="w-5 h-5" />
                <span className="text-xs">No notifications yet</span>
              </div>
            ) : (
              <>
                {unreadNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider bg-white/[0.02]">
                      Nuevas ({unreadNotifications.length})
                    </div>
                    {unreadNotifications.map((n) => (
                      <NotifItem key={n.id} notif={n} />
                    ))}
                  </div>
                )}

                {readNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider bg-white/[0.02]">
                      Anteriores ({readNotifications.length})
                    </div>
                    {readNotifications.map((n) => (
                      <NotifItem key={n.id} notif={n} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

NotificationBell.Toggle = NotificationToggle
NotificationBell.List = NotificationList

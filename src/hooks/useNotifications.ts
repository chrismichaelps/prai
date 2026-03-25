'use client'

/** @Hook.Notifications */

import { useEffect, useState, useCallback, useRef } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  resource_type: string | null
  resource_id: string | null
  issue_id: string | null
  comment_id: string | null
  actor_handle: string | null
  actor_avatar_url: string | null
  is_read: boolean
  created_at: string
}

export function useNotifications() {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const channelRef = useRef<ReturnType<ReturnType<typeof createSupabaseBrowserClient>['channel']> | null>(null)

  /** @Logic.Notifications.Fetch */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    const res = await fetch('/api/notifications')
    if (!res.ok) return
    const data: { notifications: Notification[] } = await res.json()
    setNotifications(data.notifications)
    setUnreadCount(data.notifications.filter((n) => !n.is_read).length)
  }, [isAuthenticated])

  /** @Logic.Notifications.Realtime */
  useEffect(() => {
    if (!isAuthenticated || !user) return

    fetchNotifications()

    const supabase = createSupabaseBrowserClient()
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          void fetchNotifications()
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [isAuthenticated, user, fetchNotifications])

  /** @Logic.Notifications.MarkRead */
  const markRead = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  /** @Logic.Notifications.MarkAllRead */
  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }, [])

  /** @Logic.Notifications.MarkSeen */
  const markSeen = useCallback(async () => {
    await fetch('/api/notifications/seen', { method: 'POST' })
  }, [])

  return { notifications, unreadCount, markRead, markAllRead, markSeen }
}

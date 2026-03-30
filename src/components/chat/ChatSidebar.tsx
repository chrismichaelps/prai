'use client'

/** @UI.Component.ChatSidebar */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SquarePen,
  MessageSquare,
  Archive,
  Trash2,
  MoreVertical,
  X,
  Loader2,
  ArchiveRestore,
  Inbox,
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  setCurrentChat,
  setChats,
  addChat,
  removeChat,
  clearHistory,
  setMessages,
  type Chat,
} from '@/store/slices/chatSlice'
import { ChatRole } from '@/types/chat'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/lib/effect/I18nProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { useRouter } from 'next/navigation'
import { SidebarProfile } from './SidebarProfile'
import { useHaptics } from '@/hooks/useHaptics'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { user } = useAuth()
  const haptics = useHaptics()
  const dispatch = useAppDispatch()
  const router = useRouter()
  /** @Store.Selector.Chat.State */
  const { chats, currentChatId } = useAppSelector((state) => state.chat)
  /** @UI.State.Loading */
  const [isLoading, setIsLoading] = useState(false)
  /** @UI.State.ActiveMenu */
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  /** @UI.State.ArchivedView */
  const [showArchived, setShowArchived] = useState(false)
  const [archivedChats, setArchivedChats] = useState<Chat[]>([])
  const [isLoadingArchived, setIsLoadingArchived] = useState(false)

  /** @Logic.UI.Lifecycle.AutoLoadChats */
  useEffect(() => {
    if (user && isOpen) {
      loadChats()
    }
  }, [user, isOpen])

  useEffect(() => {
    if (user && showArchived) {
      loadArchivedChats()
    }
  }, [user, showArchived])

  /** @Logic.UI.Chat.LoadActive */
  const loadChats = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/chat/chats?userId=${user.id}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      dispatch(setChats(data as Chat[]))
    } catch (err) {
      console.error('Error loading chats:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /** @Logic.UI.Chat.LoadArchived */
  const loadArchivedChats = async () => {
    if (!user) return
    setIsLoadingArchived(true)
    try {
      const res = await fetch(`/api/chat/chats/archived?userId=${user.id}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      setArchivedChats(data as Chat[])
    } catch (err) {
      console.error('Error loading archived chats:', err)
    } finally {
      setIsLoadingArchived(false)
    }
  }

  /** @Logic.UI.Chat.CreateNew */
  const createNewChat = async () => {
    if (!user) return
    try {
      const res = await fetch('/api/chat/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: t('chat.new_chat') || 'New Chat',
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      dispatch(addChat(data as Chat))
      dispatch(setMessages([]))
      showToast(t('chat.created') || 'Chat created', 'success')
      router.push(`/chat/${data.id}`)
    } catch (err) {
      console.error('Error creating chat:', err)
      showToast(t('chat.create_error') || 'Failed to create chat', 'error')
    }
  }

  /** @Logic.UI.Chat.Select */
  const selectChat = async (chatId: string) => {
    if (chatId === currentChatId) {
      onClose()
      return
    }

    dispatch(setCurrentChat(chatId))
    try {
      const res = await fetch(`/api/chat/chats/${chatId}`)
      const messages = await res.json()

      if (!res.ok) throw new Error(messages.error)

      const formattedMessages = messages.map(
        (msg: {
          role: string
          content: string
          metadata: Record<string, unknown> | null
        }) => ({
          role: msg.role as typeof ChatRole.USER | typeof ChatRole.ASSISTANT,
          content: msg.content,
          metadata: msg.metadata as Record<string, unknown> | undefined,
        }),
      )

      dispatch(setMessages(formattedMessages))
      router.push(`/chat/${chatId}`)
      onClose()
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  /** @Logic.UI.Chat.Archive */
  const archiveChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: true }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      
      dispatch(removeChat(chatId))
      if (currentChatId === chatId) {
        dispatch(clearHistory())
      }
      showToast(t('chat.archived') || 'Chat archived', 'success')
      setActiveMenu(null)
    } catch (err) {
      console.error('Error archiving chat:', err)
      showToast(t('chat.archive_error') || 'Failed to archive chat', 'error')
    }
  }

  /** @Logic.UI.Chat.Restore */
  const restoreChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/chats/${chatId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_archived: false }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      setArchivedChats(archivedChats.filter(c => c.id !== chatId))
      loadChats()
      showToast(t('chat.restored') || 'Chat restored', 'success')
      setActiveMenu(null)
    } catch (err) {
      console.error('Error restoring chat:', err)
      showToast(t('chat.restore_error') || 'Failed to restore chat', 'error')
    }
  }

  /** @Logic.UI.Chat.Delete */
  const deleteChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/chats/${chatId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }
      setArchivedChats(archivedChats.filter(c => c.id !== chatId))
      dispatch(removeChat(chatId))
      dispatch(clearHistory())
      showToast(t('chat.deleted') || 'Chat deleted', 'success')
      setActiveMenu(null)
    } catch (err) {
      console.error('Error deleting chat:', err)
      showToast(t('chat.delete_error') || 'Failed to delete chat', 'error')
    }
  }

  const currentChats = showArchived ? archivedChats : chats
  const isListLoading = showArchived ? isLoadingArchived : isLoading

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - closes sidebar when clicking outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">
                {showArchived
                  ? t('chat.archived_title') || 'Archived'
                  : t('chat.history') || 'Chat History'}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowArchived(!showArchived)}
                  aria-label={showArchived ? t('a11y.show_active') : t('a11y.show_archived')}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  {showArchived ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : (
                    <Archive className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => { haptics.success(); createNewChat() }}
                  aria-label={t('a11y.new_chat')}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* New Chat Button (only show when not in archived view) */}
            {!showArchived && (
              <div className="p-4">
                <button
                  onClick={createNewChat}
                  className="w-full flex items-center gap-3 bg-white/5 border border-white/10 text-white font-medium py-3 px-4 rounded-xl hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  <SquarePen className="w-5 h-5 text-white/70" />
                  <span className="text-sm font-semibold tracking-tight">
                    {t('chat.new_chat') || 'New Chat'}
                  </span>
                </button>
              </div>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {isListLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                </div>
              ) : currentChats.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>
                    {showArchived 
                      ? (t('chat.no_archived') || 'No archived chats')
                      : (t('chat.no_chats') || 'No chats yet')
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      layout
                      className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        currentChatId === chat.id
                          ? 'bg-white/10 border border-white/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                      onClick={() => { if (!showArchived) { haptics.selection(); selectChat(chat.id) } }}
                    >
                      <MessageSquare className="w-5 h-5 text-white/50 flex-shrink-0" />
                      <span className="flex-1 text-white/80 text-sm font-medium truncate">
                        {chat.title || t('chat.untitled') || 'Untitled'}
                      </span>

                      {/* More Actions */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenu(activeMenu === chat.id ? null : chat.id)
                        }}
                        aria-label={t('a11y.more_options')}
                        className="p-1 text-white/30 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === chat.id && (
                        <div className="absolute right-2 top-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-xl z-10">
                          {showArchived ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  restoreChat(chat.id)
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <ArchiveRestore className="w-4 h-4" />
                                {t('chat.restore') || 'Restore'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteChat(chat.id)
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('chat.delete_permanently') || 'Delete Permanently'}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  archiveChat(chat.id)
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                <Archive className="w-4 h-4" />
                                {t('chat.archive') || 'Archive'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteChat(chat.id)
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('chat.delete') || 'Delete'}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Section */}
            <SidebarProfile onSignOut={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

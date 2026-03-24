'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAppDispatch } from '@/store/hooks'
import { setCurrentChat, setMessages } from '@/store/slices/chatSlice'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

/** @Route.Chat.ById */
export default function ChatByIdPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chatId = params.id as string

  useEffect(() => {
    if (user && chatId) {
      loadChat()
    }
  }, [user, chatId])

  /** @Logic.UI.Chat.LoadChatById */
  const loadChat = async () => {
    if (!user || !chatId) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/chat/chats/${chatId}`)
      const messages = await res.json()
      
      if (!res.ok) throw new Error(messages.error)

      dispatch(setCurrentChat(chatId))
      
      const formattedMessages = messages.map((msg: { role: string; content: string; metadata: Record<string, unknown> | null }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        metadata: msg.metadata as Record<string, unknown> | undefined,
      }))
      
      dispatch(setMessages(formattedMessages))
    } catch (err) {
      console.error('Error loading chat:', err)
      router.push('/chat')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute redirectTo="/">
        <div className="relative h-screen w-full overflow-hidden bg-black">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-[160%] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(255,140,0,0.15)_0%,_rgba(255,69,0,0.05)_45%,_transparent_75%)] blur-[160px]" />
          </div>
          <div className="relative z-10 flex items-center justify-center h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute redirectTo="/">
      <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-primary/30">
        {/* Ambient Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-[160%] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(255,140,0,0.15)_0%,_rgba(255,69,0,0.05)_45%,_transparent_75%)] blur-[160px]" />
          <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[120%] h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(255,165,0,0.2)_0%,_rgba(255,140,0,0.08)_40%,_transparent_70%)] blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,191,0,0.08),transparent_70%)]" />
        </div>

        <div className="relative z-10 flex flex-col h-screen overflow-hidden">
          {/* Universal Header */}
          <Header variant="chat" onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
            <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col overflow-hidden relative">
              <ChatContainer />
            </div>
          </main>
        </div>

        <ChatSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </ProtectedRoute>
  )
}

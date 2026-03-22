'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { ChatContainer } from '@/components/chat/ChatContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

/** @Route.Chat.Main */
export default function ChatPage() {
  return (
    <ProtectedRoute redirectTo="/">
      <div className="relative h-screen w-full overflow-hidden bg-black font-sans selection:bg-primary/30">
        {/* Ambient Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Subtle Horizontal Amber Horizon (The "Resplandor") */}
          <div className="absolute bottom-[-160px] left-1/2 -translate-x-1/2 w-[160%] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(255,140,0,0.15)_0%,_rgba(255,69,0,0.05)_45%,_transparent_75%)] blur-[160px]" />

          {/* Soft Radiance Flare */}
          <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 w-[120%] h-[200px] bg-[radial-gradient(ellipse_at_center,_rgba(255,165,0,0.2)_0%,_rgba(255,140,0,0.08)_40%,_transparent_70%)] blur-[100px]" />

          {/* Central Vertical depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,191,0,0.08),transparent_70%)]" />
        </div>

        <div className="relative z-10 flex flex-col h-screen overflow-hidden">
          {/* Universal Header */}
          <Header variant="chat" />

          <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
            <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col overflow-hidden relative">
              <ChatContainer />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

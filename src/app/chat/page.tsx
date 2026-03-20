'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ChatContainer } from '@/components/chat/ChatContainer';

/** @Route.Chat.Main */
export default function ChatPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans selection:bg-primary/30">
      {/* Premium "Glasiar" Orange Ambient Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[160px] animate-pulse-glow" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[160px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        {/* Glassy overlay grain/texture if needed, but blurs are enough */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
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
  );
}

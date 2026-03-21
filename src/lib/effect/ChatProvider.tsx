'use client'

import React, { createContext, useContext, useCallback, useEffect } from 'react'
import { runtime } from './runtime'
import { initChat, sendChatMessage } from './chat'
import { RuntimeError } from './errors'
import { startSpeechToText, stopSpeechToText } from './services/Voice'
import { clearHistory as clearChatAction } from '@/store/slices/chatSlice'
import { useAppDispatch } from '@/store/hooks'

interface ChatContextType {
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
  startVoice: (onResult: (text: string, isFinal: boolean) => void) => void
  stopVoice: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

/** @Context.Effect.Chat */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  const init = useCallback(async () => {
    await runtime.runPromise(initChat).catch((e) =>
      console.error("[ChatProvider] init error:", e)
    )
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const sendMessage = useCallback(async (content: string) => {
    await runtime.runPromise(sendChatMessage(content)).catch((e) =>
      console.error("[ChatProvider] sendMessage error:", e)
    )
  }, [])

  const startVoice = useCallback((onResult: (text: string, isFinal: boolean) => void) => {
    startSpeechToText({
      onResult,
      onStart: () => {},
      onEnd: () => {},
      onError: (err: string) => console.error("[ChatProvider] Voice error:", err),
    })
  }, [])

  const stopVoice = useCallback(() => {
    stopSpeechToText()
  }, [])

  return (
    <ChatContext.Provider
      value={{
        sendMessage,
        clearHistory: () => {
          dispatch(clearChatAction())
          init()
        },
        startVoice,
        stopVoice,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatActions = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new RuntimeError({
      message: 'useChatActions must be used within a ChatProvider',
    })
  }
  return context
}

/** @Deprecated */
export const useChatStore = useChatActions


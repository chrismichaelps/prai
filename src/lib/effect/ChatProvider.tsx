'use client'

import React, { createContext, useContext, useCallback, useEffect, useRef } from 'react'
import { Fiber } from 'effect'
import { runtime } from './runtime'
import { initChat, sendChatMessage, regenerateResponse } from './chat'
import { RuntimeError } from './errors'
import { startSpeechToText, stopSpeechToText } from './services/Voice'
import { clearHistory as clearChatAction, editMessage as editChatMessageAction } from '@/store/slices/chatSlice'
import { useAppDispatch } from '@/store/hooks'

interface ChatContextType {
  sendMessage: (content: string) => Promise<void>
  regenerateMessage: () => Promise<void>
  editMessage: (index: number, content: string) => Promise<void>
  stopResponse: () => void
  clearHistory: () => void
  startVoice: (onResult: (text: string, isFinal: boolean) => void) => void
  stopVoice: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

/** @Context.Effect.Chat */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const activeFiber = useRef<Fiber.RuntimeFiber<any, any> | null>(null)
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
    const fiber = runtime.runFork(sendChatMessage(content))
    activeFiber.current = fiber
    
    runtime.runPromise(Fiber.await(fiber)).then(() => {
      if (activeFiber.current === fiber) {
        activeFiber.current = null
      }
    })
  }, [])

  const regenerateMessage = useCallback(async () => {
    const fiber = runtime.runFork(regenerateResponse)
    activeFiber.current = fiber
    
    runtime.runPromise(Fiber.await(fiber)).then(() => {
      if (activeFiber.current === fiber) {
        activeFiber.current = null
      }
    })
  }, [])

  const editMessage = useCallback(async (index: number, content: string) => {
    if (activeFiber.current) {
      await runtime.runPromise(Fiber.interrupt(activeFiber.current))
      activeFiber.current = null
    }
    dispatch(editChatMessageAction({ index, content }))
    await regenerateMessage()
  }, [dispatch, regenerateMessage])

  const stopResponse = useCallback(async () => {
    if (activeFiber.current) {
      await runtime.runPromise(Fiber.interrupt(activeFiber.current))
      activeFiber.current = null
    }
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
        regenerateMessage,
        editMessage,
        stopResponse,
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


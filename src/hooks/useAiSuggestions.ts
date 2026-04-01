'use client'

/** @Hook.UseAiSuggestions */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ChatMessage } from '@/types/chat'
import { ChatRole } from '@/types/chat'
import { 
  shouldShowSuggestion, 
  buildSuggestionPrompt, 
  processSuggestionResponse, 
  getSuggestionSystemPrompt,
  SUGGESTION_CONFIG
} from '@/lib/effect/services/Suggestion'
import { runtime } from '@/lib/effect/runtime'
import { OpenRouter } from '@/lib/effect/services/OpenRouter'
import { Effect, Stream } from 'effect'

/** @Hook.UseAiSuggestions */
export function useAiSuggestions(messages: readonly ChatMessage[], isLoading: boolean) {
  /** @State.Suggestions */
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  /** @Ref.AbortController */
  const abortControllerRef = useRef<AbortController | null>(null)
  /** @Ref.IsMounted */
  const isMountedRef = useRef(true)
  /** @Ref.LastRequestTime */
  const lastRequestTimeRef = useRef<number>(0)

  /** @Hook.Effect.Cleanup */
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  /** @Logic.Suggestion.AbortPrevious */
  const abortPrevious = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
  }, [])

  /** @Hook.Effect.Trigger */
  useEffect(() => {
    /** @Check.Loading */
    if (isLoading) {
      abortPrevious()
      return
    }

    /** @Check.RateLimit */
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTimeRef.current
    if (timeSinceLastRequest < SUGGESTION_CONFIG.RATE_LIMIT_MS) {
      return
    }

    /** @Check.ShouldShow */
    if (!shouldShowSuggestion(messages)) {
      setAiSuggestions([])
      return
    }

    /** @Logic.Suggestion.Generate */
    const generateAISuggestion = async () => {
      /** @Logic.AbortPrevious */
      abortPrevious()
      /** @Logic.UpdateLastRequestTime */
      lastRequestTimeRef.current = Date.now()

      try {
        /** @Logic.BuildPrompt */
        const prompt = buildSuggestionPrompt(messages)
        /** @Logic.GetSystemPrompt */
        const systemPrompt = getSuggestionSystemPrompt()
        
        /** @Logic.BuildMessages */
        const suggestionMessages: Array<{ role: typeof ChatRole[keyof typeof ChatRole]; content: string }> = [
          { role: ChatRole.SYSTEM, content: systemPrompt + '\n\n' + prompt },
          { role: ChatRole.USER, content: '[Generar sugerencia]' }
        ]
        
        /** @Effect.RunAI */
        const runEffect = Effect.gen(function* () {
          const or = yield* OpenRouter
          const stream = or.chat(suggestionMessages)
          const collected = yield* Stream.runCollect(Stream.take(stream, 1))
          let content = ''
          for (const response of collected) {
            content += response.content
          }
          return content
        })
        
        /** @Logic.RunEffect */
        const result = await runtime.runPromise(
          Effect.provide(runEffect, OpenRouter.Default)
        )
        
        /** @Check.Mounted */
        if (!isMountedRef.current) return
        
        /** @Logic.ProcessResponse */
        const processed = processSuggestionResponse(result)
        
        /** @Check.Confidence */
        if (
          processed.suggestion && 
          processed.confidence >= SUGGESTION_CONFIG.CONFIDENCE_THRESHOLD
        ) {
          setAiSuggestions([processed.suggestion])
        } else {
          setAiSuggestions([])
        }
      } catch (err) {
        /** @Check.Mounted */
        if (!isMountedRef.current) return
        /** @Check.AbortError */
        if (err instanceof Error && err.name === 'AbortError') return
        
        setAiSuggestions([])
      }
    }
    
    /** @Logic.Generate */
    generateAISuggestion()
  }, [isLoading, messages, abortPrevious])

  /** @Logic.ClearSuggestions */
  const clearSuggestions = useCallback(() => {
    setAiSuggestions([])
    abortPrevious()
  }, [abortPrevious])

  /** @Return.Suggestions */
  return {
    aiSuggestions,
    clearSuggestions,
    setAiSuggestions
  }
}

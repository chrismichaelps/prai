'use client'

/** @Hook.UseAiSuggestions */

import { useState, useEffect, useRef, useCallback } from 'react'
import { Effect, Exit, Stream, Cause } from 'effect'
import type { ChatMessage } from '@/types/chat'
import { ChatRole } from '@/types/chat'
import { SuggestionError } from '@/lib/effect/errors'
import type { SuggestionMessage } from '@/lib/effect/schemas/SuggestionSchema'
import {
  shouldShowSuggestion,
  buildSuggestionPrompt,
  processSuggestionResponse,
  getSuggestionSystemPrompt,
  SUGGESTION_GENERATE_TOKEN,
  SUGGESTION_CONFIG,
} from '@/lib/effect/services/Suggestion'
import { runtime } from '@/lib/effect/runtime'
import { OpenRouter } from '@/lib/effect/services/OpenRouter'

/** @Hook.UseAiSuggestions */
export function useAiSuggestions(messages: readonly ChatMessage[], isLoading: boolean) {
  /** @State.Suggestions */
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  /** @Ref.AbortController */
  const abortControllerRef = useRef<AbortController | null>(null)

  /** @Ref.IsMounted */
  const isMountedRef = useRef(true)

  /** @Ref.LastRequestTime */
  const lastRequestTimeRef = useRef(0)

  /** @Hook.Effect.Cleanup */
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  /** @Logic.Suggestion.AbortPrevious */
  const abortPrevious = useCallback((): AbortController => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    return controller
  }, [])

  /** @Logic.Suggestion.BuildEffect */
  const buildSuggestionEffect = useCallback(
    (promptMessages: SuggestionMessage[]) =>
      Effect.gen(function* () {
        /** @Effect.Suggestion.GetService */
        const or = yield* OpenRouter

        /** @Effect.Suggestion.Stream */
        const stream = or.chat(promptMessages)

        /** @Effect.Suggestion.Collect */
        const chunks = yield* Stream.runCollect(Stream.take(stream, 1))

        /** @Effect.Suggestion.Aggregate */
        let raw = ''
        for (const chunk of chunks) {
          raw += chunk.content
        }

        /** @Effect.Suggestion.Process */
        return yield* processSuggestionResponse(raw)
      }).pipe(
        Effect.mapError((err) => {
          /** @Error.Suggestion.MapGeneration */
          if (err instanceof SuggestionError) return err
          return new SuggestionError({
            message: String(err),
            reason: 'generation',
            cause: err,
          })
        }),
      ),
    [],
  )

  /** @Hook.Effect.Trigger */
  useEffect(() => {
    /** @Check.Loading */
    if (isLoading) {
      abortPrevious()
      return
    }

    /** @Check.RateLimit */
    const now = Date.now()
    if (now - lastRequestTimeRef.current < SUGGESTION_CONFIG.RATE_LIMIT_MS) return

    /** @Check.ShouldShow */
    if (!shouldShowSuggestion(messages)) {
      setAiSuggestions([])
      return
    }

    /** @Logic.Suggestion.Generate */
    const generate = async () => {
      abortPrevious()
      lastRequestTimeRef.current = Date.now()

      /** @Logic.Suggestion.BuildMessages */
      const systemPrompt = getSuggestionSystemPrompt()
      const contextPrompt = buildSuggestionPrompt(messages)

      const promptMessages: SuggestionMessage[] = [
        { role: ChatRole.SYSTEM, content: `${systemPrompt}\n\n${contextPrompt}` },
        { role: ChatRole.USER, content: SUGGESTION_GENERATE_TOKEN },
      ]

      /** @Logic.Suggestion.RunEffect */
      const exit = await runtime.runPromiseExit(buildSuggestionEffect(promptMessages))

      /** @Check.Mounted */
      if (!isMountedRef.current) return

      /** @Logic.Suggestion.HandleExit */
      Exit.match(exit, {
        onSuccess: (result) => {
          setAiSuggestions([result.suggestion])
        },
        onFailure: (cause) => {
          /** @Logic.Suggestion.HandleFailure */
          const maybeErr = Cause.failureOption(cause)
          if (maybeErr._tag === 'Some') {
            const suggErr = maybeErr.value
            /** @Check.Abort */
            if (suggErr instanceof SuggestionError) {
              if (
                suggErr.reason === 'aborted' ||
                suggErr.reason === 'rate_limit' ||
                suggErr.reason === 'unmounted'
              ) return
            }
          }
          setAiSuggestions([])
        },
      })
    }

    generate()
  }, [isLoading, messages, abortPrevious, buildSuggestionEffect])

  /** @Logic.Suggestion.Clear */
  const clearSuggestions = useCallback(() => {
    setAiSuggestions([])
    abortPrevious()
  }, [abortPrevious])

  /** @Return.Suggestions */
  return {
    aiSuggestions,
    clearSuggestions,
    setAiSuggestions,
  }
}

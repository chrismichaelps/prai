import { Context, Layer } from "effect"

/** @Type.Effect.Voice.Recognition */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  readonly isFinal: boolean
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onstart: () => void
  onend: () => void
  start(): void
  stop(): void
}

/** @Type.Effect.Voice.Window */
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition
    SpeechRecognition?: new () => SpeechRecognition
    _prai_recognition?: SpeechRecognition
  }
}

/** @Service.Effect.Voice.Definition */
export interface VoiceService {
  readonly isSupported: () => boolean
  readonly start: (callbacks: VoiceCallbacks) => void
  readonly stop: () => void
}

export interface VoiceCallbacks {
  onResult: (text: string, isFinal: boolean) => void
  onEnd: () => void
  onError: (error: string) => void
  onStart: () => void
}

export const startSpeechToText = (callbacks: VoiceCallbacks) => {
  if (typeof window === 'undefined') return

  const Recognition = window.webkitSpeechRecognition ?? window.SpeechRecognition
  if (!Recognition) {
    callbacks.onError("Speech recognition not supported in this browser")
    return
  }

  const recognition = new Recognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'es-PR'

  recognition.onstart = () => callbacks.onStart()
  recognition.onend = () => callbacks.onEnd()
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => callbacks.onError(event.error)

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = ''
    let finalTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i]
      if (result && result.isFinal) {
        finalTranscript += result[0]?.transcript ?? ''
      } else if (result) {
        interimTranscript += result[0]?.transcript ?? ''
      }
    }

    callbacks.onResult(finalTranscript || interimTranscript, !!finalTranscript)
  }

  recognition.start()
  window._prai_recognition = recognition
}

export const stopSpeechToText = () => {
  if (typeof window === 'undefined') return
  const recognition = window._prai_recognition
  if (recognition) {
    recognition.stop()
    delete window._prai_recognition
  }
}

export const VoiceService = Context.GenericTag<VoiceService>("VoiceService")

export const VoiceServiceLive = Layer.succeed(
  VoiceService,
  VoiceService.of({
    isSupported: () => typeof window !== 'undefined' && (!!(window.webkitSpeechRecognition) || !!(window.SpeechRecognition)),
    start: startSpeechToText,
    stop: stopSpeechToText
  })
)

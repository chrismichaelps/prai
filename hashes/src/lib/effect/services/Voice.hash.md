---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Service.Voice

### [Signatures]
```ts
declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition
    SpeechRecognition?: new () => SpeechRecognition
    _prai_recognition?: SpeechRecognition
  }
}

export interface VoiceService {
  readonly isSupported: () => boolean
  readonly startSpeechToText: (callbacks: VoiceCallbacks) => void
  readonly stopSpeechToText: () => void
}

export const VoiceServiceLive: Layer.Layer<VoiceService>
export const startSpeechToText: (callbacks: VoiceCallbacks) => void
export const stopSpeechToText: () => void
```

### [Governance]
- **Layer_Law:** `VoiceServiceLive` provided directly in MainLayer.
- **Export_Law:** Imperative `start/stop` helpers exported alongside the Effect.Service for React interop.
- **Platform_Law:** Wraps the Web Speech API — browser-only. Guard with `typeof window !== "undefined"`.
- **Type_Safety_Law:** Uses `declare global` Window augmentation instead of `any` casts. Recognition instance stored on `window._prai_recognition` for stop access.

### [Semantic Hash]
Browser-native speech recognition service. Manages SpeechRecognition lifecycle with start/stop primitives. Bridges Web API into Effect dependency graph. Window interface augmented with typed recognition constructors.

### [Linkage]
- **Upstream:** Browser Web Speech API
- **Downstream:** `@root/src/lib/effect/runtime.ts`, `@root/src/lib/effect/ChatProvider.tsx`

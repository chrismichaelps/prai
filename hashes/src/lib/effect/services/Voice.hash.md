---
State_ID: BigInt(0x1)
Git_SHA: INIT
Grammar_Lock: "@root/hashes/grammar/effect.hash.md"
---

## @Service.Voice

### [Signatures]
```ts
export class VoiceService extends Effect.Service<VoiceService>()("Voice", { ... }) {}
export const VoiceServiceLive: Layer.Layer<VoiceService>
export const startSpeechToText: (options: SpeechToTextOptions) => void
export const stopSpeechToText: () => void
```

### [Governance]
- **Layer_Law:** `VoiceServiceLive` provided directly in MainLayer.
- **Export_Law:** Imperative `start/stop` helpers exported alongside the Effect.Service for React interop.
- **Platform_Law:** Wraps the Web Speech API — browser-only. Guard with `typeof window !== "undefined"`.

### [Semantic Hash]
Browser-native speech recognition service. Manages SpeechRecognition lifecycle with start/stop primitives. Bridges Web API into Effect dependency graph.

### [Linkage]
- **Upstream:** Browser Web Speech API
- **Downstream:** `@root/src/lib/effect/runtime.ts`, `@root/src/lib/effect/ChatProvider.tsx`

---
State_ID: BigInt(0x220e1812)
Git_SHA: e14bd7ccd7a813335a9fa967470e8061bd2124a0
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @lib.effect.constants.AdaptiveCardConstants

### [Signatures]
```ts
export const ADAPTIVE_CARD_TYPES = {
  TOURISM: 'tourism',
  NEWS: 'news',
  RADIO: 'radio',
  PHOTOS: 'photos',
  VIDEO: 'video',
  SUGGESTIONS: 'suggestions',
  WELCOME: 'welcome',
  PERSONALITY: 'personality',
  SEARCH_LOCATION: 'search_location',
  DINING: 'dining',
  ITINERARY: 'itinerary',
  ACTIVITY: 'activity',
  EVENT: 'event',
  MEDIA_SEARCH: 'media_search',
  REFERENCES: 'references',
} as const;
export type AdaptiveCardType = typeof ADAPTIVE_CARD_TYPES[keyof typeof ADAPTIVE_CARD_TYPES];
```

### [Governance]
- **Encapsulation_Law:** Strictly adheres to file-level opacity rules.
- **Grammar_Bridge:** Mirrors `@root/hashes/grammar/typescript.hash.md`

### [Semantic Hash]
FMCF auto-generated constraint registry for lib/effect/constants/AdaptiveCardConstants.ts

### [Linkage]
- **Dependencies:** None

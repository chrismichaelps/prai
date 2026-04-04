---
State_ID: BigInt(0x2)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Component.Chat.AdaptiveCard

### [Signatures]
```ts
export type AdaptiveCardData =
  | TourismContent
  | DiningContent
  | ActivityContent
  | EventContent
  | PhotosContent
  | VideoContent
  | SuggestionsContent
  | ItineraryContent
  | MediaSearchContent
  | SearchLocation
  | BaseContent

export function AdaptiveCard(props: AdaptiveCardProps): JSX.Element
export function useAdaptiveCard(): AdaptiveCardContextValue
```

### [Governance]
- **Type_Safety_Law:** `AdaptiveCardData` union includes `SearchLocation` variant. Property access guarded with `'key' in data` type narrowing instead of direct property access.
- **Context_Law:** Sub-components access card data via `useAdaptiveCard()` context hook — throws `RuntimeError` if used outside `<AdaptiveCard.Root />`.

### [Semantic Hash]
Renders adaptive cards with actions for chat responses. Supports tourism, dining, events, photos, videos, suggestions, itineraries, search locations, and media search content types.

### [Linkage]
- **Upstream:** `@root/src/lib/effect/schemas/AdaptiveCardsSchema.ts`
- **Downstream:** `@root/src/components/chat/ChatContainer.tsx`

/** @Constant.Effect.AdaptiveCard */
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

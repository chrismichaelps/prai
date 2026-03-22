/** @Schema.Effect.AdaptiveCards.Definition */
import { Schema } from "effect"

export const BaseContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String)
})

/** @Type.Effect.AdaptiveCards.Base */
export type BaseContent = Schema.Schema.Type<typeof BaseContentSchema>

export const TourismContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  location: Schema.String,
  images: Schema.optional(Schema.Array(Schema.String)),
  attractions: Schema.optional(Schema.Array(Schema.String)),
  rating: Schema.optional(Schema.Number),
  reviews: Schema.optional(Schema.Number),
  lat: Schema.optional(Schema.Number),
  lng: Schema.optional(Schema.Number),
  mapUrl: Schema.optional(Schema.String),
  priceRange: Schema.optional(Schema.Literal("$", "$$", "$$$", "$$$$")),
  openingHours: Schema.optional(Schema.String),
  bestTimeToVisit: Schema.optional(Schema.String),
  accessibility: Schema.optional(Schema.Array(Schema.String)),
  media_search_terms: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.Effect.AdaptiveCards.Tourism */
export type TourismContent = Schema.Schema.Type<typeof TourismContentSchema>

export const PhotosContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  images: Schema.Array(Schema.String),
  location: Schema.optional(Schema.String),
  media_search_terms: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.Effect.AdaptiveCards.Photos */
export type PhotosContent = Schema.Schema.Type<typeof PhotosContentSchema>

export const VideoContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  youtubeUrl: Schema.optional(Schema.NullOr(Schema.String)),
  youtubeSearchUrl: Schema.optional(Schema.String),
})

/** @Type.Effect.AdaptiveCards.Video */
export type VideoContent = Schema.Schema.Type<typeof VideoContentSchema>

export const SuggestionItemSchema = Schema.Struct({
  label: Schema.String,
  action: Schema.String,
  params: Schema.Record({ key: Schema.String, value: Schema.String })
})

export const SuggestionsContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  items: Schema.Array(SuggestionItemSchema)
})

/** @Type.Effect.AdaptiveCards.Suggestions */
export type SuggestionsContent = Schema.Schema.Type<typeof SuggestionsContentSchema>

export const SearchLocationSchema = Schema.Struct({
  search: Schema.String
})

/** @Type.Effect.AdaptiveCards.SearchLocation */
export type SearchLocation = Schema.Schema.Type<typeof SearchLocationSchema>

export const DiningContentSchema = Schema.Struct({
  title: Schema.String,
  cuisine: Schema.String,
  priceRange: Schema.Literal("$", "$$", "$$$", "$$$$"),
  rating: Schema.optional(Schema.Number),
  menuHighlights: Schema.optional(Schema.Array(Schema.String)),
  images: Schema.optional(Schema.Array(Schema.String)),
  location: Schema.String,
  media_search_terms: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.Effect.AdaptiveCards.Dining */
export type DiningContent = Schema.Schema.Type<typeof DiningContentSchema>

export const ItineraryStepSchema = Schema.Struct({
  day: Schema.Number,
  title: Schema.String,
  description: Schema.String,
  location: Schema.optional(Schema.String),
  time: Schema.optional(Schema.String),
})

export const ItineraryContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  days: Schema.Number,
  steps: Schema.Array(ItineraryStepSchema),
  totalCostEstimate: Schema.optional(Schema.String),
  tips: Schema.optional(Schema.Array(Schema.String)),
  references: Schema.optional(Schema.Struct({
    flights: Schema.optional(Schema.Struct({ label: Schema.String, url: Schema.String })),
    hotels: Schema.optional(Schema.Struct({ label: Schema.String, url: Schema.String })),
    cars: Schema.optional(Schema.Struct({ label: Schema.String, url: Schema.String }))
  }))
})

/** @Type.Effect.AdaptiveCards.Itinerary */
export type ItineraryContent = Schema.Schema.Type<typeof ItineraryContentSchema>

export const ActivityContentSchema = Schema.Struct({
  title: Schema.String,
  type: Schema.String,
  duration: Schema.optional(Schema.String),
  difficulty: Schema.optional(Schema.Literal("easy", "moderate", "hard")),
  priceRange: Schema.optional(Schema.Literal("$", "$$", "$$$", "$$$$")),
  requirements: Schema.optional(Schema.Array(Schema.String)),
  images: Schema.optional(Schema.Array(Schema.String)),
  location: Schema.String,
  media_search_terms: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.Effect.AdaptiveCards.Activity */
export type ActivityContent = Schema.Schema.Type<typeof ActivityContentSchema>

export const NewsContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  timeline: Schema.Array(Schema.Struct({
    date: Schema.String,
    event: Schema.String
  }))
})

/** @Type.Effect.AdaptiveCards.News */
export type NewsContent = Schema.Schema.Type<typeof NewsContentSchema>

export const RadioContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  station: Schema.String,
  frequency: Schema.String
})

/** @Type.Effect.AdaptiveCards.Radio */
export type RadioContent = Schema.Schema.Type<typeof RadioContentSchema>

export const MediaSearchContentSchema = Schema.Struct({
  title: Schema.String,
  description: Schema.optional(Schema.String),
  media_search_terms: Schema.Array(Schema.String),
  type: Schema.optional(Schema.Literal("video", "images", "general"))
})

/** @Type.Effect.AdaptiveCards.MediaSearch */
export type MediaSearchContent = Schema.Schema.Type<typeof MediaSearchContentSchema>

export const EventContentSchema = Schema.Struct({
  title: Schema.String,
  date: Schema.String,
  location: Schema.String,
  ticketUrl: Schema.optional(Schema.String),
  description: Schema.String,
  images: Schema.optional(Schema.Array(Schema.String)),
  media_search_terms: Schema.optional(Schema.Array(Schema.String)),
})

/** @Type.Effect.AdaptiveCards.Event */
export type EventContent = Schema.Schema.Type<typeof EventContentSchema>

export const ReferencesContentSchema = Schema.Struct({
  title: Schema.optional(Schema.String),
  items: Schema.Array(Schema.Struct({
    label: Schema.optional(Schema.String),
    description: Schema.optional(Schema.String),
    url: Schema.String
  }))
})

/** @Type.Effect.AdaptiveCards.References */
export type ReferencesContent = Schema.Schema.Type<typeof ReferencesContentSchema>

/** @Schema.Effect.AdaptiveCards.Union */
export const AdaptiveBlock = Schema.Union(
  Schema.Struct({ type: Schema.Literal("tourism"), data: TourismContentSchema }),
  Schema.Struct({ type: Schema.Literal("photos"), data: PhotosContentSchema }),
  Schema.Struct({ type: Schema.Literal("video"), data: VideoContentSchema }),
  Schema.Struct({ type: Schema.Literal("suggestions"), data: SuggestionsContentSchema }),
  Schema.Struct({ type: Schema.Literal("search_location"), data: SearchLocationSchema }),
  Schema.Struct({ type: Schema.Literal("itinerary"), data: ItineraryContentSchema }),
  Schema.Struct({ type: Schema.Literal("dining"), data: DiningContentSchema }),
  Schema.Struct({ type: Schema.Literal("activity"), data: ActivityContentSchema }),
  Schema.Struct({ type: Schema.Literal("event"), data: EventContentSchema }),
  Schema.Struct({ type: Schema.Literal("news"), data: NewsContentSchema }),
  Schema.Struct({ type: Schema.Literal("radio"), data: RadioContentSchema }),
  Schema.Struct({ type: Schema.Literal("media_search"), data: MediaSearchContentSchema }),
  Schema.Struct({ type: Schema.Literal("references"), data: ReferencesContentSchema }),
)

export type AdaptiveBlock = Schema.Schema.Type<typeof AdaptiveBlock>

export const AdaptiveCardTypeSchema = Schema.Literal(
  "tourism",
  "news",
  "radio",
  "photos",
  "video",
  "suggestions",
  "personality",
  "welcome",
  "search_location",
  "itinerary",
  "dining",
  "activity",
  "event",
  "media_search",
  "references"
)

export type CardType = Schema.Schema.Type<typeof AdaptiveCardTypeSchema>

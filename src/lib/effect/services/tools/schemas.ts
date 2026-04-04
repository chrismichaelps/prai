/** @Schema.ToolParams */

import { Schema } from "effect"

const asSchema = <I, O, R>(s: Schema.Schema<I, O, R>): Schema.Schema<unknown, unknown> => s as Schema.Schema<unknown, unknown>

/** @Schema.SearchBeachesParams */
export const SearchBeachesParamsSchema = asSchema(Schema.Struct({
  location: Schema.optional(Schema.String),
  activity: Schema.optional(Schema.String)
}))

/** @Schema.SearchRestaurantsParams */
export const SearchRestaurantsParamsSchema = asSchema(Schema.Struct({
  cuisine: Schema.optional(Schema.String),
  location: Schema.optional(Schema.String),
  priceRange: Schema.optional(Schema.String)
}))

/** @Schema.SearchEventsParams */
export const SearchEventsParamsSchema = asSchema(Schema.Struct({
  category: Schema.optional(Schema.String),
  location: Schema.optional(Schema.String),
  date: Schema.optional(Schema.String)
}))

/** @Schema.SearchPlacesParams */
export const SearchPlacesParamsSchema = asSchema(Schema.Struct({
  category: Schema.optional(Schema.String),
  location: Schema.optional(Schema.String)
}))

/** @Schema.SearchHotelsParams */
export const SearchHotelsParamsSchema = asSchema(Schema.Struct({
  location: Schema.optional(Schema.String),
  budget: Schema.optional(Schema.String),
  type: Schema.optional(Schema.String)
}))

/** @Schema.SearchWeatherParams */
export const SearchWeatherParamsSchema = asSchema(Schema.Struct({
  location: Schema.optional(Schema.String),
  timeframe: Schema.optional(Schema.String)
}))

/** @Schema.SearchTransportParams */
export const SearchTransportParamsSchema = asSchema(Schema.Struct({
  from: Schema.optional(Schema.String),
  to: Schema.optional(Schema.String),
  mode: Schema.optional(Schema.String)
}))

/** @Schema.SaveFavoriteParams */
export const SaveFavoriteParamsSchema = asSchema(Schema.Struct({
  placeName: Schema.String,
  placeType: Schema.optional(Schema.String),
  location: Schema.optional(Schema.String),
  notes: Schema.optional(Schema.String)
}))

/** @Schema.SaveItineraryParams */
export const SaveItineraryParamsSchema = asSchema(Schema.Struct({
  title: Schema.String,
  days: Schema.optional(Schema.Array(Schema.Struct({
    date: Schema.String,
    activities: Schema.Array(Schema.Struct({
      time: Schema.String,
      place: Schema.String,
      notes: Schema.optional(Schema.String)
    }))
  }))),
  notes: Schema.optional(Schema.String)
}))

/** @Schema.RememberUserFactParams */
export const RememberUserFactParamsSchema = asSchema(Schema.Struct({
  key: Schema.String,
  value: Schema.String,
  category: Schema.optional(Schema.Literal("preference", "fact", "itinerary", "contact"))
}))

export const ToolParamsSchemas = {
  search_beaches: SearchBeachesParamsSchema,
  search_restaurants: SearchRestaurantsParamsSchema,
  search_events: SearchEventsParamsSchema,
  search_places: SearchPlacesParamsSchema,
  search_hotels: SearchHotelsParamsSchema,
  search_weather: SearchWeatherParamsSchema,
  search_transport: SearchTransportParamsSchema,
  save_favorite: SaveFavoriteParamsSchema,
  save_itinerary: SaveItineraryParamsSchema,
  remember_user_fact: RememberUserFactParamsSchema
} as const
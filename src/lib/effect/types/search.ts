import { Data } from "effect"

export const MediaTypes = {
  Text: "text",
  Images: "images",
  Videos: "videos",
  News: "news",
  Social: "social",
  Reviews: "reviews",
  Events: "events"
} as const

export type MediaType = typeof MediaTypes[keyof typeof MediaTypes]

export const SearchCategories = {
  All: "all",
  Tourism: "tourism",
  Food: "food",
  Beaches: "beaches",
  Culture: "culture",
  Events: "events",
  Nightlife: "nightlife",
  Nature: "nature",
  History: "history",
  Shopping: "shopping",
  Transportation: "transportation"
} as const

export type SearchCategory = typeof SearchCategories[keyof typeof SearchCategories]

export const Timeframes = {
  Live: "live",
  Today: "today",
  ThisWeek: "this-week",
  ThisMonth: "this-month",
  Recent: "recent",
  Any: "any"
} as const

export type Timeframe = typeof Timeframes[keyof typeof Timeframes]

export const Languages = {
  English: "en",
  Spanish: "es",
  Both: "both"
} as const

export type Language = typeof Languages[keyof typeof Languages]

export const DiscoveryCategories = {
  Trending: "trending",
  Events: "events",
  Food: "food",
  Beaches: "beaches",
  Nightlife: "nightlife",
  Culture: "culture",
  Nature: "nature",
  News: "news"
} as const

export type DiscoveryCategory = typeof DiscoveryCategories[keyof typeof DiscoveryCategories]

export interface PuertoRicoSearchOptions {
  readonly query: string
  readonly mediaTypes?: readonly MediaType[]
  readonly location?: string
  readonly category?: SearchCategory
  readonly timeframe?: Timeframe
  readonly language?: Language
  readonly realTime?: boolean
}

export class PuertoRicoSearchOptionsBuilder extends Data.Class<PuertoRicoSearchOptions> {}

export const DefaultSearchOptions: PuertoRicoSearchOptions = {
  query: "",
  mediaTypes: [MediaTypes.Text, MediaTypes.Images, MediaTypes.Videos, MediaTypes.News],
  timeframe: Timeframes.Recent,
  language: Languages.Spanish,
  realTime: false
}
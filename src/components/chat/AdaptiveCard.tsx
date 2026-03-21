'use client'

/** @UI.Chat.AdaptiveCard.Root */

import React, { createContext, useContext, useMemo } from 'react'
import { useI18n } from '@/lib/effect/I18nProvider'
import { motion } from 'framer-motion'
import {
  Star,
  Compass,
  ArrowRight,
  Utensils,
  ExternalLink,
  Search,
  Video,
  Image as ImageIcon,
} from 'lucide-react'
import { RuntimeError } from '@/lib/effect/errors'
import { cn } from '@/lib/utils'
import type {
  CardType,
  TourismContent,
  BaseContent,
  PhotosContent,
  VideoContent,
  SuggestionsContent,
  SearchLocation,
  DiningContent,
  ItineraryContent,
  MediaSearchContent,
} from '../../lib/effect/schemas/AdaptiveCardsSchema'
import { ADAPTIVE_CARD_TYPES } from '../../lib/effect/constants/AdaptiveCardConstants'
import { actionToNaturalMessage } from '@/lib/actions/actionToNaturalMessage'

/** @Context.AdaptiveCard */
type AdaptiveCardContextValue = {
  type: CardType
  data: any
  onAction?: (action: string) => void
}

const AdaptiveCardContext = createContext<AdaptiveCardContextValue | null>(null)

function useAdaptiveCard() {
  const context = useContext(AdaptiveCardContext)
  if (!context) {
    throw new RuntimeError({
      message: 'AdaptiveCard sub-components must be wrapped in <AdaptiveCard.Root />',
    })
  }
  return context
}

interface AdaptiveCardProps {
  type: CardType
  data: any
  onAction?: (action: string) => void
  className?: string
  children?: React.ReactNode
}

/** @Component.AdaptiveCard.Root */
const Root = ({
  type,
  data,
  onAction,
  children,
  className,
}: AdaptiveCardProps) => {
  return (
    <AdaptiveCardContext.Provider value={{ type, data, onAction }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'bg-[#1a1a1a] rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/[0.08] w-full max-w-2xl',
          type === ADAPTIVE_CARD_TYPES.TOURISM &&
            'grid grid-cols-1 lg:grid-cols-12',
          className,
        )}
      >
        {children}
      </motion.div>
    </AdaptiveCardContext.Provider>
  )
}
Root.displayName = 'AdaptiveCard.Root'

/** @Component.AdaptiveCard.Media */
const Media = () => {
  const { type, data } = useAdaptiveCard()
  const { t } = useI18n()

  const tourismData = data as TourismContent
  const photosData = data as PhotosContent
  const videoData = data as VideoContent

  const mainImage = useMemo(() => {
    return type === ADAPTIVE_CARD_TYPES.TOURISM && tourismData.images?.length
      ? tourismData.images[0]
      : type === ADAPTIVE_CARD_TYPES.PHOTOS && photosData.images?.length
        ? photosData.images[0]
        : undefined
  }, [type, data, tourismData.images, photosData.images])

  const secondaryImages = useMemo(() => {
    if (type === ADAPTIVE_CARD_TYPES.TOURISM && tourismData.images?.length)
      return tourismData.images.slice(1, 4)
    if (type === ADAPTIVE_CARD_TYPES.PHOTOS && photosData.images?.length)
      return photosData.images.slice(1, 4)
    return []
  }, [type, data, tourismData.images, photosData.images])

  if (type === ADAPTIVE_CARD_TYPES.VIDEO) {
    if (!videoData.videoUrl && videoData.media_search_terms) {
      return (
        <div className="aspect-video relative overflow-hidden group rounded-[1.5rem] bg-slate-900 border border-white/10 m-2">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8 text-center">
            <div className="max-w-xs space-y-4">
              <Search className="w-10 h-10 text-primary mx-auto opacity-50 transition-colors" />
              <div className="space-y-1">
                <p className="text-white font-bold">{t('chat.no_video')}</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  {t('chat.google_search_hint')}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {videoData.media_search_terms.map((term: string) => (
                  <button
                    key={term}
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`,
                        '_blank',
                      )
                    }
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] text-white/60 hover:text-white transition-all flex items-center gap-2 group/term"
                  >
                    {term}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/term:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (videoData.videoUrl) {
      const isYoutube =
        videoData.provider === 'youtube' ||
        videoData.videoUrl.includes('youtube.com') ||
        videoData.videoUrl.includes('youtu.be')
      let embedUrl = videoData.videoUrl

      if (isYoutube) {
        const videoId = videoData.videoUrl.match(
          /(?:v=|\/embed\/|\/watch\?v=|\/.be\/)([a-zA-Z0-9_-]{11})/,
        )?.[1]
        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}`
        }
      }

      return (
        <div className="space-y-4">
          <div className="aspect-video relative group overflow-hidden rounded-[1.5rem] border border-white/10 mx-2 mt-2">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={videoData.title}
            />
          </div>
          {videoData.media_search_terms && videoData.media_search_terms.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex items-center gap-2 mb-3 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                <Search className="w-3 h-3" />
                <span>{t('chat.google_search_hint')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {videoData.media_search_terms.map((term: string) => (
                  <button
                    key={term}
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`,
                        '_blank',
                      )
                    }
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] text-white/60 hover:text-white transition-all flex items-center gap-2 group/term shadow-sm"
                  >
                    <Video className="w-3 h-3 text-red-500/50 group-hover:text-red-500 transition-colors" />
                    {term}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/term:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  if (type === ADAPTIVE_CARD_TYPES.PHOTOS) {
    return (
      <div className="p-6 md:p-8 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {photosData.images.map((img: string, i: number) => (
            <div
              key={i}
              className="aspect-square rounded-2xl overflow-hidden group"
            >
              <img
                src={img}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt={`Gallery ${i}`}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (
    type === ADAPTIVE_CARD_TYPES.TOURISM ||
    type === ADAPTIVE_CARD_TYPES.DINING ||
    type === ADAPTIVE_CARD_TYPES.ACTIVITY ||
    type === ADAPTIVE_CARD_TYPES.EVENT ||
    type === ADAPTIVE_CARD_TYPES.MEDIA_SEARCH
  ) {
    const displayData = data as any
    const mediaSearchData = data as MediaSearchContent

    if (type === ADAPTIVE_CARD_TYPES.MEDIA_SEARCH) {
      return (
        <div className="aspect-video relative overflow-hidden group rounded-[1.5rem] bg-slate-900 border border-white/10 m-2">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8 text-center">
            <div className="max-w-xs space-y-4">
              {mediaSearchData.type === 'video' ? (
                <Video className="w-10 h-10 text-primary mx-auto opacity-50 transition-colors" />
              ) : mediaSearchData.type === 'images' ? (
                <ImageIcon className="w-10 h-10 text-primary mx-auto opacity-50 transition-colors" />
              ) : (
                <Search className="w-10 h-10 text-primary mx-auto opacity-50 transition-colors" />
              )}
              <div className="space-y-1">
                <p className="text-white font-bold">{mediaSearchData.title}</p>
                {mediaSearchData.description && (
                  <p className="text-white/40 text-xs leading-relaxed">
                    {mediaSearchData.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {mediaSearchData.media_search_terms.map((term: string) => (
                  <button
                    key={term}
                    onClick={() => {
                      const baseUrl =
                        mediaSearchData.type === 'video'
                          ? 'https://www.youtube.com/results?search_query='
                          : mediaSearchData.type === 'images'
                            ? 'https://www.google.com/search?tbm=isch&q='
                            : 'https://www.google.com/search?q='
                      window.open(
                        `${baseUrl}${encodeURIComponent(term)}`,
                        '_blank',
                      )
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] text-white/60 hover:text-white transition-all flex items-center gap-2 group/term"
                  >
                    {term}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/term:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    const displayImage =
      mainImage || (displayData.images && displayData.images[0])

    return (
      <div className="lg:col-span-12 relative overflow-hidden group">
        <div className="grid grid-cols-12 h-[350px] md:h-[450px] gap-1">
          <div
            className={cn(
              'relative overflow-hidden',
              secondaryImages.length ? 'col-span-8' : 'col-span-12',
            )}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayData.title}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1500331041132-72049e79430c?q=80&w=1000&auto=format&fit=crop'
                }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <Compass className="w-12 h-12 text-white/10 animate-pulse" />
              </div>
            )}
          </div>
          {secondaryImages.length > 0 && (
            <div className="col-span-4 flex flex-col gap-1">
              {secondaryImages.map((img: string, i: number) => (
                <div key={i} className="flex-1 overflow-hidden">
                  <img
                    src={img}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542401886-65d6c60db27b?q=80&w=1000&auto=format&fit=crop'
                    }}
                    className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
                    alt={`Gallery ${i}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* @UI.Chat.AdaptiveCard.SearchFallback */}
        {!displayImage && displayData.media_search_terms && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8 text-center">
            <div className="max-w-xs space-y-4">
              <Search className="w-10 h-10 text-primary mx-auto opacity-50 transition-colors" />
              <div className="space-y-1">
                <p className="text-white font-bold">{t('chat.no_image')}</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  {t('chat.google_search_hint')}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {displayData.media_search_terms.map((term: string) => (
                  <button
                    key={term}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`,
                        '_blank',
                      )
                    }
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-[10px] text-white/60 hover:text-white transition-all flex items-center gap-2 group/term"
                  >
                    {term}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/term:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* @UI.Chat.AdaptiveCard.Overlays */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex gap-2">
          {displayData.rating && (
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-xl border border-white">
              <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
              <span className="font-bold text-sm text-slate-900">
                {displayData.rating}
              </span>
            </div>
          )}
          {displayData.priceRange && (
            <div className="bg-brand-blue/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-xl border border-white/20">
              <span className="font-bold text-sm text-white">
                {displayData.priceRange}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
Media.displayName = 'AdaptiveCard.Media'

/** @UI.Chat.AdaptiveCard.Header */
const Header = () => {
  const { type, data } = useAdaptiveCard()
  const { t } = useI18n()
  const baseData = data as BaseContent
  const tourismData = data as TourismContent
  const photosData = data as PhotosContent
  const videoData = data as VideoContent
  const suggestionsData = data as SuggestionsContent

  const title =
    tourismData.title ||
    photosData.title ||
    videoData.title ||
    suggestionsData.title ||
    (data as MediaSearchContent).title ||
    (data.type === ADAPTIVE_CARD_TYPES.SEARCH_LOCATION
      ? `${t('chat.search_for')} "${data.search}"`
      : null) ||
    baseData.title

  return (
    <div className="space-y-3">
      <h3
        className={cn(
          'font-extrabold tracking-tighter leading-tight drop-shadow-sm',
          type === ADAPTIVE_CARD_TYPES.SUGGESTIONS
            ? 'text-4xl md:text-5xl text-white'
            : 'text-3xl md:text-4xl text-white/90',
        )}
      >
        {title}
      </h3>
    </div>
  )
}
Header.displayName = 'AdaptiveCard.Header'

/** @UI.Chat.AdaptiveCard.Content */
const Content = () => {
  const { type, data, onAction } = useAdaptiveCard()
  const { t } = useI18n()
  const tourismData = data as TourismContent

  return (
    <div className="space-y-6">
      {data.description && (
        <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-2xl font-light italic">
          "{data.description}"
        </p>
      )}

      {/* @UI.Chat.AdaptiveCard.Attractions */}
      {type === ADAPTIVE_CARD_TYPES.TOURISM && tourismData.attractions && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tourismData.attractions.map((tag: string) => (
            <button
              key={tag}
              onClick={() => onAction?.(`Cuéntame más sobre ${tag}`)}
              className="px-3 py-1 bg-white/5 text-[10px] font-bold text-white/40 rounded-full border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* @UI.Chat.AdaptiveCard.Dining */}
      {type === ADAPTIVE_CARD_TYPES.DINING &&
        (data as DiningContent).menuHighlights && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('chat.menu_highlights')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data as DiningContent).menuHighlights?.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => onAction?.(tag)}
                  className="px-3 py-1.5 bg-white/5 text-xs font-bold text-white/40 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* @UI.Chat.AdaptiveCard.Itinerary */}
      {type === ADAPTIVE_CARD_TYPES.ITINERARY &&
        (data as ItineraryContent).steps && (
          <div className="space-y-6 pt-4 border-t border-white/10">
            {(data as ItineraryContent).steps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start group/step">
                <div className="flex flex-col items-center pt-1.5">
                  <button
                    onClick={() => onAction?.(`${step.day}: ${step.title}`)}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                  >
                    {i + 1}
                  </button>
                  {i < (data as ItineraryContent).steps.length - 1 && (
                    <div className="w-px h-12 bg-white/10" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white/90 font-bold text-lg">
                    {step.title}
                    {step.time && (
                      <span className="text-[11px] font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                        {step.time}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* @UI.Chat.AdaptiveCard.Activity */}
      {(type === ADAPTIVE_CARD_TYPES.ACTIVITY ||
        type === ADAPTIVE_CARD_TYPES.EVENT) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          {(data as any).duration && (
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                {t('chat.duration')}
              </div>
              <div className="text-sm text-white/70 font-bold">
                {(data as any).duration}
              </div>
            </div>
          )}
          {(data as any).difficulty && (
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                {t('chat.difficulty')}
              </div>
              <div className="text-sm text-white/70 font-bold capitalize">
                {(data as any).difficulty}
              </div>
            </div>
          )}
          {(data as any).date && (
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
                {t('chat.date')}
              </div>
              <div className="text-sm text-primary font-bold">
                {(data as any).date}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
Content.displayName = 'AdaptiveCard.Content'

/** @UI.Chat.AdaptiveCard.Actions */
const Actions = ({ onAction }: { onAction?: (action: string) => void }) => {
  const { type, data } = useAdaptiveCard()
  const { t } = useI18n()
  const tourismData = data as TourismContent
  const suggestionsData = data as SuggestionsContent

  const handleOpenMap = () => {
    if (type === ADAPTIVE_CARD_TYPES.TOURISM) {
      const url =
        tourismData.mapUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tourismData.title + ' ' + (tourismData.location || 'Puerto Rico'))}`
      window.open(url, '_blank')
    }
  }

  if (type === ADAPTIVE_CARD_TYPES.SUGGESTIONS) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
        {suggestionsData.items.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              const message = actionToNaturalMessage(item.action, item.params)
              onAction?.(message)
            }}
            className={cn(
              'flex items-center justify-between text-left px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70',
              'hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] transition-all duration-300 group shadow-sm active:scale-95',
            )}
          >
            <span className="text-base font-medium text-white/70 group-hover:text-white transition-colors">
              {item.label}
            </span>
            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    )
  }

  if (type === ADAPTIVE_CARD_TYPES.SEARCH_LOCATION) {
    const searchData = data as SearchLocation
    return (
      <div className="pt-4">
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchData.search)}`,
              '_blank',
            )
          }
          className="w-full lg:w-auto px-10 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all border border-white/[0.08] hover:border-white/20 shadow-2xl active:scale-95 group backdrop-blur-md"
        >
          <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-50 group-hover:opacity-100" />
          <span className="opacity-80 group-hover:opacity-100 italic font-medium tracking-tight">
            {t('chat.open_maps')}
          </span>
        </button>
      </div>
    )
  }

  if (type === ADAPTIVE_CARD_TYPES.DINING) {
    const diningData = data as DiningContent
    return (
      <div className="pt-6">
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(diningData.title + ' ' + (diningData.location || 'Puerto Rico'))}`,
              '_blank',
            )
          }
          className="w-full lg:w-auto px-8 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all border border-white/[0.08] hover:border-white/20 shadow-xl active:scale-95 group backdrop-blur-md"
        >
          <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-50 group-hover:opacity-100" />
          <span className="opacity-80 group-hover:opacity-100 italic font-medium tracking-tight">
            {t('chat.view_menu')}
          </span>
        </button>
      </div>
    )
  }

  if (type === ADAPTIVE_CARD_TYPES.MEDIA_SEARCH) {
    const mediaSearchData = data as MediaSearchContent
    return (
      <div className="pt-4 px-8 pb-8 md:px-10 md:pb-10">
        <button
          onClick={() =>
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(mediaSearchData.title + ' ' + (mediaSearchData.media_search_terms?.[0] || 'Puerto Rico'))}`,
              '_blank',
            )
          }
          className="w-full lg:w-auto px-10 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all border border-white/[0.08] hover:border-white/20 shadow-2xl active:scale-95 group backdrop-blur-md"
        >
          <Search className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-50 group-hover:opacity-100" />
          <span className="opacity-80 group-hover:opacity-100 italic font-medium tracking-tight">
            {t('chat.view_more_results')}
          </span>
        </button>
      </div>
    )
  }

  if (type === ADAPTIVE_CARD_TYPES.TOURISM) {
    return (
      <div className="pt-6">
        <button
          onClick={handleOpenMap}
          className="w-full lg:w-auto px-8 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all border border-white/[0.08] hover:border-white/20 shadow-xl active:scale-95 group backdrop-blur-md"
        >
          <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-50 group-hover:opacity-100" />
          <span className="opacity-80 group-hover:opacity-100 italic font-medium tracking-tight">
            {t('chat.how_to_get_there')}
          </span>
        </button>
      </div>
    )
  }

  return null
}
Actions.displayName = 'AdaptiveCard.Actions'

/** @Component.AdaptiveCard */
const AdaptiveCardBase = ({
  type,
  data,
  onAction,
  className,
  children,
}: AdaptiveCardProps) => {
  if (children) {
    return (
      <Root type={type} data={data} className={className}>
        {children}
      </Root>
    )
  }

  return (
    <Root type={type} data={data} className={className}>
      <Media />
      <div
        className={cn(
          'p-8 md:p-10 space-y-6',
          (type === ADAPTIVE_CARD_TYPES.TOURISM ||
            type === ADAPTIVE_CARD_TYPES.NEWS) &&
            'lg:col-span-12',
        )}
      >
        <Header />
        <Content />
        <Actions onAction={onAction} />
      </div>
    </Root>
  )
}

export const AdaptiveCard = Object.assign(AdaptiveCardBase, {
  Root,
  Media,
  Header,
  Content,
  Actions,
})

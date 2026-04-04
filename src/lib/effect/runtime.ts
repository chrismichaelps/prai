import { Layer, ManagedRuntime, ConfigProvider, Effect } from "effect";
import { BrowserHttpClient } from "@effect/platform-browser";
import { ConfigService } from "./services/Config";
import { OpenRouterLayer } from "./services/OpenRouter";
import { Redux } from "./services/Redux";
import { PromptBuilderService } from "./services/PromptBuilder";
import { VoiceServiceLive } from "./services/Voice";
import { I18nLive } from "./i18n";
import { BuildInfoService } from "./services/BuildInfo";
import { SeoService } from "./services/Seo";
import { ChatApiLayer } from "./services/ChatApi"
import { MemoryApiLayer } from "./services/MemoryApi";
import { TokenEstimationService } from "./services/token";
import { CostTrackerService } from "./services/token";
import { CompactionService } from "./services/compaction";
import { CoordinatorService } from "./services/coordinator";
import { ProactiveService } from "./services/proactive";
import { SessionMemoryService } from "./services/memory";
import { SkillsService } from "./services/skills"
import { QueryExpansionService } from "./services/query";
import { ToolRelevanceService } from "./services/relevance";
import { SearchFilterService } from "./services/filters";
import { FollowUpSuggestionsService } from "./services/followup"
import { CommandService } from "./services/CommandService";

/** @Logic.Effect.Runtime */
const BaseLayer = Layer.mergeAll(
  PromptBuilderService.Default,
  Redux.Default,
  BrowserHttpClient.layerXMLHttpRequest
);

/** @Logic.Effect.ConfigLayer */
export const ConfigLayer = ConfigService.Default.pipe(
  Layer.provide(PromptBuilderService.Default)
);

/** @Logic.Effect.NextJsConfigProvider */
export const nextJsConfigProvider = ConfigProvider.fromMap(
  new Map([
    ["NEXT_PUBLIC_OPENROUTER_BASE_URL", process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || ""],
    ["NEXT_PUBLIC_MODEL_NAME", process.env.NEXT_PUBLIC_MODEL_NAME || ""],
    ["NEXT_PUBLIC_OPENROUTER_API_KEY", process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ""],
    ["NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL || ""]
  ])
);

/** @Logic.Effect.TelemetryLayer */
const TelemetryLayer = Layer.empty

/** @Logic.Effect.ContextLayer */
const ContextLayer = Layer.mergeAll(
  TokenEstimationService.Default,
  CostTrackerService.Default,
  CompactionService.Default.pipe(
    Layer.provide(TokenEstimationService.Default)
  ),
  CoordinatorService.Default,
  ProactiveService.Default,
  SessionMemoryService.Default,
  SkillsService.Default,
  QueryExpansionService.Default.pipe(
    Layer.provide(SessionMemoryService.Default)
  ),
  ToolRelevanceService.Default,
  SearchFilterService.Default,
  FollowUpSuggestionsService.Default,
  CommandService.Default
)

/** @Logic.Effect.MainLayer.Init */
const MainLayer = Layer.mergeAll(
  BaseLayer,
  ConfigLayer,
  TelemetryLayer,
  ContextLayer,
  VoiceServiceLive,
  I18nLive,
  BuildInfoService.Default,
  ChatApiLayer,
  MemoryApiLayer,
  SeoService.Default.pipe(
    Layer.provideMerge(ConfigLayer)
  ),
  OpenRouterLayer.pipe(
    Layer.provideMerge(ConfigLayer),
    Layer.provideMerge(BaseLayer)
  )
).pipe(
  Layer.provide(Layer.setConfigProvider(nextJsConfigProvider))
);


/** @Logic.Effect.Runtime.Types */
/** @Type.Database.Json */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppEnvironment = Layer.Layer.Success<typeof MainLayer>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runtime = ManagedRuntime.make(MainLayer as any);

/** @Logic.Effect.Trace */
export function withTrace<T>(name: string, effect: Effect.Effect<T>) {
  return effect.pipe(Effect.withSpan(name))
}

/** @Logic.Effect.Annotate */
export function annotate(attributes: Record<string, string>) {
  return Effect.annotateCurrentSpan(attributes)
}
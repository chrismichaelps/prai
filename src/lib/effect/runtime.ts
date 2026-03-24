import { Layer, ManagedRuntime, ConfigProvider } from "effect";
import { BrowserHttpClient } from "@effect/platform-browser";
import { ConfigService } from "./services/Config";
import { OpenRouter } from "./services/OpenRouter";
import { Redux } from "./services/Redux";
import { PromptBuilderService } from "./services/PromptBuilder";
import { VoiceServiceLive } from "./services/Voice";
import { I18nLive } from "./i18n";
import { BuildInfoService } from "./services/BuildInfo";
import { SeoService } from "./services/Seo";
import { ChatApiLayer } from "./services/ChatApi";

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

/** @Logic.Effect.MainLayer.Init */
const MainLayer = Layer.mergeAll(
  BaseLayer,
  ConfigLayer,
  VoiceServiceLive,
  I18nLive,
  BuildInfoService.Default,
  ChatApiLayer,
  SeoService.Default.pipe(
    Layer.provideMerge(ConfigLayer)
  ),
  OpenRouter.Default.pipe(
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

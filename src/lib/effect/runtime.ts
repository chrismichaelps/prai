import { Layer, ManagedRuntime, ConfigProvider } from "effect";
import { BrowserHttpClient } from "@effect/platform-browser";
import { ConfigService } from "./services/Config";
import { OpenRouter } from "./services/OpenRouter";
import { Redux } from "./services/Redux";
import { PromptBuilderService } from "./services/PromptBuilder";
import { VoiceServiceLive } from "./services/Voice";
import { I18nLive } from "./i18n";
import { BuildInfoService } from "./services/BuildInfo";

/** @Logic.Effect.Runtime */
const BaseLayer = Layer.mergeAll(
  PromptBuilderService.Default,
  Redux.Default,
  BrowserHttpClient.layerXMLHttpRequest
);

const ConfigLayer = ConfigService.Default.pipe(
  Layer.provide(PromptBuilderService.Default)
);

const nextJsConfigProvider = ConfigProvider.fromMap(
  new Map([
    ["NEXT_PUBLIC_OPENROUTER_BASE_URL", process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || ""],
    ["NEXT_PUBLIC_MODEL_NAME", process.env.NEXT_PUBLIC_MODEL_NAME || ""],
    ["NEXT_PUBLIC_OPENROUTER_API_KEY", process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ""],
    ["NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL || "https://prai.vercel.app"]
  ])
);

const MainLayer = Layer.mergeAll(
  BaseLayer,
  ConfigLayer,
  VoiceServiceLive,
  I18nLive,
  BuildInfoService.Default,
  OpenRouter.Default.pipe(
    Layer.provideMerge(ConfigLayer),
    Layer.provideMerge(BaseLayer)
  )
).pipe(
  Layer.provide(Layer.setConfigProvider(nextJsConfigProvider))
);


/** @Logic.Effect.Runtime.Types */
export type AppEnvironment = Layer.Layer.Success<typeof MainLayer>;
export type AppRuntime = ManagedRuntime.ManagedRuntime<AppEnvironment, never>;

export const runtime: AppRuntime = ManagedRuntime.make(MainLayer) as AppRuntime;


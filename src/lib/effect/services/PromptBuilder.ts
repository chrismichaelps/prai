import { Effect } from "effect";
import { 
  role, 
  guardrails, 
  rules, 
  family_safety, 
  search_config,
  thought_process, 
  accuracy_and_media, 
  action_handling, 
  output_format,
  output_efficiency,
  cyber_risk,
  buildPersonalizationPrompt 
} from "./prompts";
import type { Personalization } from "../schemas/PersonalizationSchema";

/** @Service.Effect.PromptBuilder */
export class PromptBuilderService extends Effect.Service<PromptBuilderService>()("PromptBuilder", {
  effect: Effect.gen(function* () {
    const compose = (t: (key: string, params?: Record<string, string>) => string, extraCapabilities?: string, personalization?: Personalization) => {
      const personalizationPrompt = personalization 
        ? buildPersonalizationPrompt(personalization, { t })
        : "";

      return [
        role,
        guardrails,
        rules,
        family_safety,
        search_config,
        thought_process,
        accuracy_and_media,
        action_handling,
        output_format,
        output_efficiency,
        cyber_risk,
        personalizationPrompt,
        extraCapabilities ?? ""
      ].join("\n\n").trim();
    };

    return { compose } as const;
  })
}) {}
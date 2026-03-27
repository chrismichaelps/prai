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
  output_format 
} from "./prompts";

/** @Service.Effect.PromptBuilder */
export class PromptBuilderService extends Effect.Service<PromptBuilderService>()("PromptBuilder", {
  effect: Effect.gen(function* () {
    const compose = (extraCapabilities?: string) => {
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
        extraCapabilities ?? ""
      ].join("\n\n").trim();
    };

    return { compose } as const;
  })
}) {}
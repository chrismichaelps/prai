import { Effect } from "effect";
import * as prompts from "./prompts";

/** @Service.Effect.PromptBuilder */
export class PromptBuilderService extends Effect.Service<PromptBuilderService>()("PromptBuilder", {
  effect: Effect.gen(function* () {
    const compose = (extraCapabilities?: string) => {
      return [
        prompts.role,
        prompts.family_safety,
        prompts.rules,
        prompts.guardrails,
        prompts.thought_process,
        prompts.accuracy_and_media,
        prompts.action_handling,
        prompts.output_format,
        extraCapabilities ?? ""
      ].join("\n\n").trim();
    };

    return { compose } as const;
  })
}) { }
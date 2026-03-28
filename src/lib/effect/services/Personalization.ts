import { Effect, Ref } from "effect";
import { createClient } from "@/lib/supabase/server";
import { PersonalizationSchema, DEFAULT_PERSONALIZATION, type Personalization } from "../schemas/PersonalizationSchema";

/** @Service.Effect.Personalization */
export class PersonalizationService extends Effect.Service<PersonalizationService>()("Personalization", {
  effect: Effect.gen(function* () {
    const currentPersonalization = yield* Ref.make(DEFAULT_PERSONALIZATION);

    const loadPersonalization = (userId: string): Effect.Effect<Personalization, Error> =>
      Effect.gen(function* () {
        const supabase = yield* Effect.promise(() => createClient());
        const { data, error } = yield* Effect.promise(() =>
          supabase.from("profiles").select("preferences").eq("id", userId).single()
        );

        if (error || !data?.preferences) {
          return DEFAULT_PERSONALIZATION;
        }

        const prefs = data.preferences as Partial<Personalization>;
        const result = PersonalizationSchema.make({
          baseStyle: prefs?.baseStyle ?? "default",
          warm: prefs?.warm ?? "default",
          enthusiastic: prefs?.enthusiastic ?? "default",
          headersAndLists: prefs?.headersAndLists ?? "default",
          emoji: prefs?.emoji ?? "default",
          customInstructions: prefs?.customInstructions ?? "",
          nickname: prefs?.nickname ?? "",
        });

        yield* Ref.set(currentPersonalization, result);
        return result;
      }).pipe(
        Effect.catchAll(() => Effect.succeed(DEFAULT_PERSONALIZATION))
      );

    const savePersonalization = (userId: string, prefs: Personalization): Effect.Effect<void, Error> =>
      Effect.gen(function* () {
        const supabase = yield* Effect.promise(() => createClient());
        
        const existing = yield* Effect.promise(() =>
          supabase.from("profiles").select("preferences").eq("id", userId).single()
        );

        const currentPrefs = (existing.data?.preferences as Record<string, unknown>) || {};
        const updatedPrefs = { ...currentPrefs, ...prefs };

        yield* Effect.promise(() =>
          supabase.from("profiles").update({ preferences: updatedPrefs }).eq("id", userId)
        );

        yield* Ref.set(currentPersonalization, prefs);
      }).pipe(
        Effect.catchAll((err) => Effect.sync(() => { 
          console.error("Failed to save personalization:", err) 
        }))
      );

    const getPersonalization = (): Effect.Effect<Personalization> =>
      Ref.get(currentPersonalization);

    return {
      loadPersonalization,
      savePersonalization,
      getPersonalization,
    } as const;
  }),
  accessors: true
}) {}

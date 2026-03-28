import { type Personalization } from "../../schemas/PersonalizationSchema";

/** @Logic.Effect.Prompts.Personalization */
export const buildPersonalizationPrompt = (prefs: Personalization, i18n: { t: (key: string, params?: Record<string, string>) => string }): string => {
  const parts: string[] = [];

  if (prefs.nickname) {
    parts.push(i18n.t("personalization.prompt.nickname", { nickname: prefs.nickname }));
  }

  if (prefs.aboutMe) {
    parts.push(i18n.t("personalization.prompt.about_me", { aboutMe: prefs.aboutMe }));
  }

  if (prefs.baseStyle !== "default") {
    const toneKey = `personalization.prompt.tone.${prefs.baseStyle}`;
    const personaHeader = i18n.t("personalization.prompt.persona_header");
    parts.push(`${personaHeader}: ${i18n.t(toneKey)}`);
  }

  const charParts: string[] = [];
  
  if (prefs.warm !== "default") {
    const levelKey = `personalization.prompt.level.${prefs.warm}`;
    charParts.push(`${i18n.t(levelKey)} ${i18n.t("personalization.prompt.term.warm")}.`);
  }
  
  if (prefs.enthusiastic !== "default") {
    const levelKey = `personalization.prompt.level.${prefs.enthusiastic}`;
    charParts.push(`${i18n.t(levelKey)} ${i18n.t("personalization.prompt.term.enthusiastic")}.`);
  }
  
  if (prefs.headersAndLists !== "default") {
    const levelKey = `personalization.prompt.level.${prefs.headersAndLists}`;
    charParts.push(`${i18n.t(levelKey)} ${i18n.t("personalization.prompt.term.headers")}.`);
  }
  
  if (prefs.emoji !== "default") {
    const levelKey = `personalization.prompt.level.${prefs.emoji}`;
    charParts.push(`${i18n.t(levelKey)} ${i18n.t("personalization.prompt.term.emoji")}.`);
  }

  if (charParts.length > 0) {
    const modifiersHeader = i18n.t("personalization.prompt.modifiers_header");
    parts.push(`${modifiersHeader}:\n- ${charParts.join("\n- ")}`);
  }

  if (prefs.customInstructions) {
    const customHeader = i18n.t("personalization.prompt.custom_header");
    parts.push(`${customHeader}:\n${prefs.customInstructions}`);
  }

  if (parts.length === 0) return "";

  const sectionHeader = i18n.t("personalization.prompt.section_header");
  const instructions = i18n.t("personalization.prompt.instructions");

  return `
${sectionHeader}
${instructions}
${parts.join("\n\n")}
`.trim();
};

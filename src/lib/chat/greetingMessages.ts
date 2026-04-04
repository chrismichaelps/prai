/** @Constant.Chat.Greetings */
export const GREETING_MESSAGES = [
  "¿Qué quieres descubrir hoy?",
  "¿En qué te puedo ayudar?",
  "¿A dónde quieres ir?",
  "Estoy aquí para guiarte.",
  "¿Listo para explorar la isla?",
  "Cuéntame, ¿qué buscas?",
] as const

/** @Logic.Chat.GetRandomGreeting */
export function getRandomGreeting(): string {
  return GREETING_MESSAGES[
    Math.floor(Math.random() * GREETING_MESSAGES.length)
  ] as string
}

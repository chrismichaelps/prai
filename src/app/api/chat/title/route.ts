/** @Route.Chat.Title */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { ApiConstants, LimitConstants } from "@/lib/constants/app-constants"

const TITLE_SYSTEM_PROMPT = `Eres un generador de títulos para chats.
Dado un mensaje del usuario y el inicio de la respuesta del asistente IA, genera un título corto y descriptivo (3 a 6 palabras) quecapture el tema de la conversación.
Reglas:
- Empareja el idioma del mensaje del usuario (español o inglés)
- Sin comillas, sin puntuación al final, sin palabras de relleno como "Chat sobre"
- Responde SOLO con el título, nada más`

/** @Route.Chat.Title.POST */
export async function POST(request: NextRequest) {
  try {
    const { userMessage, assistantMessage } = await request.json() as {
      userMessage?: string
      assistantMessage?: string
    }

    if (!userMessage?.trim()) {
      return NextResponse.json({ title: "New Chat" })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.NEXT_PUBLIC_MODEL_NAME

    if (!apiKey || !model) {
      return NextResponse.json({ title: fallbackTitle(userMessage) })
    }

    const userContent = assistantMessage?.trim()
      ? `User: ${userMessage.slice(0, 300)}\n\nAssistant: ${assistantMessage.slice(0, 200)}`
      : `User: ${userMessage.slice(0, 300)}`

    const response = await fetch(ApiConstants.OPENROUTER_CHAT_COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: TITLE_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 20,
        temperature: 0.4,
        stream: false,
      }),
      signal: AbortSignal.timeout(8_000),
    })

    if (!response.ok) {
      return NextResponse.json({ title: fallbackTitle(userMessage) })
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
    const title = sanitizeTitle(raw) || fallbackTitle(userMessage)

    return NextResponse.json({ title })
  } catch {
    return NextResponse.json({ title: "New Chat" })
  }
}

/** @Logic.Chat.Title.Fallback */
const fallbackTitle = (message: string): string => {
  const words = message.trim().split(/\s+/).slice(0, 5).join(" ")
  return words.slice(0, LimitConstants.CHAT_TITLE_MAX_LENGTH) || "New Chat"
}

/** @Logic.Chat.Title.Sanitize */
const sanitizeTitle = (raw: string): string =>
  raw
    .replace(/^["'"""'']+|["'"""'']+$/g, "")
    .replace(/[.!?]+$/, "")
    .trim()
    .slice(0, LimitConstants.CHAT_TITLE_MAX_LENGTH)

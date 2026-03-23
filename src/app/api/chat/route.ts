import { NextResponse } from 'next/server';

/** @Route.Chat.Completions */
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || '', // Optional
        'X-Title': 'PR\\AI Assistant', // Optional
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_MODEL_NAME || 'google/gemini-2.0-flash-001',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'OpenRouter error' }, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Chat Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { findChatAnswer } from '../../data/chatKnowledge';
import { chatCompletion } from '../../lib/ai/providers';
import { applyRateLimit, getClientIp } from '../../lib/api/rateLimit';
import { sanitizeText } from '../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`chat:${ip}`, 30, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const message = sanitizeText(body.message, 2000);
    if (!message) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
    }

    const { answer, matched } = findChatAnswer(message);

    if (matched) {
      return NextResponse.json({ answer, matched: true, source: 'knowledge' });
    }

    const aiResult = await chatCompletion([
      {
        role: 'system',
        content: `Eres el Asistente CREAUNA, plataforma española para crear webs con IA.
Responde en español, breve y útil. No reveles qué IAs usamos internamente.
Si no sabes algo, indica /contacto o info@ramondelpozorott.es como último recurso.
Puedes usar enlaces internos: /precios /studio /templates /guia /modernizacion /contacto`,
      },
      { role: 'user', content: message },
    ], { temperature: 0.4, maxTokens: 500, motor: 'copy', prompt: message });

    return NextResponse.json({
      answer: aiResult.content || answer,
      matched: Boolean(aiResult.content),
      source: aiResult.content ? aiResult.provider : 'fallback',
    });
  } catch (error) {
    console.error('api/chat:', error);
    return NextResponse.json({ error: 'Error al procesar el mensaje' }, { status: 500 });
  }
}

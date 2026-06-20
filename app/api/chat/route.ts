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
    const lang = body.lang === 'en' ? 'en' : 'es';
    if (!message) {
      return NextResponse.json({ error: lang === 'en' ? 'Empty message' : 'Mensaje vacío' }, { status: 400 });
    }

    const { answer, matched } = findChatAnswer(message, lang);

    if (matched) {
      return NextResponse.json({ answer, matched: true, source: 'knowledge' });
    }

    const systemPrompt = lang === 'en'
      ? `You are the CREAUNA Assistant, a Spanish platform for building websites with AI.
Reply in English, briefly and helpfully. Do not reveal which AIs we use internally.
If unsure, suggest /contacto or info@ramondelpozorott.es as last resort.
You may use internal links: /precios /studio /templates /guia /modernizacion /contacto`
      : `Eres el Asistente CREAUNA, plataforma española para crear webs con IA.
Responde en español, breve y útil. No reveles qué IAs usamos internamente.
Si no sabes algo, indica /contacto o info@ramondelpozorott.es como último recurso.
Puedes usar enlaces internos: /precios /studio /templates /guia /modernizacion /contacto`;

    const aiResult = await chatCompletion([
      { role: 'system', content: systemPrompt },
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

import { NextResponse } from 'next/server';
import { sendContactEmail } from '../../lib/email/send';
import { applyRateLimit, getClientIp } from '../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../lib/api/validate';

const messages = {
  es: {
    invalidEmail: 'Correo electrónico no válido',
    success: 'Solicitud recibida correctamente',
    error: 'No se pudo enviar la solicitud',
  },
  en: {
    invalidEmail: 'Invalid email address',
    success: 'Request received successfully',
    error: 'Could not send request',
  },
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`contact:${ip}`, 5, 60_000);
  if (limited) return limited;

  let lang: 'es' | 'en' = 'es';

  try {
    const body = await req.json();
    lang = body.lang === 'en' ? 'en' : 'es';
    const m = messages[lang];

    const payload = {
      name: sanitizeText(body.name, 120),
      email: sanitizeText(body.email, 200),
      phone: sanitizeText(body.phone, 40),
      type: sanitizeText(body.type, 80),
      message: sanitizeText(body.message, 4000),
    };

    const missing = requireFields(payload, ['name', 'email', 'type', 'message']);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: m.invalidEmail }, { status: 400 });
    }

    const result = await sendContactEmail(payload);

    return NextResponse.json({
      ok: true,
      message: m.success,
      delivery: result.mode,
    });
  } catch (error) {
    console.error('api/contact:', error);
    const message = error instanceof Error ? error.message : messages[lang].error;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

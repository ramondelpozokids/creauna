import { NextResponse } from 'next/server';
import { sendContactEmail } from '../../lib/email/send';
import { applyRateLimit, getClientIp } from '../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = applyRateLimit(`contact:${ip}`, 5, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
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
      return NextResponse.json({ error: 'Correo electrónico no válido' }, { status: 400 });
    }

    const result = await sendContactEmail(payload);

    return NextResponse.json({
      ok: true,
      message: 'Solicitud recibida correctamente',
      delivery: result.mode,
    });
  } catch (error) {
    console.error('api/contact:', error);
    return NextResponse.json({ error: 'No se pudo enviar la solicitud' }, { status: 500 });
  }
}

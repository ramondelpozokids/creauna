import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, rateLimitResponse } from '../../../lib/api/rateLimit';
import { isValidEmail, requireFields, sanitizeText } from '../../../lib/api/validate';

const VALID_DELIVERY = new Set(['zip', 'link', 'code', 'email']);

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`studio-delivery:${ip}`, 10, 60_000);
  if (!rate.ok) return rateLimitResponse(rate.retryAfterSec);

  try {
    const body = await req.json();
    const projectName = sanitizeText(body.projectName, 120);
    const deliveryMethod = sanitizeText(body.deliveryMethod, 20);
    const email = sanitizeText(body.email, 200);

    const missing = requireFields({ projectName, deliveryMethod }, ['projectName', 'deliveryMethod']);
    if (missing) return NextResponse.json({ error: missing }, { status: 400 });
    if (!VALID_DELIVERY.has(deliveryMethod)) {
      return NextResponse.json({ error: 'Método de entrega no válido' }, { status: 400 });
    }
    if (deliveryMethod === 'email' && (!email || !isValidEmail(email))) {
      return NextResponse.json({ error: 'Email válido requerido para entrega por correo' }, { status: 400 });
    }

    const deliveryId = `del_${Date.now()}`;
    console.info('[CREAUNA delivery]', { deliveryId, projectName, deliveryMethod, email: email || null });

    return NextResponse.json({
      ok: true,
      deliveryId,
      status: 'queued',
      message: 'Entrega programada correctamente',
      estimatedDelivery: deliveryMethod === 'link' ? '7 días de enlace activo' : '24-48 horas',
    });
  } catch (error) {
    console.error('api/studio/delivery:', error);
    return NextResponse.json({ error: 'Error al programar la entrega' }, { status: 500 });
  }
}

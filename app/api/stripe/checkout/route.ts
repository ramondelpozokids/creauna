import { NextResponse } from 'next/server';
import { getStripe } from '../../lib/stripe/client';
import { getPlan, isStripeConfigured } from '../../lib/stripe/config';
import { checkRateLimit, getClientIp, rateLimitResponse } from '../../lib/api/rateLimit';
import { sanitizeText } from '../../lib/api/validate';

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`stripe-checkout:${ip}`, 10, 60_000);
  if (!rate.ok) return rateLimitResponse(rate.retryAfterSec);

  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: 'Pagos con Stripe próximamente. La integración está preparada; activa tu cuenta empresarial.',
          enabled: false,
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const planId = sanitizeText(body.planId, 40) || 'pro';
    const projectName = sanitizeText(body.projectName, 120) || 'Proyecto CREAUNA';
    const plan = getPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://creauna.vercel.app';
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: plan.priceEur * 100,
            recurring: { interval: 'month' },
            product_data: {
              name: `CREAUNA ${plan.labelEs}`,
              description: `${plan.credits} créditos/mes · Proyecto: ${projectName}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/studio?checkout=success`,
      cancel_url: `${baseUrl}/studio?checkout=cancel`,
      metadata: {
        planId: plan.id,
        projectName,
        credits: String(plan.credits),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'No se pudo crear la sesión de pago' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id, enabled: true });
  } catch (error) {
    console.error('api/stripe/checkout:', error);
    return NextResponse.json({ error: 'Error al iniciar el pago' }, { status: 500 });
  }
}

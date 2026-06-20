import { NextResponse } from 'next/server';
import { getStripe } from '../../../lib/stripe/client';
import { isStripeConfigured } from '../../../lib/stripe/config';

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe no configurado' }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret no configurado' }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Firma ausente' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.info('[CREAUNA stripe] Pago completado', {
        sessionId: session.id,
        metadata: session.metadata,
        customerEmail: session.customer_details?.email,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('api/stripe/webhook:', error);
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 });
  }
}

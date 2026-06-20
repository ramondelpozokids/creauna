import { NextResponse } from 'next/server';
import { CREAUNA_PLANS, getStripePublishableKey, isStripeConfigured } from '../../lib/stripe/config';

export async function GET() {
  return NextResponse.json({
    enabled: isStripeConfigured(),
    publishableKey: getStripePublishableKey() ?? null,
    plans: CREAUNA_PLANS,
    note: isStripeConfigured()
      ? null
      : 'Stripe preparado. Los cobros se activarán cuando la cuenta empresarial esté lista.',
  });
}

import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error('STRIPE_SECRET_KEY no configurada');
  if (!stripeClient) {
    stripeClient = new Stripe(key, { apiVersion: '2026-05-27.dahlia' });
  }
  return stripeClient;
}

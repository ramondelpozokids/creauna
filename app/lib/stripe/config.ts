export type PlanId = 'pro' | 'business';

export type CreaunaPlan = {
  id: PlanId;
  labelEs: string;
  labelEn: string;
  priceEur: number;
  credits: number;
};

export const CREAUNA_PLANS: CreaunaPlan[] = [
  {
    id: 'pro',
    labelEs: 'Plan Pro — 19€/mes',
    labelEn: 'Pro Plan — €19/mo',
    priceEur: 19,
    credits: 120,
  },
  {
    id: 'business',
    labelEs: 'Plan Business — 49€/mes',
    labelEn: 'Business Plan — €49/mo',
    priceEur: 49,
    credits: 300,
  },
];

export function getPlan(id: string): CreaunaPlan | undefined {
  return CREAUNA_PLANS.find((p) => p.id === id);
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripePublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || undefined;
}

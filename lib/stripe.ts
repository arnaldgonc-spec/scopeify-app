import Stripe from 'stripe';

// Lazily instantiated so the app builds/boots before Stripe keys are provided.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export const PLANS = {
  starter: {
    id: 'starter' as const,
    name: 'Starter',
    price: 49,
    proposalLimit: 10,
    priceEnv: 'STRIPE_PRICE_STARTER',
    features: ['10 proposals / month', 'AI scope + estimates', 'Photo analysis', 'Preset report templates'],
  },
  pro: {
    id: 'pro' as const,
    name: 'Pro',
    price: 99,
    proposalLimit: null,
    priceEnv: 'STRIPE_PRICE_PRO',
    features: ['Unlimited proposals', 'Everything in Starter', 'Custom report templates', 'Priority support'],
  },
};

export type PlanId = keyof typeof PLANS;

export function priceIdForPlan(plan: PlanId): string {
  const env = PLANS[plan].priceEnv;
  const value = process.env[env];
  if (!value) throw new Error(`${env} is not set`);
  return value;
}

export function planForPriceId(priceId: string | undefined): PlanId {
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  return 'starter';
}

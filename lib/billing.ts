import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PlanId } from './stripe';

export interface Subscription {
  id: string;
  company_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanId;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  trial_ends_at: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// Service-role client for billing writes (webhook, trial provisioning).
export function serviceClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getSubscriptionForCompany(
  supabase: SupabaseClient,
  companyId: string
): Promise<Subscription | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle();
  return (data as Subscription | null) ?? null;
}

// Days remaining in a trial, or null if not trialing. 0 means the trial lapsed.
export function trialDaysLeft(sub: Pick<Subscription, 'status' | 'trial_ends_at'> | null): number | null {
  if (!sub || sub.status !== 'trialing' || !sub.trial_ends_at) return null;
  const ms = new Date(sub.trial_ends_at).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (24 * 60 * 60 * 1000)) : 0;
}

// Whether a subscription grants access to gated features (proposal generation).
export function hasActiveAccess(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.status === 'active') return true;
  if (sub.status === 'trialing') {
    if (!sub.trial_ends_at) return true;
    return new Date(sub.trial_ends_at).getTime() > Date.now();
  }
  return false;
}

// Ensures a trialing subscription row exists for a company (used at onboarding,
// so trials work before Stripe is connected). Idempotent via unique company_id.
export async function ensureTrialSubscription(companyId: string): Promise<void> {
  const supabase = serviceClient();
  const existing = await getSubscriptionForCompany(supabase, companyId);
  if (existing) return;
  const trialEnds = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from('subscriptions').insert({
    company_id: companyId,
    plan: 'starter',
    status: 'trialing',
    trial_ends_at: trialEnds,
  });
}

// Server-side gate. Returns null if access is granted, or a reason string if not.
export async function checkAccessForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<{ ok: boolean; companyId: string | null; reason?: string }> {
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', userId)
    .single();
  if (!company) return { ok: false, companyId: null, reason: 'no_company' };
  const sub = await getSubscriptionForCompany(supabase, (company as { id: string }).id);
  if (!hasActiveAccess(sub)) return { ok: false, companyId: (company as { id: string }).id, reason: 'no_subscription' };
  return { ok: true, companyId: (company as { id: string }).id };
}

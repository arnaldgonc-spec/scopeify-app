export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient, getSubscriptionForCompany } from '@/lib/billing';
import { stripeConfigured } from '@/lib/stripe';
import BillingClient from '@/components/BillingClient';
import type { Company } from '@/lib/types';

export default async function BillingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (!company) redirect('/onboarding');

  const sub = await getSubscriptionForCompany(serviceClient(), company.id);

  return (
    <BillingClient
      company={company as Company}
      subscription={sub}
      stripeReady={stripeConfigured()}
    />
  );
}

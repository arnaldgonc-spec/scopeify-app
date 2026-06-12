export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient, getSubscriptionForCompany, hasActiveAccess } from '@/lib/billing';
import NewProposalClient from './NewProposalClient';
import type { Company } from '@/lib/types';

export default async function NewProposalPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (!company) redirect('/onboarding');

  // Gate on an active trial/subscription, consistent with the build page.
  const sub = await getSubscriptionForCompany(serviceClient(), company.id);
  if (!hasActiveAccess(sub)) redirect('/billing?status=required');

  return <NewProposalClient company={company as Company} />;
}

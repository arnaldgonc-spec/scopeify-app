export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProposalForm from '@/components/ProposalForm';
import type { ProposalPath, Company, Proposal } from '@/lib/types';

interface Props {
  searchParams: Promise<{ path?: string; id?: string }>;
}

export default async function BuildPage({ searchParams }: Props) {
  const params = await searchParams;

  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!company) redirect('/onboarding');

  // Edit mode: load existing proposal
  let existingProposal: Proposal | null = null;
  let path: ProposalPath = (params.path as ProposalPath) || 'proposal';

  if (params.id) {
    const { data } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', params.id)
      .eq('company_id', company.id)
      .single();
    if (data) {
      existingProposal = data as Proposal;
      path = existingProposal.path;
    }
  }

  if (!['proposal', 'estimate', 'assessment'].includes(path)) redirect('/proposals/new');

  return <ProposalForm path={path} company={company as Company} existingProposal={existingProposal} />;
}

export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient, getSubscriptionForCompany, trialDaysLeft } from '@/lib/billing';
import Sidebar from '@/components/Sidebar';
import StatsRow from '@/components/Dashboard/StatsRow';
import ProposalCard from '@/components/Dashboard/ProposalCard';
import EmptyState from '@/components/Dashboard/EmptyState';
import type { Proposal, Company } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!company) redirect('/onboarding');

  const { data: proposals } = await supabase
    .from('proposals')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  const proposalList = (proposals || []) as Proposal[];

  const sub = await getSubscriptionForCompany(serviceClient(), company.id);
  const daysLeft = trialDaysLeft(sub);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company as Company} />
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5, flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>Dashboard</div>
            <div style={{ fontSize: 12, color: 'var(--mt)', marginTop: 3, fontWeight: 300 }}>{company.name} · {company.city}, {company.state}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {daysLeft !== null && (
              <a href="/billing" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '7px 14px', textDecoration: 'none', background: 'rgba(180,200,220,0.18)', border: '1px solid var(--sv)', color: 'var(--nd)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {daysLeft > 0 ? `Free trial — ${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : 'Trial ended — choose a plan'}
              </a>
            )}
            <a href="/proposals/new" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              + New Proposal
            </a>
          </div>
        </div>

        <div style={{ padding: '36px 40px', flex: 1 }}>
          <StatsRow proposals={proposalList} />

          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            Recent Proposals
            <span style={{ flex: 1, height: 1, background: 'var(--rl)', display: 'block' }} />
          </div>

          {proposalList.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {proposalList.map((p) => <ProposalCard key={p.id} proposal={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

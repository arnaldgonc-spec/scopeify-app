export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import ProposalCard from '@/components/Dashboard/ProposalCard';
import type { Proposal, Company } from '@/lib/types';

export default async function AllProposalsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: company } = await supabase.from('companies').select('*').eq('user_id', session.user.id).single();
  if (!company) redirect('/onboarding');

  const { data: proposals } = await supabase
    .from('proposals').select('*').eq('company_id', company.id).order('created_at', { ascending: false });

  const list = (proposals || []) as Proposal[];
  const counts = { draft: 0, sent: 0, accepted: 0 };
  list.forEach((p) => { if (p.status in counts) counts[p.status as keyof typeof counts]++; });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company as Company} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>All Proposals</div>
            <div style={{ fontSize: 12, color: 'var(--mt)', marginTop: 3, fontWeight: 300 }}>Your complete proposal history</div>
          </div>
          <a href="/proposals/new" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', textDecoration: 'none' }}>
            + New Proposal
          </a>
        </div>
        <div style={{ padding: '36px 40px' }}>
          {list.length === 0 ? (
            <div style={{ background: '#fff', border: '1.5px solid var(--rl)', padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>No proposals yet</div>
              <div style={{ fontSize: 13, color: 'var(--mt)', fontWeight: 300, lineHeight: 1.65, maxWidth: 400, marginBottom: 28 }}>Once you generate your first proposal it will appear here.</div>
              <a href="/proposals/new" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', textDecoration: 'none' }}>Create First Proposal →</a>
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rl)', width: '100%', maxWidth: 480, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
                {(['Draft', 'Sent', 'Accepted'] as const).map((label, i) => (
                  <div key={label} style={{ padding: '0 20px', borderRight: i < 2 ? '1px solid var(--rl)' : 'none', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: 'var(--nd)', lineHeight: 1, marginBottom: 4 }}>{counts[label.toLowerCase() as keyof typeof counts]}</div>
                    <div style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {list.map((p) => <ProposalCard key={p.id} proposal={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

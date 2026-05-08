'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Proposal, Company, ProposalPhoto } from '@/lib/types';

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: p } = await supabase.from('proposals').select('*').eq('id', id).single();
      if (!p) { router.push('/dashboard'); return; }
      setProposal(p as Proposal);
      const { data: c } = await supabase.from('companies').select('*').eq('id', p.company_id).single();
      setCompany(c as Company);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--nd)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(180,200,220,0.15)', borderTopColor: 'var(--sv)', borderRadius: '50%' }} className="spinner" />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Loading proposal...</span>
        </div>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Preview bar */}
      <div style={{ background: 'var(--nd)', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderBottom: '2px solid var(--sv)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', border: 'none', fontFamily: "'Barlow', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Dashboard
          </button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {proposal.proposal_number} · {proposal.client_name}
          </span>
        </div>
        {proposal.pdf_url ? (
          <a
            href={`${proposal.pdf_url}?t=${new Date(proposal.updated_at).getTime()}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'var(--nm)', border: '1.5px solid var(--sv)', color: 'var(--sl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 20px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
          >
            ↓ Download PDF
          </a>
        ) : (
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>PDF generating...</span>
        )}
      </div>

      {/* PDF iframe or fallback */}
      <div style={{ flex: 1, background: '#cdd3de', overflow: 'auto', display: 'flex', justifyContent: 'center', padding: 32 }}>
        {proposal.pdf_url ? (
          <iframe
            src={`${proposal.pdf_url}?t=${new Date(proposal.updated_at).getTime()}`}
            style={{ width: 816, flex: 'none', border: 'none', minHeight: '100%' }}
            title="Proposal PDF"
          />
        ) : (
          <ProposalPreviewFallback proposal={proposal} company={company} />
        )}
      </div>
    </div>
  );
}

function ProposalPreviewFallback({ proposal, company }: { proposal: Proposal; company: Company | null }) {
  const fmt = (n: number | null) => n ? '$' + n.toLocaleString() : '–';
  const price = proposal.final_price ? fmt(proposal.final_price)
    : proposal.ai_estimate_low && proposal.ai_estimate_high
    ? `$${(proposal.ai_estimate_low / 1000).toFixed(0)}K–$${(proposal.ai_estimate_high / 1000).toFixed(0)}K`
    : '–';

  return (
    <div style={{ width: 816, background: '#fff', boxShadow: '0 4px 32px rgba(20,30,71,0.2)' }}>
      {/* Cover */}
      <div style={{ background: 'var(--nd)', padding: '40px 52px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="hex-clip flex items-center justify-center" style={{ width: 40, height: 40, background: 'var(--nv)' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'var(--sl)' }}><path d="M3 12L12 3L21 12V20H15V14H9V20H3V12Z" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{company?.name || 'Scopeify'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 3 }}>Licensed · Bonded · Insured</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.85 }}>{company?.owner_name}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{company?.email}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{company?.phone}</p>
          </div>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 68, color: '#fff', lineHeight: 0.9, marginBottom: 32 }}>
          Roof Replacement<br /><span style={{ color: 'var(--sl)' }}>& Restoration</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          {[['Prepared For', proposal.client_name], ['Property Address', proposal.property_address], ['Proposal Date', new Date(proposal.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })]].map(([label, val], i) => (
            <div key={label} style={{ paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingRight: i < 2 ? 24 : 0 }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', lineHeight: 1.4 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Summary */}
      <div style={{ padding: '40px 52px' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--nd)', textTransform: 'uppercase', marginBottom: 20 }}>Project Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[['Roof System', proposal.scope_data?.new_membrane_type || '–'], ['Area', `${(proposal.roof_data?.area_sqft || 0).toLocaleString()} sq ft`], ['Work Type', (proposal.scope_data?.work_types || [])[0] || '–'], ['Contract Value', price]].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--fg)', padding: '16px 20px', borderLeft: '3px solid var(--nv)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mt)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--nd)' }}>{v}</div>
            </div>
          ))}
        </div>
        {proposal.ai_scope_narrative && <p style={{ fontSize: 13, lineHeight: 1.75, color: '#3a4a6a', fontWeight: 300 }}>{proposal.ai_scope_narrative}</p>}
      </div>
    </div>
  );
}

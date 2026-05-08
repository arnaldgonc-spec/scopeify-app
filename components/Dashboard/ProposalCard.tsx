'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Proposal } from '@/lib/types';

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

const BADGE: Record<string, { bg: string; color: string; border: string }> = {
  draft: { bg: 'rgba(180,200,220,0.15)', color: 'var(--sv)', border: '1px solid rgba(180,200,220,0.25)' },
  sent: { bg: 'rgba(36,50,114,0.15)', color: 'var(--nm)', border: '1px solid rgba(36,50,114,0.25)' },
  accepted: { bg: 'rgba(21,128,61,0.12)', color: 'var(--ok)', border: '1px solid rgba(21,128,61,0.25)' },
  declined: { bg: 'rgba(185,28,28,0.1)', color: 'var(--err)', border: '1px solid rgba(185,28,28,0.2)' },
  expired: { bg: 'rgba(180,184,200,0.12)', color: 'var(--mt)', border: '1px solid rgba(180,184,200,0.2)' },
};

function fmt(n: number | null) {
  if (!n) return '–';
  return '$' + n.toLocaleString('en-US');
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const badge = BADGE[proposal.status] || BADGE.draft;

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this proposal? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete proposal.');
        setDeleting(false);
      }
    } catch {
      alert('Failed to delete proposal.');
      setDeleting(false);
    }
  }
  const price = proposal.final_price
    ? fmt(proposal.final_price)
    : proposal.ai_estimate_low && proposal.ai_estimate_high
    ? `$${(proposal.ai_estimate_low / 1000).toFixed(0)}K–$${(proposal.ai_estimate_high / 1000).toFixed(0)}K`
    : '–';

  return (
    <div
      style={{ background: 'var(--wh)', border: '1.5px solid var(--rl)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
      onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--sv)')}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--rl)')}
    >
      <div style={{ background: 'var(--nd)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete proposal"
            style={{ background: 'transparent', border: 'none', cursor: deleting ? 'default' : 'pointer', color: 'rgba(255,255,255,0.65)', padding: 0, display: 'flex', alignItems: 'center', lineHeight: 1, transition: 'color 0.15s', opacity: deleting ? 0.4 : 1 }}
            onMouseOver={(e) => { if (!deleting) e.currentTarget.style.color = '#f87171'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
          >
            <TrashIcon />
          </button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)' }}>
            {proposal.proposal_number}
          </span>
        </div>
        <span style={{ display: 'inline-block', padding: '2px 8px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', ...badge }}>
          {proposal.status}
        </span>
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--nd)', marginBottom: 3 }}>{proposal.client_name}</div>
        <div style={{ fontSize: 12, color: 'var(--mt)', fontWeight: 300, marginBottom: 12 }}>
          {proposal.property_address}, {proposal.property_city}, {proposal.property_state}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div style={{ fontSize: 10, color: 'var(--mt)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Investment</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: 'var(--nv)', lineHeight: 1 }}>{price}</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300 }}>{fmtDate(proposal.created_at)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '12px 18px', borderTop: '1px solid var(--rl)', background: 'var(--fg)' }}>
        <button
          onClick={() => router.push(`/proposals/${proposal.id}/preview`)}
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '7px 14px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', transition: 'all 0.15s' }}
        >
          Preview PDF
        </button>
        <button
          onClick={() => router.push(`/proposals/build?id=${proposal.id}`)}
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '7px 14px', cursor: 'pointer', letterSpacing: '0.04em', background: 'transparent', color: 'var(--ir)', border: '1.5px solid var(--rl)', transition: 'all 0.15s' }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

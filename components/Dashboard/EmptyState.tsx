'use client';
import { useRouter } from 'next/navigation';

export default function EmptyState() {
  const router = useRouter();
  return (
    <div style={{ background: 'var(--wh)', border: '1.5px solid var(--rl)', padding: '64px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, background: 'var(--fg)', border: '1.5px solid var(--rl)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--mt)" strokeWidth="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
        No proposals yet
      </div>
      <div style={{ fontSize: 13, color: 'var(--mt)', fontWeight: 300, lineHeight: 1.6, maxWidth: 360, marginBottom: 24 }}>
        Create your first commercial roofing proposal in under 5 minutes. All three paths end in a professional PDF your clients will take seriously.
      </div>
      <button
        onClick={() => router.push('/proposals/new')}
        style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 7 }}
      >
        Create First Proposal →
      </button>
    </div>
  );
}

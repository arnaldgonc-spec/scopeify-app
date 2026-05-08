import type { Proposal } from '@/lib/types';

interface Props {
  proposals: Proposal[];
}

export default function StatsRow({ proposals }: Props) {
  const total = proposals.length;
  const totalValue = proposals.reduce((sum, p) => sum + (p.final_price || 0), 0);
  const accepted = proposals.filter((p) => p.status === 'accepted').length;
  const sent = proposals.filter((p) => p.status === 'sent' || p.status === 'accepted' || p.status === 'declined').length;
  const closeRate = sent > 0 ? Math.round((accepted / sent) * 100) : 0;

  const stats = [
    { n: total, l: 'Proposals this year' },
    { n: totalValue >= 1_000_000 ? '$' + (totalValue / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M' : totalValue > 0 ? '$' + (totalValue / 1000).toFixed(0) + 'K' : '$0', l: 'Total quoted value' },
    { n: accepted, l: 'Accepted proposals' },
    { n: closeRate + '%', l: 'Close rate' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: 'var(--nd)', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--sv),transparent)' }} />
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: 'var(--sl)', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 300, lineHeight: 1.4 }}>{s.l}</div>
        </div>
      ))}
    </div>
  );
}

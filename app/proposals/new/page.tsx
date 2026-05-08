'use client';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import type { Company } from '@/lib/types';

const PATHS = [
  {
    id: 'proposal' as const,
    title: 'Proposal Builder',
    desc: 'You already know your price. You need a professional document that wins the job.',
    features: [
      { yes: true, text: 'AI writes your scope of work' },
      { yes: true, text: 'Branded 4-page PDF proposal' },
      { yes: true, text: 'Your own price – no AI estimation' },
      { yes: true, text: 'Optional photo documentation' },
      { yes: false, text: 'No AI cost estimation' },
    ],
    time: '~5 min · 7 steps · No AI estimation',
    popular: false,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sv)" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  },
  {
    id: 'estimate' as const,
    title: 'Quick Estimate',
    desc: 'Get an AI cost range from your roof inputs, then use it or override with your own number.',
    features: [
      { yes: true, text: 'AI estimates from roof data + regional pricing' },
      { yes: true, text: 'Accept AI range or enter your own price' },
      { yes: true, text: 'AI writes scope of work narrative' },
      { yes: true, text: 'Branded 4-page PDF proposal' },
      { yes: false, text: 'No photo AI analysis' },
    ],
    time: '~6 min · 7 steps · AI pricing included',
    popular: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sv)" strokeWidth="1.5"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  },
  {
    id: 'assessment' as const,
    title: 'Full Assessment',
    desc: 'Upload site photos, get AI damage detection, a confidence-scored estimate, and a condition report.',
    features: [
      { yes: true, text: 'AI analyzes visible damage in photos' },
      { yes: true, text: 'Confidence-scored estimate (0–88%)' },
      { yes: true, text: 'Annotated photos in proposal PDF' },
      { yes: true, text: 'Full AI scope + condition report' },
      { yes: true, text: 'Branded 4-page PDF proposal' },
    ],
    time: '~10 min · 8 steps · Full AI analysis',
    popular: false,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sv)" strokeWidth="1.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>,
  },
];

export default function NewProposalPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) { router.push('/login'); return; }
        supabase.from('companies').select('*').eq('user_id', user.id).single().then(({ data }) => setCompany(data as Company));
      });
    });
  }, [router]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Back topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
          <button onClick={() => router.push('/dashboard')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--mt)', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', border: 'none', fontFamily: "'Barlow', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}>← Dashboard</button>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mt)' }}>New Proposal</div>
          <div style={{ width: 120 }} />
        </div>

        <div style={{ flex: 1, padding: '52px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--sv)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 2, background: 'var(--sv)', opacity: 0.5, display: 'inline-block' }} />
              Choose Your Workflow
              <span style={{ width: 28, height: 2, background: 'var(--sv)', opacity: 0.5, display: 'inline-block' }} />
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: 'var(--nd)', letterSpacing: '0.02em', lineHeight: 0.95, marginBottom: 14 }}>How Do You Want<br />To Work Today?</div>
            <div style={{ fontSize: 14, color: 'var(--ir)', fontWeight: 300, maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>Pick the path that fits your situation. All three end in the same professional PDF proposal.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
            {PATHS.map((p) => (
              <PathCard key={p.id} path={p} onClick={() => router.push(`/proposals/build?path=${p.id}`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PathCard({ path, onClick }: { path: typeof PATHS[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{ background: '#fff', border: `1.5px solid ${hovered || path.popular ? 'var(--nv)' : 'var(--rl)'}`, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', transform: hovered ? 'translateY(-2px)' : 'none', position: 'relative' }}
    >
      {path.popular && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--nv)', color: 'var(--sl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', zIndex: 1 }}>Most Popular</div>
      )}
      <div style={{ background: 'var(--nd)', padding: '26px 26px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)' }} />
        <div style={{ width: 44, height: 44, background: 'rgba(180,200,220,0.12)', border: '1px solid rgba(180,200,220,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          {path.icon}
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{path.title}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.5 }}>{path.desc}</div>
      </div>
      <div style={{ padding: '22px 26px' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {path.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: 9, fontSize: 13, color: f.yes ? 'var(--ir)' : 'var(--mt)', fontWeight: 300 }}>
              <span style={{ color: f.yes ? 'var(--nv)' : 'var(--mt)', fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 1 }}>{f.yes ? '✓' : '✕'}</span>
              {f.text}
            </li>
          ))}
        </ul>
        <div style={{ background: 'var(--nv)', color: '#fff', width: '100%', padding: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          Start {path.title} →
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rl)' }}>
          <span style={{ fontSize: 12 }}>⏱</span>
          <span style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300 }}>{path.time}</span>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (!email) return;
    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/auth/callback' },
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(180,200,220,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(180,200,220,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,200,220,0.06) 0%,transparent 65%)' }} />

      <div style={{ background: '#fff', padding: '48px 52px', width: 420, position: 'relative', zIndex: 2, boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ marginBottom: 36 }}>
          <img src="/Scopeify_logo_2.png" alt="Scopeify" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--nd)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Sign In</div>
        <div style={{ fontSize: 13, color: 'var(--ir)', fontWeight: 300, marginBottom: 28, lineHeight: 1.5 }}>Enter your email to receive a secure magic link – no password needed.</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="you@yourcompany.com"
            disabled={sent}
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--ink)', background: '#fff', border: '1.5px solid var(--rl)', padding: '10px 13px', outline: 'none', width: '100%' }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || sent}
          style={{ width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: loading || sent ? 'default' : 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', opacity: loading || sent ? 0.7 : 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 7 }}
        >
          {loading ? 'Sending...' : 'Send Magic Link →'}
        </button>

        {sent && (
          <div style={{ background: 'rgba(21,128,61,0.08)', border: '1.5px solid rgba(21,128,61,0.25)', padding: 16, marginTop: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--ok)', fontWeight: 500 }}>✓ Check your inbox – a login link is on its way.</p>
          </div>
        )}

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rl)', textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--mt)' }}>Don&apos;t have an account? </span>
          <span onClick={() => router.push('/onboarding')} style={{ fontSize: 12, color: 'var(--nv)', cursor: 'pointer', fontWeight: 600 }}>Get started free →</span>
        </div>
      </div>
    </div>
  );
}

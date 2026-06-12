'use client';
import { useState } from 'react';

export const authInputStyle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--ink)', background: '#fff',
  border: '1.5px solid var(--rl)', padding: '10px 13px', outline: 'none', width: '100%',
};

export const authButtonStyle = (disabled: boolean): React.CSSProperties => ({
  width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px',
  border: 'none', cursor: disabled ? 'default' : 'pointer', letterSpacing: '0.04em',
  background: 'var(--nv)', color: '#fff', opacity: disabled ? 0.7 : 1,
  justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 7,
});

// Page chrome shared by all auth screens (dark gridded backdrop + white card).
export function AuthShell({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(180,200,220,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(180,200,220,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(180,200,220,0.06) 0%,transparent 65%)' }} />
      <div style={{ background: '#fff', padding: '48px 52px', width: 420, position: 'relative', zIndex: 2, boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
        <div style={{ marginBottom: 36 }}>
          <img src="/Scopeify_logo_2.png" alt="Scopeify" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--nd)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--ir)', fontWeight: 300, marginBottom: 28, lineHeight: 1.5 }}>{subtitle}</div>
        {children}
      </div>
    </div>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div style={{ background: 'rgba(220,38,38,0.07)', border: '1.5px solid rgba(220,38,38,0.25)', padding: 12, marginBottom: 16 }}>
      <p style={{ fontSize: 13, color: '#b91c1c', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export function AuthSuccess({ message }: { message: string }) {
  return (
    <div style={{ background: 'rgba(21,128,61,0.08)', border: '1.5px solid rgba(21,128,61,0.25)', padding: 16, marginTop: 16 }}>
      <p style={{ fontSize: 13, color: 'var(--ok)', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

// "Continue with Google" — starts the OAuth redirect flow.
export function GoogleButton({ next = '/dashboard' }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  async function signInWithGoogle() {
    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setLoading(false);
  }
  return (
    <button
      onClick={signInWithGoogle}
      disabled={loading}
      style={{ width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: '1.5px solid var(--rl)', cursor: loading ? 'default' : 'pointer', background: '#fff', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>
  );
}

export function AuthDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
      <span style={{ flex: 1, height: 1, background: 'var(--rl)' }} />
      <span style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 600, letterSpacing: '0.08em' }}>OR</span>
      <span style={{ flex: 1, height: 1, background: 'var(--rl)' }} />
    </div>
  );
}

export function AuthField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <input style={authInputStyle} {...props} />
    </div>
  );
}

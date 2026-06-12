'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell, AuthField, AuthError, AuthSuccess, GoogleButton, AuthDivider, authButtonStyle } from '@/components/auth/AuthCard';

const ERROR_MESSAGES: Record<string, string> = {
  expired: 'That link has expired or is invalid. Please sign in again.',
  auth: 'Something went wrong with sign-in. Please try again.',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resent, setResent] = useState(false);

  // Read ?error= from the URL without useSearchParams (avoids a Suspense boundary).
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error');
    if (code) setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.auth);
  }, []);

  async function handleLogin() {
    setError(null);
    setNeedsConfirm(false);
    if (!email || !password) { setError('Email and password are required.'); return; }

    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (err) {
      if (/email not confirmed/i.test(err.message)) {
        setNeedsConfirm(true);
        setError('Your email isn’t confirmed yet. Check your inbox or resend the confirmation below.');
      } else {
        setError('Incorrect email or password.');
      }
      return;
    }
    router.push('/dashboard');
  }

  async function resendConfirmation() {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${origin}/auth/callback?next=/onboarding` } });
    setResent(true);
  }

  return (
    <AuthShell title="Sign In" subtitle="Welcome back. Enter your details to access your dashboard.">
      <AuthError message={error} />
      {needsConfirm && !resent && (
        <button onClick={resendConfirmation} style={{ ...authButtonStyle(false), background: '#fff', color: 'var(--nv)', border: '1.5px solid var(--nv)', marginBottom: 16 }}>
          Resend confirmation email
        </button>
      )}
      {resent && <AuthSuccess message="✓ Confirmation email sent." />}

      <AuthField label="Email Address" type="email" value={email} placeholder="you@yourcompany.com" onChange={(e) => setEmail(e.target.value)} />
      <AuthField label="Password" type="password" value={password} placeholder="Your password" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
      <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 14 }}>
        <span onClick={() => router.push('/forgot-password')} style={{ fontSize: 12, color: 'var(--nv)', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
      </div>

      <button onClick={handleLogin} disabled={loading} style={authButtonStyle(loading)}>
        {loading ? 'Signing in...' : 'Sign In →'}
      </button>

      <AuthDivider />
      <GoogleButton next="/dashboard" />

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rl)', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--mt)' }}>Don&apos;t have an account? </span>
        <span onClick={() => router.push('/signup')} style={{ fontSize: 12, color: 'var(--nv)', cursor: 'pointer', fontWeight: 600 }}>Get started free →</span>
      </div>
    </AuthShell>
  );
}

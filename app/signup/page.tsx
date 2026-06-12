'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell, AuthField, AuthError, AuthSuccess, GoogleButton, AuthDivider, authButtonStyle } from '@/components/auth/AuthCard';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSignup() {
    setError(null);
    if (!email || !password) { setError('Email and password are required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${origin}/auth/callback?next=/onboarding` },
    });
    setLoading(false);

    if (err) { setError(err.message); return; }
    // Supabase returns a user with empty identities for an already-registered email.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError('An account with this email already exists. Please sign in instead.');
      return;
    }
    if (data.session) {
      router.push('/onboarding');
      return;
    }
    // Email confirmation required.
    setSent(true);
  }

  return (
    <AuthShell title="Create Account" subtitle="Start your 14-day free trial — no card required.">
      {sent ? (
        <AuthSuccess message="✓ Check your inbox to confirm your email, then you'll be guided through company setup." />
      ) : (
        <>
          <AuthError message={error} />
          <AuthField label="Email Address" type="email" value={email} placeholder="you@yourcompany.com" onChange={(e) => setEmail(e.target.value)} />
          <AuthField label="Password" type="password" value={password} placeholder="At least 8 characters" onChange={(e) => setPassword(e.target.value)} />
          <AuthField label="Confirm Password" type="password" value={confirm} placeholder="Re-enter password" onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSignup()} />
          <button onClick={handleSignup} disabled={loading} style={authButtonStyle(loading)}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
          <AuthDivider />
          <GoogleButton next="/onboarding" />
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rl)', textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--mt)' }}>Already have an account? </span>
            <span onClick={() => router.push('/login')} style={{ fontSize: 12, color: 'var(--nv)', cursor: 'pointer', fontWeight: 600 }}>Sign in →</span>
          </div>
        </>
      )}
    </AuthShell>
  );
}

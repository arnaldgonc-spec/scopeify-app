'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell, AuthField, AuthError, AuthSuccess, authButtonStyle } from '@/components/auth/AuthCard';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setError(null);
    if (!email) { setError('Enter your email address.'); return; }
    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    // Always show success — don't reveal whether the account exists.
    setSent(true);
  }

  return (
    <AuthShell title="Reset Password" subtitle="Enter your email and we'll send you a link to reset your password.">
      {sent ? (
        <AuthSuccess message="✓ If an account exists for that email, a reset link is on its way." />
      ) : (
        <>
          <AuthError message={error} />
          <AuthField label="Email Address" type="email" value={email} placeholder="you@yourcompany.com" onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleReset()} />
          <button onClick={handleReset} disabled={loading} style={authButtonStyle(loading)}>
            {loading ? 'Sending...' : 'Send Reset Link →'}
          </button>
        </>
      )}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rl)', textAlign: 'center' }}>
        <span onClick={() => router.push('/login')} style={{ fontSize: 12, color: 'var(--nv)', cursor: 'pointer', fontWeight: 600 }}>← Back to sign in</span>
      </div>
    </AuthShell>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell, AuthField, AuthError, authButtonStyle } from '@/components/auth/AuthCard';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // The callback exchanged the recovery code for a session. If there's no user,
  // the link was invalid/expired.
  useEffect(() => {
    (async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login?error=expired'); return; }
      setReady(true);
    })();
  }, [router]);

  async function handleUpdate() {
    setError(null);
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push('/dashboard');
  }

  return (
    <AuthShell title="Set New Password" subtitle="Choose a new password for your account.">
      {!ready ? (
        <div style={{ fontSize: 13, color: 'var(--mt)' }}>Verifying link…</div>
      ) : (
        <>
          <AuthError message={error} />
          <AuthField label="New Password" type="password" value={password} placeholder="At least 8 characters" onChange={(e) => setPassword(e.target.value)} />
          <AuthField label="Confirm Password" type="password" value={confirm} placeholder="Re-enter password" onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdate()} />
          <button onClick={handleUpdate} disabled={loading} style={authButtonStyle(loading)}>
            {loading ? 'Updating...' : 'Update Password →'}
          </button>
        </>
      )}
    </AuthShell>
  );
}

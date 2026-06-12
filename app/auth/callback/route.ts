import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Handles every code-based auth redirect: OAuth (Google), email confirmation,
// and password recovery. All arrive as ?code= under the @supabase/ssr PKCE flow.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');
  // Only allow internal redirects (prevent open-redirect via ?next=).
  const next = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard';

  // Supabase can redirect back with its own error (e.g. expired link).
  if (searchParams.get('error') || searchParams.get('error_description')) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=expired`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

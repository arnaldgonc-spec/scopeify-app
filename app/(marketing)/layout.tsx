export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import NavBar from '@/components/Marketing/NavBar';
import Footer from '@/components/Marketing/Footer';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Scopeify – Commercial roofing reports in minutes, not days',
  description:
    'Scopeify turns roof measurements and site photos into branded, AI-written commercial roofing proposals and assessment reports — ready to send in minutes.',
};

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  let loggedIn = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getSession();
    loggedIn = !!data.session;
  } catch {
    loggedIn = false;
  }

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <NavBar loggedIn={loggedIn} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

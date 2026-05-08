export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Sidebar from '@/components/Sidebar';
import AccountForm from '@/components/AccountForm';
import type { Company } from '@/lib/types';

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!company) redirect('/onboarding');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company as Company} />
      <div style={{ flex: 1, overflowY: 'auto', background: '#f0f2f7' }}>
        <AccountForm company={company as Company} />
      </div>
    </div>
  );
}

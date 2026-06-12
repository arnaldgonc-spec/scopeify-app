import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ensureTrialSubscription } from '@/lib/billing';

// Called right after onboarding so a 14-day trial exists before Stripe is wired up.
export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (!company) return NextResponse.json({ error: 'no_company' }, { status: 400 });

    await ensureTrialSubscription(company.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('start-trial error:', err);
    return NextResponse.json({ error: 'trial_failed' }, { status: 500 });
  }
}

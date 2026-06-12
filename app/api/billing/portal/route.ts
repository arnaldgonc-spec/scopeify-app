import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe';
import { serviceClient, getSubscriptionForCompany } from '@/lib/billing';

export async function POST(request: Request) {
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

    const sub = await getSubscriptionForCompany(serviceClient(), company.id);
    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: 'no_customer' }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${origin}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('billing/portal error:', err);
    return NextResponse.json({ error: 'portal_failed' }, { status: 500 });
  }
}

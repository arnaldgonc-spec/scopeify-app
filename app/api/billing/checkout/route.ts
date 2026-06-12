import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getStripe, priceIdForPlan, PLANS, type PlanId } from '@/lib/stripe';
import { serviceClient, getSubscriptionForCompany } from '@/lib/billing';

export async function POST(request: Request) {
  try {
    const { plan } = (await request.json()) as { plan: PlanId };
    if (!PLANS[plan]) {
      return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { data: company } = await supabase
      .from('companies')
      .select('id, name, email')
      .eq('user_id', user.id)
      .single();
    if (!company) return NextResponse.json({ error: 'no_company' }, { status: 400 });

    const stripe = getStripe();
    const svc = serviceClient();
    const sub = await getSubscriptionForCompany(svc, company.id);

    // Reuse an existing Stripe customer if we have one.
    let customerId = sub?.stripe_customer_id ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: company.email ?? user.email ?? undefined,
        name: company.name ?? undefined,
        metadata: { company_id: company.id },
      });
      customerId = customer.id;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { company_id: company.id, plan },
      },
      payment_method_collection: 'if_required',
      metadata: { company_id: company.id, plan },
      success_url: `${origin}/billing?status=success`,
      cancel_url: `${origin}/billing?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('billing/checkout error:', err);
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, planForPriceId } from '@/lib/stripe';
import { serviceClient } from '@/lib/billing';

export const runtime = 'nodejs';

// Upsert the subscriptions row from a Stripe Subscription object.
async function syncSubscription(sub: Stripe.Subscription) {
  const svc = serviceClient();
  const companyId =
    (sub.metadata?.company_id as string | undefined) ?? undefined;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price?.id;
  const periodEnd = sub.items.data[0]?.current_period_end;

  const row = {
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    plan: planForPriceId(priceId),
    status: sub.status,
    trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  // Prefer matching by company_id (set via metadata); fall back to customer id.
  if (companyId) {
    await svc.from('subscriptions').upsert(
      { company_id: companyId, ...row },
      { onConflict: 'company_id' }
    );
  } else {
    await svc.from('subscriptions').update(row).eq('stripe_customer_id', customerId);
  }
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: 'not_configured' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('webhook signature verification failed:', err);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;
          const sub = await getStripe().subscriptions.retrieve(subId);
          // Carry company_id from the session if missing on the subscription.
          if (!sub.metadata?.company_id && session.metadata?.company_id) {
            sub.metadata = { ...sub.metadata, company_id: session.metadata.company_id };
          }
          await syncSubscription(sub);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('webhook handler error:', err);
    return NextResponse.json({ error: 'handler_failed' }, { status: 500 });
  }
}

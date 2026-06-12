'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import type { Company } from '@/lib/types';
import { trialDaysLeft, type Subscription } from '@/lib/billing';

const PLANS = [
  { id: 'starter', name: 'Starter', price: 49, blurb: 'For solo contractors getting started.',
    features: ['10 proposals / month', 'AI scope + cost estimates', 'AI photo analysis', 'Preset report templates'] },
  { id: 'pro', name: 'Pro', price: 99, blurb: 'For growing roofing businesses.', popular: true,
    features: ['Unlimited proposals', 'Everything in Starter', 'Custom report templates', 'Priority support'] },
] as const;

export default function BillingClient({ company, subscription, stripeReady }: {
  company: Company; subscription: Subscription | null; stripeReady: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const daysLeft = trialDaysLeft(subscription);
  const isActive = subscription?.status === 'active';

  async function subscribe(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else { alert('Could not start checkout. Stripe may not be connected yet.'); setLoading(null); }
    } catch { alert('Checkout failed.'); setLoading(null); }
  }

  async function openPortal() {
    setLoading('portal');
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else { alert('Billing portal unavailable.'); setLoading(null); }
    } catch { alert('Portal failed.'); setLoading(null); }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mt)' }}>Billing & Subscription</div>
        </div>

        <div style={{ padding: '40px', maxWidth: 880, margin: '0 auto' }}>
          {/* Status banner */}
          <div style={{ background: '#fff', border: '1.5px solid var(--rl)', padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sv)', marginBottom: 8 }}>Current Plan</div>
            {isActive ? (
              <div style={{ fontSize: 15, color: 'var(--nd)' }}>
                You are on the <strong style={{ textTransform: 'capitalize' }}>{subscription?.plan}</strong> plan.
              </div>
            ) : daysLeft !== null ? (
              <div style={{ fontSize: 15, color: 'var(--nd)' }}>
                {daysLeft > 0
                  ? <>Free trial — <strong>{daysLeft} day{daysLeft === 1 ? '' : 's'} left</strong>. Subscribe to keep generating proposals.</>
                  : <>Your trial has ended. Subscribe to continue.</>}
              </div>
            ) : (
              <div style={{ fontSize: 15, color: 'var(--nd)' }}>No active subscription. Choose a plan below.</div>
            )}
            {subscription?.stripe_customer_id && (
              <button onClick={openPortal} disabled={loading === 'portal'} style={{ marginTop: 14, fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '8px 16px', border: '1.5px solid var(--nv)', background: '#fff', color: 'var(--nv)', cursor: 'pointer' }}>
                {loading === 'portal' ? 'Opening…' : 'Manage Billing'}
              </button>
            )}
          </div>

          {!stripeReady && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#9a3412' }}>
              Card payments are being connected. Your free trial is active in the meantime.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {PLANS.map((p) => (
              <div key={p.id} style={{ background: '#fff', border: `1.5px solid ${'popular' in p && p.popular ? 'var(--nv)' : 'var(--rl)'}`, padding: 0, position: 'relative' }}>
                {'popular' in p && p.popular && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--nv)', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px' }}>Recommended</div>
                )}
                <div style={{ padding: '24px 24px 18px', borderBottom: '1px solid var(--rl)' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--mt)', marginBottom: 12 }}>{p.blurb}</div>
                  <div><span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: 'var(--nd)' }}>${p.price}</span><span style={{ fontSize: 13, color: 'var(--mt)' }}> / month</span></div>
                </div>
                <div style={{ padding: '18px 24px 24px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ display: 'flex', gap: 9, fontSize: 13, color: 'var(--ir)' }}>
                        <span style={{ color: 'var(--nv)', fontWeight: 700, fontSize: 11 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => subscribe(p.id)} disabled={!!loading || (isActive && subscription?.plan === p.id)} style={{ width: '100%', background: isActive && subscription?.plan === p.id ? 'var(--rl)' : 'var(--nv)', color: isActive && subscription?.plan === p.id ? 'var(--mt)' : '#fff', padding: 12, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: loading ? 'default' : 'pointer' }}>
                    {isActive && subscription?.plan === p.id ? 'Current Plan' : loading === p.id ? 'Redirecting…' : `Choose ${p.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    name: 'PDF Generator',
    monthly: 99,
    yearly: 89,
    tagline: 'For solo contractors who just need a polished deliverable.',
    features: [
      'Unlimited branded PDF proposals',
      'Photo + notes → AI draft scope',
      'Your logo, colors, and signature block',
      'Email delivery with read receipts',
      'Up to 25 proposals / month',
    ],
    cta: 'Start with PDF',
    ctaClass: 'pcta ghost2',
    hot: false,
  },
  {
    name: 'Quick Estimation',
    monthly: 149,
    yearly: 129,
    tagline: 'Everything in PDF, plus instant ballpark pricing for fast bids.',
    features: [
      'Everything in PDF Generator',
      'Square-footage and materials estimator',
      'Regional pricing benchmarks',
      'Cost vs. historical jobs comparison',
      'Up to 75 proposals / month',
    ],
    cta: 'Pick Quick Estimation',
    ctaClass: 'pcta solid',
    hot: true,
  },
  {
    name: 'Full Assessment',
    monthly: 249,
    yearly: 229,
    tagline: 'For estimating teams running real volume on commercial roofs.',
    features: [
      'Everything in Quick Estimation',
      'Drone & satellite roof takeoffs',
      'Drainage, slope, and penetration mapping',
      'Multi-user accounts with approvals',
      'Unlimited proposals + priority support',
    ],
    cta: 'Go Full Assessment',
    ctaClass: 'pcta ghost2',
    hot: false,
  },
] as const;

export default function ProductsPage() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <>
      <section className="dark products-hero ticks">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" />
        <div className="vignette" />
        <div
          className="wrap"
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span className="eyebrow rv">
            <span className="ln" />
            Products
            <span className="ln" />
          </span>
          <h1 className="ph rv">Pick the plan that fits how you bid</h1>
          <p className="phlead rv">
            Month-to-month, cancel anytime. Every plan includes the full PDF
            generator — pick the level of estimating muscle you need on top.
          </p>
          <p className="guarantee rv">
            Backed by our <b>2-Month 100% Money-Back Guarantee</b> — if you
            don&apos;t love it, we&apos;ll refund every cent.
          </p>
          <div className="toggle rv">
            <button
              id="bm"
              className={billing === 'monthly' ? 'on' : undefined}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              id="by"
              className={billing === 'yearly' ? 'on' : undefined}
              onClick={() => setBilling('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      <section className="price-section">
        <div className="wrap">
          <div className="price-grid rv">
            {PLANS.map((p) => {
              const price = billing === 'yearly' ? p.yearly : p.monthly;
              const note =
                billing === 'yearly'
                  ? `Billed yearly · $${p.yearly * 12}/yr`
                  : 'Billed monthly';
              const savePct = Math.round(
                ((p.monthly - p.yearly) / p.monthly) * 100,
              );
              return (
                <div key={p.name} className={p.hot ? 'plan hot' : 'plan'}>
                  <div
                    className="pn"
                    style={p.hot ? { marginTop: '18px' } : undefined}
                  >
                    {p.name}
                  </div>
                  <div className="pt">{p.tagline}</div>
                  <div className="pr">
                    <span className="amt">${price}</span>
                    <span className="per">/month</span>
                    <span
                      className="save"
                      style={{
                        display: billing === 'yearly' ? 'inline-block' : 'none',
                      }}
                    >
                      {billing === 'yearly' ? `Save ${savePct}%` : ''}
                    </span>
                  </div>
                  <div className="billing-note">{note}</div>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="tick" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link className={p.ctaClass} href="/payment">
                    {p.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

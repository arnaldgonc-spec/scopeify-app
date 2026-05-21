import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, PageHero, SectionHead } from '@/components/Marketing/sections';

export const metadata: Metadata = {
  title: 'Products & Pricing – Scopeify',
  description:
    'Scopeify plans: PDF Generator at $99/month, Quick Estimation at $149/month and Full Assessment at $249/month.',
};

const PLANS = [
  {
    name: 'PDF Generator',
    price: '$99',
    blurb: 'You already know your price. You need a professional document that wins the job.',
    features: [
      { ok: true, text: 'AI writes your scope of work' },
      { ok: true, text: 'Branded 4-page PDF proposal' },
      { ok: true, text: 'Your own price — no AI estimation' },
      { ok: true, text: 'Optional photo documentation' },
      { ok: false, text: 'No AI cost estimation' },
    ],
    popular: false,
  },
  {
    name: 'Quick Estimation',
    price: '$149',
    blurb: 'Get an AI cost range from your roof inputs, then use it or override with your own number.',
    features: [
      { ok: true, text: 'AI estimates from roof data + regional pricing' },
      { ok: true, text: 'Accept the AI range or enter your own price' },
      { ok: true, text: 'AI writes the scope-of-work narrative' },
      { ok: true, text: 'Branded 4-page PDF proposal' },
      { ok: false, text: 'No AI photo analysis' },
    ],
    popular: true,
  },
  {
    name: 'Full Assessment',
    price: '$249',
    blurb: 'Upload site photos for AI damage detection, a confidence-scored estimate and a condition report.',
    features: [
      { ok: true, text: 'AI analyzes visible damage in photos' },
      { ok: true, text: 'Confidence-scored estimate (0–88%)' },
      { ok: true, text: 'Annotated photos in the proposal PDF' },
      { ok: true, text: 'Full AI scope + condition report' },
      { ok: true, text: 'Branded 4-page PDF proposal' },
    ],
    popular: false,
  },
];

const COMPARE = [
  { label: 'AI scope-of-work writing', vals: [true, true, true] },
  { label: 'Branded 4-page PDF proposal', vals: [true, true, true] },
  { label: 'Set your own price', vals: [true, true, true] },
  { label: 'AI cost estimation', vals: [false, true, true] },
  { label: 'Regional pricing data', vals: [false, true, true] },
  { label: 'Photo documentation', vals: [true, true, true] },
  { label: 'AI photo damage analysis', vals: [false, false, true] },
  { label: 'Confidence-scored estimate', vals: [false, false, true] },
  { label: 'Annotated photos in PDF', vals: [false, false, true] },
  { label: 'Roof condition report', vals: [false, false, true] },
];

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Your first proposal is on us — no credit card and no setup call. You only pick a plan once you have seen a finished PDF with your own branding on it.',
  },
  {
    q: 'Can I move between plans?',
    a: 'Any time. Plenty of contractors run PDF Generator day to day and step up to Full Assessment for the jobs that need photo evidence. Changes take effect on your next cycle.',
  },
  {
    q: 'Do all three plans produce the same PDF?',
    a: 'The four-page branded proposal is identical across every plan. The difference is how much of the estimating and inspection work the AI does before that PDF is built.',
  },
  {
    q: 'What does per-month pricing cover?',
    a: 'A flat monthly rate for the plan — generate as many proposals as the work demands. No per-document fees and no surprise overage charges.',
  },
];

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--nv)" strokeWidth="2.6">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--mt)" strokeWidth="2.2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Pick the plan that fits the job"
        sub="Three plans, one professional PDF at the end of every one of them. Pay a flat monthly rate and generate as many proposals as the work demands."
      />

      {/* PRICING CARDS */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <div className="mkt-grid-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className="mkt-card mkt-card-hover"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: p.popular ? 'var(--nv)' : 'var(--rl)',
                  borderWidth: p.popular ? 2 : 1.5,
                }}
              >
                {p.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'var(--nv)',
                      color: 'var(--sl)',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '5px 12px',
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div style={{ padding: '30px 28px 24px', borderBottom: '1px solid var(--rl)' }}>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 23,
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      color: 'var(--nd)',
                      marginBottom: 8,
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 12 }}>
                    <span
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, color: 'var(--nd)', lineHeight: 1 }}
                    >
                      {p.price}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--mt)', fontWeight: 300 }}>/month</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.65 }}>{p.blurb}</p>
                </div>
                <div style={{ padding: '24px 28px', flex: 1 }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26 }}>
                    {p.features.map((f) => (
                      <li
                        key={f.text}
                        style={{
                          display: 'flex',
                          gap: 11,
                          alignItems: 'flex-start',
                          fontSize: 13.5,
                          color: f.ok ? 'var(--ir)' : 'var(--mt)',
                          fontWeight: 300,
                        }}
                      >
                        <span style={{ flexShrink: 0, marginTop: 1 }}>
                          <Check ok={f.ok} />
                        </span>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={`mkt-btn mkt-btn-block ${p.popular ? 'mkt-btn-primary' : 'mkt-btn-ghost'}`}
                  >
                    Start with {p.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mt)', fontWeight: 300, marginTop: 28 }}>
            Every plan includes unlimited proposals, your branding on every PDF, and a free first proposal to start.
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="mkt-section" style={{ background: '#f1f4f9' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="Compare Plans"
            title="What's included, side by side"
            sub="Everything builds on the plan before it — so you only pay for the AI work the job actually needs."
          />
          <div className="mkt-card" style={{ overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.7fr 1fr 1fr 1fr',
                background: 'var(--nd)',
                alignItems: 'stretch',
              }}
            >
              <div
                style={{
                  padding: '16px 22px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                Feature
              </div>
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  style={{
                    padding: '16px 12px',
                    textAlign: 'center',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {p.name}
                  <div style={{ fontSize: 11, color: 'var(--sv)', fontWeight: 400, marginTop: 2 }}>
                    {p.price}/mo
                  </div>
                </div>
              ))}
            </div>
            {COMPARE.map((row, i) => (
              <div
                key={row.label}
                className="mkt-row-hover"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.7fr 1fr 1fr 1fr',
                  borderTop: i === 0 ? 'none' : '1px solid var(--rl)',
                  background: '#fff',
                }}
              >
                <div style={{ padding: '14px 22px', fontSize: 13.5, color: 'var(--ink)', fontWeight: 400 }}>
                  {row.label}
                </div>
                {row.vals.map((v, j) => (
                  <div
                    key={j}
                    style={{
                      padding: '14px 12px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderLeft: '1px solid var(--rl)',
                    }}
                  >
                    <Check ok={v} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap" style={{ maxWidth: 820 }}>
          <SectionHead eyebrow="Questions" title="The short answers" />
          <div className="mkt-card" style={{ padding: '6px 32px' }}>
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                style={{ padding: '24px 0', borderBottom: i < FAQ.length - 1 ? '1px solid var(--rl)' : 'none' }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: 'var(--nd)',
                    marginBottom: 9,
                  }}
                >
                  {f.q}
                </div>
                <p style={{ fontSize: 14, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.75 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Start on the plan that fits today"
        sub="Generate your first proposal free, then choose PDF Generator, Quick Estimation or Full Assessment when you're ready."
        secondaryHref="/results"
        secondaryLabel="See Results"
      />
    </>
  );
}

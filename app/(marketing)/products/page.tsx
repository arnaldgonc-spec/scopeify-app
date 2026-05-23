import Link from 'next/link';

export const metadata = { title: 'Products & Pricing — Scopeify' };

const PLANS = [
  {
    name: 'PDF Generator',
    price: 99,
    tagline: 'For solo contractors who just need a polished deliverable.',
    features: [
      'Unlimited branded PDF proposals',
      'Photo + notes → AI draft scope',
      'Your logo, colors, and signature block',
      'Email delivery with read receipts',
      'Up to 25 proposals / month',
    ],
    cta: 'Start with PDF',
    highlight: false,
  },
  {
    name: 'Quick Estimation',
    price: 149,
    tagline: 'Everything in PDF, plus instant ballpark pricing for fast bids.',
    features: [
      'Everything in PDF Generator',
      'Square-footage and materials estimator',
      'Regional pricing benchmarks',
      'Cost vs. historical jobs comparison',
      'Up to 75 proposals / month',
    ],
    cta: 'Pick Quick Estimation',
    highlight: true,
  },
  {
    name: 'Full Assessment',
    price: 249,
    tagline: 'For estimating teams running real volume on commercial roofs.',
    features: [
      'Everything in Quick Estimation',
      'Drone & satellite roof takeoffs',
      'Drainage, slope, and penetration mapping',
      'Multi-user accounts with approvals',
      'Unlimited proposals + priority support',
    ],
    cta: 'Go Full Assessment',
    highlight: false,
  },
];

export default function Page() {
  return (
    <>
      <section className="bg-[var(--nd)] text-[var(--wh)]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--sv)]">
            Products
          </div>
          <h1
            className="mt-4 text-5xl md:text-6xl"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            Pick the plan that fits how you bid
          </h1>
          <p className="mt-5 text-[var(--sl)] max-w-2xl mx-auto">
            Month-to-month, cancel anytime. Every plan includes the full PDF
            generator — pick the level of estimating muscle you need on top.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 -mt-12 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`p-8 flex flex-col border ${
                p.highlight
                  ? 'bg-[var(--wh)] border-[var(--nd)] shadow-2xl md:-translate-y-4'
                  : 'bg-[var(--wh)] border-[var(--rl)]'
              }`}
            >
              {p.highlight && (
                <div className="self-start mb-4 px-2 py-1 bg-[var(--nd)] text-[var(--wh)] text-[10px] uppercase tracking-widest">
                  Most popular
                </div>
              )}
              <div
                className="text-2xl text-[var(--nd)] tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {p.name}
              </div>
              <p className="mt-2 text-sm text-[var(--ir)] min-h-[3rem]">
                {p.tagline}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className="text-6xl text-[var(--nd)]"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  ${p.price}
                </span>
                <span className="text-sm text-[var(--ir)]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ink)] flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-[var(--nd)] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-8 text-center py-3 font-semibold ${
                  p.highlight
                    ? 'bg-[var(--nd)] text-[var(--wh)] hover:bg-[var(--nm)]'
                    : 'bg-[var(--fg)] text-[var(--nd)] border border-[var(--rl)] hover:bg-[var(--sl)]'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-[var(--ir)]">
          Need more than Full Assessment? <Link href="/about" className="text-[var(--nd)] font-semibold underline underline-offset-4">Talk to us about Enterprise</Link>.
        </div>
      </section>
    </>
  );
}

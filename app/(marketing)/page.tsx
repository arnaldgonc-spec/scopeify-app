import Link from 'next/link';
import { CtaBand, Eyebrow, SectionHead, Stars } from '@/components/Marketing/sections';

const HERO_STATS = [
  { value: '5 min', label: 'Average time to a finished proposal' },
  { value: '4-page', label: 'Branded PDF, ready to send' },
  { value: '3 ways', label: 'Build, estimate or fully assess' },
];

const STEPS = [
  {
    n: '01',
    title: 'Enter the roof',
    desc: 'Type in measurements, system type and site details — or upload photos for a full inspection. No spreadsheets, no templates.',
  },
  {
    n: '02',
    title: 'AI does the writing',
    desc: 'Scopeify drafts the scope of work, prices it against regional cost data and, on assessments, flags visible damage from your photos.',
  },
  {
    n: '03',
    title: 'Send the PDF',
    desc: 'Download a clean, four-page proposal on your letterhead — logo, license, certifications and pricing all in place.',
  },
];

const FEATURES = [
  {
    title: 'AI scope of work',
    desc: 'Plain-English scope narratives that use the right membrane, fastening and tapered-insulation language for the job.',
    icon: (
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    title: 'Regional pricing',
    desc: 'Estimates built from real regional cost data, so your numbers hold up whether you bid in Texas or upstate New York.',
    icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
  },
  {
    title: 'Photo damage analysis',
    desc: 'Upload site photos and let the AI surface visible damage with a confidence-scored read before you commit a price.',
    icon: (
      <>
        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
  },
  {
    title: 'Branded PDF output',
    desc: 'Every proposal carries your logo, license number and certifications — the same polished document, every single time.',
    icon: <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8" />,
  },
];

const PRODUCTS = [
  { name: 'PDF Generator', price: '$99', tag: 'You set the price', popular: false },
  { name: 'Quick Estimation', price: '$149', tag: 'AI prices the job', popular: true },
  { name: 'Full Assessment', price: '$249', tag: 'AI inspects the photos', popular: false },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section style={{ background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)',
          }}
        />
        <div className="mkt-grid-bg" />
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -160,
            width: 640,
            height: 640,
            background: 'radial-gradient(circle,rgba(180,200,220,0.09) 0%,transparent 62%)',
          }}
        />
        <div className="mkt-wrap" style={{ position: 'relative', padding: '92px 32px 84px' }}>
          <div style={{ maxWidth: 780 }}>
            <Eyebrow tone="dark">Commercial Roofing Software</Eyebrow>
            <h1 className="mkt-display mkt-hero-h1" style={{ color: '#fff', margin: '22px 0 22px' }}>
              Get commercial roofing reports in minutes, not days
            </h1>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.58)',
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: 548,
                marginBottom: 34,
              }}
            >
              Scopeify turns roof measurements and site photos into branded, AI-written proposals and
              assessment reports — so you can bid the job before your competition has opened their laptop.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 46 }}>
              <Link href="/login" className="mkt-btn mkt-btn-light">Start Free →</Link>
              <Link href="/products" className="mkt-btn mkt-btn-line">View Products</Link>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 0,
                flexWrap: 'wrap',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: 26,
              }}
            >
              {HERO_STATS.map((s, i) => (
                <div
                  key={s.value}
                  style={{
                    paddingRight: 30,
                    paddingLeft: i === 0 ? 0 : 30,
                    borderRight: i < HERO_STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 34,
                      color: 'var(--sl)',
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', fontWeight: 300, maxWidth: 150 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)' }}>
        <div
          className="mkt-wrap"
          style={{
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--mt)',
            }}
          >
            Built for the work you actually do
          </span>
          <span style={{ color: 'var(--rl)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--ir)', fontWeight: 300 }}>
            TPO &nbsp;·&nbsp; EPDM &nbsp;·&nbsp; Modified Bitumen &nbsp;·&nbsp; Metal &nbsp;·&nbsp; Tapered Systems
          </span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="How It Works"
            title="Three steps from the roof to a signed proposal"
            sub="No design skills, no boilerplate to maintain. Scopeify handles the writing and the layout so you can stay focused on winning the job."
          />
          <div className="mkt-grid-3">
            {STEPS.map((s) => (
              <div key={s.n} className="mkt-card" style={{ padding: '30px 28px' }}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 44,
                    color: 'var(--sv)',
                    lineHeight: 1,
                    marginBottom: 14,
                  }}
                >
                  {s.n}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 21,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--nd)',
                    marginBottom: 10,
                  }}
                >
                  {s.title}
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mkt-section" style={{ background: '#f1f4f9' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="What's Inside"
            title="The estimating team you didn't have to hire"
            sub="Every proposal runs through the same workflow your best estimator would — only it finishes before the coffee's cold."
          />
          <div className="mkt-grid-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="mkt-card mkt-card-hover"
                style={{ padding: '28px 28px', display: 'flex', gap: 18 }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    background: 'var(--nd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sv)" strokeWidth="1.6">
                    {f.icon}
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--nd)',
                      marginBottom: 8,
                    }}
                  >
                    {f.title}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="Products"
            title="Pick the plan that fits the job"
            sub="Three plans, one professional PDF at the end of all of them. Move up only when the work calls for it."
          />
          <div className="mkt-grid-3">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="mkt-card mkt-card-hover"
                style={{
                  padding: '28px 26px',
                  position: 'relative',
                  borderColor: p.popular ? 'var(--nv)' : 'var(--rl)',
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
                      padding: '4px 10px',
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--mt)',
                    marginBottom: 14,
                  }}
                >
                  {p.tag}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 23,
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: 'var(--nd)',
                    marginBottom: 10,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 46, color: 'var(--nd)', lineHeight: 1 }}>
                    {p.price}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--mt)', fontWeight: 300 }}>/month</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/products" className="mkt-btn mkt-btn-ghost">Compare all products →</Link>
          </div>
        </div>
      </section>

      {/* RESULTS TEASER */}
      <section className="mkt-section" style={{ background: '#f1f4f9' }}>
        <div className="mkt-wrap">
          <div
            className="mkt-card"
            style={{ padding: '52px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <Stars size={16} />
            <p
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: 23,
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.55,
                maxWidth: 720,
                margin: '20px 0 24px',
              }}
            >
              &ldquo;I used to burn a whole Saturday every week formatting proposals in Word. Now I run a Quick
              Estimate from the truck before I&apos;ve pulled out of the lot.&rdquo;
            </p>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--nd)',
              }}
            >
              Marcus Bell
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--mt)', fontWeight: 300, marginTop: 3 }}>
              Owner, Bell &amp; Sons Commercial Roofing · Columbus, OH
            </div>
            <div style={{ marginTop: 28 }}>
              <Link href="/results" className="mkt-btn mkt-btn-ghost">Read customer results →</Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Your next proposal could be done before lunch"
        sub="Start free and generate your first branded roofing proposal today — no credit card, no setup call."
      />
    </>
  );
}

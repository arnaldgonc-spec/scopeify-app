import type { Metadata } from 'next';
import { CtaBand, Eyebrow, PageHero, SectionHead } from '@/components/Marketing/sections';

export const metadata: Metadata = {
  title: 'About Us – Scopeify',
  description:
    'Scopeify builds proposal and assessment software for commercial roofing contractors who would rather be on the roof than in a Word document.',
};

const VALUES = [
  {
    title: 'The roof comes first',
    desc: 'We build around how crews actually work — measurements on a clipboard, photos on a phone — not how software people imagine the trade.',
    icon: <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" />,
  },
  {
    title: 'Speed is respect',
    desc: 'A fast proposal respects the contractor’s evening and the client’s timeline. Slow paperwork loses jobs that good crews should win.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    ),
  },
  {
    title: 'Boringly reliable',
    desc: 'The same clean, branded document every time, from every person on your team. No surprises, no off-brand formatting, no last-minute fixes.',
    icon: <path d="M9 12l2 2 4-4M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />,
  },
  {
    title: 'You stay in control',
    desc: 'The AI drafts; the contractor decides. Every scope and every number is yours to review and change before it ever leaves your hands.',
    icon: (
      <>
        <path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const NUMBERS = [
  { value: '2,400+', label: 'Cities with completed proposals' },
  { value: '6', label: 'Roof systems supported end to end' },
  { value: '99.9%', label: 'Uptime for proposal generation' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="We build tools for the people on the roof"
        sub="Scopeify is software for commercial roofing contractors who would rather be measuring a deck than fighting with a Word template at 9pm."
      />

      {/* STORY */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <div
            className="mkt-grid-2"
            style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 56, alignItems: 'start' }}
          >
            <div>
              <Eyebrow>Our Story</Eyebrow>
              <h2 className="mkt-display mkt-h2" style={{ color: 'var(--nd)', margin: '16px 0 0' }}>
                It started with a stack of lost bids
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p style={{ fontSize: 15, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.8 }}>
                We spent a year riding along with commercial roofing crews — climbing ladders, watching
                inspections, sitting in trucks while estimators typed proposals one finger at a time. The roofing
                was sharp. The paperwork was where good companies were quietly losing.
              </p>
              <p style={{ fontSize: 15, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.8 }}>
                A property manager would request three bids. The national outfit had a polished proposal back the
                same day. The smaller contractor — often the better roofer — needed until the end of the week, and
                by then the decision was already leaning the other way. The job wasn&apos;t lost on the roof. It was
                lost in the formatting.
              </p>
              <p style={{ fontSize: 15, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.8 }}>
                So we built Scopeify: AI that writes the scope, prices the work against real regional data, reads
                the inspection photos, and lays it all into a branded PDF in minutes. The goal is simple — give
                every contractor the speed and polish of a national company, without hiring one more person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mkt-section" style={{ background: '#f1f4f9' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="What We Believe"
            title="The principles behind the product"
            sub="Four ideas decide what we build and what we leave out."
          />
          <div className="mkt-grid-2">
            {VALUES.map((v) => (
              <div
                key={v.title}
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
                    {v.icon}
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
                    {v.title}
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section className="mkt-section" style={{ background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
        <div className="mkt-grid-bg" />
        <div className="mkt-wrap" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Eyebrow tone="dark" align="center">By The Numbers</Eyebrow>
            <h2 className="mkt-display mkt-h2" style={{ color: '#fff', margin: '16px 0 0' }}>
              Where Scopeify is today
            </h2>
          </div>
          <div className="mkt-grid-3">
            {NUMBERS.map((n, i) => (
              <div
                key={n.label}
                style={{
                  textAlign: 'center',
                  padding: '8px 20px',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 60,
                    color: 'var(--sl)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {n.value}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'rgba(255,255,255,0.45)',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {n.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Build your next proposal with us"
        sub="Join the contractors who stopped losing jobs to slow paperwork. Your first proposal is free."
        secondaryHref="/results"
        secondaryLabel="See Results"
      />
    </>
  );
}

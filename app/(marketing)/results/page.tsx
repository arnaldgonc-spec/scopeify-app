import type { Metadata } from 'next';
import { CtaBand, Eyebrow, PageHero, SectionHead, Stars } from '@/components/Marketing/sections';

export const metadata: Metadata = {
  title: 'Results – Scopeify',
  description:
    'How commercial roofing contractors use Scopeify to win more bids and get hours of their week back.',
};

const STATS = [
  { value: '11,000+', label: 'Proposals generated' },
  { value: '4.5 hrs', label: 'Saved on the average proposal' },
  { value: '1,300+', label: 'Roofing contractors on board' },
  { value: '32%', label: 'Higher win rate reported' },
];

const FEATURED = {
  quote:
    "We're a second-generation outfit — my dad still asks why we need software to do what a typewriter handled fine in 1985. Here's what changed his mind. Last spring a hailstorm came through and every contractor in the county was chasing the same forty buildings. We had assessments and priced proposals sitting in the property managers' inboxes the same afternoon, and we booked nine of those roofs. The other crews were still up there measuring. That one month paid for Scopeify for about the next decade.",
  name: 'Sandra Whitcomb',
  role: 'Vice President',
  company: 'Whitcomb Roofing & Sheet Metal',
  location: 'Kansas City, MO',
};

const TESTIMONIALS = [
  {
    quote:
      "I used to burn a whole Saturday every week formatting proposals in Word. Now I run a Quick Estimate from the truck before I've pulled out of the parking lot. We closed two re-roofs last month I honestly wouldn't have gotten to in time the old way.",
    name: 'Marcus Bell',
    role: 'Owner',
    company: 'Bell & Sons Commercial Roofing',
    location: 'Columbus, OH',
  },
  {
    quote:
      "A property manager told me my proposal looked sharper than the national company that bid against me. We're a seven-person shop. That first impression is the whole game for us, and now every proposal goes out looking like that one did.",
    name: 'Diana Reyes',
    role: 'Lead Estimator',
    company: 'Reyes Roofing Group',
    location: 'San Antonio, TX',
  },
  {
    quote:
      "I was sure the AI scope writing would make more work than it saved. It's the opposite. It gets the tapered insulation and TPO membrane language right, and I just adjust a detail or two before it ships. My crew leads actually read the scopes now.",
    name: 'Anthony Caruso',
    role: 'President',
    company: 'Lakeshore Commercial Exteriors',
    location: 'Milwaukee, WI',
  },
  {
    quote:
      "Before this, a full assessment meant my inspector's photos sitting on his phone for three days until someone had time to write it all up. Now the condition report is done before he's back at the shop. The faster turnaround is the reason we won the school district.",
    name: 'Renee Holloway',
    role: 'Operations Manager',
    company: 'Gulf Coast Roofing Partners',
    location: 'Tampa, FL',
  },
  {
    quote:
      "The pricing wasn't a hard call. One extra job a month covers the Full Assessment plan many times over. I stopped thinking of it as software and started thinking of it as the cheapest estimator I've ever put on payroll.",
    name: 'Kevin Tran',
    role: 'Owner',
    company: 'Summit Flat Roof Co.',
    location: 'Sacramento, CA',
  },
  {
    quote:
      "What sold me was consistency. When three guys wrote our proposals we had three formats and three pricing styles. Now a client gets the same clean document whether it's from me or my nephew. Took fifteen years to get that — and one week with this tool.",
    name: 'Pat Donnelly',
    role: 'Co-Owner',
    company: 'Donnelly & Burke Roofing',
    location: 'Newark, NJ',
  },
];

export default function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Real contractors. Real time saved."
        sub="Roofing crews don't have spare hours to give away. Here is what changes when the proposal stops being the slowest part of the job."
      />

      {/* STATS */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--rl)' }}>
        <div className="mkt-wrap" style={{ padding: '44px 32px' }}>
          <div className="mkt-grid-4">
            {STATS.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 52,
                    color: 'var(--nd)',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--mt)',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <div
            className="mkt-card mkt-featured"
            style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.4fr', overflow: 'hidden' }}
          >
            <div
              style={{
                background: 'var(--nd)',
                padding: '44px 38px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div className="mkt-grid-bg" />
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 90,
                    color: 'var(--sv)',
                    lineHeight: 0.7,
                    opacity: 0.5,
                    marginBottom: 14,
                  }}
                >
                  &ldquo;
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--sv)',
                    marginBottom: 14,
                  }}
                >
                  Customer Spotlight
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    lineHeight: 1.1,
                  }}
                >
                  {FEATURED.name}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 300, marginTop: 8 }}>
                  {FEATURED.role}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
                  {FEATURED.company}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--sv)', fontWeight: 300, marginTop: 10 }}>
                  {FEATURED.location}
                </div>
              </div>
            </div>
            <div style={{ padding: '44px 42px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Stars size={15} />
              <p
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 17.5,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.7,
                  marginTop: 18,
                }}
              >
                {FEATURED.quote}
              </p>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 760px) { .mkt-featured { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* TESTIMONIAL GRID */}
      <section className="mkt-section" style={{ background: '#f1f4f9', paddingTop: 0 }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="In Their Words"
            title="Why crews stick with Scopeify"
            sub="Owners, estimators and operations managers on what actually changed once the paperwork stopped fighting back."
          />
          <div className="mkt-grid-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="mkt-card mkt-card-hover"
                style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column' }}
              >
                <Stars />
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--ink)',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    margin: '16px 0 22px',
                    flex: 1,
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ paddingTop: 16, borderTop: '1px solid var(--rl)' }}>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: 'var(--nd)',
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--mt)', fontWeight: 300, marginTop: 3 }}>
                    {t.role}, {t.company}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--nv)', fontWeight: 400, marginTop: 4 }}>
                    {t.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 44, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <Eyebrow align="center">Join Them</Eyebrow>
              <p style={{ fontSize: 14, color: 'var(--ir)', fontWeight: 300, maxWidth: 440, lineHeight: 1.7 }}>
                The next contractor on this page could be you. Your first proposal is free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Get the same hours back"
        sub="Start free and see what your week looks like when proposals take minutes instead of evenings."
        secondaryHref="/products"
        secondaryLabel="View Products"
      />
    </>
  );
}

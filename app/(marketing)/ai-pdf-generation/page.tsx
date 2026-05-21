import type { Metadata } from 'next';
import { CtaBand, PageHero, SectionHead } from '@/components/Marketing/sections';

export const metadata: Metadata = {
  title: 'AI PDF Generation – Scopeify',
  description:
    'How Scopeify turns roof inputs into a branded, AI-written four-page commercial roofing proposal PDF in minutes.',
};

const PIPELINE = [
  {
    n: '01',
    title: 'You give it the facts',
    desc: 'Roof size, system type, deck condition, access notes — plus photos when you want a full assessment. The kind of detail you already gather on site.',
  },
  {
    n: '02',
    title: 'The AI writes the scope',
    desc: 'Scopeify drafts a complete scope-of-work narrative, prices it against regional cost data, and reads any uploaded photos for visible damage.',
  },
  {
    n: '03',
    title: 'It renders your PDF',
    desc: 'Everything is laid out into a branded four-page document — your logo, license and certifications applied automatically. You review and send.',
  },
];

const WRITES = [
  'Scope-of-work narrative in clear, client-ready language',
  'Correct membrane, fastening and tapered-insulation terminology',
  'Tear-off, decking and detail work spelled out line by line',
  'Roof condition summary written from your photos',
  'Confidence-scored damage findings on full assessments',
  'Pricing notes that match the regional market you bid in',
];

const PAGES = [
  { n: 'Page 1', title: 'Cover', desc: 'Your branding, the client, the property address and the proposal number.' },
  { n: 'Page 2', title: 'Scope of Work', desc: 'The AI-written narrative — what gets done, in the order it gets done.' },
  { n: 'Page 3', title: 'Pricing & Terms', desc: 'Itemised pricing, payment terms and the conditions of the bid.' },
  { n: 'Page 4', title: 'Warranty', desc: 'Workmanship and manufacturer warranty coverage, plus your certifications.' },
];

export default function AiPdfGenerationPage() {
  return (
    <>
      <PageHero
        eyebrow="AI PDF Generation"
        title="Proposals that write themselves"
        sub="Scopeify pairs AI scope writing with automated document rendering. You bring the roof details — it returns a finished, branded PDF you would be proud to put your name on."
      />

      {/* PIPELINE */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="The Pipeline"
            title="From rough notes to a finished document"
            sub="Three stages, fully automated. The longest part is you deciding what to charge."
          />
          <div className="mkt-grid-3">
            {PIPELINE.map((s) => (
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

      {/* WHAT THE AI WRITES */}
      <section className="mkt-section" style={{ background: '#f1f4f9' }}>
        <div className="mkt-wrap">
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 56, alignItems: 'center' }}
            className="mkt-grid-2"
          >
            <div>
              <SectionHead
                eyebrow="What The AI Writes"
                title="It speaks roofing, not marketing"
                sub="The scope language is drafted to read the way a seasoned estimator writes — specific, ordered and free of filler. You stay in control: review every line and adjust before it ships."
                align="left"
              />
            </div>
            <div className="mkt-card" style={{ padding: '14px 28px' }}>
              {WRITES.map((w, i) => (
                <div
                  key={w}
                  style={{
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    padding: '15px 0',
                    borderBottom: i < WRITES.length - 1 ? '1px solid var(--rl)' : 'none',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--nv)"
                    strokeWidth="2.4"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 400, lineHeight: 1.55 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PDF ANATOMY */}
      <section className="mkt-section" style={{ background: '#fff' }}>
        <div className="mkt-wrap">
          <SectionHead
            eyebrow="The Document"
            title="Anatomy of a Scopeify proposal"
            sub="Every proposal lands as the same clean four-page PDF — consistent whoever on your team generated it."
          />
          <div className="mkt-grid-4">
            {PAGES.map((p) => (
              <div key={p.n} className="mkt-card mkt-card-hover" style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    background: 'var(--nd)',
                    padding: '20px 22px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)',
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--sv)',
                      marginBottom: 6,
                    }}
                  >
                    {p.n}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 19,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: '#fff',
                    }}
                  >
                    {p.title}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.7, padding: '20px 22px' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="See your branding on a finished proposal"
        sub="Generate your first AI-written PDF free. Add your logo once and it carries through every proposal after."
        secondaryLabel="See Products"
      />
    </>
  );
}

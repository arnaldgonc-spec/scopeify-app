export const metadata = { title: 'Results — Scopeify' };

const STATS = [
  ['38', '%', 'Average faster bid turnaround'],
  ['3.1', '×', 'More proposals per estimator'],
  ['30', '%', 'Average close-rate lift'],
  ['150', '+', 'Roofing companies using Scopeify'],
] as const;

const TESTIMONIALS = [
  {
    initials: 'MH',
    quote:
      'We were spending three to four hours on every proposal — measure-ups, pricing, formatting, the whole song and dance. With Scopeify our estimators are out the door in under thirty minutes. We closed two extra deals last month just because we got the bids in first.',
    name: 'Marcus Halloran',
    role: 'VP of Estimating · Halloran Commercial Roofing · Cleveland, OH',
  },
  {
    initials: 'DP',
    quote:
      'Honestly, I was skeptical. I’ve watched a lot of “AI” tools spit out garbage that I had to rewrite anyway. Scopeify is different — it reads our photos, pulls real numbers, and the PDF looks like one of my senior guys wrote it. I had to read the first one twice to make sure he hadn’t.',
    name: 'Denise Park',
    role: 'Owner · Park & Sons Roofing · Austin, TX',
  },
  {
    initials: 'AV',
    quote:
      'What sold me was the consistency. Before, every estimator’s proposal looked a little different — different exclusions, different formatting, some better than others. Now every bid that goes out the door looks like it came from the same company, because it did.',
    name: 'Anthony Vega',
    role: 'Director of Operations · Crownline Roofing Group · Phoenix, AZ',
  },
  {
    initials: 'KW',
    quote:
      'Our close rate went from around 22% to just over 31% in five months. I can’t pin that all on Scopeify, but the speed-to-bid is real — we’re getting in front of building owners while our competitors are still measuring up. That changes everything.',
    name: 'Karen Whitfield',
    role: 'General Manager · Whitfield Industrial Roofing · Charlotte, NC',
  },
  {
    initials: 'LR',
    quote:
      'I run a four-person shop. I used to lose nights and weekends formatting proposals after a full day on the roof. Now I dictate notes from the truck, snap photos, and have a real PDF ready before I’m home for dinner. That alone is worth the subscription ten times over.',
    name: 'Luis Ramírez',
    role: 'Owner / Estimator · Ramírez Roofing Solutions · San Antonio, TX',
  },
  {
    initials: 'PA',
    quote:
      'The Full Assessment tier paid for itself the first week. The drone takeoff on a 180,000 square foot warehouse used to mean a full day on site and another half day in the office. Scopeify did it from imagery in twenty minutes, and the numbers matched our manual measure within 1.4%.',
    name: 'Priya Anand',
    role: 'Chief Estimator · Anand Roofing & Sheet Metal · Newark, NJ',
  },
];

export default function ResultsPage() {
  return (
    <>
      <section className="dark results-hero ticks">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" />
        <div className="vignette" />
        <div className="wrap">
          <span className="eyebrow rv">
            <span className="ln" />
            Results
          </span>
          <h1 className="ph rv" style={{ maxWidth: '820px' }}>
            What contractors are saying about Scopeify
          </h1>
          <p
            className="phlead rv"
            style={{ marginLeft: 0, textAlign: 'left' }}
          >
            Scopeify is trusted by real commercial roofers. Here are some of our
            reviews.
          </p>
        </div>
      </section>

      <div className="stats">
        <div
          className="wrap stats-in"
          style={{ gridTemplateColumns: 'repeat(4,1fr)' }}
        >
          {STATS.map(([n, u, label]) => (
            <div key={label} className="stat rv">
              <div className="n">
                {n}
                <span className="u">{u}</span>
              </div>
              <div className="l">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="block" style={{ paddingTop: '74px' }}>
        <div className="wrap">
          <div className="tgrid">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="tcard rv">
                <div className="qm">“</div>
                <blockquote>{t.quote}</blockquote>
                <div className="rule" />
                <figcaption className="who">
                  <span className="av">{t.initials}</span>
                  <div>
                    <div className="nm">{t.name}</div>
                    <div className="rl">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

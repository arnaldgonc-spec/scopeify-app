export const metadata = { title: 'Results — Scopeify' };

const TESTIMONIALS = [
  {
    quote:
      "We were spending three to four hours on every proposal — measure-ups, pricing, formatting, the whole song and dance. With Scopeify our estimators are out the door in under thirty minutes. We closed two extra deals last month just because we got the bids in first.",
    name: 'Marcus Halloran',
    role: 'VP of Estimating',
    company: 'Halloran Commercial Roofing',
    location: 'Cleveland, OH',
    metric: '4.2× more bids per estimator',
  },
  {
    quote:
      "Honestly, I was skeptical. I've watched a lot of 'AI' tools spit out garbage that I had to rewrite anyway. Scopeify is different — it reads our photos, pulls real numbers, and the PDF looks like one of my senior guys wrote it. I had to read the first one twice to make sure he hadn't.",
    name: 'Denise Park',
    role: 'Owner',
    company: 'Park & Sons Roofing',
    location: 'Austin, TX',
    metric: '$340k closed in first quarter',
  },
  {
    quote:
      "What sold me was the consistency. Before, every estimator's proposal looked a little different — different exclusions, different formatting, some better than others. Now every bid that goes out the door looks like it came from the same company, because it did.",
    name: 'Anthony Vega',
    role: 'Director of Operations',
    company: 'Crownline Roofing Group',
    location: 'Phoenix, AZ',
    metric: '100% on-brand proposals',
  },
  {
    quote:
      "Our close rate went from around 22% to just over 31% in five months. I can't pin that all on Scopeify, but the speed-to-bid is real — we're getting in front of building owners while our competitors are still measuring up. That changes everything.",
    name: 'Karen Whitfield',
    role: 'General Manager',
    company: 'Whitfield Industrial Roofing',
    location: 'Charlotte, NC',
    metric: 'Close rate 22% → 31%',
  },
  {
    quote:
      "I run a four-person shop. I used to lose nights and weekends formatting proposals after a full day on the roof. Now I dictate notes from the truck, snap photos, and have a real PDF ready before I'm home for dinner. That alone is worth the subscription ten times over.",
    name: 'Luis Ramírez',
    role: 'Owner / Estimator',
    company: 'Ramírez Roofing Solutions',
    location: 'San Antonio, TX',
    metric: 'Got his evenings back',
  },
  {
    quote:
      "The Full Assessment tier paid for itself the first week. The drone takeoff on a 180,000 square foot warehouse used to mean a full day on site and another half day in the office. Scopeify did it from imagery in twenty minutes, and the numbers matched our manual measure within 1.4%.",
    name: 'Priya Anand',
    role: 'Chief Estimator',
    company: 'Anand Roofing & Sheet Metal',
    location: 'Newark, NJ',
    metric: '1.4% variance vs. manual takeoff',
  },
];

export default function Page() {
  return (
    <>
      <section className="bg-[var(--nd)] text-[var(--wh)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-xs uppercase tracking-widest text-[var(--sv)]">
            Results
          </div>
          <h1
            className="mt-4 text-5xl md:text-6xl max-w-3xl"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            What contractors are saying about Scopeify
          </h1>
          <p className="mt-6 text-lg text-[var(--sl)] max-w-2xl">
            Scopeify is trusted by real commercial roofers. Here are some of our reviews.
          </p>
        </div>
      </section>

      <section className="bg-[var(--fg)] border-y border-[var(--rl)]">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['38%', 'Average faster bid turnaround'],
            ['3.1×', 'More proposals per estimator'],
            ['30%', 'Average close-rate lift'],
            ['150+', 'Roofing Companies using Scopeify'],
          ].map(([n, l]) => (
            <div key={l}>
              <div
                className="text-4xl text-[var(--nd)]"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {n}
              </div>
              <div className="text-xs uppercase tracking-widest text-[var(--ir)] mt-1">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-[var(--wh)] border border-[var(--rl)] p-8 flex flex-col"
            >
              <div
                className="text-5xl text-[var(--sv)] leading-none mb-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                &ldquo;
              </div>
              <blockquote className="text-[var(--ink)] leading-relaxed flex-1">
                {t.quote}
              </blockquote>
              <div className="mt-6 pt-6 border-t border-[var(--rl)] flex items-start justify-between gap-4">
                <figcaption>
                  <div className="font-semibold text-[var(--nd)]">{t.name}</div>
                  <div className="text-sm text-[var(--ir)]">{t.role}</div>
                  <div className="text-sm text-[var(--ir)]">
                    {t.company} · {t.location}
                  </div>
                </figcaption>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--ir)]">
                    Result
                  </div>
                  <div className="text-sm font-semibold text-[var(--nd)] max-w-[10rem]">
                    {t.metric}
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}

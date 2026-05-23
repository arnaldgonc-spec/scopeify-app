export const metadata = { title: 'About Us — Scopeify' };

const VALUES = [
  {
    title: 'Built by people who hated writing proposals',
    body: 'Our founding team spent a combined decade in commercial roofing estimating. Scopeify exists because we got tired of losing weekends to PDF formatting.',
  },
  {
    title: 'AI that knows its place',
    body: "We don't use AI to invent numbers. We use it to read photos, draft language, and stitch together the boring parts — your pricing and your judgment stay yours.",
  },
  {
    title: 'Honest pricing, honest software',
    body: 'No annual lock-ins, no per-seat surprises, no "talk to sales" walls before you can try it. Pay monthly. Cancel any time.',
  },
];

export default function Page() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2
            className="text-4xl text-[var(--nd)]"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            Our story
          </h2>
          <div className="mt-4 space-y-4 text-[var(--ir)] leading-relaxed">
            <p>
              Scopeify started in 2023 in a contractor's back office in Cleveland. The
              founder, a third-generation roofer, was watching his estimators spend
              more time in Word than on rooftops — and losing bids because the
              fastest contractor, not the best one, was winning the job.
            </p>
            <p>
              We built the first version for his crew. Word got out, other shops
              asked for it, and a year later we were running proposals for hundreds
              of contractors across North America.
            </p>
            <p>
              We're still small. We answer our own support tickets. And we still
              think commercial roofing deserves better software than it's gotten for
              the last thirty years.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-[var(--wh)] border border-[var(--rl)] p-6">
              <h3 className="font-semibold text-[var(--nd)]">{v.title}</h3>
              <p className="mt-2 text-sm text-[var(--ir)] leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--nd)] text-[var(--wh)]">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-8 text-center">
          {[
            ['2023', 'Founded in Cleveland, OH'],
            ['18', 'People on the team'],
            ['600+', 'Roofing companies served'],
          ].map(([n, l]) => (
            <div key={l}>
              <div
                className="text-5xl text-[var(--sv)]"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {n}
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest text-[var(--sl)]">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

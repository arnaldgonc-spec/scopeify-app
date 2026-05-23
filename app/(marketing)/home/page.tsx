import Link from 'next/link';

export const metadata = {
  title: 'Scopeify – Commercial roofing reports in minutes',
};

const FEATURES = [
  {
    title: 'Photo-to-report in one upload',
    body: 'Drop in site photos and a quick scope. Scopeify drafts the measurements narrative, materials list, and executive summary while you grab coffee.',
  },
  {
    title: 'Numbers your estimator trusts',
    body: 'Square footage, slope, drainage, and tear-off estimates are checked against your historical jobs — not a generic template.',
  },
  {
    title: 'On-brand PDFs, every time',
    body: 'Your logo, your colors, your terms. The output looks like your senior estimator wrote it, because it learned from the ones who did.',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--nd)] text-[var(--wh)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(var(--nm) 1px, transparent 1px), linear-gradient(90deg, var(--nm) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--nm)] text-[var(--sl)] text-xs tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-[var(--sv)]" /> Built for commercial roofers
            </div>
            <h1
              className="mt-6 text-5xl md:text-7xl leading-[0.95] tracking-tight"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Get commercial roofing reports in minutes, not days
            </h1>
            <p className="mt-6 text-lg text-[var(--sl)] max-w-2xl">
              Scopeify turns site photos and a few notes into a complete,
              client-ready proposal — pricing, scope, and PDF included. Built
              for the way commercial roofing actually gets sold.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="px-6 py-3 bg-[var(--sv)] text-[var(--nd)] font-semibold hover:bg-[var(--sl)] transition-colors"
              >
                Start free trial
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border border-[var(--nm)] text-[var(--sl)] hover:bg-[var(--nm)] transition-colors"
              >
                See pricing
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-[var(--sv)] uppercase tracking-widest">
              <span>No credit card</span>
              <span className="w-px h-3 bg-[var(--nm)]" />
              <span>Cancel anytime</span>
              <span className="w-px h-3 bg-[var(--nm)]" />
              <span>SOC 2 in progress</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="bg-[var(--nv)] border border-[var(--nm)] p-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-[var(--sv)] uppercase tracking-widest mb-4">
                <span>Proposal #2026-0142</span>
                <span>Draft · 38s</span>
              </div>
              <div
                className="text-2xl text-[var(--wh)] tracking-wide"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                Northgate Logistics — Roof Replacement
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                {[
                  ['Sq Ft', '84,200'],
                  ['System', 'TPO 60mil'],
                  ['Total', '$612,400'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[var(--nd)] p-3">
                    <div className="text-[10px] uppercase text-[var(--sv)] tracking-widest">{k}</div>
                    <div className="mt-1 text-[var(--wh)] font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {['Tear-off existing EPDM', 'Install new 60mil TPO membrane', '24 roof drains, 6 scuppers', '15-yr NDL warranty'].map((line) => (
                  <div key={line} className="flex items-start gap-2 text-sm text-[var(--sl)]">
                    <span className="mt-1 w-1.5 h-1.5 bg-[var(--sv)] shrink-0" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <button className="mt-5 w-full py-2 bg-[var(--sv)] text-[var(--nd)] text-sm font-semibold">
                Generate PDF →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--fg)] border-y border-[var(--rl)]">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
          {[
            ['12,400+', 'Proposals generated'],
            ['$1.8B', 'Roofing work scoped'],
            ['38 min', 'Avg time saved per job'],
            ['96%', 'Estimator approval rate'],
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

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-[var(--ir)]">
            What you get
          </div>
          <h2
            className="mt-3 text-4xl md:text-5xl text-[var(--nd)]"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            Less paperwork. More roofs.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[var(--wh)] border border-[var(--rl)] p-6">
              <div className="w-10 h-10 bg-[var(--nd)] hex-clip mb-4" />
              <h3 className="text-lg font-semibold text-[var(--nd)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--ir)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--nd)] text-[var(--wh)]">
        <div className="mx-auto max-w-7xl px-6 py-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Try it on your next bid
            </h2>
            <p className="mt-3 text-[var(--sl)] max-w-xl">
              Spin up a proposal in under five minutes. No setup, no sales call.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-3 bg-[var(--sv)] text-[var(--nd)] font-semibold hover:bg-[var(--sl)]"
            >
              Start free trial
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 border border-[var(--nm)] text-[var(--sl)] hover:bg-[var(--nm)]"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

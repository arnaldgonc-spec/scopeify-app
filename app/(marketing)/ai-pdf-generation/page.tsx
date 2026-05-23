import Link from 'next/link';

export const metadata = { title: 'AI PDF Generation — Scopeify' };

const STEPS = [
  {
    n: '01',
    title: 'Answer a quick form',
    body: 'Tell Scopeify the basics: building type, system, scope of work, and any client-specific notes. Takes under two minutes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Upload your photos',
    body: 'Drag in roof photos, drone shots, and any extra context from the walk. Scopeify reads layouts, drains, penetrations, and existing-system clues.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M3 6h18v13H3z" />
        <path d="M3 16l5-5 4 4 3-3 6 6" />
        <circle cx="8" cy="10" r="1.5" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Generate the PDF',
    body: 'Branded cover page, executive summary, scope, exclusions, and signature block — exported as a clean, client-ready PDF in seconds.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

export default function Page() {
  return (
    <>
      <section className="bg-[var(--nd)] text-[var(--wh)]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-xs uppercase tracking-widest text-[var(--sv)]">
            AI PDF Generation
          </div>
          <h1
            className="mt-4 text-5xl md:text-6xl max-w-3xl"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            From site photos to a client-ready PDF
          </h1>
          <p className="mt-6 text-lg text-[var(--sl)] max-w-2xl">
            The reports your estimators used to spend half a day on — drafted by
            Scopeify in under five minutes, in your branding, ready to send.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative">
          <div
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--rl) 0 8px, transparent 8px 16px)',
            }}
            aria-hidden
          />
          <div className="relative grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-[var(--nd)] text-[var(--sv)] flex items-center justify-center shadow-lg">
                    <div className="w-10 h-10">{s.icon}</div>
                  </div>
                  <div
                    className="absolute -top-3 -right-3 w-10 h-10 bg-[var(--sv)] text-[var(--nd)] flex items-center justify-center text-sm font-bold border-4"
                    style={{ borderColor: 'var(--fg)' }}
                  >
                    {s.n}
                  </div>
                </div>
                <h3
                  className="mt-6 text-2xl text-[var(--nd)]"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--ir)] leading-relaxed max-w-xs">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-3">
          <Link
            href="/login"
            className="px-8 py-4 bg-[var(--nd)] text-[var(--wh)] font-semibold hover:bg-[var(--nm)] transition-colors"
          >
            Try it now — 2-Month Money-Back Guarantee
          </Link>
          <p className="text-xs uppercase tracking-widest text-[var(--ir)]">
            No credit card · Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';

export const metadata = { title: 'AI PDF Generation — Scopeify' };

const STEPS = [
  {
    n: '01',
    title: 'Upload your photos',
    body: 'Drag in roof photos, drone shots, and a few notes from the walk. Scopeify reads layouts, drains, penetrations, and existing system clues.',
  },
  {
    n: '02',
    title: 'Confirm the scope',
    body: 'Review the AI-drafted scope of work line by line. Edit anything; the pricing recalculates the moment you save.',
  },
  {
    n: '03',
    title: 'Generate the PDF',
    body: 'Branded cover page, executive summary, scope, exclusions, and signature block — exported as a clean, client-ready PDF in seconds.',
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
            From site photos to a signed-ready PDF
          </h1>
          <p className="mt-6 text-lg text-[var(--sl)] max-w-2xl">
            The reports your estimators used to spend half a day on — drafted by
            Scopeify in under five minutes, in your branding, ready to send.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-[var(--wh)] border border-[var(--rl)] p-6">
              <div
                className="text-5xl text-[var(--sv)]"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[var(--nd)]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--ir)] leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--wh)] border-y border-[var(--rl)]">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-4xl md:text-5xl text-[var(--nd)]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Built on the way your team already writes proposals
            </h2>
            <ul className="mt-6 space-y-3 text-[var(--ir)]">
              {[
                'Imports your line items, materials catalog, and standard exclusions.',
                'Keeps your historical pricing as the source of truth — not a generic AI guess.',
                'Lets you override any number, then re-flows the PDF instantly.',
                'Exports to PDF, DOCX, or sends straight to the client via signed link.',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 bg-[var(--nd)] shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="inline-block mt-8 px-6 py-3 bg-[var(--nd)] text-[var(--wh)] font-semibold hover:bg-[var(--nm)]"
            >
              Try it free →
            </Link>
          </div>
          <div className="bg-[var(--nd)] p-8 text-[var(--sl)]">
            <div className="text-xs uppercase tracking-widest text-[var(--sv)]">
              Sample output
            </div>
            <div
              className="mt-3 text-3xl text-[var(--wh)]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              Cedar Park Distribution Center
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[var(--nv)] p-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--sv)]">
                  Roof area
                </div>
                <div className="text-[var(--wh)] font-semibold">142,800 sq ft</div>
              </div>
              <div className="bg-[var(--nv)] p-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--sv)]">
                  System
                </div>
                <div className="text-[var(--wh)] font-semibold">Mech. fastened TPO</div>
              </div>
              <div className="bg-[var(--nv)] p-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--sv)]">
                  Warranty
                </div>
                <div className="text-[var(--wh)] font-semibold">20-yr NDL</div>
              </div>
              <div className="bg-[var(--nv)] p-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--sv)]">
                  Total
                </div>
                <div className="text-[var(--wh)] font-semibold">$1,142,600</div>
              </div>
            </div>
            <div className="mt-6 text-xs text-[var(--sv)] leading-relaxed">
              "Scope includes full tear-off of existing ballasted EPDM,
              installation of a new mechanically fastened 60mil TPO system over
              R-25 polyiso, all flashings, edge metal, and warranty
              registration..."
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

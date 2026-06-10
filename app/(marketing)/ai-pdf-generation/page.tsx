import Link from 'next/link';

export const metadata = { title: 'AI PDF Generation — Scopeify' };

export default function AiPdfGenerationPage() {
  return (
    <>
      <section className="dark ai-hero ticks">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" />
        <div className="vignette" />
        <div className="wrap">
          <span className="eyebrow rv">
            <span className="ln" />
            AI PDF Generation
          </span>
          <h1 className="ph rv" style={{ maxWidth: '780px' }}>
            From site photos to a client-ready PDF
          </h1>
          <p
            className="phlead rv"
            style={{ maxWidth: '600px', marginLeft: 0, marginRight: 0 }}
          >
            The reports your estimators used to spend half a day on — drafted by
            Scopeify in under five minutes, in your branding, ready to send.
          </p>
          <div className="cta-row rv" style={{ marginTop: '30px' }}>
            <Link className="btn btn-primary lg" href="/payment">
              Try it now <span className="ar">→</span>
            </Link>
            <Link className="btn btn-out" href="/products">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* THE WORKFLOW */}
      <section className="light-steps block">
        <div className="wrap">
          <div
            className="rv"
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span className="eyebrow">
              <span className="ln" />
              The workflow
              <span className="ln" />
            </span>
            <h2 className="sec">Three steps. Under five minutes.</h2>
          </div>
          <div className="steps rv">
            <div className="connector" />
            <div className="step">
              <div className="disc">
                <span className="num">01</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="4" y="3" width="16" height="18" />
                  <path d="M8 8h8M8 12h8M8 16h5" />
                </svg>
              </div>
              <h3>Answer a quick form</h3>
              <p>
                Tell Scopeify the basics: building type, system, scope of work,
                and any client-specific notes. Takes under two minutes.
              </p>
            </div>
            <div className="step">
              <div className="disc">
                <span className="num">02</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="14" />
                  <circle cx="8.5" cy="10" r="1.6" />
                  <path d="M3 17l5-4 4 3 4-4 5 5" />
                </svg>
              </div>
              <h3>Upload your photos</h3>
              <p>
                Drag in roof photos, drone shots, and any extra context from the
                walk. Scopeify reads layouts, drains, penetrations, and
                existing-system clues.
              </p>
            </div>
            <div className="step">
              <div className="disc">
                <span className="num">03</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 3v11m0 0l-4-4m4 4l4-4" />
                  <path d="M4 17v3h16v-3" />
                </svg>
              </div>
              <h3>Generate the PDF</h3>
              <p>
                Branded cover page, executive summary, scope, exclusions, and
                signature block — exported as a clean, client-ready PDF in
                seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE DELIVERABLE */}
      <section className="block">
        <div className="wrap">
          <div className="pdfwrap">
            <div className="rv">
              <span className="eyebrow">
                <span className="ln" />
                The deliverable
              </span>
              <h2 className="sec">
                Client-ready output,
                <br />
                not a rough draft
              </h2>
              <p className="sec-lead">
                Every export comes out formatted, branded, and structured the
                way a building owner expects to read it — nothing left to clean
                up.
              </p>
              <ul className="checklist">
                <li>
                  <span className="tk" /> Branded cover page with your logo &amp;
                  colors
                </li>
                <li>
                  <span className="tk" /> Executive summary in plain language
                </li>
                <li>
                  <span className="tk" /> Itemized scope of work &amp; exclusions
                </li>
                <li>
                  <span className="tk" /> Pricing totals and payment terms
                </li>
                <li>
                  <span className="tk" /> Signature block, ready to send
                </li>
              </ul>
            </div>

            <div className="rv">
              <div className="paper">
                <span className="ptab">PROPOSAL.PDF</span>
                <div className="pp-top">
                  <div>
                    <div className="lg">SCOPEIFY</div>
                    <div className="sub">Roof Replacement Proposal</div>
                  </div>
                  <div className="meta">
                    #2026-0142
                    <br />
                    CLEVELAND, OH
                    <br />
                    TPO 60MIL
                  </div>
                </div>
                <div className="pp-body">
                  <div className="pp-h">
                    Executive Summary<span className="r" />
                  </div>
                  <div className="pp-line" style={{ width: '100%' }} />
                  <div className="pp-line" style={{ width: '96%' }} />
                  <div className="pp-line" style={{ width: '88%' }} />
                  <div className="pp-h">
                    Scope of Work<span className="r" />
                  </div>
                  <div className="pp-line" style={{ width: '92%' }} />
                  <div className="pp-line" style={{ width: '98%' }} />
                  <div className="pp-line" style={{ width: '70%' }} />
                  <div className="pp-h">
                    Exclusions<span className="r" />
                  </div>
                  <div className="pp-line" style={{ width: '82%' }} />
                  <div className="pp-line" style={{ width: '60%' }} />
                  <div className="pp-total">
                    <span className="k">Total — Materials &amp; Labor</span>
                    <span className="v">$612,400</span>
                  </div>
                  <div className="pp-sign">
                    <div className="s">
                      <div className="ln" />
                      <div className="lb">Client signature</div>
                    </div>
                    <div className="s">
                      <div className="ln" />
                      <div className="lb">Date</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="dark final ticks">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" />
        <div className="vignette" />
        <div className="wrap final-in rv">
          <div>
            <h2 className="disp">
              Try it on your
              <br />
              next bid
            </h2>
            <p>
              Spin up a proposal in under five minutes. No setup, no sales call —
              and a full 2-month money-back guarantee if it isn&apos;t for you.
            </p>
          </div>
          <div className="cta-row" style={{ margin: 0 }}>
            <Link className="btn btn-primary lg" href="/payment">
              Try it now — 2-Month Money-Back Guarantee{' '}
              <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

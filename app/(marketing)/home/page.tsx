import Link from 'next/link';

export const metadata = {
  title: 'Scopeify – Commercial roofing reports in minutes',
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="dark hero ticks">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" />
        <div className="vignette" />
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <span className="tag rv">
                <span className="dot" /> Built for commercial roofers
              </span>
              <h1 className="disp hero-h rv">
                Roofing reports in <span className="em">minutes</span>, not days
              </h1>
              <p className="lead rv">
                Scopeify turns site photos and a few notes into a complete,
                client-ready proposal — <b>pricing, scope, and PDF included.</b>{' '}
                Built for the way commercial roofing actually gets sold.
              </p>
              <div className="cta-row rv">
                <Link className="btn btn-primary lg" href="/signup">
                  Get Started <span className="ar">→</span>
                </Link>
                <Link className="btn btn-out" href="/products">
                  See pricing
                </Link>
              </div>
              <div className="reassure rv">
                <span>
                  <span className="chk">✓</span> No credit card
                </span>
                <span className="sep" />
                <span>
                  <span className="chk">✓</span> Cancel anytime
                </span>
                <span className="sep" />
                <span>
                  <span className="chk">✓</span> 2-month money-back guarantee
                </span>
              </div>
            </div>

            <div className="mock rv">
              <div className="dimline">
                <span className="bar" />
                <em className="mono">PROPOSAL · 38s</em>
              </div>
              <div className="sheet">
                <div className="scan" />
                <div className="sheet-hd">
                  <span className="mono">#2026-0142</span>
                  <span className="live">
                    <span className="pulse" /> GENERATING
                  </span>
                </div>
                <div className="sheet-bd">
                  <div className="sheet-title">
                    Northgate Logistics
                    <br />
                    Roof Replacement
                  </div>
                  <div className="sheet-sub mono">
                    TPO 60mil · Full tear-off · Cleveland, OH
                  </div>
                  <div className="specs">
                    <div className="spec">
                      <div className="k">Sq Ft</div>
                      <div className="v">84,200</div>
                    </div>
                    <div className="spec">
                      <div className="k">System</div>
                      <div
                        className="v"
                        style={{ fontSize: '18px', paddingTop: '3px' }}
                      >
                        TPO 60
                      </div>
                    </div>
                    <div className="spec">
                      <div className="k">Total</div>
                      <div className="v hi">$612K</div>
                    </div>
                  </div>
                  <div className="lines">
                    <div className="li">
                      <span className="bx" /> Tear-off existing EPDM membrane
                    </div>
                    <div className="li">
                      <span className="bx" /> Install new 60mil TPO membrane
                    </div>
                    <div className="li">
                      <span className="bx" /> 24 roof drains · 6 scuppers
                    </div>
                    <div className="li">
                      <span className="bx" /> 15-yr NDL manufacturer warranty
                    </div>
                  </div>
                  <div className="sheet-ft">
                    <span className="genbtn">Generate PDF →</span>
                  </div>
                </div>
              </div>
              <div className="float-badge">
                <span className="big">
                  38<small style={{ fontSize: '14px' }}>s</small>
                </span>
                <span className="sm">from photos to PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="strip">
        <div className="wrap strip-in">
          <span className="strip-lbl cond">Trusted by crews in</span>
          <span className="nm">Cleveland</span>
          <span className="nm">Austin</span>
          <span className="nm">Phoenix</span>
          <span className="nm">Charlotte</span>
          <span className="nm">San Antonio</span>
          <span className="nm">Newark</span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="wrap stats-in">
          <div className="stat rv">
            <div className="n">
              12,400<span className="u">+</span>
            </div>
            <div className="l">Proposals generated</div>
          </div>
          <div className="stat rv">
            <div className="n">
              56
              <span className="u" style={{ fontSize: '34px' }}>
                {' '}
                min
              </span>
            </div>
            <div className="l">Saved per job, on average</div>
          </div>
          <div className="stat rv">
            <div className="n">
              82<span className="u">%</span>
            </div>
            <div className="l">Estimator approval rate</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="block">
        <div className="wrap">
          <div className="rv">
            <span className="eyebrow">
              <span className="ln" />
              What you get
            </span>
            <h2 className="sec">
              Less paperwork.
              <br />
              More roofs.
            </h2>
            <p className="sec-lead">
              The reports your estimators used to spend half a day on — handled
              by Scopeify before you&apos;ve left the parking lot.
            </p>
          </div>
          <div className="feat-grid rv">
            <div className="feat">
              <span className="no">01</span>
              <svg
                className="ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 16l5-5 4 4 7-7" />
                <circle cx="8" cy="8" r="1.6" />
                <rect x="3" y="3" width="18" height="18" />
              </svg>
              <h3>Upload once, done thinking</h3>
              <p>
                A handful of site photos is the whole input. The takeoff, the
                materials, the write-up — Scopeify handles the parts that used
                to eat your afternoon.
              </p>
              <span className="underbar" />
            </div>
            <div className="feat">
              <span className="no">02</span>
              <svg
                className="ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 9l9-6 9 6" />
                <path d="M5 8v12h14V8" />
                <path d="M9 20v-6h6v6" />
              </svg>
              <h3>Tuned to how you bid</h3>
              <p>
                Slopes, drains, tear-offs, square footage — calibrated to your
                own pricing history instead of a generic playbook.
              </p>
              <span className="underbar" />
            </div>
            <div className="feat">
              <span className="no">03</span>
              <svg
                className="ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2h9l5 5v15H6z" />
                <path d="M15 2v5h5" />
                <path d="M9 13h6M9 17h6" />
              </svg>
              <h3>Client-ready on the first pass</h3>
              <p>
                What comes out is a proposal you&apos;d be comfortable handing
                over without changing a word.
              </p>
              <span className="underbar" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="dark block ticks" id="how">
        <span className="t3" />
        <span className="t4" />
        <div className="grid-bg" style={{ opacity: 0.14 }} />
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
              How it works
              <span className="ln" />
            </span>
            <h2 className="sec">From site photos to a sent PDF</h2>
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
                Building type, system, scope of work, and any client notes.
                Under two minutes.
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
                Scopeify reads layouts, drains, penetrations, and
                existing-system clues from the walk.
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
                Branded cover, summary, scope, exclusions and signature block —
                exported in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="block" id="pricing">
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
              Products
              <span className="ln" />
            </span>
            <h2 className="sec">Pick the plan that fits how you bid</h2>
            <p className="sec-lead" style={{ textAlign: 'center' }}>
              Month-to-month, cancel anytime. Backed by a 2-month 100%
              money-back guarantee.
            </p>
          </div>
          <div className="price-grid rv">
            <div className="plan">
              <div className="pn">PDF Generator</div>
              <div className="pt">
                For solo contractors who just need a polished deliverable.
              </div>
              <div className="pr">
                <span className="amt">$99</span>
                <span className="per">/month</span>
              </div>
              <ul>
                <li>
                  <span className="tick" /> Unlimited branded PDF proposals
                </li>
                <li>
                  <span className="tick" /> Photo + notes → AI draft scope
                </li>
                <li>
                  <span className="tick" /> Your logo, colors &amp; signature
                  block
                </li>
                <li>
                  <span className="tick" /> Up to 25 proposals / month
                </li>
              </ul>
              <Link className="pcta ghost2" href="/signup">
                Start with PDF
              </Link>
            </div>
            <div className="plan hot">
              <div className="pn" style={{ marginTop: '18px' }}>
                Quick Estimation
              </div>
              <div className="pt">
                Everything in PDF, plus instant ballpark pricing for fast bids.
              </div>
              <div className="pr">
                <span className="amt">$149</span>
                <span className="per">/month</span>
              </div>
              <ul>
                <li>
                  <span className="tick" /> Everything in PDF Generator
                </li>
                <li>
                  <span className="tick" /> Square-footage &amp; materials
                  estimator
                </li>
                <li>
                  <span className="tick" /> Regional pricing benchmarks
                </li>
                <li>
                  <span className="tick" /> Up to 75 proposals / month
                </li>
              </ul>
              <Link className="pcta solid" href="/signup">
                Pick Quick Estimation
              </Link>
            </div>
            <div className="plan">
              <div className="pn">Full Assessment</div>
              <div className="pt">
                For estimating teams running real volume on commercial roofs.
              </div>
              <div className="pr">
                <span className="amt">$249</span>
                <span className="per">/month</span>
              </div>
              <ul>
                <li>
                  <span className="tick" /> Everything in Quick Estimation
                </li>
                <li>
                  <span className="tick" /> Drone &amp; satellite roof takeoffs
                </li>
                <li>
                  <span className="tick" /> Multi-user accounts with approvals
                </li>
                <li>
                  <span className="tick" /> Unlimited proposals + priority
                  support
                </li>
              </ul>
              <Link className="pcta ghost2" href="/signup">
                Go Full Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="block" id="proof" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="rv">
            <span className="eyebrow">
              <span className="ln" />
              Results
            </span>
            <h2 className="sec">What contractors are saying</h2>
          </div>
          <div className="quote-box rv ticks">
            <span className="t3" />
            <span className="t4" />
            <div className="grid-bg" style={{ opacity: 0.1 }} />
            <span className="qmark">“</span>
            <blockquote>
              I was skeptical — I&apos;ve watched a lot of &quot;AI&quot; tools
              spit out garbage I had to rewrite anyway. Scopeify is different. It
              reads our photos, pulls real numbers, and the PDF looks like one of
              my senior guys wrote it. I had to read the first one twice to make
              sure he hadn&apos;t.
            </blockquote>
            <div className="who">
              <span className="av">DP</span>
              <div>
                <div className="nm">Denise Park</div>
                <div className="rl">Owner · Park &amp; Sons Roofing · Austin, TX</div>
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
            <Link className="btn btn-primary lg" href="/signup">
              Get Started <span className="ar">→</span>
            </Link>
            <Link className="btn btn-out" href="/products">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

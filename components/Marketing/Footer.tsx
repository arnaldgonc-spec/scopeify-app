import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/ai-pdf-generation', label: 'AI PDF Generation' },
      { href: '/products', label: 'Products & Pricing' },
      { href: '/results', label: 'Results' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/results', label: 'Customer Stories' },
      { href: '/login', label: 'Sign In' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
      <div className="mkt-grid-bg" />
      <div className="mkt-wrap" style={{ position: 'relative', padding: '60px 32px 30px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr',
            gap: 40,
            paddingBottom: 44,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
          className="mkt-grid-foot"
        >
          <div>
            <img
              src="/Scopeify_Logo_Inversed_v2.png"
              alt="Scopeify"
              style={{ height: 30, width: 'auto', objectFit: 'contain', marginBottom: 16 }}
            />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', fontWeight: 300, lineHeight: 1.7, maxWidth: 280 }}>
              Commercial roofing proposals and assessment reports, written by AI and ready to send in minutes.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--sv)',
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 300 }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--sv)',
                marginBottom: 16,
              }}
            >
              Get Started
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
              Your first proposal is free. No card, no setup call.
            </p>
            <Link href="/login" className="mkt-btn mkt-btn-light mkt-btn-sm">Start Free →</Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 22,
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            © {new Date().getFullYear()} Scopeify. Built for commercial roofing contractors.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            TPO · EPDM · Modified Bitumen · Metal · Tapered Systems
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 880px) { .mkt-grid-foot { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </footer>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';
import './marketing.css';
import MarketingFx from './MarketingFx';

const NAV = [
  { href: '/ai-pdf-generation', label: 'AI PDF Generation' },
  { href: '/products', label: 'Products' },
  { href: '/results', label: 'Results' },
];

function Logo() {
  return (
    <>
      <img className="logo-img" src="/scopeify-mark.png" alt="Scopeify" />
      <span className="logo-fallback">
        <span className="mk" />
        <span className="wm">SCOPEIFY</span>
      </span>
    </>
  );
}

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="grain" />

      <header>
        <div className="wrap hbar">
          <Link className="logo" href="/home" aria-label="Scopeify home">
            <Logo />
          </Link>
          <nav>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hcta">
            <Link className="ghost" href="/login">
              Sign in
            </Link>
            <Link className="btn btn-primary" href="/products">
              Get Started <span className="ar">→</span>
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer>
        <div className="wrap foot-grid">
          <div>
            <Link className="logo" href="/home" aria-label="Scopeify home">
              <Logo />
            </Link>
            <p className="blurb">
              Commercial roofing reports, generated in minutes.
            </p>
          </div>
          <div>
            <div className="foot-h">Product</div>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <div className="foot-h">Company</div>
            <Link href="/results">Customer Stories</Link>
            <Link href="/login">Sign in</Link>
          </div>
          <div>
            <div className="foot-h">Contact</div>
            <a href="mailto:info.scopeify@gmail.com">info.scopeify@gmail.com</a>
          </div>
        </div>
        <div className="wrap foot-bar">
          <span>© 2026 Scopeify, Inc.</span>
          <span className="mono">Built for commercial roofing contractors.</span>
        </div>
      </footer>

      <MarketingFx />
    </>
  );
}

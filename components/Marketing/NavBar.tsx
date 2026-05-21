'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { href: '/ai-pdf-generation', label: 'AI PDF Generation' },
  { href: '/products', label: 'Products' },
  { href: '/results', label: 'Results' },
  { href: '/about', label: 'About Us' },
];

export default function NavBar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="mkt-nav">
      <div className="mkt-nav-inner">
        <Link href="/" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Scopeify_logo_2.png" alt="Scopeify" style={{ height: 27, width: 'auto', objectFit: 'contain' }} />
        </Link>

        <nav className="mkt-nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`mkt-nav-link${pathname === l.href ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mkt-nav-right">
          <div className="mkt-nav-cta">
            {loggedIn ? (
              <Link href="/dashboard" className="mkt-btn mkt-btn-primary mkt-btn-sm">Go to Dashboard →</Link>
            ) : (
              <>
                <Link href="/login" className="mkt-nav-link">Sign In</Link>
                <Link href="/login" className="mkt-btn mkt-btn-primary mkt-btn-sm">Start Free →</Link>
              </>
            )}
          </div>
          <button className="mkt-burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className={`mkt-mobile${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`mkt-mobile-link${pathname === l.href ? ' active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          {loggedIn ? (
            <Link href="/dashboard" onClick={() => setOpen(false)} className="mkt-btn mkt-btn-primary mkt-btn-block">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="mkt-btn mkt-btn-ghost mkt-btn-block">
                Sign In
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} className="mkt-btn mkt-btn-primary mkt-btn-block">
                Start Free →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

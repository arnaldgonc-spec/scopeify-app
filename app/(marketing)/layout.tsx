import Link from 'next/link';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/ai-pdf-generation', label: 'AI PDF Generation' },
  { href: '/products', label: 'Products' },
  { href: '/results', label: 'Results' },
  { href: '/about', label: 'About Us' },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-[var(--fg)] text-[var(--ink)]">
      <header className="sticky top-0 z-40 bg-[var(--nd)] text-[var(--wh)] border-b border-[var(--nm)]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2">
            <span
              className="inline-block w-8 h-8 bg-[var(--sv)] hex-clip"
              aria-hidden
            />
            <span
              className="text-2xl tracking-widest"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              SCOPEIFY
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium tracking-wide text-[var(--sl)] hover:text-[var(--wh)] hover:bg-[var(--nm)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-block px-4 py-2 text-sm text-[var(--sl)] hover:text-[var(--wh)]"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold bg-[var(--sv)] text-[var(--nd)] hover:bg-[var(--sl)] transition-colors"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[var(--nd)] text-[var(--sl)] mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div
              className="text-2xl tracking-widest text-[var(--wh)]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              SCOPEIFY
            </div>
            <p className="mt-3 text-sm text-[var(--sv)]">
              Commercial roofing reports, generated in minutes.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--sv)] mb-3">
              Product
            </div>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link className="hover:text-[var(--wh)]" href={n.href}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--sv)] mb-3">
              Company
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-[var(--wh)]" href="/about">About</Link></li>
              <li><Link className="hover:text-[var(--wh)]" href="/results">Customer Stories</Link></li>
              <li><Link className="hover:text-[var(--wh)]" href="/login">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--sv)] mb-3">
              Contact
            </div>
            <p className="text-sm">hello@scopeify.app</p>
          </div>
        </div>
        <div className="border-t border-[var(--nm)]">
          <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-[var(--sv)] flex justify-between">
            <span>© {new Date().getFullYear()} Scopeify, Inc.</span>
            <span>Built for commercial roofing contractors.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

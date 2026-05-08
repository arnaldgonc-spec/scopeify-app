'use client';
import { useRouter, usePathname } from 'next/navigation';
import type { Company } from '@/lib/types';

interface Props {
  company: Company | null;
}

export default function Sidebar({ company }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'new',
      label: 'New Proposal',
      href: '/proposals/new',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'All Proposals',
      href: '/proposals',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      style={{ width: 240, background: 'var(--nd)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      className="flex flex-col h-full flex-shrink-0"
    >
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center mb-4">
          <img src="/Scopeify_Logo_Inversed_v2.png" alt="Scopeify" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div
          className="flex items-center gap-1.5"
          style={{ background: 'rgba(180,200,220,0.1)', border: '1px solid rgba(180,200,220,0.18)', padding: '5px 10px' }}
        >
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--sv)', opacity: 0.5 }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sv)' }}>
            {company?.name || 'Your Company'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '18px 0' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '0 20px', marginBottom: 4 }}>
          Main
        </div>
        {links.slice(0, 2).map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <div
              key={link.id}
              onClick={() => router.push(link.href)}
              className="flex items-center gap-2.5 cursor-pointer"
              style={{
                padding: '9px 20px',
                background: isActive ? 'rgba(180,200,220,0.09)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--sv)' : '2px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ opacity: isActive ? 0.85 : 0.5, color: '#fff' }}>{link.icon}</span>
              <span style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.35)', fontWeight: isActive ? 500 : 400 }}>
                {link.label}
              </span>
            </div>
          );
        })}

        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '0 20px', marginBottom: 4, marginTop: 16 }}>
          History
        </div>
        {links.slice(2).map((link) => {
          const isActive = pathname === link.href;
          return (
            <div
              key={link.id}
              onClick={() => router.push(link.href)}
              className="flex items-center gap-2.5 cursor-pointer"
              style={{
                padding: '9px 20px',
                background: isActive ? 'rgba(180,200,220,0.09)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--sv)' : '2px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ opacity: isActive ? 0.85 : 0.5, color: '#fff' }}>{link.icon}</span>
              <span style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.35)', fontWeight: isActive ? 500 : 400 }}>
                {link.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          <strong style={{ display: 'block', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{company?.name || 'Your Company'}</strong>
          {company?.city}, {company?.state}
        </div>
        <div
          onClick={() => router.push('/account')}
          className="flex items-center gap-2 cursor-pointer w-full"
          style={{ padding: '7px 0', marginBottom: 8, color: pathname === '/account' ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.35)', transition: 'color 0.15s' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>Account</span>
        </div>
        <button
          onClick={signOut}
          className="w-full cursor-pointer"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 14px', letterSpacing: '0.04em', transition: 'all 0.15s' }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

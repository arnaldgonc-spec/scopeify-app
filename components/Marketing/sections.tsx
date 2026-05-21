import Link from 'next/link';
import type { ReactNode } from 'react';

export function Eyebrow({
  children,
  tone = 'light',
  align = 'left',
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
}) {
  const color = tone === 'dark' ? 'var(--sv)' : 'var(--nv)';
  const line = <span style={{ width: 26, height: 2, background: color, opacity: 0.55, display: 'inline-block' }} />;
  return (
    <div
      className="mkt-eyebrow"
      style={{
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 12,
      }}
    >
      {line}
      {children}
      {align === 'center' && line}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub: string }) {
  return (
    <section style={{ background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)',
        }}
      />
      <div className="mkt-grid-bg" />
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -140,
          width: 540,
          height: 540,
          background: 'radial-gradient(circle,rgba(180,200,220,0.08) 0%,transparent 64%)',
        }}
      />
      <div className="mkt-wrap" style={{ position: 'relative', padding: '76px 32px 82px', textAlign: 'center' }}>
        <Eyebrow tone="dark" align="center">{eyebrow}</Eyebrow>
        <h1 className="mkt-display mkt-h2" style={{ color: '#fff', maxWidth: 800, margin: '20px auto 16px' }}>
          {title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.52)',
            fontWeight: 300,
            lineHeight: 1.75,
            maxWidth: 580,
            margin: '0 auto',
          }}
        >
          {sub}
        </p>
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = 'center',
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 46,
        maxWidth: align === 'center' ? 660 : undefined,
        marginLeft: align === 'center' ? 'auto' : undefined,
        marginRight: align === 'center' ? 'auto' : undefined,
      }}
    >
      <Eyebrow align={align}>{eyebrow}</Eyebrow>
      <h2 className="mkt-display mkt-h2" style={{ color: 'var(--nd)', margin: sub ? '16px 0 12px' : '16px 0 0' }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 14.5, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.75 }}>{sub}</p>
      )}
    </div>
  );
}

export function CtaBand({
  title,
  sub,
  primaryHref = '/login',
  primaryLabel = 'Start Free →',
  secondaryHref = '/products',
  secondaryLabel = 'View Products',
}: {
  title: string;
  sub: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section style={{ background: 'var(--nd)', position: 'relative', overflow: 'hidden' }}>
      <div className="mkt-grid-bg" />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg,transparent,var(--sl),var(--sv))',
        }}
      />
      <div className="mkt-wrap" style={{ position: 'relative', padding: '74px 32px', textAlign: 'center' }}>
        <h2 className="mkt-display mkt-h2" style={{ color: '#fff', maxWidth: 680, margin: '0 auto 14px' }}>
          {title}
        </h2>
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.52)',
            fontWeight: 300,
            lineHeight: 1.75,
            maxWidth: 520,
            margin: '0 auto 30px',
          }}
        >
          {sub}
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={primaryHref} className="mkt-btn mkt-btn-light">{primaryLabel}</Link>
          <Link href={secondaryHref} className="mkt-btn mkt-btn-line">{secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}

export function Stars({ size = 13 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="var(--amb)">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

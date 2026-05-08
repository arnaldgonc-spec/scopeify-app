interface Props {
  title: string;
  sub: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  isLast?: boolean;
}

export default function StepTopbar({ title, sub, onBack, onNext, nextLabel = 'Continue →', isLast }: Props) {
  return (
    <div style={{ background: 'var(--wh)', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--mt)', marginTop: 3, fontWeight: 300 }}>{sub}</div>
      </div>
      <div className="flex gap-2.5 items-center">
        <button
          onClick={onBack}
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: '1.5px solid var(--rl)', cursor: 'pointer', letterSpacing: '0.04em', background: 'transparent', color: 'var(--ir)', transition: 'all 0.15s' }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', transition: 'all 0.15s' }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

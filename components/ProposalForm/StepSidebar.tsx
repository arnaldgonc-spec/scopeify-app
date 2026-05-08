import type { ProposalPath } from '@/lib/types';

interface Step {
  n: number;
  label: string;
  group: string;
}

function getSteps(path: ProposalPath): Step[] {
  const base: Step[] = [
    { n: 1, label: 'Company Profile', group: 'Your Business' },
    { n: 2, label: 'Client & Property', group: 'The Job' },
    { n: 3, label: 'Roof Details', group: 'The Job' },
    { n: 4, label: 'Scope of Work', group: 'The Job' },
  ];
  base.push({ n: 5, label: 'Site Photos', group: 'Photos & Pricing' });
  base.push({ n: 6, label: 'Pricing & Payment', group: 'Photos & Pricing' });
  base.push({ n: 7, label: 'Warranty', group: 'Photos & Pricing' });
  base.push({ n: 8, label: 'Review & Generate', group: 'Finish' });
  return base;
}

interface Props {
  path: ProposalPath;
  currentStep: number;
  completedSteps: Set<number>;
  onGoTo: (n: number) => void;
}

export default function StepSidebar({ path, currentStep, completedSteps, onGoTo }: Props) {
  const steps = getSteps(path);
  const totalSteps = steps.length;
  const pct = Math.round(((currentStep - 1) / totalSteps) * 100);
  const pathNames: Record<ProposalPath, string> = {
    proposal: 'Proposal Builder',
    estimate: 'Quick Estimate',
    assessment: 'Full Assessment',
  };

  let lastGroup = '';

  return (
    <div style={{ width: 240, background: 'var(--nd)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      {/* Top */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center mb-3.5">
          <img src="/Scopeify_Logo_Inversed_v2.png" alt="Scopeify" style={{ height: 30, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div className="flex items-center gap-1.5" style={{ background: 'rgba(180,200,220,0.1)', border: '1px solid rgba(180,200,220,0.18)', padding: '5px 10px' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--sv)', opacity: 0.5 }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sv)' }}>
            {pathNames[path]} · Draft
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '16px 0' }}>
        {steps.map((step) => {
          const showGroup = step.group !== lastGroup;
          lastGroup = step.group;
          const isActive = currentStep === step.n;
          const isDone = completedSteps.has(step.n);

          return (
            <div key={step.n}>
              {showGroup && (
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', padding: '0 20px', marginBottom: 4, marginTop: 14 }}>
                  {step.group}
                </div>
              )}
              <div
                onClick={() => onGoTo(step.n)}
                className="flex items-center gap-2.5 cursor-pointer"
                style={{
                  padding: '9px 20px',
                  background: isActive ? 'rgba(180,200,220,0.09)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--sv)' : '2px solid transparent',
                  opacity: isDone && !isActive ? 0.7 : 1,
                  transition: 'background 0.15s',
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: isDone ? 'var(--ok)' : isActive ? 'var(--nm)' : 'rgba(255,255,255,0.06)',
                    border: isDone ? '1.5px solid var(--ok)' : isActive ? '1.5px solid var(--sv)' : '1.5px solid rgba(255,255,255,0.1)',
                    fontFamily: "'Barlow Condensed', sans-serif", fontSize: isDone ? 12 : 11, fontWeight: 700,
                    color: isDone ? '#fff' : isActive ? 'var(--sl)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {isDone ? '✓' : step.n}
                </div>
                <span style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.88)' : isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.32)', fontWeight: isActive ? 500 : 400 }}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', height: 3, overflow: 'hidden', marginBottom: 7 }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--sv),var(--sl))', width: pct + '%', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)' }}>
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
}

'use client';
import type { FormState, ScopeData } from '@/lib/types';

const WORK_TYPES = ['Full Tear-Off & Replacement','Recover (overlay existing)','Partial Repair','Preventive Maintenance','Re-flashing Only','Coating Application'];
const MEMBRANE_TYPES = ['TPO – 60-mil','TPO – 80-mil','EPDM – 60-mil','PVC – 60-mil','Modified Bitumen'];
const ATTACH_METHODS = ['Fully Adhered','Mechanically Fastened','Ballasted'];
const INSULATION = ['R-15 (2.5" polyiso)','R-20 (3.5" polyiso)','R-25 (4.5" polyiso)','No new insulation'];
const PHASING = ['No – single mobilization','2 phases','3 phases'];
const DURATIONS = ['1–2 days','3–5 days','1–2 weeks','2–4 weeks','4+ weeks'];
const PW = ['No','Yes – government project'];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; }

export default function Step4Scope({ state, onChange }: Props) {
  const scope = state.scope_data;
  const set = (k: keyof ScopeData, v: string | string[] | number) => onChange({ scope_data: { ...scope, [k]: v } });

  const toggleWork = (wt: string) => {
    const arr = scope.work_types || [];
    set('work_types', arr.includes(wt) ? arr.filter((w) => w !== wt) : [...arr, wt]);
  };

  return (
    <div>
      <Section label="Work Type · select all that apply">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {WORK_TYPES.map((wt) => {
            const on = (scope.work_types || []).includes(wt);
            return (
              <label key={wt} onClick={() => toggleWork(wt)} className="flex items-center gap-2.5" style={{ padding: '10px 14px', border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, cursor: 'pointer', background: on ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s' }}>
                <div style={{ width: 16, height: 16, border: `2px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--nv)' : 'transparent', flexShrink: 0 }}>
                  {on && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{wt}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section label="New Roof System">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <Sel label="New Membrane Type *" value={scope.new_membrane_type || MEMBRANE_TYPES[0]} opts={MEMBRANE_TYPES} onChange={(v) => set('new_membrane_type', v)} />
          <Sel label="Attachment Method" value={scope.attachment_method || ATTACH_METHODS[0]} opts={ATTACH_METHODS} onChange={(v) => set('attachment_method', v)} />
          <Sel label="Insulation R-Value" value={scope.insulation_r_value || INSULATION[0]} opts={INSULATION} onChange={(v) => set('insulation_r_value', v)} />
        </div>
      </Section>

      <Section label="Logistics">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Sel label="Phased Work?" value={scope.phasing || PHASING[0]} opts={PHASING} onChange={(v) => set('phasing', v)} note="Phasing is common on occupied buildings." />
          <Sel label="Estimated Duration" value={scope.estimated_duration || DURATIONS[2]} opts={DURATIONS} onChange={(v) => set('estimated_duration', v)} />
          <Field label="Deck Repair Allowance" note="Sq ft included at no extra charge.">
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <input type="number" value={scope.deck_allowance_sqft || ''} onChange={(e) => set('deck_allowance_sqft', +e.target.value)} placeholder="400" style={iStyle} />
              <div style={{ background: 'var(--fg)', border: '1.5px solid var(--rl)', borderLeft: 'none', padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--ir)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>ft²</div>
            </div>
          </Field>
          <Sel label="Prevailing Wage?" value={scope.prevailing_wage || PW[0]} opts={PW} onChange={(v) => set('prevailing_wage', v)} />
        </div>
      </Section>

      <Section label="Additional Notes">
        <Field label="Special conditions, access restrictions – fed to AI scope generator">
          <textarea
            value={scope.notes || ''}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="e.g. Building is occupied. No work before 7AM. Loading dock must remain accessible."
            style={{ ...iStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
          />
        </Field>
      </Section>
    </div>
  );
}

const iStyle: React.CSSProperties = { fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--wh)', border: '1.5px solid var(--rl)', padding: '10px 13px', outline: 'none', width: '100%' };

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        {label}<span style={{ flex: 1, height: 1, background: 'var(--rl)', display: 'block' }} />
      </div>
      {children}
    </div>
  );
}
function Field({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      {children}
      {note && <div style={{ fontSize: 11, color: 'var(--mt)', lineHeight: 1.5, fontWeight: 300 }}>{note}</div>}
    </div>
  );
}
function Sel({ label, value, opts, onChange, note }: { label: string; value: string; opts: string[]; onChange: (v: string) => void; note?: string }) {
  return (
    <Field label={label} note={note}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={iStyle}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );
}

'use client';
import type { FormState, RoofData } from '@/lib/types';

const ROOF_TYPES = ['TPO','EPDM','PVC','Mod Bit','BUR','Metal'];
const SLOPES = ['Low-slope · <2:12','Slight · 2:12–4:12','Moderate · 4:12–6:12','Steep · >6:12'];
const ACCESS = ['Interior hatch','Exterior ladder','Requires lift / scaffold','Rooftop stairwell'];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; }

function Counter({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: '1.5px solid var(--rl)', overflow: 'hidden' }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} style={{ background: 'var(--fg)', border: 'none', width: 36, fontSize: 16, color: 'var(--ir)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
      <input readOnly value={value} style={{ flex: 1, border: 'none', textAlign: 'center', fontSize: 15, fontWeight: 600, background: 'var(--wh)', fontFamily: "'Barlow', sans-serif", color: 'var(--ink)', padding: '10px 4px', outline: 'none' }} />
      <button type="button" onClick={() => onChange(value + 1)} style={{ background: 'var(--fg)', border: 'none', width: 36, fontSize: 16, color: 'var(--ir)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
    </div>
  );
}

export default function Step3Roof({ state, onChange }: Props) {
  const roof = state.roof_data;
  const setRoof = (k: keyof RoofData, v: string | number | null) => onChange({ roof_data: { ...roof, [k]: v } });

  return (
    <div>
      <Section label="Existing Roof Type *">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
          {ROOF_TYPES.map((rt) => {
            const sel = roof.existing_roof_type === rt;
            return (
              <label key={rt} onClick={() => setRoof('existing_roof_type', rt)} style={{ border: `1.5px solid ${sel ? 'var(--nv)' : 'var(--rl)'}`, padding: '13px 15px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 11, background: sel ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s' }}>
                <div style={{ width: 17, height: 17, borderRadius: '50%', border: `2px solid ${sel ? 'var(--nv)' : 'var(--rl)'}`, flexShrink: 0, marginTop: 2, background: sel ? 'var(--nv)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {sel && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>{rt}</div></div>
              </label>
            );
          })}
        </div>
      </Section>

      <Section label="Dimensions & Structure">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <Field label="Roof Area *">
            <InputSuf suf="ft²"><input type="number" value={roof.area_sqft || ''} onChange={(e) => setRoof('area_sqft', +e.target.value)} placeholder="42800" /></InputSuf>
          </Field>
          <Field label="Roof Age *">
            <InputSuf suf="yrs"><input type="number" value={roof.roof_age || ''} onChange={(e) => setRoof('roof_age', +e.target.value)} placeholder="17" /></InputSuf>
          </Field>
          <Field label="Stories">
            <Counter value={roof.stories ?? 1} onChange={(v) => setRoof('stories', v)} min={1} />
          </Field>
          <Field label="Slope">
            <select value={roof.slope || SLOPES[0]} onChange={(e) => setRoof('slope', e.target.value)} style={selectStyle}>
              {SLOPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Eave Height">
            <InputSuf suf="ft"><input type="number" value={roof.eave_height || ''} onChange={(e) => setRoof('eave_height', +e.target.value)} placeholder="22" /></InputSuf>
          </Field>
          <Field label="Roof Sections">
            <Counter value={roof.sections ?? 1} onChange={(v) => setRoof('sections', v)} min={1} />
          </Field>
        </div>
      </Section>

      <Section label="Penetrations & Details">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          <Field label="HVAC Curbs"><Counter value={roof.hvac_count ?? 0} onChange={(v) => setRoof('hvac_count', v)} /></Field>
          <Field label="Pipe Penetrations"><Counter value={roof.pipe_count ?? 0} onChange={(v) => setRoof('pipe_count', v)} /></Field>
          <Field label="Roof Drains"><Counter value={roof.drain_count ?? 0} onChange={(v) => setRoof('drain_count', v)} /></Field>
          <Field label="Skylights"><Counter value={roof.skylight_count ?? 0} onChange={(v) => setRoof('skylight_count', v)} /></Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <Field label="Parapet Wall Length">
            <InputSuf suf="LF"><input type="number" value={roof.parapet_lf || ''} onChange={(e) => setRoof('parapet_lf', +e.target.value)} placeholder="620" /></InputSuf>
          </Field>
          <Field label="Roof Access">
            <select value={roof.access || ACCESS[0]} onChange={(e) => setRoof('access', e.target.value)} style={selectStyle}>
              {ACCESS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </Field>
        </div>
      </Section>
    </div>
  );
}

const selectStyle = { fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--wh)', border: '1.5px solid var(--rl)', padding: '10px 13px', outline: 'none', width: '100%' };

function InputSuf({ suf, children }: { suf: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch' }}>
      <style>{`input[type=number]{flex:1;font-family:'Barlow',sans-serif;font-size:14px;color:var(--ink);background:var(--wh);border:1.5px solid var(--rl);border-right:none;padding:10px 13px;outline:none;}input[type=number]:focus{border-color:var(--nv);}input::placeholder{color:#b8c4d8;}`}</style>
      {children}
      <div style={{ background: 'var(--fg)', border: '1.5px solid var(--rl)', borderLeft: 'none', padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--ir)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>{suf}</div>
    </div>
  );
}

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

'use client';
import type { FormState, WarrantyData } from '@/lib/types';

const MFR = ['GAF','Firestone','Carlisle','Johns Manville','No warranty'];
const MFR_YEARS = ['10','15','20','25'];
const MFR_TYPES = ['Material only','System (material + labor)','NDL – No Dollar Limit'];
const REG_IN = ["Property owner's name","Contractor's name","Both"];
const WORK_YEARS = ['1','2','3','5','10'];
const LEAK_YEARS = ['None','1','2','3','5'];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; }

export default function Step7Warranty({ state, onChange }: Props) {
  const w = state.warranty_data;
  const set = (k: keyof WarrantyData, v: string | number) => onChange({ warranty_data: { ...w, [k]: v } });

  return (
    <div>
      <Section label="Manufacturer Warranty">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Sel label="Manufacturer" value={w.manufacturer || MFR[0]} opts={MFR} onChange={(v) => set('manufacturer', v)} />
          <Sel label="Warranty Term" value={w.manufacturer_years ? String(w.manufacturer_years) : '20'} opts={MFR_YEARS} onChange={(v) => set('manufacturer_years', +v)} />
          <Sel label="Warranty Type" value={w.warranty_type || MFR_TYPES[1]} opts={MFR_TYPES} onChange={(v) => set('warranty_type', v)} />
          <Sel label="Registered In" value={w.registered_in || REG_IN[0]} opts={REG_IN} onChange={(v) => set('registered_in', v)} />
        </div>
      </Section>

      <Section label="Your Workmanship Warranty">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Sel label="Workmanship Term" value={w.workmanship_years ? String(w.workmanship_years) : '5'} opts={WORK_YEARS} onChange={(v) => set('workmanship_years', +v)} />
          <Sel label="Leak-Free Guarantee" value={w.leak_free_years ? String(w.leak_free_years) : '2'} opts={LEAK_YEARS} onChange={(v) => set('leak_free_years', v === 'None' ? 0 : +v)} />
        </div>
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
function Sel({ label, value, opts, onChange }: { label: string; value: string; opts: string[]; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={iStyle}>
        {opts.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

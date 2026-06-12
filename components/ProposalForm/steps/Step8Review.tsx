'use client';
import { useState, useEffect } from 'react';
import type { FormState } from '@/lib/types';
import { PRESETS } from '@/lib/templates/presets';

interface Props {
  state: FormState;
  onChange: (p: Partial<FormState>) => void;
  onGoTo: (n: number) => void;
  onGenerate: () => void;
}

interface CustomTemplate { id: string; name: string; }

export default function Step8Review({ state, onChange, onGoTo, onGenerate }: Props) {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.from('report_templates').select('id, name').then(({ data }) => {
        if (data) setCustomTemplates(data as CustomTemplate[]);
      });
    });
  }, []);

  // Selected template: prefer custom id, else preset key.
  const selectedValue = state.template_id ? `custom:${state.template_id}` : `preset:${state.template_preset ?? 'classic'}`;
  function selectTemplate(value: string) {
    if (value.startsWith('custom:')) onChange({ template_id: value.slice(7), template_preset: null });
    else onChange({ template_id: null, template_preset: value.slice(7) });
  }

  const price = state.final_price
    ? '$' + state.final_price.toLocaleString()
    : state.ai_estimate_low && state.ai_estimate_high
    ? `$${(state.ai_estimate_low / 1000).toFixed(0)}K–$${(state.ai_estimate_high / 1000).toFixed(0)}K (AI)`
    : '–';

  const cards = [
    {
      title: 'Company',
      step: 1,
      rows: [
        ['Name', state.company.name || '–'],
        ['Contact', state.company.owner_name || '–'],
        ['Location', `${state.company.city || ''}, ${state.company.state || ''}`],
        ['License', state.company.license_number || '–'],
      ],
    },
    {
      title: 'Client & Property',
      step: 2,
      rows: [
        ['Client', state.client_name || '–'],
        ['Address', state.property_address || '–'],
        ['City / State', `${state.property_city || ''}, ${state.property_state || ''}`],
        ['Type', state.property_type || '–'],
      ],
    },
    {
      title: 'Roof Details',
      step: 3,
      rows: [
        ['System', state.roof_data.existing_roof_type || '–'],
        ['Area', state.roof_data.area_sqft ? state.roof_data.area_sqft.toLocaleString() + ' sq ft' : '–'],
        ['Age', state.roof_data.roof_age ? state.roof_data.roof_age + ' years' : '–'],
        ['HVAC / Drains', `${state.roof_data.hvac_count ?? 0} curbs · ${state.roof_data.drain_count ?? 0} drains`],
      ],
    },
    {
      title: 'Scope & Pricing',
      step: 4,
      rows: [
        ['Work Type', (state.scope_data.work_types || [])[0] || '–'],
        ['New System', state.scope_data.new_membrane_type || '–'],
        ['Estimate', price],
        ['Warranty', `${state.warranty_data.manufacturer || '–'} ${state.warranty_data.manufacturer_years || '–'}-yr`],
      ],
    },
  ];

  return (
    <div>
      <Section label="Review Before Generating">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {cards.map((card) => (
            <div key={card.title} style={{ background: 'var(--wh)', border: '1.5px solid var(--rl)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--nd)', padding: '11px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{card.title}</span>
                <span onClick={() => onGoTo(card.step)} style={{ fontSize: 11, color: 'var(--sv)', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Edit</span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {card.rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--fg)' }}>
                    <span style={{ fontSize: 12, color: 'var(--mt)' }}>{k}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Report Template">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {PRESETS.map((p) => {
            const value = `preset:${p.id}`;
            const on = selectedValue === value;
            return (
              <div key={p.id} onClick={() => selectTemplate(value)} style={{ border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, background: on ? 'rgba(27,42,94,0.04)' : 'var(--wh)', cursor: 'pointer', overflow: 'hidden' }}>
                <div style={{ height: 8, background: p.definition.theme.primary, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '40%', background: p.definition.theme.accent }} />
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nd)' }}>{p.name}{on ? ' ✓' : ''}</div>
                  <div style={{ fontSize: 11, color: 'var(--mt)', lineHeight: 1.4 }}>{p.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        {customTemplates.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--ir)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your custom templates</label>
            <select value={state.template_id ? `custom:${state.template_id}` : ''} onChange={(e) => e.target.value && selectTemplate(e.target.value)} style={{ width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: '9px 11px', border: '1.5px solid var(--rl)' }}>
              <option value="">— Use a preset above —</option>
              {customTemplates.map((c) => <option key={c.id} value={`custom:${c.id}`}>{c.name}</option>)}
            </select>
          </div>
        )}
      </Section>

      {/* Generate CTA */}
      <div style={{ background: 'var(--nd)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)' }} />
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>Ready to Generate</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 300 }}>AI writes your scope, annotates photos, and builds a 4-page PDF in ~15 seconds</div>
        </div>
        <button
          onClick={onGenerate}
          style={{ background: 'var(--nm)', border: '1.5px solid var(--sv)', color: 'var(--sl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '13px 28px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Generate Proposal PDF
        </button>
      </div>
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

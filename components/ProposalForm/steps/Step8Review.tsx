'use client';
import type { FormState } from '@/lib/types';

interface Props {
  state: FormState;
  onGoTo: (n: number) => void;
  onGenerate: () => void;
}

export default function Step8Review({ state, onGoTo, onGenerate }: Props) {
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

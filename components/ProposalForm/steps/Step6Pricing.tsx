'use client';
import type { FormState, PaymentTerms, LineItem, ProposalPath } from '@/lib/types';

const TERMS = ['Net-15','Net-30','Due on completion'];
const VALID = ['30 days','15 days','45 days','60 days'];
const CC = ['Yes – 3% fee','Yes – fee absorbed','No – check / ACH only'];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; path: ProposalPath; }

export default function Step6Pricing({ state, onChange, path }: Props) {
  const pt = state.payment_terms;
  const setPt = (k: keyof PaymentTerms, v: string | number) => onChange({ payment_terms: { ...pt, [k]: v } });
  const useAI = state.price_source === 'ai';

  // ── Material list ──
  const membrane = state.scope_data?.new_membrane_type || 'TPO';
  const DEFAULT_ITEMS: Partial<LineItem>[] = [
    { title: 'Tear-Off & Disposal', unit: 'SF' },
    { title: 'Deck Inspection & Repair', unit: 'SF' },
    { title: 'Insulation System', unit: 'SF' },
    { title: `${membrane} Membrane Installation`, unit: 'SF' },
    { title: 'Penetrations, Flashings & Drainage', unit: 'LS' },
    { title: 'Final Inspection & Warranty Registration', unit: 'LS' },
  ];
  const items: Partial<LineItem>[] = (state.line_items && state.line_items.length > 0) ? state.line_items : DEFAULT_ITEMS;
  const total = items.reduce((s, item) => s + (item.line_total || 0), 0);

  function updateItem(i: number, key: keyof LineItem, value: string | number) {
    const base = (state.line_items && state.line_items.length > 0) ? [...state.line_items] : [...DEFAULT_ITEMS];
    const updated = base.map((item, idx) => idx === i ? { ...item, [key]: value } : item);
    const newTotal = updated.reduce((s, item) => s + (item.line_total || 0), 0);
    const updates: Partial<FormState> = { line_items: updated };
    if (path === 'proposal' && newTotal > 0) updates.final_price = newTotal;
    onChange(updates);
  }

  function removeItem(i: number) {
    const updated = items.filter((_, idx) => idx !== i);
    const newTotal = updated.reduce((s, item) => s + (item.line_total || 0), 0);
    const updates: Partial<FormState> = { line_items: updated };
    if (path === 'proposal') updates.final_price = newTotal || null;
    onChange(updates);
  }

  function addItem() {
    onChange({ line_items: [...items, { title: '', unit: 'SF' }] });
  }

  return (
    <div>
      {/* Estimate source – only for estimate/assessment */}
      {path !== 'proposal' && (
        <Section label="Estimate Source">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1.5px solid var(--rl)', overflow: 'hidden', marginBottom: 18 }}>
            {[{ key: 'ai', label: 'Use AI Estimate', sub: 'Generated from roof details + regional pricing' }, { key: 'manual', label: 'Enter My Own Price', sub: "I already know what I'm charging" }].map((opt) => {
              const sel = state.price_source === opt.key;
              return (
                <div key={opt.key} onClick={() => onChange({ price_source: opt.key as 'ai' | 'manual' })} style={{ padding: '14px 18px', cursor: 'pointer', background: sel ? 'var(--nd)' : 'var(--wh)', display: 'flex', alignItems: 'center', gap: 11, borderRight: opt.key === 'ai' ? '1px solid var(--rl)' : 'none', transition: 'all 0.15s' }}>
                  <div style={{ width: 17, height: 17, borderRadius: '50%', border: `2px solid ${sel ? 'var(--sv)' : 'var(--rl)'}`, background: sel ? 'var(--nm)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--sl)' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: sel ? '#fff' : 'var(--ink)' }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,0.38)' : 'var(--mt)', fontWeight: 300 }}>{opt.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {useAI && state.ai_estimate_low && state.ai_estimate_high && (
            <div style={{ background: 'var(--nd)', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, alignItems: 'center', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)' }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: 'var(--sl)', lineHeight: 1 }}>
                ${(state.ai_estimate_low / 1000).toFixed(0)}K – ${(state.ai_estimate_high / 1000).toFixed(0)}K
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>AI Estimate · {(state.roof_data?.area_sqft || 0).toLocaleString()} sq ft</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 300, lineHeight: 1.5 }}>Includes tear-off, membrane, insulation, flashings, labor, disposal, and permit.</div>
              </div>
              <div style={{ background: 'rgba(180,200,220,0.12)', border: '1px solid rgba(180,200,220,0.25)', padding: '5px 11px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--sv)', letterSpacing: '0.1em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>
                AI Est.
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Material List */}
      <Section label={path === 'proposal' ? 'Material List *' : 'Material List'}>
        {path !== 'proposal' ? (
          <div style={{ background: 'rgba(27,42,94,0.05)', border: '1px solid rgba(27,42,94,0.15)', padding: '8px 14px', marginBottom: 14, fontSize: 12, color: 'var(--ir)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ opacity: 0.5 }}>ℹ</span>
            Leave prices blank to estimate with AI
          </div>
        ) : (
          <div style={{ background: 'rgba(201,59,59,0.05)', border: '1px solid rgba(201,59,59,0.18)', padding: '8px 14px', marginBottom: 14, fontSize: 12, color: '#c93b3b', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 700 }}>*</span>
            Enter a price for each line item — required for Proposal Builder
          </div>
        )}

        <div style={{ border: '1.5px solid var(--rl)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 58px 58px 1fr 28px', background: 'var(--fg)', borderBottom: '1.5px solid var(--rl)', padding: '7px 0' }}>
            {['MATERIAL / PRODUCT', 'SPECIFICATION', 'QTY', 'UNIT', 'PRICE', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ir)', padding: '0 10px', borderLeft: i > 0 ? '1px solid var(--rl)' : 'none', display: 'flex', alignItems: 'center' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 58px 58px 1fr 28px', borderBottom: '1px solid var(--rl)', background: i % 2 === 0 ? 'var(--wh)' : 'var(--fg)' }}>
              <input
                value={item.title || ''}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                placeholder="Material name"
                style={cs}
              />
              <input
                value={item.specification || ''}
                onChange={(e) => updateItem(i, 'specification', e.target.value)}
                placeholder="e.g. 80-mil TPO"
                style={{ ...cs, borderLeft: '1px solid var(--rl)' }}
              />
              <input
                type="number"
                value={(item.quantity && item.quantity > 0) ? item.quantity : ''}
                onChange={(e) => updateItem(i, 'quantity', e.target.value ? +e.target.value : 0)}
                placeholder="–"
                style={{ ...cs, textAlign: 'right', borderLeft: '1px solid var(--rl)' }}
              />
              <input
                value={item.unit || ''}
                onChange={(e) => updateItem(i, 'unit', e.target.value)}
                placeholder="SF"
                style={{ ...cs, textAlign: 'center', borderLeft: '1px solid var(--rl)' }}
              />
              <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: '1px solid var(--rl)' }}>
                <span style={{ padding: '0 9px', fontSize: 13, fontWeight: 600, color: 'var(--ir)', display: 'flex', alignItems: 'center', background: 'var(--fg)', borderRight: '1px solid var(--rl)', flexShrink: 0 }}>$</span>
                <input
                  type="number"
                  value={(item.line_total && item.line_total > 0) ? item.line_total : ''}
                  onChange={(e) => updateItem(i, 'line_total', e.target.value ? +e.target.value : 0)}
                  placeholder={path !== 'proposal' ? 'AI est.' : 'Required'}
                  style={{ ...cs, flex: 1, minWidth: 0 }}
                />
              </div>
              <button
                onClick={() => removeItem(i)}
                title="Remove row"
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16, color: 'var(--mt)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--rl)', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c93b3b')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--mt)')}
              >×</button>
            </div>
          ))}

          {/* Total row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 58px 58px 1fr 28px', background: 'var(--nd)' }}>
            <div style={{ gridColumn: 'span 4', padding: '10px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center' }}>
              Total
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '10px 12px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: total > 0 ? 'var(--sl)' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center' }}>
              {total > 0 ? '$' + total.toLocaleString() : '—'}
            </div>
            <div />
          </div>
        </div>

        <button
          onClick={addItem}
          style={{ marginTop: 10, background: 'transparent', border: '1.5px dashed var(--rl)', color: 'var(--ir)', fontSize: 12, fontWeight: 600, padding: '8px 0', cursor: 'pointer', letterSpacing: '0.04em', width: '100%', fontFamily: "'Barlow', sans-serif", transition: 'border-color 0.15s' }}
        >
          + Add Line Item
        </button>
      </Section>

      {/* Contract price */}
      <Section label={path === 'proposal' ? 'Contract Price' : (useAI ? 'Override Total Price (optional)' : 'Your Total Price *')}>
        {path === 'proposal' && total > 0 && (
          <div style={{ fontSize: 12, color: 'var(--ir)', marginBottom: 10 }}>
            Auto-computed from material list above. Override below only if needed.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label={path === 'proposal' ? 'Total Contract Value' : (useAI ? 'Override (leave blank for AI range)' : 'Your Total Price *')}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              <div style={{ background: 'var(--fg)', border: '1.5px solid var(--rl)', borderRight: 'none', padding: '10px 12px', fontSize: 13, fontWeight: 600, color: 'var(--ir)', display: 'flex', alignItems: 'center' }}>$</div>
              <input
                type="number"
                value={state.final_price || ''}
                onChange={(e) => onChange({ final_price: e.target.value ? +e.target.value : null })}
                placeholder={path === 'proposal' ? (total > 0 ? total.toLocaleString() : '0') : (useAI ? 'Leave blank to use AI range' : '146,640')}
                style={{ flex: 1, fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'var(--ink)', background: 'var(--wh)', border: '1.5px solid var(--rl)', padding: '10px 13px', outline: 'none' }}
              />
            </div>
          </Field>
        </div>
      </Section>

      {/* Payment schedule */}
      <Section label="Payment Schedule">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[
            { key: 'deposit', pct: pt.deposit_pct ?? 30, noteKey: 'deposit_note', label: 'Deposit', defaultNote: 'Due at signing to secure project start date' },
            { key: 'progress', pct: pt.progress_pct ?? 40, noteKey: 'progress_note', label: 'Progress', defaultNote: 'Upon completion of tear-off and insulation' },
            { key: 'final', pct: pt.final_pct ?? 30, noteKey: 'final_note', label: 'Final', defaultNote: 'Upon substantial completion and walkthrough' },
          ].map((row) => (
            <div key={row.key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 90px', border: '1.5px solid var(--rl)', overflow: 'hidden', alignItems: 'stretch' }}>
              <div style={{ background: 'var(--fg)', padding: '10px 13px', fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', borderRight: '1.5px solid var(--rl)' }}>{row.label}</div>
              <input
                type="text"
                defaultValue={row.defaultNote}
                onBlur={(e) => setPt(row.noteKey as keyof PaymentTerms, e.target.value)}
                style={{ border: 'none', padding: '10px 13px', fontSize: 13, outline: 'none', fontFamily: "'Barlow', sans-serif", color: 'var(--ink)' }}
              />
              <div style={{ background: 'var(--nd)', borderLeft: '1.5px solid var(--rl)', padding: '10px 13px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--sl)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{row.pct}%</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Terms">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <Sel label="Final Invoice Terms" value={state.invoice_terms || TERMS[0]} opts={TERMS} onChange={(v) => onChange({ invoice_terms: v })} />
          <Sel label="Proposal Valid For" value={state.valid_days ? state.valid_days + ' days' : '30 days'} opts={VALID} onChange={(v) => onChange({ valid_days: parseInt(v) })} />
          <Sel label="Credit Card?" value={state.credit_card_accepted || CC[0]} opts={CC} onChange={(v) => onChange({ credit_card_accepted: v })} />
        </div>
      </Section>
    </div>
  );
}

const cs: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif",
  fontSize: 13,
  color: 'var(--ink)',
  background: 'transparent',
  border: 'none',
  padding: '9px 10px',
  outline: 'none',
  width: '100%',
};

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
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}
function Sel({ label, value, opts, onChange }: { label: string; value: string; opts: string[]; onChange: (v: string) => void }) {
  return (
    <Field label={label}><select value={value} onChange={(e) => onChange(e.target.value)} style={iStyle}>{opts.map((o) => <option key={o}>{o}</option>)}</select></Field>
  );
}

'use client';
import { useState } from 'react';
import type { FormState } from '@/lib/types';

const SLOTS = [
  'Overview / Aerial','NW Corner','NE Corner','SW Corner',
  'SE Corner','Membrane Damage','Drain / Ponding','HVAC / Penetrations',
];
const CHECKLIST = [
  'All four corners photographed','Aerial / full-roof overview',
  'All drains / scuppers','All HVAC curb flashings',
  'Parapet / coping condition','Interior leak points (if any)',
];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; path: string; }

export default function Step5Photos({ state, onChange, path }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleCheck = (item: string) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
  };

  const pct = Math.round((checked.size / CHECKLIST.length) * 85);
  const confNote = pct === 0
    ? 'No items checked yet. Check items as you upload photos above.'
    : pct < 35 ? 'Low coverage – estimate range will be wider. Add more angles.'
    : pct < 65 ? 'Moderate coverage – AI can work with this but more photos help.'
    : 'Good coverage – AI estimate and photo annotations will be reliable.';

  const addPhoto = (slot: string, file: File) => {
    const photos = state.photos.filter((p) => p.slot_label !== slot);
    onChange({ photos: [...photos, { file, slot_label: slot, caption: slot }] });
  };

  return (
    <div>
      {/* Callout — assessment path only */}
      {path === 'assessment' && (
        <div style={{ padding: '14px 18px', marginBottom: 22, borderLeft: '3px solid var(--nv)', background: 'rgba(27,42,94,0.06)', display: 'flex', gap: 11 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📸</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nd)', marginBottom: 2 }}>Photos are optional – but they unlock more from Scopeify</div>
            <div style={{ fontSize: 12, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.55 }}>Uploaded photos are annotated automatically in the proposal PDF. The coverage checklist below drives the estimate confidence score.</div>
          </div>
        </div>
      )}

      <Section label="Upload Site Photos">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
          {SLOTS.map((slot) => {
            const existing = state.photos.find((p) => p.slot_label === slot);
            return (
              <label
                key={slot}
                htmlFor={`photo-${slot}`}
                style={{ aspectRatio: '4/3', border: '2px dashed var(--rl)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: existing ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s', gap: 5, position: 'relative', overflow: 'hidden' }}
              >
                <input id={`photo-${slot}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(slot, f); }} />
                {existing ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span style={{ fontSize: 20 }}>✓</span>
                    <span style={{ fontSize: 9, color: 'var(--nv)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', padding: '0 6px' }}>{slot}</span>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: 18, opacity: 0.2 }}>＋</span>
                    <span style={{ fontSize: 9, color: 'var(--mt)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', padding: '0 6px' }}>{slot}</span>
                  </>
                )}
              </label>
            );
          })}
        </div>
      </Section>

      <Section label="Coverage Checklist · each item increases confidence score">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {CHECKLIST.map((item) => {
            const on = checked.has(item);
            return (
              <label key={item} onClick={() => toggleCheck(item)} className="flex items-center gap-2.5" style={{ padding: '10px 14px', border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, cursor: 'pointer', background: on ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s' }}>
                <div style={{ width: 16, height: 16, border: `2px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--nv)' : 'transparent', flexShrink: 0 }}>
                  {on && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item}</span>
              </label>
            );
          })}
        </div>

        {/* Confidence bar */}
        <div style={{ background: 'var(--nd)', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 18, marginTop: 14 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: 'var(--sl)', lineHeight: 1, flexShrink: 0 }}>{pct}%</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Photo Coverage Confidence</div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', marginBottom: 7 }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--sv),var(--sl))', width: pct + '%', transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, fontWeight: 300 }}>{confNote}</div>
          </div>
        </div>
      </Section>
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

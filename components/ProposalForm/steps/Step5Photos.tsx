'use client';
import { useState } from 'react';
import type { FormState, FormPhoto, PhotoSeverity } from '@/lib/types';

const SLOTS = [
  'Overview / Aerial','NW Corner','NE Corner','SW Corner',
  'SE Corner','Membrane Damage','Drain / Ponding','HVAC / Penetrations',
];
const CHECKLIST = [
  'All four corners photographed','Aerial / full-roof overview',
  'All drains / scuppers','All HVAC curb flashings',
  'Parapet / coping condition','Interior leak points (if any)',
];

const SEVERITY_COLOR: Record<PhotoSeverity, string> = {
  none: '#15803d', low: '#65a30d', moderate: '#d97706', severe: '#dc2626',
};

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; path: string; }

// Downscale an image to a ~1024px JPEG data URL to keep vision token usage low.
function fileToAnalysisBase64(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = Math.min(img.width, maxWidth);
      const h = Math.round(img.height * (w / img.width));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = url;
  });
}

export default function Step5Photos({ state, onChange, path }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());

  const toggleCheck = (item: string) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
  };

  // Update a single photo (by slot) inside formState.
  const updatePhoto = (slot: string, patch: Partial<FormPhoto>) => {
    onChange({ photos: state.photos.map((p) => (p.slot_label === slot ? { ...p, ...patch } : p)) });
  };

  const analyzed = state.photos.filter((p) => p.analysis && p.analysis.is_roof_photo);
  const avgCondition = analyzed.length
    ? analyzed.reduce((s, p) => s + (p.analysis?.condition_score ?? 0), 0) / analyzed.length
    : null;

  // Blend checklist coverage with AI condition findings when available.
  const checklistPct = (checked.size / CHECKLIST.length) * 85;
  const pct = avgCondition !== null
    ? Math.round(0.6 * checklistPct + 0.4 * Math.min(85, (avgCondition / 100) * 85))
    : Math.round(checklistPct);

  const confNote = avgCondition !== null
    ? `AI reviewed ${analyzed.length} photo${analyzed.length === 1 ? '' : 's'} · avg condition ${Math.round(avgCondition)}/100. Findings appear in the scope and PDF.`
    : pct === 0 ? 'No items checked yet. Check items as you upload photos above.'
    : pct < 35 ? 'Low coverage – estimate range will be wider. Add more angles.'
    : pct < 65 ? 'Moderate coverage – AI can work with this but more photos help.'
    : 'Good coverage – AI estimate and photo annotations will be reliable.';

  const addPhoto = async (slot: string, file: File) => {
    const others = state.photos.filter((p) => p.slot_label !== slot);
    const newPhoto: FormPhoto = { file, slot_label: slot, caption: slot, analysis_status: 'pending' };
    onChange({ photos: [...others, newPhoto] });

    // Kick off AI analysis.
    setAnalyzing((prev) => new Set(prev).add(slot));
    try {
      const imageBase64 = await fileToAnalysisBase64(file);
      const res = await fetch('/api/analyze-photo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, slotLabel: slot }),
      });
      if (res.ok) {
        const { analysis, status } = await res.json();
        updatePhoto(slot, {
          analysis,
          analysis_status: status,
          caption: analysis?.suggested_caption || slot,
        });
      } else {
        updatePhoto(slot, { analysis_status: 'failed' });
      }
    } catch {
      updatePhoto(slot, { analysis_status: 'failed' });
    } finally {
      setAnalyzing((prev) => { const n = new Set(prev); n.delete(slot); return n; });
    }
  };

  return (
    <div>
      {path === 'assessment' && (
        <div style={{ padding: '14px 18px', marginBottom: 22, borderLeft: '3px solid var(--nv)', background: 'rgba(27,42,94,0.06)', display: 'flex', gap: 11 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>📸</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--nd)', marginBottom: 2 }}>AI analyzes every photo you upload</div>
            <div style={{ fontSize: 12, color: 'var(--ir)', fontWeight: 300, lineHeight: 1.55 }}>Each photo is reviewed for visible damage and condition. Findings drive the confidence score and appear in the PDF. You can edit captions below.</div>
          </div>
        </div>
      )}

      <Section label="Upload Site Photos">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>
          {SLOTS.map((slot) => {
            const existing = state.photos.find((p) => p.slot_label === slot);
            const isAnalyzing = analyzing.has(slot);
            const sev = existing?.analysis?.severity;
            return (
              <div key={slot}>
                <label
                  htmlFor={`photo-${slot}`}
                  style={{ aspectRatio: '4/3', border: '2px dashed var(--rl)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: existing ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s', gap: 5, position: 'relative', overflow: 'hidden' }}
                >
                  <input id={`photo-${slot}`} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(slot, f); }} />
                  {existing ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span style={{ fontSize: 20 }}>{isAnalyzing ? '⏳' : '✓'}</span>
                      <span style={{ fontSize: 9, color: 'var(--nv)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', padding: '0 6px' }}>{slot}</span>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 18, opacity: 0.2 }}>＋</span>
                      <span style={{ fontSize: 9, color: 'var(--mt)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', padding: '0 6px' }}>{slot}</span>
                    </>
                  )}
                </label>
                {existing && (
                  <div style={{ marginTop: 5 }}>
                    {isAnalyzing ? (
                      <div style={{ fontSize: 10, color: 'var(--mt)' }}>Analyzing…</div>
                    ) : existing.analysis_status === 'failed' ? (
                      <div style={{ fontSize: 10, color: '#9a3412' }}>Analysis unavailable</div>
                    ) : existing.analysis_status === 'skipped' ? (
                      <div style={{ fontSize: 10, color: 'var(--mt)' }}>Not a roof photo</div>
                    ) : sev ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: SEVERITY_COLOR[sev], display: 'inline-block' }} />
                        <span style={{ fontSize: 10, color: 'var(--ir)', textTransform: 'capitalize' }}>{sev} · {existing.analysis?.condition_score}/100</span>
                      </div>
                    ) : null}
                    {existing.analysis_status === 'done' && (
                      <input
                        value={existing.caption}
                        onChange={(e) => updatePhoto(slot, { caption: e.target.value })}
                        style={{ width: '100%', fontSize: 10, padding: '4px 6px', border: '1px solid var(--rl)', fontFamily: "'Barlow', sans-serif", color: 'var(--ink)' }}
                      />
                    )}
                  </div>
                )}
              </div>
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

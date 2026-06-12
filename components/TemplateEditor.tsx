'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Company } from '@/lib/types';
import type { TemplateDefinition, TemplateSection, SectionId } from '@/lib/templates/types';

const SECTION_LABELS: Record<SectionId, string> = {
  cover: 'Cover Page', scope: 'Scope of Work', photos: 'Site Photos',
  pricing: 'Investment / Pricing', warranty: 'Warranty', terms: 'Terms & Conditions',
  signature: 'Acceptance / Signature', textBlock: 'Custom Text Block',
};

const HEADING_FONTS = ["'Bebas Neue', sans-serif", "'Barlow Condensed', sans-serif", "'Barlow', sans-serif"];
const BODY_FONTS = ["'Barlow', sans-serif", "'Barlow Condensed', sans-serif"];

export default function TemplateEditor({ company, templateId, initialName, initialDescription, initialDefinition }: {
  company: Company; templateId: string; initialName: string; initialDescription: string; initialDefinition: TemplateDefinition;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [def, setDef] = useState<TemplateDefinition>(initialDefinition);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sorted = [...def.sections].sort((a, b) => a.order - b.order);

  const refreshPreview = useCallback(async () => {
    const res = await fetch('/api/templates/preview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ definition: def }),
    });
    const html = await res.text();
    if (iframeRef.current) iframeRef.current.srcdoc = html;
  }, [def]);

  useEffect(() => {
    const t = setTimeout(refreshPreview, 350);
    return () => clearTimeout(t);
  }, [refreshPreview]);

  function setTheme<K extends keyof TemplateDefinition['theme']>(k: K, v: TemplateDefinition['theme'][K]) {
    setDef((d) => ({ ...d, theme: { ...d.theme, [k]: v } }));
  }
  function toggleSection(id: SectionId) {
    setDef((d) => ({ ...d, sections: d.sections.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s) }));
  }
  function moveSection(id: SectionId, dir: -1 | 1) {
    setDef((d) => {
      const arr = [...d.sections].sort((a, b) => a.order - b.order);
      const i = arr.findIndex((s) => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= arr.length) return d;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...d, sections: arr.map((s, idx) => ({ ...s, order: idx })) };
    });
  }
  function updateSection(id: SectionId, patch: Partial<TemplateSection>) {
    setDef((d) => ({ ...d, sections: d.sections.map((s) => s.id === id ? { ...s, ...patch } : s) }));
  }

  async function save() {
    setSaving(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { error } = await supabase.from('report_templates')
      .update({ name, description, definition: def })
      .eq('id', templateId);
    setSaving(false);
    if (error) { alert('Save failed.'); return; }
    setSavedAt(new Date().toLocaleTimeString());
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Controls panel */}
      <div style={{ width: 380, background: '#fff', borderRight: '1px solid var(--rl)', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--rl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => router.push('/templates')} style={{ fontSize: 12, color: 'var(--mt)', background: 'none', border: 'none', cursor: 'pointer' }}>← Templates</button>
          <button onClick={save} disabled={saving} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '7px 16px', background: 'var(--nv)', color: '#fff', border: 'none', cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save'}</button>
        </div>

        <div style={{ padding: 20 }}>
          {savedAt && <div style={{ fontSize: 11, color: '#15803d', marginBottom: 12 }}>Saved at {savedAt}</div>}

          <Field label="Template Name"><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></Field>
          <Field label="Description"><input value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} /></Field>

          <Group title="Theme">
            <Field label="Primary color"><input type="color" value={def.theme.primary} onChange={(e) => setTheme('primary', e.target.value)} style={colorStyle} /></Field>
            <Field label="Accent color"><input type="color" value={def.theme.accent} onChange={(e) => setTheme('accent', e.target.value)} style={colorStyle} /></Field>
            <Field label="Body text color"><input type="color" value={def.theme.text} onChange={(e) => setTheme('text', e.target.value)} style={colorStyle} /></Field>
            <Field label="Heading font">
              <select value={def.theme.headingFont} onChange={(e) => setTheme('headingFont', e.target.value)} style={inputStyle}>
                {HEADING_FONTS.map((f) => <option key={f} value={f}>{f.replace(/'/g, '').split(',')[0]}</option>)}
              </select>
            </Field>
            <Field label="Body font">
              <select value={def.theme.bodyFont} onChange={(e) => setTheme('bodyFont', e.target.value)} style={inputStyle}>
                {BODY_FONTS.map((f) => <option key={f} value={f}>{f.replace(/'/g, '').split(',')[0]}</option>)}
              </select>
            </Field>
            <Field label="Logo placement">
              <select value={def.theme.logoPlacement} onChange={(e) => setTheme('logoPlacement', e.target.value as TemplateDefinition['theme']['logoPlacement'])} style={inputStyle}>
                <option value="cover-only">Cover only</option>
                <option value="header-left">Header left</option>
                <option value="header-center">Header center</option>
              </select>
            </Field>
          </Group>

          <Group title="Sections">
            {sorted.map((s, i) => (
              <div key={s.id} style={{ border: '1px solid var(--rl)', padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={s.enabled} onChange={() => toggleSection(s.id)} />
                    {SECTION_LABELS[s.id]}
                  </label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => moveSection(s.id, -1)} disabled={i === 0} style={arrowStyle}>↑</button>
                    <button onClick={() => moveSection(s.id, 1)} disabled={i === sorted.length - 1} style={arrowStyle}>↓</button>
                  </div>
                </div>
                {s.id === 'pricing' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--mt)', marginTop: 8 }}>
                    <input type="checkbox" checked={s.options?.showLineItems !== false} onChange={(e) => updateSection(s.id, { options: { ...s.options, showLineItems: e.target.checked } })} />
                    Show itemized line items
                  </label>
                )}
                {(s.id === 'terms' || s.id === 'textBlock') && (
                  <div style={{ marginTop: 8 }}>
                    <input placeholder="Heading" value={s.heading ?? ''} onChange={(e) => updateSection(s.id, { heading: e.target.value })} style={{ ...inputStyle, marginBottom: 6 }} />
                    <textarea placeholder="Body text" value={s.text ?? ''} onChange={(e) => updateSection(s.id, { text: e.target.value })} style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} />
                  </div>
                )}
              </div>
            ))}
          </Group>
        </div>
      </div>

      {/* Live preview */}
      <div style={{ flex: 1, background: '#e2e7f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mt)' }}>Live Preview (sample data)</div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
          <iframe ref={iframeRef} title="preview" sandbox="" style={{ width: 816, transform: 'scale(0.62)', transformOrigin: 'top left', height: 2600, border: '1px solid var(--rl)', background: '#fff' }} />
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: '8px 10px', border: '1.5px solid var(--rl)', outline: 'none' };
const colorStyle: React.CSSProperties = { width: 48, height: 32, padding: 0, border: '1.5px solid var(--rl)', cursor: 'pointer' };
const arrowStyle: React.CSSProperties = { width: 24, height: 24, border: '1px solid var(--rl)', background: '#fff', cursor: 'pointer', fontSize: 12 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ir)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>{children}</div>;
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rl)' }}><div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 12 }}>{title}</div>{children}</div>;
}

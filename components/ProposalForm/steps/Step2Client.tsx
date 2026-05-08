'use client';
import { useState, useEffect, useRef } from 'react';
import type { FormState } from '@/lib/types';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const PROPERTY_TYPES = ['Industrial / Warehouse','Office Building','Retail / Strip Mall','Healthcare Facility','Government / Municipal','Multi-Family','Mixed Use'];

interface Props { state: FormState; onChange: (p: Partial<FormState>) => void; }

export default function Step2Client({ state, onChange }: Props) {
  const set = (k: keyof FormState, v: string) => onChange({ [k]: v } as Partial<FormState>);

  return (
    <div>
      <Section label="Client Information">
        <Grid cols={2}>
          <Field label="Company / Owner Name *" span={2}><input type="text" value={state.client_name} onChange={(e) => set('client_name', e.target.value)} placeholder="Lakeview Industrial Park LLC" /></Field>
          <Field label="Contact Name"><input type="text" value={state.client_contact_name} onChange={(e) => set('client_contact_name', e.target.value)} placeholder="Robert Chen" /></Field>
          <Field label="Contact Email"><input type="email" value={state.client_email} onChange={(e) => set('client_email', e.target.value)} placeholder="rchen@example.com" /></Field>
        </Grid>
      </Section>

      <Section label="Property Address">
        <Grid cols={2}>
          <Field label="Street Address *" span={2}><input type="text" value={state.property_address} onChange={(e) => set('property_address', e.target.value)} placeholder="4400 N Ravenswood Ave" /></Field>
          <Field label="City *"><input type="text" value={state.property_city} onChange={(e) => set('property_city', e.target.value)} placeholder="Chicago" /></Field>
          <Field label="State *">
            <select value={state.property_state} onChange={(e) => set('property_state', e.target.value)}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Zip Code"><input type="text" value={state.property_zip} onChange={(e) => set('property_zip', e.target.value)} placeholder="60640" /></Field>
          <Field label="Property Type">
            <select value={state.property_type} onChange={(e) => set('property_type', e.target.value)}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
        </Grid>
      </Section>

      <Section label="Cover Photo">
        <div style={{ fontSize: 12, color: 'var(--mt)', fontWeight: 300, marginBottom: 12, lineHeight: 1.5 }}>
          Upload a photo of the property or roof — it appears as the full-page background on the proposal cover with a 50% dark overlay.
        </div>
        <CoverPhotoUpload state={state} onChange={onChange} />
      </Section>
    </div>
  );
}

function CoverPhotoUpload({ state, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.coverPhotoFile) {
      const url = URL.createObjectURL(state.coverPhotoFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    if (state.coverPhotoBase64) {
      setPreview(state.coverPhotoBase64);
      return;
    }
    setPreview(null);
  }, [state.coverPhotoFile, state.coverPhotoBase64]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${preview ? 'var(--nv)' : 'var(--rl)'}`,
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: preview ? 'transparent' : 'var(--fg)',
        transition: 'border-color 0.15s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onChange({ coverPhotoFile: e.target.files?.[0] || null })}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="Cover"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,18,48,0.5)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, marginBottom: 4 }}>Cover photo ready</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 300 }}>{state.coverPhotoFile?.name || 'Existing photo · click to change'}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>Click to change</div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: 28, opacity: 0.15, marginBottom: 10 }}>🏗️</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ir)', marginBottom: 4 }}>Click to upload cover photo</div>
          <div style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300 }}>
            JPG or PNG · Appears on proposal cover with dark overlay
          </div>
        </div>
      )}
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
function Grid({ cols, children }: { cols: number; children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14 }}>{children}</div>;
}
function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <style>{`input,select{font-family:'Barlow',sans-serif;font-size:14px;color:var(--ink);background:var(--wh);border:1.5px solid var(--rl);padding:10px 13px;outline:none;width:100%;}input:focus,select:focus{border-color:var(--nv);}input::placeholder{color:#b8c4d8;}`}</style>
      {children}
    </div>
  );
}

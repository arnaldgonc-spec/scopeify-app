'use client';
import { useState, useEffect } from 'react';
import type { FormState } from '@/lib/types';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const CERTS = ['GAF Certified Contractor','Owens Corning Preferred','NRCA Member','FM Approved Installer','Fully Bonded & Insured','OSHA 30 Certified Crew'];

interface Props {
  state: FormState;
  onChange: (patch: Partial<FormState>) => void;
}

export default function Step1Company({ state, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const co = state.company;
  const activeCerts = mounted ? (co.certifications || []) : [];
  const set = (k: string, v: string) => onChange({ company: { ...co, [k]: v } });
  const toggleCert = (cert: string) => {
    const certs = co.certifications || [];
    const next = certs.includes(cert) ? certs.filter((c) => c !== cert) : [...certs, cert];
    onChange({ company: { ...co, certifications: next } });
  };

  return (
    <div>
      <Section label="Company Info">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Company Name *" span={2}><input type="text" value={co.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Apex Commercial Roofing" /></Field>
          <Field label="Owner / Contact *"><input type="text" value={co.owner_name || ''} onChange={(e) => set('owner_name', e.target.value)} placeholder="James Whitfield" /></Field>
          <Field label="License Number"><input type="text" value={co.license_number || ''} onChange={(e) => set('license_number', e.target.value)} placeholder="RC-10492" /></Field>
          <Field label="Email *"><input type="email" value={co.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="james@example.com" /></Field>
          <Field label="Phone *"><input type="tel" value={co.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="(312) 555-0000" /></Field>
          <Field label="City"><input type="text" value={co.city || ''} onChange={(e) => set('city', e.target.value)} placeholder="Chicago" /></Field>
          <Field label="State">
            <select value={co.state || 'IL'} onChange={(e) => set('state', e.target.value)}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section label="Certifications">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {CERTS.map((cert) => {
            const on = activeCerts.includes(cert);
            return (
              <label key={cert} onClick={() => toggleCert(cert)} className="flex items-center gap-2.5" style={{ padding: '10px 14px', border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, cursor: 'pointer', background: on ? 'rgba(27,42,94,0.04)' : 'var(--wh)', transition: 'all 0.15s' }}>
                <div style={{ width: 16, height: 16, border: `2px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--nv)' : 'transparent', flexShrink: 0, transition: 'all 0.15s' }}>
                  {on && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{cert}</span>
              </label>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        {label}
        <span style={{ flex: 1, height: 1, background: 'var(--rl)', display: 'block' }} />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <style>{`input,select{font-family:'Barlow',sans-serif;font-size:14px;color:var(--ink);background:var(--wh);border:1.5px solid var(--rl);padding:10px 13px;outline:none;width:100%;}input:focus,select:focus{border-color:var(--nv);box-shadow:0 0 0 3px var(--sdim);}input::placeholder{color:#b8c4d8;}`}</style>
      {children}
    </div>
  );
}

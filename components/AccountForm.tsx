'use client';
import { useState, useEffect, useRef } from 'react';
import type { Company } from '@/lib/types';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const CERTS = ['GAF Certified Contractor','Owens Corning Preferred','NRCA Member','FM Approved Installer'];

interface Props { company: Company; }

export default function AccountForm({ company }: Props) {
  const [form, setForm] = useState({
    name: company.name || '',
    owner_name: company.owner_name || '',
    license_number: company.license_number || '',
    email: company.email || '',
    phone: company.phone || '',
    city: company.city || '',
    state: company.state || 'IL',
  });
  const [certs, setCerts] = useState<string[]>(company.certifications || []);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logo_url || null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const update: Record<string, unknown> = { ...form, certifications: certs };

      if (logoFile) {
        const path = `${user.id}/logo/${logoFile.name}`;
        await supabase.storage.from('company-assets').upload(path, logoFile, { upsert: true });
        const { data: u } = supabase.storage.from('company-assets').getPublicUrl(path);
        update.logo_url = u.publicUrl;
      }

      const { error: err } = await supabase.from('companies').update(update).eq('id', company.id);
      if (err) throw new Error(err.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--nd)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>Account Settings</div>
          <div style={{ fontSize: 12, color: 'var(--mt)', marginTop: 3, fontWeight: 300 }}>Manage your company profile and preferences</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>✓ Saved</span>}
          {error && <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{error}</span>}
          <button
            onClick={save}
            disabled={saving}
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '9px 22px', border: 'none', cursor: saving ? 'default' : 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px', maxWidth: 720 }}>
        <Card label="Company Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <F label="Company Name *" span={2}><input value={form.name} onChange={(e) => set('name', e.target.value)} /></F>
            <F label="Owner / Contact Name *"><input value={form.owner_name} onChange={(e) => set('owner_name', e.target.value)} /></F>
            <F label="License Number"><input value={form.license_number} onChange={(e) => set('license_number', e.target.value)} /></F>
            <F label="Email *"><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></F>
            <F label="Phone"><input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></F>
            <F label="City"><input value={form.city} onChange={(e) => set('city', e.target.value)} /></F>
            <F label="State">
              <select value={form.state} onChange={(e) => set('state', e.target.value)}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </F>
          </div>
        </Card>

        <Card label="Company Logo">
          <LogoDropzone logoFile={logoFile} preview={logoPreview} onSelect={(f) => { setLogoFile(f); if (f) setLogoPreview(URL.createObjectURL(f)); }} />
        </Card>

        <Card label="Certifications">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CERTS.map((c) => {
              const on = certs.includes(c);
              return (
                <label
                  key={c}
                  onClick={() => setCerts(on ? certs.filter((x) => x !== c) : [...certs, c])}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, cursor: 'pointer', background: on ? 'rgba(27,42,94,0.04)' : '#fff' }}
                >
                  <div style={{ width: 16, height: 16, border: `2px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--nv)' : 'transparent', flexShrink: 0 }}>
                    {on && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{c}</span>
                </label>
              );
            })}
          </div>
        </Card>
      </div>
      <style>{`input,select{font-family:'Barlow',sans-serif;font-size:14px;color:var(--ink);background:#fff;border:1.5px solid var(--rl);padding:10px 13px;outline:none;width:100%;}input:focus,select:focus{border-color:var(--nv);}input::placeholder{color:#b8c4d8;}`}</style>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', marginBottom: 24, boxShadow: '0 1px 4px rgba(20,30,71,0.07)' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--rl)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--nv)' }}>
        {label}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function F({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: span ? `span ${span}` : undefined }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}

function LogoDropzone({ logoFile, preview, onSelect }: { logoFile: File | null; preview: string | null; onSelect: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{ border: `2px dashed ${preview ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', cursor: 'pointer', background: '#fff', transition: 'border-color 0.15s' }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); }} />
      <div style={{ width: 56, height: 56, flexShrink: 0, border: '1.5px solid var(--rl)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: preview ? 'transparent' : '#f5f7fb', borderRadius: 6, overflow: 'hidden' }}>
        {preview
          ? <img src={preview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 22, opacity: 0.2 }}>🏢</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ir)', marginBottom: 3 }}>
          {logoFile ? logoFile.name : (preview ? 'Current logo · click to change' : 'Click to upload your logo')}
        </div>
        <div style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300 }}>PNG, JPG or SVG · Appears on every proposal cover</div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const CERTS = ['GAF Certified Contractor','Owens Corning Preferred','NRCA Member','FM Approved Installer'];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [certs, setCerts] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', owner_name: '', license_number: '', email: '', phone: '', city: '', state: 'IL' });

  useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.from('companies').select('id').limit(1).then(({ data }) => {
        if (data && data.length > 0) router.push('/dashboard');
      });
    });
  }, [router]);

  async function save() {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      let logo_url: string | null = null;
      if (logoFile) {
        const path = `${user.id}/logo/${logoFile.name}`;
        await supabase.storage.from('company-assets').upload(path, logoFile, { upsert: true });
        const { data: u } = supabase.storage.from('company-assets').getPublicUrl(path);
        logo_url = u.publicUrl;
      }

      await supabase.from('companies').insert({ ...form, user_id: user.id, certifications: certs, logo_url });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e7f0', padding: '20px 0' }}>
      <div style={{ background: '#fff', width: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 12px 60px rgba(20,30,71,0.15)' }}>
        <div style={{ background: 'var(--nd)', padding: '28px 36px', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,var(--sv),var(--sl),transparent)' }} />
          <div style={{ marginBottom: 16 }}>
            <img src="/Scopeify_Logo_Inversed_v2.png" alt="Scopeify" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#fff', letterSpacing: '0.02em', marginBottom: 4 }}>Company Setup</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>Fill this in once – it appears on every proposal you generate.</div>
        </div>

        <div style={{ padding: '32px 36px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--sv)', marginBottom: 20 }}>Step 1 of 1 – Your Business</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <F label="Company Name *" span={2}><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Apex Commercial Roofing" /></F>
            <F label="Owner / Contact Name *"><input value={form.owner_name} onChange={(e) => set('owner_name', e.target.value)} placeholder="James Whitfield" /></F>
            <F label="License Number"><input value={form.license_number} onChange={(e) => set('license_number', e.target.value)} placeholder="RC-10492" /></F>
            <F label="Email *"><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="james@example.com" /></F>
            <F label="Phone *"><input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(312) 555-0000" /></F>
            <F label="City"><input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Chicago" /></F>
            <F label="State"><select value={form.state} onChange={(e) => set('state', e.target.value)}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></F>
          </div>

          <div style={{ marginBottom: 20 }}>
            <SectionLbl>Company Logo</SectionLbl>
            <LogoDropzone logoFile={logoFile} onSelect={setLogoFile} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <SectionLbl>Certifications</SectionLbl>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CERTS.map((c) => {
                const on = certs.includes(c);
                return (
                  <label key={c} onClick={() => setCerts(on ? certs.filter((x) => x !== c) : [...certs, c])} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: `1.5px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, cursor: 'pointer', background: on ? 'rgba(27,42,94,0.04)' : '#fff' }}>
                    <div style={{ width: 16, height: 16, border: `2px solid ${on ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--nv)' : 'transparent', flexShrink: 0 }}>
                      {on && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button onClick={save} disabled={loading} style={{ width: '100%', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, padding: '11px 22px', border: 'none', cursor: loading ? 'default' : 'pointer', letterSpacing: '0.04em', background: 'var(--nv)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {loading ? 'Saving...' : 'Save & Go to Dashboard →'}
          </button>
        </div>
      </div>
      <style>{`input,select{font-family:'Barlow',sans-serif;font-size:14px;color:var(--ink);background:#fff;border:1.5px solid var(--rl);padding:10px 13px;outline:none;width:100%;}input::placeholder{color:#b8c4d8;}`}</style>
    </div>
  );
}

function LogoDropzone({ logoFile, onSelect }: { logoFile: File | null; onSelect: (f: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [logoFile]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{ border: `2px dashed ${preview ? 'var(--nv)' : 'var(--rl)'}`, display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', cursor: 'pointer', background: '#fff', transition: 'border-color 0.15s' }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onSelect(e.target.files?.[0] || null)} />
      <div style={{ width: 56, height: 56, flexShrink: 0, border: '1.5px solid var(--rl)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: preview ? 'transparent' : '#f5f7fb', borderRadius: 6, overflow: 'hidden' }}>
        {preview
          ? <img src={preview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 22, opacity: 0.2 }}>🏢</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ir)', marginBottom: 3 }}>
          {logoFile ? logoFile.name : 'Click to upload your logo'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--mt)', fontWeight: 300 }}>PNG, JPG or SVG · Appears on every proposal cover</div>
      </div>
    </div>
  );
}

function SectionLbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>{children}<span style={{ flex: 1, height: 1, background: 'var(--rl)', display: 'block' }} /></div>;
}

function F({ label, children, span }: { label: string; children: React.ReactNode; span?: number }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: span ? `span ${span}` : undefined }}><label style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>{children}</div>;
}

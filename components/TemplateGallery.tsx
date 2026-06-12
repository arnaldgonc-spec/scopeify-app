'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import type { Company } from '@/lib/types';
import type { TemplateDefinition } from '@/lib/templates/types';

interface PresetLite { id: string; name: string; description: string; definition: TemplateDefinition; }
interface CustomLite { id: string; name: string; description: string; definition: TemplateDefinition; updated_at: string; }

export default function TemplateGallery({ company, presets, custom, canCreateCustom }: {
  company: Company; presets: PresetLite[]; custom: CustomLite[]; canCreateCustom: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function duplicatePreset(p: PresetLite) {
    if (!canCreateCustom) { alert('Custom templates are a Pro feature. Upgrade on the Billing page.'); return; }
    setBusy(true);
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data, error } = await supabase.from('report_templates').insert({
      company_id: company.id,
      name: `${p.name} (Custom)`,
      description: p.description,
      definition: p.definition,
    }).select('id').single();
    setBusy(false);
    if (error || !data) { alert('Could not create template.'); return; }
    router.push(`/templates/${data.id}/edit`);
  }

  async function deleteCustom(id: string) {
    if (!confirm('Delete this template?')) return;
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    await supabase.from('report_templates').delete().eq('id', id);
    router.refresh();
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mt)' }}>Report Templates</div>
        </div>

        <div style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }}>
          {!canCreateCustom && (
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#9a3412' }}>
              Custom templates are a <strong>Pro</strong> feature. You can use any preset now — upgrade to build your own.
            </div>
          )}

          <SectionHead>Preset Templates</SectionHead>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 36 }}>
            {presets.map((p) => (
              <Card key={p.id} title={p.name} desc={p.description} theme={p.definition.theme}>
                <button onClick={() => duplicatePreset(p)} disabled={busy} style={btn(true)}>Customize</button>
              </Card>
            ))}
          </div>

          <SectionHead>My Templates</SectionHead>
          {custom.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--mt)' }}>No custom templates yet. Customize a preset to get started.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {custom.map((c) => (
                <Card key={c.id} title={c.name} desc={c.description} theme={c.definition.theme}>
                  <button onClick={() => router.push(`/templates/${c.id}/edit`)} style={btn(true)}>Edit</button>
                  <button onClick={() => deleteCustom(c.id)} style={btn(false)}>Delete</button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function btn(primary: boolean): React.CSSProperties {
  return { fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '7px 14px', cursor: 'pointer',
    border: primary ? 'none' : '1.5px solid var(--rl)', background: primary ? 'var(--nv)' : '#fff', color: primary ? '#fff' : 'var(--mt)' };
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nv)', marginBottom: 14 }}>{children}</div>;
}

function Card({ title, desc, theme, children }: { title: string; desc: string; theme: TemplateDefinition['theme']; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--rl)' }}>
      <div style={{ height: 84, background: theme.primary, display: 'flex', alignItems: 'flex-end', padding: 14, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: theme.accent }} />
        <div style={{ fontFamily: theme.headingFont, color: '#fff', fontSize: 22, letterSpacing: '0.03em' }}>{title}</div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--ir)', lineHeight: 1.5, marginBottom: 14, minHeight: 36 }}>{desc}</div>
        <div style={{ display: 'flex', gap: 8 }}>{children}</div>
      </div>
    </div>
  );
}

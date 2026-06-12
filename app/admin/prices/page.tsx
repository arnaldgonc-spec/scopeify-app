export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient } from '@/lib/billing';
import Sidebar from '@/components/Sidebar';
import type { Company } from '@/lib/types';

interface PriceRow {
  id: string; state: string; roof_type: string; work_type: string;
  labor_per_sq: number; material_per_sq: number; tearoff_per_sq: number; insulation_per_sq: number;
  confidence: string; sources: { supplier: string; url?: string; note?: string }[];
  effective_date: string;
}
interface Run {
  id: string; started_at: string; finished_at: string | null; status: string;
  model: string | null; rows_written: number; error: string | null;
}

// Server action: trigger the price-research cron internally with the secret.
async function runNow() {
  'use server';
  // Server actions are public endpoints — re-check admin access here.
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user?.email)) return;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await fetch(`${origin}/api/cron/update-prices`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.CRON_SECRET ?? ''}` },
  }).catch(() => {});
}

// Comma-separated list of emails allowed into /admin (e.g. "you@company.com").
function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

export default async function AdminPricesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.email)) redirect('/dashboard');
  const { data: company } = await supabase
    .from('companies').select('*').eq('user_id', user.id).single();
  if (!company) redirect('/onboarding');

  // Read with service role so RLS doesn't hide rows during setup.
  const svc = serviceClient();
  const { data: prices } = await svc
    .from('material_prices')
    .select('*')
    .order('effective_date', { ascending: false })
    .order('state', { ascending: true })
    .limit(400);
  const { data: runs } = await svc
    .from('price_research_runs')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(5);

  // Keep only the latest row per state+roof_type+work_type for the main table.
  const latest = new Map<string, PriceRow>();
  for (const p of (prices ?? []) as PriceRow[]) {
    const key = `${p.state}|${p.roof_type}|${p.work_type}`;
    if (!latest.has(key)) latest.set(key, p);
  }
  const rows = [...latest.values()];
  const lastRun = (runs ?? [])[0] as Run | undefined;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar company={company as Company} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid var(--rl)', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mt)' }}>Material Price Database</div>
          <form action={runNow}>
            <button type="submit" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, padding: '8px 16px', background: 'var(--nv)', color: '#fff', border: 'none', cursor: 'pointer' }}>Run research now</button>
          </form>
        </div>

        <div style={{ padding: 40, maxWidth: 1100, margin: '0 auto' }}>
          {/* Last run status */}
          <div style={{ background: '#fff', border: '1.5px solid var(--rl)', padding: '16px 20px', marginBottom: 24, fontSize: 13, color: 'var(--ir)' }}>
            {lastRun ? (
              <>Last run: <strong>{lastRun.status}</strong> · {lastRun.rows_written} rows · {new Date(lastRun.started_at).toLocaleString()} · model {lastRun.model}
              {lastRun.error && <span style={{ color: '#9a3412' }}> · {lastRun.error}</span>}</>
            ) : (
              <>No research runs yet. Click “Run research now” or wait for the weekly Monday job.</>
            )}
          </div>

          {rows.length === 0 ? (
            <div style={{ fontSize: 14, color: 'var(--mt)' }}>No live prices yet — estimates are using seed pricing until the first research run completes.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--nd)', color: '#fff', textAlign: 'left' }}>
                  {['State', 'Roof', 'Labor', 'Material', 'Tear-off', 'Insul.', 'Conf.', 'Effective', 'Sources'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--rl)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{r.state}</td>
                    <td style={{ padding: '8px 12px' }}>{r.roof_type}</td>
                    <td style={{ padding: '8px 12px' }}>${Number(r.labor_per_sq).toFixed(0)}</td>
                    <td style={{ padding: '8px 12px' }}>${Number(r.material_per_sq).toFixed(0)}</td>
                    <td style={{ padding: '8px 12px' }}>${Number(r.tearoff_per_sq).toFixed(0)}</td>
                    <td style={{ padding: '8px 12px' }}>${Number(r.insulation_per_sq).toFixed(0)}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: r.confidence === 'high' ? '#15803d' : r.confidence === 'low' ? '#9a3412' : 'var(--mt)' }}>{r.confidence}</span>
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--mt)' }}>{r.effective_date}</td>
                    <td style={{ padding: '8px 12px', maxWidth: 240 }}>
                      <details>
                        <summary style={{ cursor: 'pointer', color: 'var(--nv)', fontSize: 12 }}>{r.sources?.length ?? 0} sources</summary>
                        <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 11, color: 'var(--mt)' }}>
                          {(r.sources ?? []).map((s, i) => (
                            <li key={i}>{s.supplier}{s.url ? ` — ${s.url}` : ''}{s.note ? ` (${s.note})` : ''}</li>
                          ))}
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

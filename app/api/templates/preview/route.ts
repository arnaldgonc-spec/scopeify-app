import { renderProposalHtml } from '@/lib/templates/render';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { TemplateDefinition, RenderData } from '@/lib/templates/types';

export const runtime = 'nodejs';

const SAMPLE: Omit<RenderData, 'logoSrc'> = {
  company: {
    name: 'Apex Commercial Roofing', owner_name: 'James Whitfield',
    email: 'james@apexroofing.com', phone: '(312) 555-0142',
    city: 'Chicago', state: 'IL', license_number: 'RC-10492',
    certifications: ['GAF Certified', 'NRCA Member'], logo_url: null,
  },
  proposal: {
    proposal_number: 'SCO-2026-0042',
    client_name: 'Lakeside Logistics', client_contact_name: 'Dana Reyes',
    property_address: '4400 W Industrial Pkwy', property_city: 'Aurora',
    property_state: 'IL', property_zip: '60504', property_type: 'Industrial / Warehouse',
    ai_scope_narrative: 'Full tear-off and replacement of the existing 42,000 sq ft EPDM roof with a fully-adhered 60-mil TPO membrane system. Includes new polyiso insulation to R-30, all penetration flashings, and a 20-year manufacturer warranty.',
    ai_line_items: [
      { title: 'Tear-Off & Disposal', specification: 'Remove existing EPDM to deck', quantity: 420, unit: 'SQ', line_total: 12600 },
      { title: 'Insulation System', specification: 'R-30 polyiso, 2 layers', quantity: 420, unit: 'SQ', line_total: 21000 },
      { title: 'TPO Membrane Installation', specification: '60-mil fully adhered', quantity: 420, unit: 'SQ', line_total: 58800 },
      { title: 'Penetrations & Flashings', specification: 'HVAC curbs, drains, parapet', quantity: 1, unit: 'LS', line_total: 9400 },
    ],
    final_price: 101800, ai_estimate_low: 96000, ai_estimate_high: 112000,
    photo_condition_score: 64,
    payment_terms: { deposit_pct: 30, deposit_note: 'Due at signing', progress_pct: 40, progress_note: 'At tear-off', final_pct: 30, final_note: 'At completion' },
    warranty_data: { manufacturer: 'GAF', manufacturer_years: 20, warranty_type: 'NDL', workmanship_years: 5, leak_free_years: 2 },
    valid_days: 30, invoice_terms: 'Net-15',
  },
  photos: [
    { public_url: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800', caption: 'Ponding water near central drain', slot_label: 'Drain / Ponding', analysis: { severity: 'moderate', condition_score: 58 } },
    { public_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', caption: 'Membrane seam separation at NE corner', slot_label: 'NE Corner', analysis: { severity: 'severe', condition_score: 41 } },
  ],
  coverPhoto: null,
};

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { definition } = (await request.json()) as { definition: TemplateDefinition };
    const html = renderProposalHtml(definition, {
      ...SAMPLE,
      logoSrc: 'https://dummyimage.com/200x60/1b2a5e/ffffff&text=YOUR+LOGO',
    });
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Preview HTML embeds user-edited content; keep it sandboxed.
        'Content-Security-Policy': "default-src 'none'; img-src https: data:; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com",
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (err) {
    console.error('template preview error:', err);
    return new Response('<p>Preview failed</p>', { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}

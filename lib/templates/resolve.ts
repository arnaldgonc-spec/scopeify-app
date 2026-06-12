import type { SupabaseClient } from '@supabase/supabase-js';
import type { TemplateDefinition } from './types';
import { getPreset } from './presets';

// Resolve the template definition for a proposal. Returns null when no template
// is selected, so callers can fall back to the legacy proposal-template.html.
export async function resolveTemplate(
  supabase: SupabaseClient,
  opts: { template_id?: string | null; template_preset?: string | null; company_id?: string | null }
): Promise<TemplateDefinition | null> {
  if (opts.template_id) {
    let query = supabase
      .from('report_templates')
      .select('definition')
      .eq('id', opts.template_id);
    // When called with a service-role client (which bypasses RLS), restrict
    // the lookup to the company that owns the proposal.
    if (opts.company_id) query = query.eq('company_id', opts.company_id);
    const { data } = await query.maybeSingle();
    if (data?.definition) return data.definition as TemplateDefinition;
  }
  if (opts.template_preset) {
    const preset = getPreset(opts.template_preset);
    if (preset) return preset.definition;
  }
  return null;
}

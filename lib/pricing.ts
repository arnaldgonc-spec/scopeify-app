import type { SupabaseClient } from '@supabase/supabase-js';

export interface PricingRow {
  labor_per_sq: number;
  material_per_sq: number;
  tearoff_per_sq: number;
  insulation_per_sq: number;
}

export interface PricingResult {
  pricing: PricingRow | null;
  source: 'live' | 'seed' | 'none';
  effective_date: string | null;
}

const STALE_DAYS = 21;

// Returns the freshest usable pricing for a state/roof/work combo.
// Prefers a recent AI-researched row from material_prices; if the newest live
// row is older than STALE_DAYS (or absent), falls back to regional_pricing seed.
export async function getLatestPricing(
  supabase: SupabaseClient,
  state: string,
  roofType: string,
  workType: string
): Promise<PricingResult> {
  const { data: live } = await supabase
    .from('material_prices')
    .select('labor_per_sq, material_per_sq, tearoff_per_sq, insulation_per_sq, effective_date')
    .eq('state', state)
    .eq('roof_type', roofType)
    .eq('work_type', workType)
    .order('effective_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (live) {
    const ageDays = (Date.now() - new Date(live.effective_date).getTime()) / (24 * 60 * 60 * 1000);
    if (ageDays <= STALE_DAYS) {
      return {
        pricing: {
          labor_per_sq: Number(live.labor_per_sq),
          material_per_sq: Number(live.material_per_sq),
          tearoff_per_sq: Number(live.tearoff_per_sq),
          insulation_per_sq: Number(live.insulation_per_sq),
        },
        source: 'live',
        effective_date: live.effective_date,
      };
    }
  }

  const { data: seed } = await supabase
    .from('regional_pricing')
    .select('labor_per_sq, material_per_sq, tearoff_per_sq, insulation_per_sq')
    .eq('state', state)
    .eq('roof_type', roofType)
    .eq('work_type', workType)
    .maybeSingle();

  if (seed) {
    return {
      pricing: {
        labor_per_sq: Number(seed.labor_per_sq),
        material_per_sq: Number(seed.material_per_sq),
        tearoff_per_sq: Number(seed.tearoff_per_sq),
        insulation_per_sq: Number(seed.insulation_per_sq),
      },
      source: 'seed',
      effective_date: live?.effective_date ?? null,
    };
  }

  return { pricing: null, source: 'none', effective_date: null };
}

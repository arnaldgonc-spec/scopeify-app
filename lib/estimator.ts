import type { RoofData } from './types';

interface PricingRow {
  labor_per_sq: number;
  material_per_sq: number;
  tearoff_per_sq: number;
  insulation_per_sq: number;
}

const FALLBACK: PricingRow = {
  labor_per_sq: 90,
  material_per_sq: 88,
  tearoff_per_sq: 26,
  insulation_per_sq: 48,
};

export function calculateEstimate(pricing: PricingRow | null, roofData: Partial<RoofData>) {
  const p = pricing ?? FALLBACK;
  const area = roofData.area_sqft ?? 0;
  const squares = area / 100;

  const base = (p.labor_per_sq + p.material_per_sq + p.tearoff_per_sq + p.insulation_per_sq) * squares;
  const penetrations =
    (roofData.hvac_count ?? 0) * 140 +
    (roofData.pipe_count ?? 0) * 45 +
    (roofData.drain_count ?? 0) * 330;
  const parapet = (roofData.parapet_lf ?? 0) * 11;
  const accessMult = roofData.access === 'Requires lift / scaffold' ? 1.08 : 1.0;
  const subtotal = (base + penetrations + parapet) * accessMult;

  const low = Math.round(subtotal * 0.87 / 1000) * 1000;
  const high = Math.round(subtotal * 1.15 / 1000) * 1000;
  const midpoint = Math.round(subtotal / 1000) * 1000;

  return { low, high, midpoint };
}

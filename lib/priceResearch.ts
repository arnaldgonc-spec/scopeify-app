// Validation + shaping for AI-researched material prices.

export const ROOF_TYPES = ['TPO', 'EPDM', 'PVC', 'ModBit'] as const;
export type RoofType = (typeof ROOF_TYPES)[number];

// States we research each week (mirrors the regional_pricing seed coverage).
export const RESEARCH_STATES = ['IL', 'TX', 'FL', 'CA', 'NY', 'OH', 'GA', 'AZ', 'WA', 'CO', 'PA', 'NC'];

export interface PriceSource {
  supplier: string;
  url?: string;
  note?: string;
  price_seen?: string;
}

export interface ResearchedPrice {
  state: string;
  roof_type: string;
  work_type: string;
  labor_per_sq: number;
  material_per_sq: number;
  tearoff_per_sq: number;
  insulation_per_sq: number;
  confidence: 'low' | 'medium' | 'high';
  sources: PriceSource[];
}

// Sanity bounds per cost component ($/square = 100 sq ft of installed roofing).
const BOUNDS = {
  labor_per_sq: [40, 250],
  material_per_sq: [40, 250],
  tearoff_per_sq: [10, 80],
  insulation_per_sq: [20, 120],
} as const;

export interface PriorPrice {
  labor_per_sq: number;
  material_per_sq: number;
  tearoff_per_sq: number;
  insulation_per_sq: number;
}

export interface ValidationResult {
  ok: boolean;
  price?: ResearchedPrice;
  reason?: string;
}

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : null;
}

// Validate one researched row. Out-of-range rows are rejected; rows that deviate
// >40% from the prior known price are downgraded to low confidence (not rejected).
export function validatePrice(raw: unknown, prior?: PriorPrice | null): ValidationResult {
  if (!raw || typeof raw !== 'object') return { ok: false, reason: 'not_an_object' };
  const r = raw as Record<string, unknown>;

  const state = typeof r.state === 'string' ? r.state.trim().toUpperCase().slice(0, 2) : '';
  const roof_type = typeof r.roof_type === 'string' ? r.roof_type.trim() : '';
  if (!state) return { ok: false, reason: 'missing_state' };
  if (!ROOF_TYPES.includes(roof_type as RoofType)) return { ok: false, reason: `bad_roof_type:${roof_type}` };

  const components = ['labor_per_sq', 'material_per_sq', 'tearoff_per_sq', 'insulation_per_sq'] as const;
  const values: Record<string, number> = {};
  for (const key of components) {
    const n = num(r[key]);
    if (n === null) return { ok: false, reason: `missing:${key}` };
    const [lo, hi] = BOUNDS[key];
    if (n < lo || n > hi) return { ok: false, reason: `out_of_range:${key}=${n}` };
    values[key] = n;
  }

  let confidence: ResearchedPrice['confidence'] =
    r.confidence === 'high' || r.confidence === 'low' ? r.confidence : 'medium';

  if (prior) {
    for (const key of components) {
      const before = prior[key];
      if (before > 0 && Math.abs(values[key] - before) / before > 0.4) {
        confidence = 'low';
        break;
      }
    }
  }

  const sources: PriceSource[] = Array.isArray(r.sources)
    ? (r.sources as unknown[]).slice(0, 8).map((s) => {
        const so = (s ?? {}) as Record<string, unknown>;
        return {
          supplier: String(so.supplier ?? '').slice(0, 80),
          url: so.url ? String(so.url).slice(0, 400) : undefined,
          note: so.note ? String(so.note).slice(0, 300) : undefined,
          price_seen: so.price_seen ? String(so.price_seen).slice(0, 80) : undefined,
        };
      })
    : [];

  return {
    ok: true,
    price: {
      state,
      roof_type,
      work_type: typeof r.work_type === 'string' && r.work_type.trim() ? r.work_type.trim() : 'Full Tear-Off & Replacement',
      ...values,
      confidence,
      sources,
    } as ResearchedPrice,
  };
}

// Extract a JSON array of price rows from a (possibly chatty) model response.
export function parsePriceArray(content: string): unknown[] {
  const trimmed = content.trim();
  // Try direct parse first.
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray((parsed as Record<string, unknown>).prices)) {
      return (parsed as Record<string, unknown>).prices as unknown[];
    }
  } catch {
    /* fall through to bracket extraction */
  }
  // Fall back: grab the first [...] block.
  const start = trimmed.indexOf('[');
  const end = trimmed.lastIndexOf(']');
  if (start !== -1 && end > start) {
    try {
      const arr = JSON.parse(trimmed.slice(start, end + 1));
      if (Array.isArray(arr)) return arr;
    } catch {
      /* give up */
    }
  }
  return [];
}

export function buildResearchPrompt(state: string, roofTypes: readonly string[]): string {
  return `Research current commercial roofing installed costs for the US state of ${state}.
For EACH of these membrane types: ${roofTypes.join(', ')}, estimate the cost PER SQUARE (one square = 100 sq ft) for a full tear-off and replacement, broken into four components:
- labor_per_sq (installation labor)
- material_per_sq (membrane + fasteners/adhesive)
- tearoff_per_sq (removal & disposal of the existing roof)
- insulation_per_sq (polyiso/cover board)

Reference current market pricing from these suppliers where possible: ABC Supply, Beacon, SRS Distribution, Home Depot, Lowe's, plus public commercial roofing estimating sources. Use today's market, not historical averages.

Return ONLY a JSON array (no prose) of objects with exactly these keys:
state, roof_type, work_type, labor_per_sq, material_per_sq, tearoff_per_sq, insulation_per_sq, confidence ("low"|"medium"|"high"), sources (array of {supplier, url, note, price_seen}).
state must be "${state}". roof_type must be one of: ${roofTypes.join(', ')}. Include one object per roof type.`;
}

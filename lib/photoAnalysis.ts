// Shaping + validation for Groq vision photo analysis.

export type Severity = 'none' | 'low' | 'moderate' | 'severe';

export interface PhotoAnalysis {
  is_roof_photo: boolean;
  damage_types: string[];
  severity: Severity;
  condition_score: number; // 0 (failed) – 100 (pristine)
  suggested_caption: string;
  observations: string;
}

const SEVERITIES: Severity[] = ['none', 'low', 'moderate', 'severe'];

function clampScore(v: unknown): number {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Normalize a raw model response into a safe PhotoAnalysis.
export function normalizeAnalysis(raw: unknown): PhotoAnalysis {
  const r = (raw ?? {}) as Record<string, unknown>;
  const isRoof = r.is_roof_photo !== false; // default true unless explicitly false
  const severity = SEVERITIES.includes(r.severity as Severity) ? (r.severity as Severity) : 'low';
  const damage = Array.isArray(r.damage_types)
    ? (r.damage_types as unknown[]).map((d) => String(d).slice(0, 60)).slice(0, 8)
    : [];
  return {
    is_roof_photo: isRoof,
    damage_types: damage,
    severity: isRoof ? severity : 'none',
    condition_score: isRoof ? clampScore(r.condition_score) : 0,
    suggested_caption: String(r.suggested_caption ?? '').slice(0, 160),
    observations: String(r.observations ?? '').slice(0, 600),
  };
}

export const PHOTO_SYSTEM_PROMPT = `You are a licensed commercial roof inspector reviewing a single site photo.
Assess the roof's visible condition. Respond with ONLY a JSON object with these keys:
- "is_roof_photo": boolean (false if the image clearly is not a roof)
- "damage_types": array of short strings (e.g. "ponding water", "membrane blistering", "open seams", "flashing failure", "punctures"); empty array if none visible
- "severity": one of "none" | "low" | "moderate" | "severe"
- "condition_score": integer 0-100 (100 = pristine, 0 = failed/needs full replacement)
- "suggested_caption": one concise sentence suitable for a client proposal (no inch symbols; write "in")
- "observations": 1-3 sentences of professional notes
No markdown, no extra text.`;

// Map the average condition score (0-100) into a 0-85 "coverage confidence" band
// consistent with the existing checklist-based score.
export function conditionToConfidence(avgScore: number): number {
  return Math.round(Math.max(0, Math.min(85, (avgScore / 100) * 85)));
}

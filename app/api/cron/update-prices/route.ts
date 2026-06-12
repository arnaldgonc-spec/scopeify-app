import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import Groq from 'groq-sdk';
import { serviceClient } from '@/lib/billing';
import {
  RESEARCH_STATES, ROOF_TYPES, buildResearchPrompt, parsePriceArray,
  validatePrice, type PriorPrice,
} from '@/lib/priceResearch';

export const runtime = 'nodejs';
export const maxDuration = 300;

const MODEL = 'groq/compound';

async function runResearch() {
  const supabase = serviceClient();
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

  const { data: run } = await supabase
    .from('price_research_runs')
    .insert({ status: 'running', model: MODEL })
    .select('id')
    .single();
  const runId = run?.id as string | undefined;

  let written = 0;
  let failures = 0;

  for (const state of RESEARCH_STATES) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a commercial roofing cost researcher. Use web search for current prices. Respond with JSON only.' },
          { role: 'user', content: buildResearchPrompt(state, ROOF_TYPES) },
        ],
        temperature: 0.2,
      });

      const content = completion.choices[0]?.message?.content ?? '';
      const rows = parsePriceArray(content);

      for (const raw of rows) {
        const roofType = (raw as Record<string, unknown>)?.roof_type;
        // Fetch the latest prior price for deviation checks.
        const { data: prior } = await supabase
          .from('material_prices')
          .select('labor_per_sq, material_per_sq, tearoff_per_sq, insulation_per_sq')
          .eq('state', state)
          .eq('roof_type', String(roofType ?? ''))
          .order('effective_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        const result = validatePrice(raw, (prior as PriorPrice | null) ?? null);
        if (!result.ok || !result.price) {
          failures++;
          console.warn(`price rejected (${state}/${String(roofType)}):`, result.reason);
          continue;
        }
        const { error } = await supabase.from('material_prices').insert({
          ...result.price,
          run_id: runId,
        });
        if (error) { failures++; console.error('insert error:', error.message); }
        else written++;
      }
    } catch (err) {
      failures++;
      console.error(`research failed for ${state}:`, err);
    }
  }

  const status = written === 0 ? 'failed' : failures > 0 ? 'partial' : 'success';
  if (runId) {
    await supabase.from('price_research_runs').update({
      finished_at: new Date().toISOString(),
      status,
      rows_written: written,
      error: failures > 0 ? `${failures} rows rejected/failed` : null,
    }).eq('id', runId);
  }

  return { status, written, failures, runId };
}

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  // Constant-time compare to avoid leaking the secret via timing.
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const result = await runResearch();
    return NextResponse.json(result);
  } catch (err) {
    console.error('update-prices error:', err);
    return NextResponse.json({ error: 'research_failed' }, { status: 500 });
  }
}

// Allow the admin "Run now" server action to trigger via POST as well.
export async function POST(request: Request) {
  return GET(request);
}

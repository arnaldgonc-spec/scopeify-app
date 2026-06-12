import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient } from '@/lib/billing';
import { calculateEstimate } from '@/lib/estimator';
import { getLatestPricing } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await request.json();
    const { state, roofType, workType, roofData } = body;

    const supabase = serviceClient();

    // Prefer fresh AI-researched pricing; fall back to seed data when stale/absent.
    const { pricing, source, effective_date } = await getLatestPricing(
      supabase, state, roofType, workType
    );

    const result = calculateEstimate(pricing, roofData);
    return NextResponse.json({ ...result, price_source: source, price_effective_date: effective_date });
  } catch (err) {
    console.error('calculate-estimate error:', err);
    return NextResponse.json({ error: 'calculation_failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateEstimate } from '@/lib/estimator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { state, roofType, workType, roofData } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: pricing } = await supabase
      .from('regional_pricing')
      .select('*')
      .eq('state', state)
      .eq('roof_type', roofType)
      .eq('work_type', workType)
      .single();

    const result = calculateEstimate(pricing, roofData);
    return NextResponse.json(result);
  } catch (err) {
    console.error('calculate-estimate error:', err);
    return NextResponse.json({ error: 'calculation_failed' }, { status: 500 });
  }
}

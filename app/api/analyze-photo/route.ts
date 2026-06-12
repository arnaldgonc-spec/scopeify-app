import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAccessForUser } from '@/lib/billing';
import { normalizeAnalysis, PHOTO_SYSTEM_PROMPT } from '@/lib/photoAnalysis';

export const runtime = 'nodejs';
export const maxDuration = 60;

const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export async function POST(request: Request) {
  try {
    const { imageBase64, slotLabel } = (await request.json()) as {
      imageBase64: string; slotLabel?: string;
    };
    if (!imageBase64) return NextResponse.json({ error: 'missing_image' }, { status: 400 });
    // Only accept inline image data (no remote URLs), capped at ~10MB of base64.
    if (
      typeof imageBase64 !== 'string' ||
      !imageBase64.startsWith('data:image/') ||
      imageBase64.length > 14_000_000
    ) {
      return NextResponse.json({ error: 'invalid_image' }, { status: 400 });
    }

    // Gate behind an active subscription/trial.
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const access = await checkAccessForUser(supabase, user.id);
    if (!access.ok) return NextResponse.json({ error: 'no_subscription' }, { status: 402 });

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    const completion = await groq.chat.completions.create({
      model: VISION_MODEL,
      temperature: 0.2,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: PHOTO_SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Photo slot: ${slotLabel ?? 'site photo'}. Analyze this roof photo.` },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ],
        },
      ],
    });

    const raw = (completion.choices[0]?.message?.content ?? '').trim();
    let parsed: unknown = {};
    try { parsed = JSON.parse(raw); } catch { /* normalizeAnalysis handles empties */ }
    const analysis = normalizeAnalysis(parsed);

    return NextResponse.json({
      analysis,
      status: analysis.is_roof_photo ? 'done' : 'skipped',
    });
  } catch (err) {
    console.error('analyze-photo error:', err);
    return NextResponse.json({ error: 'analysis_failed' }, { status: 500 });
  }
}

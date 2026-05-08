import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import type { FormState } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const formState: FormState = await request.json();
    const { company, roof_data, scope_data, property_address, property_city, property_state, property_type, client_name } = formState;
    const area = roof_data?.area_sqft ?? 0;
    const squares = Math.round(area / 100);
    const membrane = scope_data?.new_membrane_type ?? 'TPO';

    const systemPrompt = `You are a senior commercial roofing estimator. Output ONLY a JSON object with two keys: "narrative" and "line_items". No extra text, no markdown.

"narrative" must be a JSON string (enclosed in double quotes) containing 2-3 sentences describing the project scope.

"line_items" must be a JSON array of exactly 6 objects. Each object has these keys:
- "title": string
- "description": string (1-2 sentences, no inch marks — write inch or in instead of the inch symbol)
- "specification": string (brief, no inch marks)
- "quantity": number
- "unit": string
- "line_total": number

The 6 titles must be exactly:
1. "Tear-Off & Disposal"
2. "Deck Inspection & Repair"
3. "Insulation System"
4. "${membrane} Membrane Installation"
5. "Penetrations, Flashings & Drainage"
6. "Final Inspection & Warranty Registration"`;

    const userPrompt = `Project data:
Company: ${company?.name ?? 'Contractor'}, ${company?.city ?? ''}, ${company?.state ?? ''}
Client: ${client_name}
Property: ${property_address}, ${property_city}, ${property_state} — ${property_type}
Existing Roof: ${roof_data?.existing_roof_type ?? 'Unknown'}, ${roof_data?.roof_age ?? 0} years old
Roof Area: ${area.toLocaleString()} sq ft (${squares} squares)
Stories: ${roof_data?.stories ?? 1} | HVAC Curbs: ${roof_data?.hvac_count ?? 0} | Pipe Penetrations: ${roof_data?.pipe_count ?? 0} | Roof Drains: ${roof_data?.drain_count ?? 0}
Parapet: ${roof_data?.parapet_lf ?? 0} LF | Access: ${roof_data?.access ?? 'Interior hatch'}
Work: ${scope_data?.work_types?.join(', ') ?? 'Full Tear-Off & Replacement'}
New Membrane: ${membrane} | Attachment: ${scope_data?.attachment_method ?? 'Fully Adhered'}
Insulation: ${scope_data?.insulation_r_value ?? 'R-15, 2.5in polyiso'}
Duration: ${scope_data?.estimated_duration ?? '1-2 weeks'} | Deck Allowance: ${scope_data?.deck_allowance_sqft ?? 0} sq ft`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const raw = (completion.choices[0]?.message?.content ?? '').trim();

    try {
      const parsed = JSON.parse(raw);
      return NextResponse.json(parsed);
    } catch {
      console.error('generate-scope parse_failed. Raw response:', raw);
      return NextResponse.json({ error: 'parse_failed', raw }, { status: 500 });
    }
  } catch (err) {
    console.error('generate-scope error:', err);
    return NextResponse.json({ error: 'generation_failed' }, { status: 500 });
  }
}

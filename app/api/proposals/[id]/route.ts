import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient } from '@/lib/billing';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAuth = await createServerSupabaseClient();
  // getUser() validates the JWT against Supabase; getSession() only reads the cookie.
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = serviceClient();

  // Verify ownership via company
  const { data: proposal } = await supabase
    .from('proposals')
    .select('id, company_id')
    .eq('id', id)
    .single();

  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('id', proposal.company_id)
    .eq('user_id', user.id)
    .single();

  if (!company) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { error } = await supabase.from('proposals').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

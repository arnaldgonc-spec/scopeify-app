export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { serviceClient, getSubscriptionForCompany } from '@/lib/billing';
import { PRESETS } from '@/lib/templates/presets';
import TemplateGallery from '@/components/TemplateGallery';
import type { Company } from '@/lib/types';

export default async function TemplatesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: company } = await supabase
    .from('companies').select('*').eq('user_id', user.id).single();
  if (!company) redirect('/onboarding');

  const { data: custom } = await supabase
    .from('report_templates')
    .select('id, name, description, definition, updated_at')
    .eq('company_id', company.id)
    .order('updated_at', { ascending: false });

  const sub = await getSubscriptionForCompany(serviceClient(), company.id);
  const isPro = sub?.plan === 'pro' && (sub.status === 'active' || sub.status === 'trialing');

  return (
    <TemplateGallery
      company={company as Company}
      presets={PRESETS.map((p) => ({ id: p.id, name: p.name, description: p.description, definition: p.definition }))}
      custom={custom ?? []}
      canCreateCustom={isPro}
    />
  );
}

export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import TemplateEditor from '@/components/TemplateEditor';
import type { Company } from '@/lib/types';
import type { TemplateDefinition } from '@/lib/templates/types';

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: company } = await supabase
    .from('companies').select('*').eq('user_id', user.id).single();
  if (!company) redirect('/onboarding');

  const { data: tpl } = await supabase
    .from('report_templates')
    .select('id, name, description, definition')
    .eq('id', id)
    .eq('company_id', company.id)
    .maybeSingle();
  if (!tpl) redirect('/templates');

  return (
    <TemplateEditor
      company={company as Company}
      templateId={tpl.id}
      initialName={tpl.name}
      initialDescription={tpl.description ?? ''}
      initialDefinition={tpl.definition as TemplateDefinition}
    />
  );
}

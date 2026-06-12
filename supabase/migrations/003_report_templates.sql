-- Feature 2: Section-based report templates
-- Presets are defined in code (lib/templates/presets.ts) with stable string ids.
-- This table stores only user-created custom templates.

create table if not exists report_templates (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  description text default '',
  definition jsonb not null,
  preview_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table report_templates enable row level security;

create policy "Users can read their templates"
  on report_templates for select
  using (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can insert their templates"
  on report_templates for insert
  with check (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can update their templates"
  on report_templates for update
  using (company_id in (select id from companies where user_id = auth.uid()));
create policy "Users can delete their templates"
  on report_templates for delete
  using (company_id in (select id from companies where user_id = auth.uid()));

create trigger report_templates_updated_at
  before update on report_templates
  for each row execute function update_updated_at();

-- Proposals reference a template. A preset id (text) lives in a separate column so
-- we can point at a code-defined preset OR a stored custom template row.
alter table proposals
  add column if not exists template_id uuid references report_templates(id) on delete set null,
  add column if not exists template_preset text;

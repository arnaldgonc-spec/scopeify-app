-- Scopeify Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies table (one per user)
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  owner_name text not null,
  email text not null,
  phone text,
  city text,
  state text default 'IL',
  license_number text,
  logo_url text,
  certifications text[] default '{}',
  created_at timestamptz default now()
);

alter table companies enable row level security;

create policy "Users can view their own company"
  on companies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own company"
  on companies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own company"
  on companies for update
  using (auth.uid() = user_id);

-- Proposals table
create table if not exists proposals (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  proposal_number text not null,
  path text not null check (path in ('proposal','estimate','assessment')),
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined','expired')),
  client_name text not null default '',
  client_contact_name text default '',
  client_email text default '',
  property_address text default '',
  property_city text default '',
  property_state text default '',
  property_zip text default '',
  property_type text default '',
  roof_data jsonb default '{}',
  scope_data jsonb default '{}',
  ai_scope_narrative text,
  ai_line_items jsonb default '[]',
  ai_estimate_low integer,
  ai_estimate_high integer,
  final_price integer,
  price_source text default 'manual' check (price_source in ('ai','manual')),
  confidence_score integer,
  payment_terms jsonb default '{}',
  warranty_data jsonb default '{}',
  valid_days integer default 30,
  invoice_terms text default 'Net-15',
  credit_card_accepted text default 'Yes – 3% fee',
  pdf_url text,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table proposals enable row level security;

create policy "Users can view proposals for their company"
  on proposals for select
  using (company_id in (select id from companies where user_id = auth.uid()));

create policy "Users can insert proposals for their company"
  on proposals for insert
  with check (company_id in (select id from companies where user_id = auth.uid()));

create policy "Users can update proposals for their company"
  on proposals for update
  using (company_id in (select id from companies where user_id = auth.uid()));

-- Proposal photos table
create table if not exists proposal_photos (
  id uuid primary key default uuid_generate_v4(),
  proposal_id uuid references proposals(id) on delete cascade not null,
  storage_path text not null,
  public_url text not null,
  caption text default '',
  slot_label text default '',
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table proposal_photos enable row level security;

create policy "Users can view photos for their proposals"
  on proposal_photos for select
  using (proposal_id in (
    select p.id from proposals p
    join companies c on c.id = p.company_id
    where c.user_id = auth.uid()
  ));

create policy "Users can insert photos for their proposals"
  on proposal_photos for insert
  with check (proposal_id in (
    select p.id from proposals p
    join companies c on c.id = p.company_id
    where c.user_id = auth.uid()
  ));

-- Regional pricing table (seed data)
create table if not exists regional_pricing (
  id uuid primary key default uuid_generate_v4(),
  state text not null,
  roof_type text not null,
  work_type text not null,
  labor_per_sq numeric not null default 90,
  material_per_sq numeric not null default 88,
  tearoff_per_sq numeric not null default 26,
  insulation_per_sq numeric not null default 48
);

-- Seed regional pricing data
insert into regional_pricing (state, roof_type, work_type, labor_per_sq, material_per_sq, tearoff_per_sq, insulation_per_sq) values
  ('IL', 'TPO', 'Full Tear-Off & Replacement', 95, 90, 28, 50),
  ('IL', 'EPDM', 'Full Tear-Off & Replacement', 88, 82, 26, 48),
  ('TX', 'TPO', 'Full Tear-Off & Replacement', 80, 85, 22, 44),
  ('TX', 'EPDM', 'Full Tear-Off & Replacement', 76, 80, 20, 42),
  ('FL', 'TPO', 'Full Tear-Off & Replacement', 82, 88, 24, 46),
  ('CA', 'TPO', 'Full Tear-Off & Replacement', 110, 95, 32, 55),
  ('NY', 'TPO', 'Full Tear-Off & Replacement', 115, 98, 34, 58),
  ('OH', 'TPO', 'Full Tear-Off & Replacement', 88, 86, 26, 48)
on conflict do nothing;

-- Storage buckets (run via Supabase dashboard or Storage API)
-- Bucket: company-assets (public)
-- Bucket: proposal-photos (public)
-- Bucket: proposal-pdfs (public)

-- Auto-update updated_at on proposals
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger proposals_updated_at
  before update on proposals
  for each row execute function update_updated_at();

-- Feature 1: Weekly material price database
-- An AI research agent (Groq compound, with web search) runs weekly and appends
-- price rows. material_prices is append-only so we keep full price history.

create table if not exists suppliers (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  website text
);

insert into suppliers (name, website) values
  ('ABC Supply', 'https://www.abcsupply.com'),
  ('Beacon', 'https://www.becn.com'),
  ('SRS Distribution', 'https://www.srsdistribution.com'),
  ('Home Depot', 'https://www.homedepot.com'),
  ('Lowe''s', 'https://www.lowes.com')
on conflict (name) do nothing;

create table if not exists price_research_runs (
  id uuid primary key default uuid_generate_v4(),
  started_at timestamptz default now(),
  finished_at timestamptz,
  status text default 'running' check (status in ('running','success','partial','failed')),
  model text,
  rows_written integer default 0,
  error text
);

create table if not exists material_prices (
  id uuid primary key default uuid_generate_v4(),
  state text not null,
  roof_type text not null,                       -- TPO | EPDM | PVC | ModBit
  work_type text not null default 'Full Tear-Off & Replacement',
  labor_per_sq numeric not null,
  material_per_sq numeric not null,
  tearoff_per_sq numeric not null,
  insulation_per_sq numeric not null,
  confidence text default 'medium' check (confidence in ('low','medium','high')),
  sources jsonb default '[]',                    -- [{supplier,url,note,price_seen}]
  effective_date date not null default current_date,
  run_id uuid references price_research_runs(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists material_prices_lookup_idx
  on material_prices (state, roof_type, work_type, effective_date desc);

alter table suppliers enable row level security;
alter table material_prices enable row level security;
alter table price_research_runs enable row level security;

-- Authenticated users get read-only access (for the admin price-history view).
-- All writes happen through the service-role client in the cron route.
create policy "Authenticated can read suppliers"
  on suppliers for select to authenticated using (true);
create policy "Authenticated can read material prices"
  on material_prices for select to authenticated using (true);
create policy "Authenticated can read research runs"
  on price_research_runs for select to authenticated using (true);

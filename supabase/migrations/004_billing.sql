-- Feature 4: Stripe Billing
-- Subscriptions are one-per-company. Writes happen only via the service-role
-- client inside the Stripe webhook; users get read-only RLS access.

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null unique,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'starter' check (plan in ('starter','pro')),
  status text not null default 'trialing'
    check (status in ('trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;

-- Users may read their own company's subscription. No insert/update/delete
-- policies: those paths run through the service-role key (webhook / onboarding).
create policy "Users can view their company subscription"
  on subscriptions for select
  using (company_id in (select id from companies where user_id = auth.uid()));

create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function update_updated_at();

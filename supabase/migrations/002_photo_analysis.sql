-- Feature 3: AI photo analysis
-- Store Groq vision results per photo and an aggregate condition score per proposal.

alter table proposal_photos
  add column if not exists analysis jsonb,
  add column if not exists analysis_status text default 'pending'
    check (analysis_status in ('pending','done','failed','skipped')),
  add column if not exists ai_caption text;

alter table proposals
  add column if not exists photo_condition_score integer;

-- The original schema only had select/insert policies on proposal_photos.
-- Adding update so analysis edits (captions) can be saved.
create policy "Users can update photos for their proposals"
  on proposal_photos for update
  using (proposal_id in (
    select p.id from proposals p
    join companies c on c.id = p.company_id
    where c.user_id = auth.uid()
  ));

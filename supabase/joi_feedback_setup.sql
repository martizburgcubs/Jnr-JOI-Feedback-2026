-- Junior JOI 2026 feedback table for an existing Supabase project.
-- This creates only one new, clearly named table and does not alter existing tables.

create table if not exists public.joi_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  school text not null check (char_length(school) between 2 and 120),
  division text not null check (division in ('U14', 'U15', 'Both divisions')),
  communication smallint not null check (communication between 1 and 5),
  info_pack smallint not null check (info_pack between 1 and 5),
  game_format smallint not null check (game_format between 1 and 5),
  scheduling smallint not null check (scheduling between 1 and 5),
  officiating smallint not null check (officiating between 1 and 5),
  facilities smallint not null check (facilities between 1 and 5),
  organisation smallint not null check (organisation between 1 and 5),
  hosting smallint not null check (hosting between 1 and 5),
  accommodation smallint not null check (accommodation between 1 and 5),
  meals smallint not null check (meals between 1 and 5),
  overall smallint not null check (overall between 1 and 5),
  schedule_pace text not null check (schedule_pace in ('Too compressed', 'Slightly compressed', 'Well balanced', 'Too spread out')),
  strengths jsonb not null default '[]'::jsonb check (jsonb_typeof(strengths) = 'array'),
  priority_area text not null,
  highlight text not null default '' check (char_length(highlight) <= 500),
  improvement text not null default '' check (char_length(improvement) <= 500),
  return_intent text not null check (return_intent in ('Definitely', 'Probably', 'Unsure', 'Probably not', 'Definitely not')),
  comments text not null default '' check (char_length(comments) <= 800)
);

create index if not exists joi_feedback_created_at_idx
  on public.joi_feedback (created_at desc);

alter table public.joi_feedback enable row level security;

revoke all on table public.joi_feedback from anon, authenticated;
grant insert on table public.joi_feedback to anon;

drop policy if exists "Public may submit Junior JOI feedback" on public.joi_feedback;
create policy "Public may submit Junior JOI feedback"
  on public.joi_feedback
  for insert
  to anon
  with check (true);

-- There is deliberately no SELECT, UPDATE or DELETE policy for anonymous visitors.
-- The protected organiser dashboard reads through the server-only Supabase secret key.

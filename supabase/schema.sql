-- ============================================================
-- INNOVA — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. PROFILES ────────────────────────────────────────────
-- Extends auth.users with app-specific user data
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  role          text not null default 'solver' check (role in ('solver', 'company')),
  name          text,
  title         text,
  location      text,
  avatar_url    text,
  percentile    int default 0,
  streak        int default 0,
  open_challenges int default 0,
  reputation    int default 0,
  total_earned  numeric(12,2) default 0,
  wins          int default 0,
  submissions_count int default 0,
  expertise     text[] default '{}',
  created_at    timestamptz default now()
);

-- ─── 2. CHALLENGES ──────────────────────────────────────────
create table if not exists public.challenges (
  id              bigserial primary key,
  title           text not null,
  description     text,
  problem_statement text,
  problem_detail  text,
  category        text,
  subcategory     text,
  phase           text default 'Accepting Submissions',
  current_phase   text default 'Open',
  status          text default 'Open' check (status in ('Open', 'Sealed', 'Completed')),
  prize           text,
  prize_value     numeric(12,2) default 0,
  prize_type      text,
  grand_prize     text,
  difficulty      text check (difficulty in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  days_left       int default 0,
  time_label      text,
  time_left       text,
  time_color      text default 'green',
  submissions_count int default 0,
  participants_count int default 0,
  created_by      uuid references public.profiles(id),
  created_at      timestamptz default now()
);

-- ─── 3. CHALLENGE HOSTS ─────────────────────────────────────
create table if not exists public.challenge_hosts (
  id            bigserial primary key,
  challenge_id  bigint references public.challenges(id) on delete cascade,
  name          text not null,
  logo_initial  text,
  verified      boolean default false,
  description   text
);

-- ─── 4. CHALLENGE CONSTRAINTS ───────────────────────────────
create table if not exists public.challenge_constraints (
  id            bigserial primary key,
  challenge_id  bigint references public.challenges(id) on delete cascade,
  content       text not null,
  position      int default 0
);

-- ─── 5. JUDGING CRITERIA ────────────────────────────────────
create table if not exists public.judging_criteria (
  id            bigserial primary key,
  challenge_id  bigint references public.challenges(id) on delete cascade,
  title         text,
  weight        int default 0,
  description   text
);

-- ─── 6. CHALLENGE RESOURCES ─────────────────────────────────
create table if not exists public.challenge_resources (
  id            bigserial primary key,
  challenge_id  bigint references public.challenges(id) on delete cascade,
  name          text,
  storage_path  text,
  url           text
);

-- ─── 7. SUBMISSIONS ─────────────────────────────────────────
create table if not exists public.submissions (
  id            bigserial primary key,
  challenge_id  bigint references public.challenges(id),
  user_id       uuid references public.profiles(id),
  title         text,
  concept       text,
  impact        text,
  feasibility   text,
  skills        text[] default '{}',
  category      text,
  status        text default 'Drafting' check (status in ('Drafting', 'Submitted', 'Under Evaluation', 'Won', 'Finalist')),
  progress      int default 10 check (progress >= 0 and progress <= 100),
  deadline      text,
  milestone     text,
  prize         text,
  last_edited   timestamptz default now(),
  created_at    timestamptz default now()
);

-- ─── 8. NOTIFICATIONS ───────────────────────────────────────
create table if not exists public.notifications (
  id            bigserial primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  type          text check (type in ('mention', 'prize', 'phase', 'system')),
  text          text,
  time          timestamptz default now(),
  card_style    text default 'light-beige',
  dot_color     text default 'gray-dot',
  action_label  text,
  action_style  text,
  read          boolean default false
);

-- ─── 9. CHALLENGE FOLLOWERS ─────────────────────────────────
create table if not exists public.challenge_followers (
  user_id       uuid references public.profiles(id) on delete cascade,
  challenge_id  bigint references public.challenges(id) on delete cascade,
  created_at    timestamptz default now(),
  primary key (user_id, challenge_id)
);

-- ─── 10. OPPORTUNITIES ──────────────────────────────────────
create table if not exists public.opportunities (
  id            text primary key,
  title         text,
  description   text,
  prize         text,
  tag           text,
  image_url     text,
  is_hero       boolean default false,
  hero_text     text,
  stats         text,
  featured      boolean default false
);

-- ─── 11. LEADERBOARD (VIEW) ─────────────────────────────────
-- Computed from profiles for fellowship rankings
create or replace view public.leaderboard as
  select
    id,
    name,
    reputation as xp,
    row_number() over (order by reputation desc) as rank
  from public.profiles
  where role = 'solver'
  order by reputation desc
  limit 50;

-- ─── 12. ACTIVE CHALLENGES (VIEW) ───────────────────────────
-- Helper view: challenges the logged-in user has active submissions in
create or replace view public.active_challenge_summary as
  select
    c.id,
    c.title,
    c.days_left,
    c.current_phase,
    s.status as submission_status,
    s.progress,
    s.user_id
  from public.submissions s
  join public.challenges c on c.id = s.challenge_id
  where s.status not in ('Won');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_hosts enable row level security;
alter table public.challenge_constraints enable row level security;
alter table public.judging_criteria enable row level security;
alter table public.challenge_resources enable row level security;
alter table public.submissions enable row level security;
alter table public.notifications enable row level security;
alter table public.challenge_followers enable row level security;
alter table public.opportunities enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- challenges: public read
create policy "challenges_select_all" on public.challenges for select using (true);
create policy "challenges_insert_company" on public.challenges for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'company'));
create policy "challenges_update_own" on public.challenges for update
  using (auth.uid() = created_by);

-- challenge related tables: public read
create policy "hosts_select_all" on public.challenge_hosts for select using (true);
create policy "constraints_select_all" on public.challenge_constraints for select using (true);
create policy "criteria_select_all" on public.judging_criteria for select using (true);
create policy "resources_select_all" on public.challenge_resources for select using (true);

-- submissions: users see and manage only their own
create policy "submissions_select_own" on public.submissions for select using (auth.uid() = user_id);
create policy "submissions_insert_own" on public.submissions for insert with check (auth.uid() = user_id);
create policy "submissions_update_own" on public.submissions for update using (auth.uid() = user_id);

-- notifications: users see only their own
create policy "notifs_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifs_update_own" on public.notifications for update using (auth.uid() = user_id);

-- challenge_followers
create policy "followers_all_own" on public.challenge_followers for all using (auth.uid() = user_id);

-- opportunities: public read
create policy "opps_select_all" on public.opportunities for select using (true);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'role', 'solver')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

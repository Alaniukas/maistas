-- ============================================================
-- Maistė App – Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- PROFILES TABLE
create table if not exists public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  name            text default '',
  age             integer default 28,
  height          integer default 170,       -- cm
  current_weight  numeric(5,2) default 75,   -- kg
  goal_weight     numeric(5,2) default 65,   -- kg
  activity_level  text default 'SEDENTARY',
  goal_type       text default 'LOSE',
  goal_speed      numeric(4,2) default 0.5,  -- kg/week
  gender          text default 'female',
  onboarding_complete boolean default false,
  start_date      date default current_date,
  streak_days     integer default 0,
  last_login_date date,
  last_checkin_timestamp bigint,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- DAILY LOGS TABLE (water intake per day)
create table if not exists public.daily_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  date         date not null,
  water_intake integer default 0,            -- ml
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique(user_id, date)
);

-- FOOD ENTRIES TABLE
create table if not exists public.food_entries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  date             date not null,
  name             text not null,
  calories         numeric(7,2) not null default 0,
  protein          numeric(6,2) not null default 0,
  carbs            numeric(6,2) not null default 0,
  fat              numeric(6,2) not null default 0,
  sugar            numeric(6,2),
  fiber            numeric(6,2),
  saturated_fat    numeric(6,2),
  sodium           numeric(6,2),
  serving_size     numeric(7,2) not null default 100,
  unit             text default 'g',
  source           text default 'manual',
  meal_type        text not null,            -- breakfast|lunch|dinner|snack
  entry_timestamp  bigint,
  created_at       timestamptz default now()
);

-- WEIGHT HISTORY TABLE
create table if not exists public.weight_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  weight      numeric(5,2) not null,
  recorded_at timestamptz default now(),
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles     enable row level security;
alter table public.daily_logs   enable row level security;
alter table public.food_entries enable row level security;
alter table public.weight_history enable row level security;

-- PROFILES policies
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- DAILY LOGS policies
create policy "Users manage own daily logs"
  on public.daily_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- FOOD ENTRIES policies
create policy "Users manage own food entries"
  on public.food_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- WEIGHT HISTORY policies
create policy "Users manage own weight history"
  on public.weight_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- INDEXES (performance)
-- ============================================================
create index if not exists idx_food_entries_user_date on public.food_entries(user_id, date);
create index if not exists idx_daily_logs_user_date   on public.daily_logs(user_id, date);
create index if not exists idx_weight_history_user    on public.weight_history(user_id, recorded_at);

-- ==========================================
-- PDF Tools - Supabase Database Init Script
-- Run sequentially in Supabase SQL Editor
-- ==========================================

-- 1. User profiles table (extends Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('free', 'pro', 'lifetime')) default 'free',
  daily_used integer default 0,
  daily_limit integer default 5,
  max_files_per_request integer default 2,
  reset_at date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Usage logs table
create table if not exists usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  tool_type text not null,
  file_count integer default 1,
  created_at timestamptz default now()
);

-- 3. Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- 4. Security policies (RLS)
alter table profiles enable row level security;
alter table usage_logs enable row level security;
alter table subscriptions enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own usage logs"
  on usage_logs for select using (auth.uid() = user_id);

create policy "Users can insert own usage logs"
  on usage_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

-- 5. Quota increment function (for frontend, atomic anti-concurrency)
create or replace function increment_usage(
  user_id uuid,
  tool_type text,
  file_count integer
)
returns void
language plpgsql
security definer
as $$
begin
  -- Check if reset needed (cross-day)
  update profiles
  set daily_used = case
    when reset_at < current_date then 1
    else daily_used + 1
  end,
  reset_at = current_date
  where id = user_id;

  -- Insert usage log
  insert into usage_logs (user_id, tool_type, file_count)
  values (user_id, tool_type, file_count);
end;
$$;

-- 6. Auto-create profile on user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'free'
  );
  return new;
end;
$$;

-- Bind trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

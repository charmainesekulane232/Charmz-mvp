-- Run this in Supabase Dashboard → SQL Editor → New Query → paste all → Run

-- 1. TRANSACTIONS TABLE
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  description text not null,
  amount numeric not null,        -- negative = expense, positive = income
  category text default 'Uncategorized',
  created_at timestamptz default now()
);

-- 2. PROFILES TABLE (extra user info, subscription status from Paddle)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text,
  is_pro boolean default false,
  paddle_customer_id text,
  created_at timestamptz default now()
);

-- 3. AUTO-CREATE PROFILE ROW WHEN A USER SIGNS UP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. ENABLE ROW LEVEL SECURITY — this is what keeps User A from seeing User B's data
alter table transactions enable row level security;
alter table profiles enable row level security;

-- 5. POLICIES: users can only read/write their OWN rows
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

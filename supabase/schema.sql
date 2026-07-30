-- 30 MPS Growth OS — Data Hub + Auth (Postgres / Supabase)
-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.mps_hub_meta (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.mps_leads (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mps_clients (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mps_reservations (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mps_invoices (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.mps_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'ops',
  updated_at timestamptz not null default now()
);

create index if not exists mps_leads_origin_idx
  on public.mps_leads ((payload->>'origin'));
create index if not exists mps_leads_email_idx
  on public.mps_leads ((payload->>'email'));
create index if not exists mps_clients_email_idx
  on public.mps_clients ((payload->>'email'));
create index if not exists mps_clients_segment_idx
  on public.mps_clients ((payload->>'segment'));
create index if not exists mps_reservations_status_idx
  on public.mps_reservations ((payload->>'status'));

alter table public.mps_hub_meta enable row level security;
alter table public.mps_leads enable row level security;
alter table public.mps_clients enable row level security;
alter table public.mps_reservations enable row level security;
alter table public.mps_invoices enable row level security;
alter table public.mps_profiles enable row level security;

-- Solo usuarios autenticados del equipo
drop policy if exists "mps hub meta all" on public.mps_hub_meta;
create policy "mps hub meta auth" on public.mps_hub_meta
  for all to authenticated using (true) with check (true);

drop policy if exists "mps leads all" on public.mps_leads;
create policy "mps leads auth" on public.mps_leads
  for all to authenticated using (true) with check (true);

drop policy if exists "mps clients all" on public.mps_clients;
create policy "mps clients auth" on public.mps_clients
  for all to authenticated using (true) with check (true);

drop policy if exists "mps reservations all" on public.mps_reservations;
create policy "mps reservations auth" on public.mps_reservations
  for all to authenticated using (true) with check (true);

drop policy if exists "mps invoices all" on public.mps_invoices;
create policy "mps invoices auth" on public.mps_invoices
  for all to authenticated using (true) with check (true);

drop policy if exists "mps profiles self" on public.mps_profiles;
create policy "mps profiles self" on public.mps_profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "mps profiles upsert self" on public.mps_profiles;
create policy "mps profiles upsert self" on public.mps_profiles
  for insert to authenticated with check (auth.uid() = id);

create or replace function public.mps_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mps_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'ops')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.mps_handle_new_user();

-- 30 MPS Growth OS — Data Hub (Postgres / Supabase)
-- Ejecutar en el SQL Editor de Supabase antes de poner VITE_DATA_MODE=supabase

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

-- Índices útiles para filtros futuros
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

-- RLS: panel interno. Con anon key, permite CRUD al equipo autenticado.
-- Ajusta políticas cuando conectes Auth (email del equipo 30 MPS).
alter table public.mps_hub_meta enable row level security;
alter table public.mps_leads enable row level security;
alter table public.mps_clients enable row level security;
alter table public.mps_reservations enable row level security;
alter table public.mps_invoices enable row level security;

-- Política temporal de arranque (solo para MVP interno).
-- Sustituir por auth.uid() / claims de equipo en producción.
drop policy if exists "mps hub meta all" on public.mps_hub_meta;
create policy "mps hub meta all" on public.mps_hub_meta
  for all using (true) with check (true);

drop policy if exists "mps leads all" on public.mps_leads;
create policy "mps leads all" on public.mps_leads
  for all using (true) with check (true);

drop policy if exists "mps clients all" on public.mps_clients;
create policy "mps clients all" on public.mps_clients
  for all using (true) with check (true);

drop policy if exists "mps reservations all" on public.mps_reservations;
create policy "mps reservations all" on public.mps_reservations
  for all using (true) with check (true);

drop policy if exists "mps invoices all" on public.mps_invoices;
create policy "mps invoices all" on public.mps_invoices
  for all using (true) with check (true);

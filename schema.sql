-- ============================================================
-- Case Study & Client Management — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- This file is IDEMPOTENT: you can re-run it at any time
-- without errors or data loss, which also makes it safe to
-- use as a migration to bring an existing database up to date.
-- ============================================================

-- ─────────────────────────────────────────────────────────
-- CLIENTS TABLE
-- ─────────────────────────────────────────────────────────
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  business_name text,
  industry      text,
  email         text,
  phone         text,
  website       text,
  notes         text,
  status        text not null default 'active' check (status in ('active', 'inactive', 'lead')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- IDEMPOTENT MIGRATIONS (safe to re-run)
-- Adds any missing columns to bring an existing database
-- up to date, e.g. the `business_name` column.
-- ─────────────────────────────────────────────────────────
alter table public.clients add column if not exists business_name text;
alter table public.clients add column if not exists industry      text;
alter table public.clients add column if not exists email         text;
alter table public.clients add column if not exists phone         text;
alter table public.clients add column if not exists website       text;
alter table public.clients add column if not exists notes         text;
alter table public.clients add column if not exists status
  text not null default 'active' check (status in ('active', 'inactive', 'lead'));

-- ─────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────
-- GRANTS
-- Important: RLS policies alone are NOT enough. The postgres
-- roles that Supabase uses (`anon`, `authenticated`) need
-- explicit table privileges or you get "permission denied
-- for table clients".
-- ─────────────────────────────────────────────────────────
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.clients to anon, authenticated;

-- ─────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Each user can only see and modify their own clients.
-- ─────────────────────────────────────────────────────────
alter table public.clients enable row level security;

-- Drop existing policies first so this file stays idempotent
drop policy if exists "Users can view own clients"  on public.clients;
drop policy if exists "Users can insert own clients" on public.clients;
drop policy if exists "Users can update own clients" on public.clients;
drop policy if exists "Users can delete own clients" on public.clients;

-- SELECT: only own rows
create policy "Users can view own clients"
  on public.clients for select
  using (auth.uid() = user_id);

-- INSERT: user_id must match authenticated user
create policy "Users can insert own clients"
  on public.clients for insert
  with check (auth.uid() = user_id);

-- UPDATE: only own rows
create policy "Users can update own clients"
  on public.clients for update
  using (auth.uid() = user_id);

-- DELETE: only own rows
create policy "Users can delete own clients"
  on public.clients for delete
  using (auth.uid() = user_id);
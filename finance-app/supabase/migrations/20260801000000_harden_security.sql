-- Harden database access.
--
-- The app talks to Postgres exclusively through the service-role key (server-side),
-- which bypasses RLS. The previous migrations granted the `anon` and `authenticated`
-- roles full access on every table — including `app_config`, which holds the SHA-256
-- password hash. Because the anon key is public by design in Supabase, anyone with it
-- could read the hash and forge the app's session cookie, or read/write all financial
-- data directly via PostgREST, completely bypassing the app-level auth gate.
--
-- Fix: revoke table access from anon/authenticated, drop the permissive "app access"
-- policies, and make sure default privileges no longer grant new tables to anon.
-- The service_role keeps its grants (it bypasses RLS anyway, so no policies are needed).

revoke all on table public.profile, public.income, public.expenses,
  public.categories, public.savings_goals, public.fixed_expenses,
  public.app_config
from anon, authenticated;

revoke usage on schema public from anon, authenticated;

drop policy if exists "app access profile" on public.profile;
drop policy if exists "app access income" on public.income;
drop policy if exists "app access expenses" on public.expenses;
drop policy if exists "app access categories" on public.categories;
drop policy if exists "app access savings_goals" on public.savings_goals;
drop policy if exists "app access fixed_expenses" on public.fixed_expenses;
drop policy if exists "app access app_config" on public.app_config;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

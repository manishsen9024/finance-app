-- App config: single-row settings table (id = 1), stores the password
-- gate's SHA-256 hash. The plaintext password never touches the database.

create table if not exists public.app_config (
  id bigint primary key default 1 check (id = 1),
  password_hash text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

create policy "app access app_config" on public.app_config
  for all using (true) with check (true);

grant all on table public.app_config to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;

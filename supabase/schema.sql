-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Une seule ligne JSON par utilisateur. Chaque utilisateur ne peut lire/modifier que sa propre ligne.
create table if not exists public.app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_data enable row level security;

revoke all on public.app_data from anon;
grant select, insert, update, delete on public.app_data to authenticated;

drop policy if exists "Users manage only their own HAPPY SHOPPING data" on public.app_data;
create policy "Users manage only their own HAPPY SHOPPING data"
on public.app_data
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

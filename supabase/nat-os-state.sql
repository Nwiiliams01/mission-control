create table if not exists public.nat_os_state (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.nat_os_state enable row level security;

drop policy if exists "service role can manage nat os state" on public.nat_os_state;

create policy "service role can manage nat os state"
on public.nat_os_state
for all
to service_role
using (true)
with check (true);

drop policy if exists "anon can read default nat os state" on public.nat_os_state;
drop policy if exists "anon can insert default nat os state" on public.nat_os_state;
drop policy if exists "anon can update default nat os state" on public.nat_os_state;

create policy "anon can read default nat os state"
on public.nat_os_state
for select
to anon
using (id = 'default');

create policy "anon can insert default nat os state"
on public.nat_os_state
for insert
to anon
with check (id = 'default');

create policy "anon can update default nat os state"
on public.nat_os_state
for update
to anon
using (id = 'default')
with check (id = 'default');

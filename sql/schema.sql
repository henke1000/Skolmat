create extension if not exists "pgcrypto";

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  week text not null,
  created_at timestamp default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid references meals(id) on delete cascade,
  vote text check (vote in ('like', 'dislike')),
  voter_id text not null,
  created_at timestamp default now(),
  unique(meal_id, voter_id)
);

alter table meals enable row level security;
alter table votes enable row level security;

drop policy if exists "Alla kan läsa maträtter" on meals;
create policy "Alla kan läsa maträtter"
  on meals for select
  using (true);

drop policy if exists "Demo-admin kan lägga till maträtter" on meals;
create policy "Demo-admin kan lägga till maträtter"
  on meals for insert
  with check (true);

drop policy if exists "Demo-admin kan ta bort maträtter" on meals;
create policy "Demo-admin kan ta bort maträtter"
  on meals for delete
  using (true);

drop policy if exists "Alla kan läsa röster" on votes;
create policy "Alla kan läsa röster"
  on votes for select
  using (true);

drop policy if exists "Alla kan rösta en gång per maträtt" on votes;
create policy "Alla kan rösta en gång per maträtt"
  on votes for insert
  with check (
    vote in ('like', 'dislike')
    and voter_id is not null
  );

insert into meals (name, week)
select seed.name, seed.week
from (
  values
    ('Köttbullar med potatismos', '2026-W24'),
    ('Vegetarisk lasagne', '2026-W24'),
    ('Fiskgratäng med ris', '2026-W24'),
    ('Kycklinggryta med bulgur', '2026-W24')
) as seed(name, week)
where not exists (
  select 1
  from meals
  where meals.name = seed.name
    and meals.week = seed.week
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'votes'
  ) then
    alter publication supabase_realtime add table public.votes;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'meals'
  ) then
    alter publication supabase_realtime add table public.meals;
  end if;
end $$;

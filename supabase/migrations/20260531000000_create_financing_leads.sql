create table if not exists financing_leads (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete set null,
  name text not null,
  phone text not null,
  email text,
  entrada_pct integer not null,
  prazo integer not null,
  parcela_estimada numeric(12,2) not null,
  created_at timestamptz default now()
);

alter table financing_leads enable row level security;

create policy "service role only"
  on financing_leads
  using (true)
  with check (true);

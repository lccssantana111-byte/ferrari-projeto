import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://deyqvsyqpzhwcfxdswsc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleXF2c3lxcHpod2NmeGRzd3NjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk5NjgwOSwiZXhwIjoyMDk1NTcyODA5fQ.9REh4TcWu6pGlP80KX4wa0orNOb8gfjnr-7729XMacc'
)

const cars = [
  {
    name: 'Ferrari 488 GTB',
    slug: '488-gtb',
    description: 'O 488 GTB representa a evolução perfeita do motor turbo Ferrari. Com aerodinâmica ativa e o mais avançado sistema de controle de tração da marca, entrega uma experiência de condução absolutamente visceral.',
    short_tagline: 'A arte da velocidade em estado puro',
    price: 2890000,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V8 Twin-Turbo 3.9L',
      horsepower: 710,
      torque: '770 Nm',
      transmission: 'PDK 7 velocidades',
      drivetrain: 'Traseira',
      acceleration: '3.1s',
      top_speed: '330 km/h',
      weight: '1.475 kg',
    },
    featured: true,
    year: 2023,
    color_options: [
      { name: 'Rosso Corsa', hex: '#CC0000' },
      { name: 'Nero', hex: '#0A0A0A' },
      { name: 'Bianco Avus', hex: '#F5F5F5' },
      { name: 'Giallo Modena', hex: '#F5C400' },
    ],
    status: 'active',
  },
  {
    name: 'Ferrari Roma',
    slug: 'roma',
    description: 'O Roma é a reinterpretação moderna do estilo da dolce vita romana dos anos 60 e 70. Um Gran Turismo 2+ de elegância intemporal, com desempenho surpreendente escondido sob linhas suaves e sofisticadas.',
    short_tagline: 'Elegância absoluta, poder sem igual',
    price: 2450000,
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V8 Twin-Turbo 3.9L',
      horsepower: 620,
      torque: '760 Nm',
      transmission: 'DCT 8 velocidades',
      drivetrain: 'Traseira',
      acceleration: '3.4s',
      top_speed: '320 km/h',
      weight: '1.472 kg',
    },
    featured: true,
    year: 2024,
    color_options: [
      { name: 'Grigio Silverstone', hex: '#8D8D8D' },
      { name: 'Rosso Portofino', hex: '#C0392B' },
      { name: 'Blu Pozzi', hex: '#1A3A5C' },
      { name: 'Nero', hex: '#0A0A0A' },
    ],
    status: 'active',
  },
  {
    name: 'Ferrari SF90 Stradale',
    slug: 'sf90-stradale',
    description: 'O SF90 Stradale é o primeiro Ferrari de produção com motor híbrido plug-in. Com 1.000 cv combinados, é o carro de estrada mais potente jamais construído pela Ferrari, elevando os limites do possível.',
    short_tagline: 'O futuro chegou com 1.000 cavalos',
    price: 6200000,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V8 Twin-Turbo 4.0L + 3 motores elétricos',
      horsepower: 1000,
      torque: '800 Nm',
      transmission: 'DCT 8 velocidades',
      drivetrain: 'AWD (eAWD)',
      acceleration: '2.5s',
      top_speed: '340 km/h',
      weight: '1.570 kg',
    },
    featured: true,
    year: 2024,
    color_options: [
      { name: 'Rosso Corsa', hex: '#CC0000' },
      { name: 'Nero', hex: '#0A0A0A' },
      { name: 'Giallo Triplo Strato', hex: '#D4A017' },
      { name: 'Blu Tour de France', hex: '#003087' },
    ],
    status: 'active',
  },
  {
    name: 'Ferrari F8 Tributo',
    slug: 'f8-tributo',
    description: 'O F8 Tributo é uma homenagem ao motor V8 mais premiado da história Ferrari. Herdeiro do 488 GTB, refina cada aspecto do predecessor com 50 cv a mais e aerodinâmica completamente repensada.',
    short_tagline: 'Pura adrenalina com DNA de campeão',
    price: 3150000,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V8 Twin-Turbo 3.9L',
      horsepower: 720,
      torque: '770 Nm',
      transmission: 'PDK 7 velocidades',
      drivetrain: 'Traseira',
      acceleration: '2.9s',
      top_speed: '340 km/h',
      weight: '1.435 kg',
    },
    featured: true,
    year: 2023,
    color_options: [
      { name: 'Rosso Corsa', hex: '#CC0000' },
      { name: 'Giallo Modena', hex: '#F5C400' },
      { name: 'Bianco Avus', hex: '#F5F5F5' },
      { name: 'Verde British', hex: '#1B4D2E' },
    ],
    status: 'active',
  },
  {
    name: 'Ferrari Portofino M',
    slug: 'portofino-m',
    description: 'O Portofino M é o Gran Turismo conversível que combina o prazer de dirigir com o conforto de um carro do dia a dia. A versão "Modificata" traz motor mais potente, câmbio mais rápido e dinâmica aprimorada.',
    short_tagline: 'Gran Turismo para todos os momentos',
    price: 2180000,
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V8 Twin-Turbo 3.9L',
      horsepower: 620,
      torque: '760 Nm',
      transmission: 'DCT 8 velocidades',
      drivetrain: 'Traseira',
      acceleration: '3.5s',
      top_speed: '320 km/h',
      weight: '1.545 kg',
    },
    featured: false,
    year: 2023,
    color_options: [
      { name: 'Rosso Portofino', hex: '#C0392B' },
      { name: 'Grigio Titanio', hex: '#6B7280' },
      { name: 'Bianco Italia', hex: '#FAFAFA' },
      { name: 'Azzurro California', hex: '#4A90C4' },
    ],
    status: 'active',
  },
  {
    name: 'Ferrari 812 Superfast',
    slug: '812-superfast',
    description: 'O 812 Superfast é o mais potente Ferrari V12 de aspiração natural de todos os tempos. Com direção nas quatro rodas e 800 cv, representa o ápice do Grand Touring de alto desempenho — e o canto do cisne de uma era.',
    short_tagline: 'O último V12 atmosférico — uma era imortal',
    price: 4750000,
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1400&q=90&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=90&auto=format&fit=crop',
    ],
    video_url: null,
    model_url: null,
    specs: {
      engine: 'V12 Aspirado 6.5L',
      horsepower: 800,
      torque: '718 Nm',
      transmission: 'DCT 7 velocidades',
      drivetrain: 'Traseira',
      acceleration: '2.9s',
      top_speed: '340 km/h',
      weight: '1.525 kg',
    },
    featured: false,
    year: 2022,
    color_options: [
      { name: 'Rosso Corsa', hex: '#CC0000' },
      { name: 'Nero', hex: '#0A0A0A' },
      { name: 'Grigio Silverstone', hex: '#8D8D8D' },
      { name: 'Blu Pozzi', hex: '#1A3A5C' },
    ],
    status: 'active',
  },
]

async function seed() {
  console.log('Verificando tabela cars...')

  // Testa conexão
  const { error: pingError } = await supabase.from('cars').select('id').limit(1)
  if (pingError) {
    console.error('❌ Erro ao conectar:', pingError.message)
    console.log('\nA tabela "cars" não existe ainda. Crie-a no Supabase com o SQL abaixo:\n')
    console.log(CREATE_TABLE_SQL)
    process.exit(1)
  }

  console.log('✅ Tabela encontrada. Inserindo carros...\n')

  for (const car of cars) {
    const { data, error } = await supabase
      .from('cars')
      .upsert(car, { onConflict: 'slug' })
      .select('name')
      .single()

    if (error) {
      console.error(`❌ ${car.name}: ${error.message}`)
    } else {
      console.log(`✅ ${data.name}`)
    }
  }

  console.log('\nSeed concluído!')
}

const CREATE_TABLE_SQL = `
-- Execute este SQL no Supabase SQL Editor
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_tagline text,
  price numeric not null,
  images text[] not null default '{}',
  video_url text,
  model_url text,
  specs jsonb not null default '{}',
  featured boolean not null default false,
  year integer,
  color_options jsonb not null default '[]',
  status text not null default 'active' check (status in ('active', 'sold', 'reserved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_status_idx on public.cars (status);
create index if not exists cars_featured_idx on public.cars (featured);
create index if not exists cars_slug_idx on public.cars (slug);

alter table public.cars enable row level security;

create policy "Public read" on public.cars
  for select using (true);

create policy "Service role write" on public.cars
  for all using (auth.role() = 'service_role');
`

seed()

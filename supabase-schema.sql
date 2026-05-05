-- ════════════════════════════════════════════════════════════════
--  LIGA DRAGÓN — Esquema Supabase
--  Cafetería de juegos de mesa · Registro de partidas
-- ════════════════════════════════════════════════════════════════
--  Ejecuta este script en: Supabase → SQL Editor → New query
--  Después copia tu Project URL y anon key al panel de la app.
-- ════════════════════════════════════════════════════════════════

-- ── 1. Jugadores ──────────────────────────────────────────────
create table if not exists players (
  id           uuid primary key default gen_random_uuid(),
  username     text unique not null,
  display_name text,
  avatar_emoji text default '🎲',
  created_at   timestamptz default now()
);

-- ── 2. Catálogo de juegos ─────────────────────────────────────
create table if not exists games (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,
  min_players   int default 2,
  max_players   int default 4,
  avg_duration  int,            -- minutos
  category      text,           -- estrategia, party, familiar…
  added_by      uuid references players(id),
  created_at    timestamptz default now()
);

-- ── 3. Partidas ───────────────────────────────────────────────
create table if not exists matches (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid not null references games(id),
  played_at    timestamptz not null default now(),
  duration_min int,
  difficulty   int check (difficulty between 1 and 5),
  winner_id    uuid references players(id),
  notes        text,
  created_by   uuid not null references players(id),
  created_at   timestamptz default now()
);

-- ── 4. Participantes (jugador ↔ partida + puntuación) ─────────
create table if not exists match_players (
  match_id  uuid references matches(id) on delete cascade,
  player_id uuid references players(id),
  score     int,
  primary key (match_id, player_id)
);

-- ── 5. Catálogo de logros ─────────────────────────────────────
create table if not exists badges (
  id          text primary key,        -- 'first_win', 'marathon'…
  name        text not null,
  description text,
  emoji       text default '🏅'
);

create table if not exists player_badges (
  player_id  uuid references players(id) on delete cascade,
  badge_id   text references badges(id),
  earned_at  timestamptz default now(),
  primary key (player_id, badge_id)
);

-- ── 6. Logros iniciales ───────────────────────────────────────
insert into badges (id, name, description, emoji) values
  ('first_match', 'Primera partida',  'Registraste tu primera partida',         '🎲'),
  ('first_win',   'Primera victoria', 'Tu primera victoria en la liga',          '🏆'),
  ('marathon',    'Maratonista',      'Una partida de más de 3 horas',           '⏰'),
  ('explorer',    'Explorador',       'Probaste 10 juegos diferentes',           '🧭'),
  ('regular',     'Habitual',         '25 partidas registradas',                 '☕'),
  ('strategist',  'Estratega',        '5 victorias en juegos de estrategia',     '♟️')
on conflict (id) do nothing;

-- ── 7. Vistas útiles para el dashboard ────────────────────────
create or replace view player_stats as
  select
    p.id, p.username, p.display_name, p.avatar_emoji,
    count(distinct mp.match_id) as matches_played,
    count(distinct case when m.winner_id = p.id then m.id end) as wins,
    coalesce(sum(m.duration_min), 0) as total_minutes
  from players p
  left join match_players mp on mp.player_id = p.id
  left join matches m on m.id = mp.match_id
  group by p.id;

-- ── 8. Row Level Security (modo casual: lectura abierta) ──────
alter table players       enable row level security;
alter table games         enable row level security;
alter table matches       enable row level security;
alter table match_players enable row level security;
alter table badges        enable row level security;
alter table player_badges enable row level security;

create policy "lectura abierta" on players       for select using (true);
create policy "lectura abierta" on games         for select using (true);
create policy "lectura abierta" on matches       for select using (true);
create policy "lectura abierta" on match_players for select using (true);
create policy "lectura abierta" on badges        for select using (true);
create policy "lectura abierta" on player_badges for select using (true);

create policy "insert abierto" on players       for insert with check (true);
create policy "insert abierto" on games         for insert with check (true);
create policy "insert abierto" on matches       for insert with check (true);
create policy "insert abierto" on match_players for insert with check (true);
create policy "insert abierto" on player_badges for insert with check (true);

-- ── 9. Datos de ejemplo (opcional — bórralos si no los quieres)─
insert into games (name, min_players, max_players, avg_duration, category) values
  ('Catan',           3, 4, 90,  'estrategia'),
  ('Carcassonne',     2, 5, 45,  'familiar'),
  ('Wingspan',        1, 5, 70,  'estrategia'),
  ('Codenames',       4, 8, 20,  'party'),
  ('Azul',            2, 4, 35,  'familiar'),
  ('7 Wonders Duel',  2, 2, 30,  'estrategia'),
  ('Dixit',           3, 6, 30,  'party'),
  ('Splendor',        2, 4, 30,  'estrategia')
on conflict (name) do nothing;

// ═══════════════════════════════════════════════════════════════
//  Configuración Supabase — El Dragón
// ═══════════════════════════════════════════════════════════════

const TS = window.LDUI.T;
const { Btn, Field, Input, DragonMark } = window.LDUI;

function SupabaseConfig({ theme, onChanged, onClose }) {
  const stored = window.LigaDragon.getStoredCreds();
  const [url, setUrl] = React.useState(stored?.url || '');
  const [key, setKey] = React.useState(stored?.key || '');
  const [showSql, setShowSql] = React.useState(false);
  const [sql, setSql] = React.useState(SCHEMA_SQL);
  const [status, setStatus] = React.useState(stored ? 'connected' : 'disconnected');
  const [testing, setTesting] = React.useState(false);

  async function test() {
    if (!url || !key) return;
    setTesting(true); setStatus('testing');
    try {
      const r = await fetch(`${url}/rest/v1/games?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (r.ok) {
        window.LigaDragon.setStoredCreds({ url, key });
        setStatus('connected');
        onChanged && onChanged();
      } else { setStatus('error'); }
    } catch { setStatus('error'); }
    finally { setTesting(false); }
  }

  function disconnect() {
    window.LigaDragon.setStoredCreds(null);
    setUrl(''); setKey(''); setStatus('disconnected');
    onChanged && onChanged();
  }

  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto',
      background: theme.bg, color: theme.ink, fontFamily: TS.sans, padding: '40px 36px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {onClose && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: theme.inkSoft,
            fontFamily: TS.sans, fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 24,
          }}>← Volver</button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <DragonMark size={48} color={theme.deep} accent={theme.accent} fire={theme.fire}/>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: theme.gold }}>
              ◆ Configuración ◆
            </div>
            <h1 style={{ fontFamily: TS.display, fontSize: 36, fontWeight: 500, fontStyle: 'italic', margin: '4px 0 0', letterSpacing: -0.8 }}>
              Conectar a <span style={{ color: theme.accent }}>Supabase</span>
            </h1>
          </div>
        </div>

        <p style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, margin: '16px 0 28px', maxWidth: 560 }}>
          Pega el <strong>Project URL</strong> y la <strong>anon key</strong>. Se guardan en <code style={{ fontFamily: TS.mono, fontSize: 12, background: theme.chip, padding: '2px 6px', borderRadius: 3 }}>localStorage</code>.
        </p>

        <div style={{
          padding: '14px 18px', borderRadius: 6, marginBottom: 24,
          background: status === 'connected' ? theme.deep : theme.surface,
          color: status === 'connected' ? theme.gold : theme.ink,
          border: `1px solid ${status === 'connected' ? theme.gold : theme.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              {status === 'connected' && '● Conectado'}
              {status === 'testing' && '◌ Probando…'}
              {status === 'error' && '✕ No pude conectar — revisa URL y key'}
              {status === 'disconnected' && '○ Modo demo (datos en memoria)'}
            </div>
          </div>
          {status === 'connected' && <Btn theme={theme} variant="ghost" onClick={disconnect}>Desconectar</Btn>}
        </div>

        <Field label="Project URL" theme={theme} hint="ej. https://abcd1234.supabase.co">
          <Input theme={theme} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xxxxx.supabase.co" />
        </Field>
        <Field label="Anon (public) key" theme={theme} hint="La anon key — NO la service_role">
          <Input theme={theme} value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbGc…" type="password" />
        </Field>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Btn theme={theme} variant="dark" onClick={test} style={{ padding: '12px 24px' }}>
            {testing ? 'Probando…' : 'Conectar'}
          </Btn>
          <Btn theme={theme} variant="ghost" onClick={() => setShowSql(!showSql)}>
            {showSql ? '↑ Ocultar SQL' : '↓ Ver script SQL'}
          </Btn>
        </div>

        {showSql && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <h3 style={{ fontFamily: TS.display, fontSize: 22, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>Script de inicialización</h3>
              <button onClick={() => navigator.clipboard.writeText(sql)} style={{
                background: theme.deep, border: 'none', color: theme.gold,
                fontFamily: TS.sans, fontSize: 11, fontWeight: 700,
                padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
              }}>Copiar</button>
            </div>
            <p style={{ fontSize: 12, color: theme.inkSoft, marginBottom: 10 }}>
              En Supabase: <strong>SQL Editor → New query</strong>, pega y ejecuta.
            </p>
            <pre style={{
              background: theme.deep, color: theme.gold,
              borderRadius: 6, padding: 16, fontFamily: TS.mono, fontSize: 11,
              lineHeight: 1.55, maxHeight: 360, overflow: 'auto', margin: 0, whiteSpace: 'pre-wrap',
            }}>{sql}</pre>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: TS.display, fontSize: 22, margin: '0 0 12px', fontStyle: 'italic', fontWeight: 500 }}>Pasos</h3>
          <ol style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
            <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" style={{ color: theme.accent }}>supabase.com</a></li>
            <li>Copia el script SQL y ejecútalo en el SQL Editor</li>
            <li>Ve a <strong>Settings → API</strong>, copia Project URL + anon public key</li>
            <li>Pega los valores arriba y dale a "Conectar"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

const SCHEMA_SQL = `-- Pega esto en Supabase → SQL Editor → New query
-- (script completo en supabase-schema.sql del proyecto)

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  username text unique not null, display_name text,
  avatar_emoji text default '🐉', pin_hash text,
  created_at timestamptz default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  name text unique not null, min_players int default 2, max_players int default 4,
  avg_duration int, category text, available boolean default true,
  created_at timestamptz default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id),
  played_at timestamptz default now(), duration_min int,
  difficulty int check (difficulty between 1 and 5),
  winner_id uuid references players(id), notes text,
  created_by uuid references players(id),
  created_at timestamptz default now()
);

create table if not exists match_players (
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id), score int,
  primary key (match_id, player_id)
);

create or replace view player_stats as
  select p.id, p.username, p.display_name, p.avatar_emoji,
    count(distinct mp.match_id) as matches_played,
    count(distinct case when m.winner_id = p.id then m.id end) as wins,
    coalesce(sum(m.duration_min) filter (where mp.player_id = p.id), 0) as total_minutes
  from players p
  left join match_players mp on mp.player_id = p.id
  left join matches m on m.id = mp.match_id
  group by p.id;

alter table players enable row level security;
alter table games enable row level security;
alter table matches enable row level security;
alter table match_players enable row level security;

create policy "all" on players for all using (true) with check (true);
create policy "all" on games for all using (true) with check (true);
create policy "all" on matches for all using (true) with check (true);
create policy "all" on match_players for all using (true) with check (true);

insert into games (name, min_players, max_players, avg_duration, category) values
  ('Catan', 3, 4, 90, 'estrategia'),
  ('Carcassonne', 2, 5, 45, 'familiar'),
  ('Wingspan', 1, 5, 70, 'estrategia'),
  ('Codenames', 4, 8, 20, 'party'),
  ('Azul', 2, 4, 35, 'familiar'),
  ('Harmonies', 2, 4, 35, 'familiar'),
  ('Orleans', 2, 4, 90, 'estrategia')
on conflict (name) do nothing;`;

window.LDSupabase = SupabaseConfig;

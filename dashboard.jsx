// ═══════════════════════════════════════════════════════════════
//  Dashboard desktop — Liga Dragón
// ═══════════════════════════════════════════════════════════════

const { Btn: DBtn, Pill: DPill, WordMark: DWordMark } = window.LDUI;
const TD = window.LDUI.T;

function Dashboard({ theme, players, matches, games, badges }) {
  const totalMatches = matches.length;
  const totalMinutes = matches.reduce((a,m) => a + (m.duration_min || 0), 0);
  const gameCount = {};
  matches.forEach(m => { gameCount[m.game_name] = (gameCount[m.game_name] || 0) + 1; });
  const topGames = Object.entries(gameCount).sort((a,b) => b[1]-a[1]).slice(0, 6);
  const maxGameCount = topGames[0]?.[1] || 1;

  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: theme.bg, color: theme.ink, fontFamily: TD.sans,
      display: 'grid', gridTemplateColumns: '220px 1fr', overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <aside style={{
        background: theme.surface, borderRight: `1px solid ${theme.line}`,
        padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <DWordMark theme={theme} />
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
          {[
            ['Resumen', true], ['Partidas', false], ['Jugadores', false],
            ['Juegos', false], ['Logros', false], ['Configuración', false],
          ].map(([label, on]) => (
            <div key={label} style={{
              padding: '8px 12px', borderRadius: 8,
              background: on ? theme.chip : 'transparent',
              color: on ? theme.ink : theme.inkSoft,
              fontSize: 13, fontWeight: on ? 600 : 500, cursor: 'pointer',
            }}>{label}</div>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '12px', background: theme.chip, borderRadius: 12 }}>
          <div style={{ fontFamily: TD.mono, fontSize: 10, color: theme.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
            Modo
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.ink, marginTop: 2 }}>
            {window.Api.mode() === 'live' ? '🟢 Conectado' : '⚪ Demo'}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ overflowY: 'auto', padding: '32px 36px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: theme.inkMuted }}>
              Dashboard del propietario
            </div>
            <h1 style={{
              fontFamily: TD.serif, fontSize: 44, fontWeight: 400,
              margin: '4px 0 0', letterSpacing: -1, lineHeight: 1.05,
            }}>
              Resumen <em style={{ fontStyle: 'italic', color: theme.accent }}>de la semana</em>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <DBtn theme={theme} variant="ghost">Exportar CSV</DBtn>
            <DBtn theme={theme}>Nueva partida</DBtn>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            ['Partidas', totalMatches, '+3 vs prev'],
            ['Jugadores', players.length, `${players.filter(p => p.matches_played > 0).length} activos`],
            ['Horas jugadas', Math.round(totalMinutes/60), 'esta semana'],
            ['Juegos en uso', Object.keys(gameCount).length, `de ${games.length}`],
          ].map(([label, val, sub]) => (
            <div key={label} style={{
              background: theme.surface, border: `1px solid ${theme.lineSoft}`,
              borderRadius: 16, padding: '20px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: theme.inkMuted }}>
                {label}
              </div>
              <div style={{ fontFamily: TD.serif, fontSize: 44, color: theme.ink, marginTop: 6, letterSpacing: -1, lineHeight: 1 }}>
                {val}
              </div>
              <div style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkMuted, marginTop: 8 }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
          {/* Ranking */}
          <section style={{
            background: theme.surface, border: `1px solid ${theme.lineSoft}`,
            borderRadius: 16, padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h2 style={{ fontFamily: TD.serif, fontSize: 22, margin: 0, fontStyle: 'italic', fontWeight: 400 }}>
                Ranking
              </h2>
              <span style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkMuted }}>
                por victorias
              </span>
            </div>
            {players.slice().sort((a,b) => b.wins - a.wins).slice(0, 6).map((p, i) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '24px 32px 1fr auto auto',
                gap: 12, alignItems: 'center', padding: '10px 0',
                borderBottom: i < 5 ? `1px solid ${theme.lineSoft}` : 'none',
              }}>
                <div style={{
                  fontFamily: TD.mono, fontSize: 12, color: i === 0 ? theme.gold : theme.inkMuted, fontWeight: 600,
                }}>
                  {i === 0 ? '★' : `0${i+1}`.slice(-2)}
                </div>
                <div style={{
                  width: 30, height: 30, borderRadius: 999, background: theme.chip,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{p.avatar_emoji}</div>
                <div style={{ fontFamily: TD.serif, fontSize: 17, color: theme.ink, fontStyle: 'italic' }}>
                  {p.display_name || p.username}
                </div>
                <div style={{ fontFamily: TD.mono, fontSize: 12, color: theme.inkSoft }}>
                  {p.matches_played} part.
                </div>
                <div style={{
                  fontFamily: TD.serif, fontSize: 22, color: theme.accent,
                  letterSpacing: -0.5, minWidth: 40, textAlign: 'right',
                }}>{p.wins}</div>
              </div>
            ))}
          </section>

          {/* Top games */}
          <section style={{
            background: theme.surface, border: `1px solid ${theme.lineSoft}`,
            borderRadius: 16, padding: '22px 24px',
          }}>
            <h2 style={{ fontFamily: TD.serif, fontSize: 22, margin: '0 0 16px', fontStyle: 'italic', fontWeight: 400 }}>
              Más jugados
            </h2>
            {topGames.map(([name, count]) => (
              <div key={name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontFamily: TD.serif, fontSize: 15, fontStyle: 'italic', color: theme.ink }}>{name}</span>
                  <span style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkMuted }}>{count}</span>
                </div>
                <div style={{ height: 4, background: theme.lineSoft, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(count / maxGameCount) * 100}%`, height: '100%', background: theme.accent,
                  }} />
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Recent matches table */}
        <section style={{
          background: theme.surface, border: `1px solid ${theme.lineSoft}`,
          borderRadius: 16, padding: '22px 24px', marginTop: 20,
        }}>
          <h2 style={{ fontFamily: TD.serif, fontSize: 22, margin: '0 0 12px', fontStyle: 'italic', fontWeight: 400 }}>
            Partidas recientes
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.6fr 1fr', gap: 12, padding: '8px 0', borderBottom: `1px solid ${theme.line}` }}>
            {['Juego','Jugadores','Cuándo','Min','Ganador'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: theme.inkMuted }}>
                {h}
              </div>
            ))}
          </div>
          {matches.slice(0, 7).map(m => (
            <div key={m.id} style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.6fr 1fr', gap: 12,
              padding: '12px 0', borderBottom: `1px solid ${theme.lineSoft}`, alignItems: 'center',
            }}>
              <div style={{ fontFamily: TD.serif, fontSize: 16, fontStyle: 'italic', color: theme.ink }}>{m.game_name}</div>
              <div style={{ fontSize: 12, color: theme.inkSoft }}>{(m.players || []).join(' · ')}</div>
              <div style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkMuted }}>
                {new Date(m.played_at).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
              </div>
              <div style={{ fontFamily: TD.mono, fontSize: 12, color: theme.inkSoft }}>{m.duration_min || '—'}</div>
              <div>{m.winner ? <DPill theme={theme} tone="gold">🏆 {m.winner}</DPill> : <span style={{ color: theme.inkMuted, fontSize: 12 }}>—</span>}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

window.LDDashboard = Dashboard;

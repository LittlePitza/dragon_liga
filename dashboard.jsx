// ═══════════════════════════════════════════════════════════════
//  Dashboard Admin — El Dragón
// ═══════════════════════════════════════════════════════════════

const TD = window.LDUI.T;
const { Btn, Pill, WordMark, DragonMark, Divider, Field, Input } = window.LDUI;

function AdminGate({ theme, onUnlock }) {
  const [pin, setPin] = React.useState('');
  const [err, setErr] = React.useState('');
  const stored = localStorage.getItem(window.LigaDragon.ADMIN_KEY);

  function submit() {
    if (!stored) {
      if (pin.length < 4) { setErr('Mínimo 4 dígitos'); return; }
      localStorage.setItem(window.LigaDragon.ADMIN_KEY, pin);
      onUnlock();
    } else {
      if (pin === stored) onUnlock();
      else setErr('PIN incorrecto');
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box',
      background: theme.bg, color: theme.ink, fontFamily: TD.sans,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40,
    }}>
      <div style={{
        maxWidth: 380, width: '100%', textAlign: 'center',
        padding: '40px 32px', background: theme.surface,
        border: `1px solid ${theme.line}`, borderRadius: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <DragonMark size={56} color={theme.deep} accent={theme.accent} fire={theme.fire}/>
        </div>
        <div style={{ fontFamily: TD.sans, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: theme.gold, marginBottom: 4, textTransform: 'uppercase' }}>
          ★ Acceso restringido ★
        </div>
        <h1 style={{ fontFamily: TD.display, fontSize: 30, fontWeight: 500, fontStyle: 'italic', color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5 }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: TD.sans, fontSize: 13, color: theme.inkSoft, margin: '0 0 24px' }}>
          {stored ? 'Ingresa el PIN del propietario' : 'Crea un PIN para proteger esta vista'}
        </p>
        <Input theme={theme} value={pin} type="tel" inputMode="numeric"
          onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,8))}
          placeholder="••••" autoFocus
          style={{ fontFamily: TD.mono, fontSize: 22, letterSpacing: 6, textAlign: 'center' }}
          onKeyDown={e => e.key === 'Enter' && submit()}/>
        {err && <p style={{ color: theme.accent, fontSize: 13, margin: '12px 0 0' }}>{err}</p>}
        <Btn theme={theme} variant="dark" onClick={submit} style={{ width: '100%', marginTop: 16, padding: '14px' }}>
          {stored ? 'Entrar' : 'Crear PIN'}
        </Btn>
        <p style={{ fontFamily: TD.sans, fontSize: 11, color: theme.inkMuted, margin: '16px 0 0' }}>
          ¿No eres el propietario? <a href="?" style={{ color: theme.accent }}>Volver a la app</a>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ theme, players, matches, games, onLogout }) {
  const [view, setView] = React.useState('overview');
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
      display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden',
    }}>
      <aside style={{
        background: theme.deep, color: theme.gold,
        padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DragonMark size={36} color={theme.gold} accent={theme.accent} fire={theme.fire}/>
          <div>
            <div style={{ fontFamily: TD.display, fontSize: 16, fontStyle: 'italic', fontWeight: 500, color: theme.gold, lineHeight: 1 }}>
              El Dragón
            </div>
            <div style={{ fontFamily: TD.sans, fontSize: 9, fontWeight: 700, letterSpacing: 1.4, opacity: 0.6, marginTop: 2 }}>
              ADMIN PANEL
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            ['overview', 'Resumen', '◇'],
            ['matches',  'Partidas', '⚔'],
            ['players',  'Jugadores', '★'],
            ['games',    'Inventario', '♟'],
          ].map(([k, label, ic]) => (
            <button key={k} onClick={() => setView(k)} style={{
              padding: '10px 12px', borderRadius: 4, background: view === k ? 'rgba(217,179,90,0.15)' : 'transparent',
              color: view === k ? theme.gold : 'rgba(244,236,216,0.6)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
              textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center',
              fontFamily: TD.sans, letterSpacing: 0.3,
            }}>
              <span style={{ width: 14, color: theme.gold, opacity: view === k ? 1 : 0.4 }}>{ic}</span>
              {label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: 4 }}>
          <div style={{ fontFamily: TD.mono, fontSize: 9, color: 'rgba(217,179,90,0.5)', textTransform: 'uppercase', letterSpacing: 1.4 }}>Modo</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.gold, marginTop: 2 }}>
            {window.Api.mode() === 'live' ? '● Conectado' : '○ Demo'}
          </div>
          <button onClick={onLogout} style={{
            background: 'none', border: 'none', color: 'rgba(244,236,216,0.5)',
            fontFamily: TD.sans, fontSize: 11, marginTop: 10, cursor: 'pointer', padding: 0,
            textTransform: 'uppercase', letterSpacing: 1,
          }}>Salir</button>
        </div>
      </aside>

      <main style={{ overflowY: 'auto', padding: '32px 36px' }}>
        {view === 'overview' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: theme.gold }}>
                  ◆ Crónica del reino ◆
                </div>
                <h1 style={{ fontFamily: TD.display, fontSize: 44, fontWeight: 500, fontStyle: 'italic', margin: '6px 0 0', letterSpacing: -1, lineHeight: 1.05 }}>
                  Resumen <span style={{ color: theme.accent }}>de la semana</span>
                </h1>
              </div>
              <Btn theme={theme} variant="dark">Exportar CSV</Btn>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
              {[
                ['Partidas', totalMatches],
                ['Jugadores', players.length],
                ['Horas', Math.round(totalMinutes/60)],
                ['Juegos en uso', Object.keys(gameCount).length],
              ].map(([label, val]) => (
                <div key={label} style={{
                  background: theme.surface, border: `1px solid ${theme.lineSoft}`,
                  borderRadius: 6, padding: 20, position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.inkMuted }}>{label}</div>
                  <div style={{ fontFamily: TD.display, fontSize: 44, color: theme.ink, marginTop: 4, letterSpacing: -1, lineHeight: 1, fontStyle: 'italic', fontWeight: 500 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
              <section style={{ background: theme.surface, border: `1px solid ${theme.lineSoft}`, borderRadius: 6, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                  <h2 style={{ fontFamily: TD.display, fontSize: 24, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
                    Liga del <span style={{ color: theme.accent }}>Dragón</span>
                  </h2>
                  <span style={{ fontFamily: TD.mono, fontSize: 10, color: theme.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>por victorias</span>
                </div>
                {players.slice().sort((a,b) => b.wins - a.wins).slice(0, 7).map((p, i) => (
                  <div key={p.id} style={{
                    display: 'grid', gridTemplateColumns: '24px 32px 1fr auto auto',
                    gap: 12, alignItems: 'center', padding: '10px 0',
                    borderBottom: i < 6 ? `1px solid ${theme.lineSoft}` : 'none',
                  }}>
                    <div style={{ fontFamily: TD.display, fontSize: 16, fontStyle: 'italic', color: i === 0 ? theme.gold : theme.inkMuted, fontWeight: 600 }}>
                      {i + 1}
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: theme.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {p.avatar_emoji}
                    </div>
                    <div style={{ fontFamily: TD.display, fontSize: 17, color: theme.ink, fontStyle: 'italic', fontWeight: 500 }}>
                      {p.display_name || p.username}
                    </div>
                    <div style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkSoft }}>{p.matches_played} part.</div>
                    <div style={{ fontFamily: TD.display, fontSize: 22, color: theme.accent, letterSpacing: -0.5, minWidth: 40, textAlign: 'right', fontStyle: 'italic', fontWeight: 500 }}>{p.wins}</div>
                  </div>
                ))}
              </section>

              <section style={{ background: theme.surface, border: `1px solid ${theme.lineSoft}`, borderRadius: 6, padding: 24 }}>
                <h2 style={{ fontFamily: TD.display, fontSize: 24, margin: '0 0 16px', fontStyle: 'italic', fontWeight: 500 }}>
                  Más jugados
                </h2>
                {topGames.map(([name, count]) => (
                  <div key={name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontFamily: TD.display, fontSize: 14, fontStyle: 'italic', color: theme.ink }}>{name}</span>
                      <span style={{ fontFamily: TD.mono, fontSize: 10, color: theme.inkMuted }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: theme.lineSoft, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / maxGameCount) * 100}%`, height: '100%', background: theme.accent }}/>
                    </div>
                  </div>
                ))}
              </section>
            </div>

            <section style={{ background: theme.surface, border: `1px solid ${theme.lineSoft}`, borderRadius: 6, padding: 24, marginTop: 18 }}>
              <h2 style={{ fontFamily: TD.display, fontSize: 24, margin: '0 0 12px', fontStyle: 'italic', fontWeight: 500 }}>
                Crónicas recientes
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.6fr 1fr', gap: 12, padding: '8px 0', borderBottom: `1px solid ${theme.line}` }}>
                {['Juego','Jugadores','Cuándo','Min','Ganador'].map(h => (
                  <div key={h} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.4, color: theme.inkMuted }}>{h}</div>
                ))}
              </div>
              {matches.slice(0, 8).map(m => (
                <div key={m.id} style={{
                  display: 'grid', gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.6fr 1fr', gap: 12,
                  padding: '12px 0', borderBottom: `1px solid ${theme.lineSoft}`, alignItems: 'center',
                }}>
                  <div style={{ fontFamily: TD.display, fontSize: 16, fontStyle: 'italic', color: theme.ink }}>{m.game_name}</div>
                  <div style={{ fontSize: 12, color: theme.inkSoft }}>{(m.players || []).join(' · ')}</div>
                  <div style={{ fontFamily: TD.mono, fontSize: 10, color: theme.inkMuted }}>
                    {new Date(m.played_at).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkSoft }}>{m.duration_min || '—'}</div>
                  <div>{m.winner ? <Pill theme={theme} tone="gold">🏆 {m.winner}</Pill> : <span style={{ color: theme.inkMuted, fontSize: 11 }}>—</span>}</div>
                </div>
              ))}
            </section>
          </>
        )}

        {view === 'matches' && <SimpleList theme={theme} title="Todas las partidas"
          items={matches.map(m => ({ id: m.id, primary: m.game_name, secondary: (m.players || []).join(' · '), meta: new Date(m.played_at).toLocaleDateString('es'), tag: m.winner }))}/>}
        {view === 'players' && <SimpleList theme={theme} title="Jugadores"
          items={players.map(p => ({ id: p.id, primary: p.display_name || p.username, secondary: `@${p.username}`, meta: `${p.matches_played} partidas`, tag: `${p.wins} 🏆` }))}/>}
        {view === 'games' && <SimpleList theme={theme} title="Inventario"
          items={games.map(g => ({ id: g.id, primary: g.name, secondary: `${g.min_players}–${g.max_players} jug · ~${g.avg_duration || '—'} min`, meta: g.category, tag: g.available === false ? 'PRESTADO' : 'DISPONIBLE' }))}/>}
      </main>
    </div>
  );
}

function SimpleList({ theme, title, items }) {
  return (
    <>
      <h1 style={{ fontFamily: TD.display, fontSize: 36, fontWeight: 500, fontStyle: 'italic', margin: '0 0 24px', letterSpacing: -0.8 }}>
        {title}
      </h1>
      <div style={{ background: theme.surface, border: `1px solid ${theme.lineSoft}`, borderRadius: 6, padding: '12px 20px' }}>
        {items.map((it, i) => (
          <div key={it.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: 12,
            padding: '14px 0', alignItems: 'center',
            borderBottom: i < items.length - 1 ? `1px solid ${theme.lineSoft}` : 'none',
          }}>
            <div style={{ fontFamily: TD.display, fontSize: 17, fontStyle: 'italic', color: theme.ink, fontWeight: 500 }}>{it.primary}</div>
            <div style={{ fontFamily: TD.sans, fontSize: 12, color: theme.inkSoft }}>{it.secondary}</div>
            <div style={{ fontFamily: TD.mono, fontSize: 11, color: theme.inkMuted }}>{it.meta}</div>
            <div>{it.tag && <Pill theme={theme} tone="outline">{it.tag}</Pill>}</div>
          </div>
        ))}
      </div>
    </>
  );
}

window.LDDashboard = Dashboard;
window.LDAdminGate = AdminGate;

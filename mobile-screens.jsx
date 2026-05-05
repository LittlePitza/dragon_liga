// ═══════════════════════════════════════════════════════════════
//  Pantallas móviles — Liga Dragón
// ═══════════════════════════════════════════════════════════════

const { Btn, Field, Input, Pill, DragonLogo, WordMark, useTheme } = window.LDUI;
const TT = window.LDUI.T;

// ─── Login casual ─────────────────────────────────────────────
function MobileLogin({ theme, onLogin }) {
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('🎲');
  const emojis = ['🎲','🐉','🦊','🦉','🐺','🐱','🦅','🐢','🦁','🦄'];
  const [busy, setBusy] = React.useState(false);

  async function go() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const player = await window.Api.findOrCreatePlayer(name);
      player.avatar_emoji = emoji;
      window.LigaDragon.setStoredUser(player);
      onLogin(player);
    } catch (e) { alert(e.message || 'Error'); }
    finally { setBusy(false); }
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: theme.bg, padding: '40px 28px 32px',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <DragonLogo size={56} theme={theme} />
        <h1 style={{
          fontFamily: TT.serif, fontSize: 44, fontWeight: 400,
          color: theme.ink, margin: '24px 0 6px', letterSpacing: -1, lineHeight: 1.05,
        }}>
          Liga<br/><em style={{ fontStyle: 'italic', color: theme.accent }}>Dragón</em>
        </h1>
        <p style={{
          fontFamily: TT.sans, fontSize: 15, color: theme.inkSoft,
          margin: '0 0 36px', lineHeight: 1.5, maxWidth: 280,
        }}>
          Registra tus partidas. Sube en el ranking. Desbloquea logros.
        </p>

        <Field label="¿Cómo te llamas?" theme={theme}>
          <Input theme={theme} value={name} onChange={e => setName(e.target.value)}
            placeholder="tu nombre o apodo" autoFocus />
        </Field>

        <Field label="Avatar" theme={theme}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {emojis.map(e => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                width: 42, height: 42, borderRadius: 12,
                border: `1.5px solid ${emoji === e ? theme.accent : theme.line}`,
                background: emoji === e ? theme.chip : theme.surface,
                fontSize: 22, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{e}</button>
            ))}
          </div>
        </Field>
      </div>

      <Btn theme={theme} onClick={go} style={{ width: '100%', padding: '16px', fontSize: 15 }}>
        {busy ? 'Entrando…' : 'Entrar a la mesa →'}
      </Btn>
      <p style={{
        fontFamily: TT.sans, fontSize: 11, color: theme.inkMuted,
        textAlign: 'center', margin: '12px 0 0',
      }}>
        Sin contraseñas. Si tu nombre ya existe, entrarás a esa cuenta.
      </p>
    </div>
  );
}

// ─── Home: feed + nueva partida ──────────────────────────────
function MobileHome({ theme, user, matches, onNew, onProfile, onCatalog }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      {/* header */}
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <WordMark theme={theme} />
        <button onClick={onProfile} style={{
          width: 38, height: 38, borderRadius: 999,
          background: theme.chip, border: 'none', fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{user.avatar_emoji}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 100px' }}>
        <h2 style={{
          fontFamily: TT.serif, fontSize: 32, fontWeight: 400, lineHeight: 1.1,
          color: theme.ink, margin: '8px 0 4px', letterSpacing: -0.5,
        }}>
          Hola, <em style={{ fontStyle: 'italic', color: theme.accent }}>{user.display_name || user.username}</em>
        </h2>
        <p style={{ fontFamily: TT.sans, fontSize: 14, color: theme.inkSoft, margin: '0 0 24px' }}>
          ¿Qué jugaste hoy?
        </p>

        {/* CTA principal */}
        <button onClick={onNew} style={{
          width: '100%', padding: '20px', borderRadius: 18,
          background: theme.accent, color: theme.accentInk,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <div>
            <div style={{ fontFamily: TT.serif, fontSize: 22, fontWeight: 400, fontStyle: 'italic' }}>
              Registrar partida
            </div>
            <div style={{ fontFamily: TT.sans, fontSize: 13, opacity: 0.85, marginTop: 2 }}>
              Toma 20 segundos
            </div>
          </div>
          <span style={{ fontSize: 22 }}>→</span>
        </button>

        <button onClick={onCatalog} style={{
          width: '100%', padding: '14px 18px', borderRadius: 14,
          background: theme.surface, color: theme.ink, border: `1px solid ${theme.line}`,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 32, fontFamily: TT.sans, fontSize: 14, fontWeight: 500,
        }}>
          <span>Ver catálogo de juegos</span>
          <span style={{ color: theme.inkMuted }}>→</span>
        </button>

        {/* feed */}
        <div style={{
          fontFamily: TT.sans, fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 1,
          color: theme.inkMuted, marginBottom: 10,
        }}>Últimas partidas</div>

        {matches.slice(0, 6).map(m => (
          <div key={m.id} style={{
            background: theme.surface, border: `1px solid ${theme.lineSoft}`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: TT.serif, fontSize: 18, color: theme.ink, fontStyle: 'italic' }}>
                {m.game_name}
              </div>
              <div style={{ fontFamily: TT.mono, fontSize: 11, color: theme.inkMuted }}>
                {fmtDate(m.played_at)}
              </div>
            </div>
            <div style={{
              fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, marginTop: 4,
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>
              <span>{(m.players || []).join(' · ')}</span>
              {m.winner && <Pill theme={theme} tone="gold">🏆 {m.winner}</Pill>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
}

// ─── Formulario nueva partida ────────────────────────────────
function MobileNewMatch({ theme, user, games, players, onCancel, onSaved }) {
  const [step, setStep] = React.useState(1);
  const [gameQuery, setGameQuery] = React.useState('');
  const [game, setGame] = React.useState(null);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0,16));
  const [duration, setDuration] = React.useState('');
  const [difficulty, setDifficulty] = React.useState(0);
  const [winner, setWinner] = React.useState(null);
  const [participants, setParticipants] = React.useState([user.id]);
  const [busy, setBusy] = React.useState(false);

  const filteredGames = React.useMemo(() => {
    const q = gameQuery.trim().toLowerCase();
    if (!q) return games.slice(0, 6);
    return games.filter(g => g.name.toLowerCase().includes(q)).slice(0, 8);
  }, [gameQuery, games]);

  async function save() {
    if (!game) return;
    setBusy(true);
    try {
      await window.Api.createMatch({
        game_id: game.id,
        played_at: new Date(date).toISOString(),
        duration_min: duration ? parseInt(duration) : null,
        difficulty: difficulty || null,
        winner_id: winner,
        players: participants,
        scores: {},
        created_by: user.id,
      });
      onSaved();
    } catch (e) { alert(e.message || 'Error'); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      {/* header */}
      <div style={{
        padding: '16px 24px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${theme.lineSoft}`,
      }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', color: theme.inkSoft,
          fontFamily: TT.sans, fontSize: 14, cursor: 'pointer', padding: 0,
        }}>← Cancelar</button>
        <span style={{ fontFamily: TT.mono, fontSize: 11, color: theme.inkMuted }}>
          {step}/2
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 100px' }}>
        {step === 1 && (
          <>
            <h2 style={{
              fontFamily: TT.serif, fontSize: 28, fontWeight: 400, fontStyle: 'italic',
              color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5,
            }}>¿Qué juego?</h2>
            <p style={{ fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, margin: '0 0 20px' }}>
              Busca o agrega uno nuevo
            </p>

            <Input theme={theme} value={gameQuery} onChange={e => setGameQuery(e.target.value)}
              placeholder="Buscar juego…" />

            <div style={{ marginTop: 16 }}>
              {filteredGames.map(g => (
                <button key={g.id} onClick={() => setGame(g)} style={{
                  width: '100%', textAlign: 'left', padding: '14px 16px',
                  background: game?.id === g.id ? theme.chip : theme.surface,
                  border: `1px solid ${game?.id === g.id ? theme.accent : theme.lineSoft}`,
                  borderRadius: 12, marginBottom: 8, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontFamily: TT.serif, fontSize: 17, fontStyle: 'italic', color: theme.ink }}>
                      {g.name}
                    </div>
                    <div style={{ fontFamily: TT.sans, fontSize: 12, color: theme.inkMuted, marginTop: 2 }}>
                      {g.min_players}–{g.max_players} jugadores · ~{g.avg_duration} min
                    </div>
                  </div>
                  <Pill theme={theme} tone="outline">{g.category}</Pill>
                </button>
              ))}

              {gameQuery && !filteredGames.find(g => g.name.toLowerCase() === gameQuery.toLowerCase()) && (
                <button onClick={async () => {
                  const ng = await window.Api.addGame(gameQuery, 'sin categoría');
                  setGame(ng);
                }} style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: 'transparent', color: theme.accent,
                  border: `1.5px dashed ${theme.accent}`, cursor: 'pointer',
                  fontFamily: TT.sans, fontSize: 14, fontWeight: 500, marginTop: 4,
                }}>+ Agregar "{gameQuery}"</button>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{
              fontFamily: TT.serif, fontSize: 28, fontWeight: 400, fontStyle: 'italic',
              color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5,
            }}>Detalles</h2>
            <p style={{ fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, margin: '0 0 20px' }}>
              Lo opcional, opcional. Sólo el juego es obligatorio.
            </p>

            <Field label="Cuándo" theme={theme}>
              <Input theme={theme} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
            </Field>

            <Field label="Duración (min) — opcional" theme={theme}>
              <Input theme={theme} type="number" value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="ej. 60" />
            </Field>

            <Field label="Dificultad percibida — opcional" theme={theme}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setDifficulty(difficulty === n ? 0 : n)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 10,
                    background: difficulty >= n ? theme.accent : theme.surface,
                    color: difficulty >= n ? theme.accentInk : theme.inkSoft,
                    border: `1px solid ${difficulty >= n ? theme.accent : theme.line}`,
                    fontFamily: TT.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>{n}</button>
                ))}
              </div>
            </Field>

            <Field label="Quiénes jugaron — opcional" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {players.map(p => {
                  const on = participants.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => {
                      setParticipants(on
                        ? participants.filter(id => id !== p.id)
                        : [...participants, p.id]);
                    }} style={{
                      padding: '8px 12px', borderRadius: 999,
                      background: on ? theme.chip : theme.surface,
                      border: `1px solid ${on ? theme.accent : theme.line}`,
                      color: theme.ink, fontFamily: TT.sans, fontSize: 13,
                      cursor: 'pointer', display: 'inline-flex', gap: 4, alignItems: 'center',
                    }}>{p.avatar_emoji} {p.username}</button>
                  );
                })}
              </div>
            </Field>

            <Field label="Ganador — opcional" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {players.filter(p => participants.includes(p.id)).map(p => (
                  <button key={p.id} onClick={() => setWinner(winner === p.id ? null : p.id)} style={{
                    padding: '8px 12px', borderRadius: 999,
                    background: winner === p.id ? theme.gold : theme.surface,
                    border: `1px solid ${winner === p.id ? theme.gold : theme.line}`,
                    color: winner === p.id ? '#fff' : theme.ink,
                    fontFamily: TT.sans, fontSize: 13, cursor: 'pointer',
                    display: 'inline-flex', gap: 4, alignItems: 'center',
                  }}>🏆 {p.username}</button>
                ))}
              </div>
            </Field>
          </>
        )}
      </div>

      {/* footer */}
      <div style={{
        padding: '12px 24px 24px', borderTop: `1px solid ${theme.lineSoft}`,
        background: theme.bg, display: 'flex', gap: 10,
      }}>
        {step === 1 ? (
          <Btn theme={theme} onClick={() => game && setStep(2)}
            style={{ flex: 1, padding: '15px', opacity: game ? 1 : 0.4, pointerEvents: game ? 'auto' : 'none' }}>
            Siguiente →
          </Btn>
        ) : (
          <>
            <Btn theme={theme} variant="ghost" onClick={() => setStep(1)} style={{ padding: '15px 18px' }}>
              ← Atrás
            </Btn>
            <Btn theme={theme} onClick={save} style={{ flex: 1, padding: '15px' }}>
              {busy ? 'Guardando…' : 'Guardar partida'}
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Catálogo de juegos ──────────────────────────────────────
function MobileCatalog({ theme, games, onBack }) {
  const [q, setQ] = React.useState('');
  const filtered = games.filter(g => g.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: theme.inkSoft,
          fontFamily: TT.sans, fontSize: 14, cursor: 'pointer', padding: 0,
        }}>←</button>
        <span style={{ fontFamily: TT.sans, fontSize: 14, fontWeight: 600, color: theme.ink }}>
          Catálogo
        </span>
      </div>

      <div style={{ padding: '0 24px 12px' }}>
        <h2 style={{
          fontFamily: TT.serif, fontSize: 32, fontWeight: 400, fontStyle: 'italic',
          color: theme.ink, margin: '4px 0 16px', letterSpacing: -0.5,
        }}>{games.length} juegos en la mesa</h2>
        <Input theme={theme} value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 40px' }}>
        {filtered.map(g => (
          <div key={g.id} style={{
            padding: '14px 0', borderBottom: `1px solid ${theme.lineSoft}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontFamily: TT.serif, fontSize: 19, fontStyle: 'italic', color: theme.ink, letterSpacing: -0.2 }}>
                {g.name}
              </div>
              <div style={{ fontFamily: TT.sans, fontSize: 12, color: theme.inkMuted, marginTop: 2 }}>
                {g.min_players}–{g.max_players} jug · ~{g.avg_duration} min
              </div>
            </div>
            <Pill theme={theme} tone="outline">{g.category}</Pill>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Perfil ──────────────────────────────────────────────────
function MobileProfile({ theme, user, players, badges, matches, onBack, onLogout }) {
  const me = players.find(p => p.username === user.username) || {
    matches_played: 0, wins: 0, total_minutes: 0
  };
  const myMatches = matches.filter(m => (m.players || []).includes(user.username));
  const friendsMap = {};
  myMatches.forEach(m => (m.players || []).forEach(p => {
    if (p !== user.username) friendsMap[p] = (friendsMap[p] || 0) + 1;
  }));
  const friends = Object.entries(friendsMap).sort((a,b) => b[1]-a[1]).slice(0, 4);
  const earnedBadgeIds = me.matches_played > 0 ? ['first_match'] : [];
  if (me.wins > 0) earnedBadgeIds.push('first_win');
  if (me.matches_played >= 25) earnedBadgeIds.push('regular');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: theme.inkSoft,
          fontFamily: TT.sans, fontSize: 14, cursor: 'pointer', padding: 0,
        }}>←</button>
        <button onClick={onLogout} style={{
          background: 'none', border: 'none', color: theme.inkMuted,
          fontFamily: TT.sans, fontSize: 12, cursor: 'pointer', padding: 0,
        }}>Salir</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: theme.chip, fontSize: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{user.avatar_emoji}</div>
          <div>
            <div style={{ fontFamily: TT.serif, fontSize: 28, fontStyle: 'italic', color: theme.ink, lineHeight: 1, letterSpacing: -0.3 }}>
              {user.display_name || user.username}
            </div>
            <div style={{ fontFamily: TT.mono, fontSize: 12, color: theme.inkMuted, marginTop: 4 }}>
              @{user.username}
            </div>
          </div>
        </div>

        {/* stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 28 }}>
          {[
            ['Partidas',  me.matches_played],
            ['Victorias', me.wins],
            ['Horas',     Math.round((me.total_minutes || 0) / 60)],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: theme.surface, border: `1px solid ${theme.lineSoft}`,
              borderRadius: 14, padding: '14px 12px',
            }}>
              <div style={{
                fontFamily: TT.serif, fontSize: 32, color: theme.ink,
                lineHeight: 1, letterSpacing: -0.5,
              }}>{val}</div>
              <div style={{
                fontFamily: TT.sans, fontSize: 11, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: 0.6,
                color: theme.inkMuted, marginTop: 6,
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* badges */}
        <div style={{
          fontFamily: TT.sans, fontSize: 11, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 1,
          color: theme.inkMuted, marginBottom: 10,
        }}>Logros</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 28 }}>
          {badges.map(b => {
            const earned = earnedBadgeIds.includes(b.id);
            return (
              <div key={b.id} style={{
                background: theme.surface, border: `1px solid ${theme.lineSoft}`,
                borderRadius: 14, padding: '14px 8px', textAlign: 'center',
                opacity: earned ? 1 : 0.32,
              }}>
                <div style={{ fontSize: 24, filter: earned ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
                <div style={{
                  fontFamily: TT.sans, fontSize: 10, color: theme.inkSoft,
                  marginTop: 4, lineHeight: 1.2,
                }}>{b.name}</div>
              </div>
            );
          })}
        </div>

        {/* compañeros */}
        {friends.length > 0 && (
          <>
            <div style={{
              fontFamily: TT.sans, fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: 1,
              color: theme.inkMuted, marginBottom: 10,
            }}>Juegas con</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {friends.map(([name, count]) => (
                <div key={name} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 14px', background: theme.surface,
                  border: `1px solid ${theme.lineSoft}`, borderRadius: 12,
                }}>
                  <span style={{ fontFamily: TT.sans, fontSize: 14, color: theme.ink }}>{name}</span>
                  <span style={{ fontFamily: TT.mono, fontSize: 12, color: theme.inkMuted }}>{count} partidas</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.LDMobile = { MobileLogin, MobileHome, MobileNewMatch, MobileCatalog, MobileProfile };

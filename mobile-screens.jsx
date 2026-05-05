// ═══════════════════════════════════════════════════════════════
//  Pantallas móviles — El Dragón
// ═══════════════════════════════════════════════════════════════

const { Btn, Field, Input, Pill, DragonMark, WordMark, Divider } = window.LDUI;
const TT = window.LDUI.T;

// ─── Login casual con PIN ────────────────────────────────────
function MobileLogin({ theme, onLogin }) {
  const [step, setStep] = React.useState('name'); // name | pin
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('🐉');
  const [pin, setPin] = React.useState('');
  const [confirmPin, setConfirmPin] = React.useState('');
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [existing, setExisting] = React.useState(null);
  const [err, setErr] = React.useState('');

  const emojis = ['🐉','🐲','🔥','⚔️','🛡️','🎲','🏰','🦅','🦊','🦉','🐺','🐱','♟️','🃏','🧙','🗡️'];

  async function handleNameNext() {
    if (!name.trim() || busy) return;
    setBusy(true); setErr('');
    try {
      const ex = await window.Api.findPlayer(name);
      setExisting(ex);
      setStep('pin');
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  async function handlePinSubmit() {
    if (!pin || pin.length < 4) { setErr('PIN de al menos 4 dígitos'); return; }
    setBusy(true); setErr('');
    try {
      let player;
      if (existing) {
        player = await window.Api.loginPlayer(name, pin);
      } else {
        if (pin !== confirmPin) { setErr('Los PIN no coinciden'); setBusy(false); return; }
        player = await window.Api.createPlayer(name, pin, emoji);
      }
      window.LigaDragon.setStoredUser(player);
      onLogin(player);
    } catch (e) { setErr(e.message || 'PIN incorrecto'); }
    finally { setBusy(false); }
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: theme.bg, padding: '40px 28px 32px',
      backgroundImage: `radial-gradient(circle at 50% 0%, ${theme.chip} 0%, transparent 50%)`,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {step === 'name' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <WordMark theme={theme} size="lg" stacked />
            </div>
            <Divider theme={theme} style={{ margin: '20px 40px 28px' }}/>

            <h1 style={{
              fontFamily: TT.display, fontSize: 30, fontWeight: 500,
              color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5, lineHeight: 1.1,
              textAlign: 'center', fontStyle: 'italic',
            }}>
              La <span style={{ color: theme.accent }}>Liga</span> de jugadores
            </h1>
            <p style={{
              fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft,
              margin: '0 auto 32px', lineHeight: 1.5, maxWidth: 280, textAlign: 'center',
            }}>
              Registra tus partidas. Sube en el ranking. Desbloquea logros.
            </p>

            <Field label="Nombre o apodo" theme={theme}>
              <Input theme={theme} value={name} onChange={e => setName(e.target.value)}
                placeholder="ej. Mara" autoFocus
                onKeyDown={e => e.key === 'Enter' && handleNameNext()}/>
            </Field>

            <Field label="Avatar" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {emojis.slice(0, emojiOpen ? 16 : 8).map(e => (
                  <button key={e} onClick={() => setEmoji(e)} style={{
                    width: 38, height: 38, borderRadius: 4,
                    border: `1.5px solid ${emoji === e ? theme.accent : theme.line}`,
                    background: emoji === e ? theme.chip : theme.surface,
                    fontSize: 20, cursor: 'pointer',
                  }}>{e}</button>
                ))}
                {!emojiOpen && (
                  <button onClick={() => setEmojiOpen(true)} style={{
                    width: 38, height: 38, borderRadius: 4,
                    border: `1.5px dashed ${theme.line}`, background: 'transparent',
                    color: theme.inkMuted, fontSize: 16, cursor: 'pointer',
                  }}>+</button>
                )}
              </div>
            </Field>

            {err && <p style={{ color: theme.accent, fontSize: 13, margin: '0 0 12px' }}>{err}</p>}
            <Btn theme={theme} variant="dark" onClick={handleNameNext}
              style={{ width: '100%', padding: '15px', fontSize: 13 }}>
              {busy ? 'Buscando…' : 'Continuar →'}
            </Btn>
          </>
        ) : (
          <>
            <button onClick={() => { setStep('name'); setPin(''); setConfirmPin(''); setErr(''); }}
              style={{ background: 'none', border: 'none', color: theme.inkSoft, padding: 0,
                       fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start', marginBottom: 24 }}>
              ← Atrás
            </button>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                fontSize: 40, marginBottom: 8,
                width: 64, height: 64, borderRadius: '50%', background: theme.chip,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{existing?.avatar_emoji || emoji}</div>
              <h2 style={{ fontFamily: TT.display, fontSize: 26, fontStyle: 'italic',
                color: theme.ink, margin: '0 0 4px', letterSpacing: -0.3 }}>
                {existing ? `Hola, ${existing.display_name}` : `Bienvenida, ${name}`}
              </h2>
              <p style={{ fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, margin: 0 }}>
                {existing ? 'Ingresa tu PIN para entrar' : 'Crea un PIN para tu cuenta'}
              </p>
            </div>

            <Field label={existing ? 'Tu PIN' : 'Crea un PIN (4-6 dígitos)'} theme={theme}>
              <Input theme={theme} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,'').slice(0,6))}
                type="tel" inputMode="numeric" placeholder="••••" autoFocus
                style={{ fontFamily: TT.mono, fontSize: 22, letterSpacing: 6, textAlign: 'center' }}
                onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}/>
            </Field>

            {!existing && (
              <Field label="Confirma tu PIN" theme={theme}>
                <Input theme={theme} value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g,'').slice(0,6))}
                  type="tel" inputMode="numeric" placeholder="••••"
                  style={{ fontFamily: TT.mono, fontSize: 22, letterSpacing: 6, textAlign: 'center' }}
                  onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}/>
              </Field>
            )}

            {err && <p style={{ color: theme.accent, fontSize: 13, margin: '0 0 12px' }}>{err}</p>}
            <Btn theme={theme} variant="dark" onClick={handlePinSubmit}
              style={{ width: '100%', padding: '15px', fontSize: 13 }}>
              {busy ? 'Entrando…' : (existing ? 'Entrar' : 'Crear cuenta')}
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Home ────────────────────────────────────────────────────
function MobileHome({ theme, user, matches, players, onNew, onProfile, onCatalog, onRanking, onMatch }) {
  const me = players.find(p => p.username === user.username);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      {/* header */}
      <div style={{
        padding: '16px 20px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${theme.lineSoft}`,
        background: theme.surface,
      }}>
        <WordMark theme={theme} />
        <button onClick={onProfile} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: theme.chip, border: `1px solid ${theme.line}`, fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{user.avatar_emoji}</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 100px' }}>
        <div style={{
          fontFamily: TT.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: 1.5, color: theme.gold, marginBottom: 6,
        }}>★ Bienvenido ★</div>
        <h2 style={{
          fontFamily: TT.display, fontSize: 32, fontWeight: 500, lineHeight: 1.05,
          color: theme.ink, margin: '0 0 4px', letterSpacing: -0.5, fontStyle: 'italic',
        }}>
          Hola, <span style={{ color: theme.accent }}>{user.display_name || user.username}</span>
        </h2>
        <p style={{ fontFamily: TT.sans, fontSize: 14, color: theme.inkSoft, margin: '0 0 24px' }}>
          {me?.matches_played ? `${me.matches_played} partidas registradas. ${me.wins} victorias.` : '¿Lista para tu primera partida?'}
        </p>

        {/* CTA */}
        <button onClick={onNew} style={{
          width: '100%', padding: '20px', borderRadius: 6,
          background: theme.deep, color: theme.gold,
          border: 'none', cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.15 }}>
            <DragonMark size={80} color={theme.gold} accent={theme.accent} fire={theme.fire}/>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              fontFamily: TT.sans, fontSize: 10, fontWeight: 700,
              letterSpacing: 1.5, opacity: 0.7, marginBottom: 4,
            }}>+ NUEVA</div>
            <div style={{ fontFamily: TT.display, fontSize: 22, fontWeight: 500, fontStyle: 'italic' }}>
              Registrar partida
            </div>
            <div style={{ fontFamily: TT.sans, fontSize: 12, opacity: 0.7, marginTop: 2 }}>
              Toma 20 segundos
            </div>
          </div>
          <span style={{ fontSize: 22, position: 'relative' }}>→</span>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          <button onClick={onRanking} style={menuCard(theme)}>
            <span style={{ fontSize: 18 }}>🏆</span>
            <span>Ranking</span>
          </button>
          <button onClick={onCatalog} style={menuCard(theme)}>
            <span style={{ fontSize: 18 }}>♟️</span>
            <span>Catálogo</span>
          </button>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12,
        }}>
          <div style={{
            fontFamily: TT.sans, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1.5, color: theme.inkMuted,
          }}>Crónicas recientes</div>
        </div>

        {matches.length === 0 && (
          <div style={{
            padding: '32px 20px', textAlign: 'center',
            background: theme.surface, border: `1px dashed ${theme.line}`, borderRadius: 6,
            fontFamily: TT.sans, fontSize: 13, color: theme.inkMuted,
          }}>
            Aún no hay partidas. Sé la primera en escribir la historia.
          </div>
        )}

        {matches.slice(0, 8).map(m => (
          <button key={m.id} onClick={() => onMatch(m)} style={{
            display: 'block', width: '100%', textAlign: 'left',
            background: theme.surface, border: `1px solid ${theme.lineSoft}`,
            borderRadius: 6, padding: '14px 16px', marginBottom: 8, cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: TT.display, fontSize: 18, color: theme.ink, fontStyle: 'italic', fontWeight: 500 }}>
                {m.game_name}
              </div>
              <div style={{ fontFamily: TT.mono, fontSize: 10, color: theme.inkMuted }}>
                {fmtDate(m.played_at)}
              </div>
            </div>
            <div style={{
              fontFamily: TT.sans, fontSize: 12, color: theme.inkSoft, marginTop: 4,
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            }}>
              <span>{(m.players || []).join(' · ')}</span>
              {m.winner && <Pill theme={theme} tone="gold">🏆 {m.winner}</Pill>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function menuCard(theme) {
  return {
    padding: '18px 14px', borderRadius: 6,
    background: theme.surface, border: `1px solid ${theme.line}`,
    color: theme.ink, fontFamily: TT.sans, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6,
    alignItems: 'flex-start',
  };
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' }) + ' · ' +
         d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

// ─── Detalle de partida ──────────────────────────────────────
function MobileMatchDetail({ theme, match, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${theme.lineSoft}`, background: theme.surface }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: theme.inkSoft,
          fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', padding: 0,
        }}>← Atrás</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>
        <div style={{
          fontFamily: TT.sans, fontSize: 10, fontWeight: 700,
          letterSpacing: 1.5, color: theme.gold, marginBottom: 6, textTransform: 'uppercase',
        }}>Crónica · {fmtDate(match.played_at)}</div>
        <h1 style={{
          fontFamily: TT.display, fontSize: 36, fontWeight: 500, fontStyle: 'italic',
          color: theme.ink, margin: '0 0 16px', letterSpacing: -0.8, lineHeight: 1.05,
        }}>{match.game_name}</h1>

        <Divider theme={theme} style={{ margin: '20px 0 24px' }}/>

        {match.winner && (
          <div style={{
            background: theme.deep, color: theme.gold, padding: '20px',
            borderRadius: 6, marginBottom: 20, textAlign: 'center',
          }}>
            <div style={{ fontFamily: TT.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, opacity: 0.7 }}>
              GANADOR
            </div>
            <div style={{ fontFamily: TT.display, fontSize: 32, fontStyle: 'italic', fontWeight: 500, marginTop: 4 }}>
              🏆 {match.winner}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
          {match.duration_min && (
            <div style={statCard(theme)}>
              <div style={statLabel(theme)}>Duración</div>
              <div style={statValue(theme)}>{match.duration_min}<span style={{ fontSize: 14, marginLeft: 4 }}>min</span></div>
            </div>
          )}
          {match.difficulty && (
            <div style={statCard(theme)}>
              <div style={statLabel(theme)}>Dificultad</div>
              <div style={statValue(theme)}>{'★'.repeat(match.difficulty)}<span style={{ color: theme.lineSoft }}>{'★'.repeat(5 - match.difficulty)}</span></div>
            </div>
          )}
        </div>

        <div style={{ ...statLabel(theme), marginBottom: 10 }}>Jugadores</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {(match.players || []).map(p => (
            <div key={p} style={{
              padding: '12px 14px', background: theme.surface,
              border: `1px solid ${theme.lineSoft}`, borderRadius: 6,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: TT.display, fontSize: 17, fontStyle: 'italic', color: theme.ink }}>
                {p}
              </span>
              {match.winner === p && <Pill theme={theme} tone="gold">🏆 Ganador</Pill>}
            </div>
          ))}
        </div>

        {match.notes && (
          <>
            <div style={{ ...statLabel(theme), marginBottom: 10 }}>Notas</div>
            <div style={{
              padding: '14px 16px', background: theme.surface,
              border: `1px solid ${theme.lineSoft}`, borderRadius: 6,
              fontFamily: TT.serif, fontSize: 16, color: theme.inkSoft,
              fontStyle: 'italic', lineHeight: 1.5,
            }}>"{match.notes}"</div>
          </>
        )}
      </div>
    </div>
  );
}
const statCard = t => ({ background: t.surface, border: `1px solid ${t.lineSoft}`, borderRadius: 6, padding: '14px 14px' });
const statLabel = t => ({ fontFamily: TT.sans, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: t.inkMuted, marginBottom: 6 });
const statValue = t => ({ fontFamily: TT.display, fontSize: 26, color: t.ink, fontWeight: 500, lineHeight: 1, fontStyle: 'italic' });

// ─── Nueva partida ───────────────────────────────────────────
function MobileNewMatch({ theme, user, games, players, onCancel, onSaved }) {
  const [step, setStep] = React.useState(1);
  const [gameQuery, setGameQuery] = React.useState('');
  const [game, setGame] = React.useState(null);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0,16));
  const [duration, setDuration] = React.useState('');
  const [difficulty, setDifficulty] = React.useState(0);
  const [winner, setWinner] = React.useState(null);
  const [participants, setParticipants] = React.useState([user.id]);
  const [notes, setNotes] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = gameQuery.trim().toLowerCase();
    if (!q) return games.slice(0, 8);
    return games.filter(g => g.name.toLowerCase().includes(q)).slice(0, 10);
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
        notes: notes || null,
        created_by: user.id,
      });
      onSaved();
    } catch (e) { alert(e.message || 'Error'); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px 12px', borderBottom: `1px solid ${theme.lineSoft}`,
        background: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', color: theme.inkSoft,
          fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', padding: 0,
        }}>← Cancelar</button>
        <span style={{ fontFamily: TT.mono, fontSize: 11, color: theme.inkMuted, letterSpacing: 2 }}>
          {step}/2
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 100px' }}>
        {step === 1 && (
          <>
            <h2 style={{
              fontFamily: TT.display, fontSize: 30, fontWeight: 500, fontStyle: 'italic',
              color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5,
            }}>¿Qué juego?</h2>
            <p style={{ fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, margin: '0 0 20px' }}>
              Busca o agrega uno nuevo
            </p>

            <Input theme={theme} value={gameQuery} onChange={e => setGameQuery(e.target.value)}
              placeholder="Buscar juego…" />

            <div style={{ marginTop: 12 }}>
              {filtered.map(g => (
                <button key={g.id} onClick={() => setGame(g)} style={{
                  width: '100%', textAlign: 'left', padding: '12px 14px',
                  background: game?.id === g.id ? theme.chip : theme.surface,
                  border: `1px solid ${game?.id === g.id ? theme.accent : theme.lineSoft}`,
                  borderRadius: 4, marginBottom: 6, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontFamily: TT.display, fontSize: 17, fontStyle: 'italic', color: theme.ink, fontWeight: 500 }}>
                      {g.name}
                    </div>
                    <div style={{ fontFamily: TT.sans, fontSize: 11, color: theme.inkMuted, marginTop: 2 }}>
                      {g.min_players}–{g.max_players} jug · ~{g.avg_duration || '—'} min
                    </div>
                  </div>
                  {g.category && <Pill theme={theme} tone="outline">{g.category}</Pill>}
                </button>
              ))}

              {gameQuery && !filtered.find(g => g.name.toLowerCase() === gameQuery.toLowerCase()) && (
                <button onClick={async () => {
                  const ng = await window.Api.addGame(gameQuery);
                  setGame(ng);
                }} style={{
                  width: '100%', padding: '12px', borderRadius: 4,
                  background: 'transparent', color: theme.accent,
                  border: `1.5px dashed ${theme.accent}`, cursor: 'pointer',
                  fontFamily: TT.sans, fontSize: 13, fontWeight: 600, marginTop: 4,
                }}>+ Agregar "{gameQuery}"</button>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{
              fontFamily: TT.display, fontSize: 30, fontWeight: 500, fontStyle: 'italic',
              color: theme.ink, margin: '0 0 6px', letterSpacing: -0.5,
            }}>Detalles</h2>
            <p style={{ fontFamily: TT.sans, fontSize: 13, color: theme.inkSoft, margin: '0 0 20px' }}>
              Sólo el juego es obligatorio. Lo demás es opcional.
            </p>

            <Field label="Cuándo" theme={theme}>
              <Input theme={theme} type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
            </Field>

            <Field label="Duración (min)" theme={theme}>
              <Input theme={theme} type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="ej. 60" />
            </Field>

            <Field label="Dificultad" theme={theme}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setDifficulty(difficulty === n ? 0 : n)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 4,
                    background: difficulty >= n ? theme.accent : theme.surface,
                    color: difficulty >= n ? theme.accentInk : theme.inkSoft,
                    border: `1px solid ${difficulty >= n ? theme.accent : theme.line}`,
                    fontFamily: TT.sans, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>★</button>
                ))}
              </div>
            </Field>

            <Field label="Jugadores" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {players.map(p => {
                  const on = participants.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => {
                      setParticipants(on
                        ? participants.filter(id => id !== p.id)
                        : [...participants, p.id]);
                      if (winner === p.id && on) setWinner(null);
                    }} style={{
                      padding: '7px 11px', borderRadius: 999,
                      background: on ? theme.chip : theme.surface,
                      border: `1px solid ${on ? theme.accent : theme.line}`,
                      color: theme.ink, fontFamily: TT.sans, fontSize: 12,
                      cursor: 'pointer', display: 'inline-flex', gap: 4, alignItems: 'center',
                    }}>{p.avatar_emoji} {p.username}</button>
                  );
                })}
              </div>
            </Field>

            <Field label="Ganador" theme={theme}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {players.filter(p => participants.includes(p.id)).map(p => (
                  <button key={p.id} onClick={() => setWinner(winner === p.id ? null : p.id)} style={{
                    padding: '7px 11px', borderRadius: 999,
                    background: winner === p.id ? theme.gold : theme.surface,
                    border: `1px solid ${winner === p.id ? theme.gold : theme.line}`,
                    color: winner === p.id ? '#fff' : theme.ink,
                    fontFamily: TT.sans, fontSize: 12, cursor: 'pointer',
                    display: 'inline-flex', gap: 4, alignItems: 'center',
                  }}>🏆 {p.username}</button>
                ))}
              </div>
            </Field>

            <Field label="Notas o anécdota" theme={theme}>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="ej. partida épica, remontó al final…"
                style={{
                  width: '100%', boxSizing: 'border-box', minHeight: 80, resize: 'vertical',
                  background: theme.surface, color: theme.ink,
                  border: `1px solid ${theme.line}`, borderRadius: 4,
                  padding: '12px 14px', fontFamily: TT.sans, fontSize: 14, outline: 'none',
                }}/>
            </Field>
          </>
        )}
      </div>

      <div style={{
        padding: '12px 20px 20px', borderTop: `1px solid ${theme.lineSoft}`,
        background: theme.bg, display: 'flex', gap: 10,
      }}>
        {step === 1 ? (
          <Btn theme={theme} variant="dark" onClick={() => game && setStep(2)}
            style={{ flex: 1, padding: '15px', opacity: game ? 1 : 0.4, pointerEvents: game ? 'auto' : 'none' }}>
            Siguiente →
          </Btn>
        ) : (
          <>
            <Btn theme={theme} variant="ghost" onClick={() => setStep(1)} style={{ padding: '15px 16px' }}>← Atrás</Btn>
            <Btn theme={theme} variant="dark" onClick={save} style={{ flex: 1, padding: '15px' }}>
              {busy ? 'Guardando…' : 'Guardar partida'}
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Catálogo ────────────────────────────────────────────────
function MobileCatalog({ theme, games, onBack }) {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('todas');
  const cats = ['todas', ...new Set(games.map(g => g.category).filter(Boolean))];
  const filtered = games.filter(g =>
    g.name.toLowerCase().includes(q.toLowerCase()) &&
    (cat === 'todas' || g.category === cat)
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${theme.lineSoft}`, background: theme.surface }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: theme.inkSoft, fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', padding: 0 }}>← Atrás</button>
        <span style={{ fontFamily: TT.sans, fontSize: 13, fontWeight: 600, color: theme.ink, textTransform: 'uppercase', letterSpacing: 1 }}>Catálogo</span>
      </div>

      <div style={{ padding: '20px 20px 12px' }}>
        <h2 style={{
          fontFamily: TT.display, fontSize: 30, fontWeight: 500, fontStyle: 'italic',
          color: theme.ink, margin: '0 0 16px', letterSpacing: -0.5,
        }}>{games.length} juegos en la mesa</h2>
        <Input theme={theme} value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar…" />

        <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '6px 12px', borderRadius: 999,
              background: cat === c ? theme.deep : 'transparent',
              color: cat === c ? theme.gold : theme.inkSoft,
              border: `1px solid ${cat === c ? theme.deep : theme.line}`,
              fontFamily: TT.sans, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 40px' }}>
        {filtered.map(g => (
          <div key={g.id} style={{
            padding: '14px 0', borderBottom: `1px solid ${theme.lineSoft}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TT.display, fontSize: 18, fontStyle: 'italic', color: theme.ink, fontWeight: 500 }}>
                {g.name}
              </div>
              <div style={{ fontFamily: TT.sans, fontSize: 11, color: theme.inkMuted, marginTop: 2 }}>
                {g.min_players}–{g.max_players} jug · ~{g.avg_duration || '—'} min
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              {g.category && <Pill theme={theme} tone="outline">{g.category}</Pill>}
              {g.available === false ? <Pill theme={theme} tone="fire">prestado</Pill> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ranking público ──────────────────────────────────────────
function MobileRanking({ theme, players, onBack }) {
  const sorted = [...players].sort((a,b) => b.wins - a.wins);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${theme.lineSoft}`, background: theme.surface }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: theme.inkSoft, fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', padding: 0 }}>← Atrás</button>
        <span style={{ fontFamily: TT.sans, fontSize: 13, fontWeight: 600, color: theme.ink, textTransform: 'uppercase', letterSpacing: 1 }}>Ranking</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>
        <div style={{
          fontFamily: TT.sans, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
          color: theme.gold, marginBottom: 6, textTransform: 'uppercase',
        }}>★ Liga del Dragón ★</div>
        <h2 style={{
          fontFamily: TT.display, fontSize: 32, fontWeight: 500, fontStyle: 'italic',
          color: theme.ink, margin: '0 0 24px', letterSpacing: -0.5,
        }}>Maestros de la mesa</h2>

        {sorted.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid', gridTemplateColumns: '32px 36px 1fr auto',
            gap: 12, alignItems: 'center', padding: '12px 0',
            borderBottom: `1px solid ${theme.lineSoft}`,
          }}>
            <div style={{
              fontFamily: TT.display, fontSize: i < 3 ? 24 : 18,
              color: i === 0 ? theme.gold : i === 1 ? theme.inkSoft : i === 2 ? theme.fire : theme.inkMuted,
              fontWeight: 500, fontStyle: 'italic',
            }}>{i + 1}</div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: theme.chip,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>{p.avatar_emoji}</div>
            <div>
              <div style={{ fontFamily: TT.display, fontSize: 17, fontStyle: 'italic', color: theme.ink, fontWeight: 500 }}>
                {p.display_name || p.username}
              </div>
              <div style={{ fontFamily: TT.sans, fontSize: 11, color: theme.inkMuted, marginTop: 1 }}>
                {p.matches_played} partidas
              </div>
            </div>
            <div style={{
              fontFamily: TT.display, fontSize: 24, fontWeight: 500, fontStyle: 'italic',
              color: i === 0 ? theme.gold : theme.accent, letterSpacing: -0.5,
            }}>{p.wins}</div>
          </div>
        ))}

        <div style={{
          marginTop: 24, padding: '16px', background: theme.surface,
          border: `1px solid ${theme.lineSoft}`, borderRadius: 6, textAlign: 'center',
        }}>
          <div style={{ fontFamily: TT.sans, fontSize: 11, color: theme.inkMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            Comparte el ranking
          </div>
          <div style={{ fontFamily: TT.mono, fontSize: 12, color: theme.ink, wordBreak: 'break-all' }}>
            {window.location.origin + '/ranking'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Perfil ──────────────────────────────────────────────────
function MobileProfile({ theme, user, players, badges, matches, onBack, onLogout }) {
  const me = players.find(p => p.username === user.username) || { matches_played: 0, wins: 0, total_minutes: 0 };
  const myMatches = matches.filter(m => (m.players || []).includes(user.username));
  const friendsMap = {};
  myMatches.forEach(m => (m.players || []).forEach(p => {
    if (p !== user.username) friendsMap[p] = (friendsMap[p] || 0) + 1;
  }));
  const friends = Object.entries(friendsMap).sort((a,b) => b[1]-a[1]).slice(0, 4);
  const earned = [];
  if (me.matches_played > 0) earned.push('first_match');
  if (me.wins > 0) earned.push('first_win');
  if (me.matches_played >= 25) earned.push('regular');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.lineSoft}`, background: theme.surface }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: theme.inkSoft, fontFamily: TT.sans, fontSize: 13, cursor: 'pointer', padding: 0 }}>← Atrás</button>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: theme.inkMuted, fontFamily: TT.sans, fontSize: 11, cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: 1 }}>Salir</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: theme.chip,
            border: `2px solid ${theme.gold}`,
            fontSize: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
          }}>{user.avatar_emoji}</div>
          <div style={{ fontFamily: TT.display, fontSize: 30, fontStyle: 'italic', color: theme.ink, lineHeight: 1, letterSpacing: -0.5, fontWeight: 500 }}>
            {user.display_name || user.username}
          </div>
          <div style={{ fontFamily: TT.mono, fontSize: 11, color: theme.inkMuted, marginTop: 6 }}>
            @{user.username}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 28 }}>
          {[
            ['Partidas', me.matches_played],
            ['Victorias', me.wins],
            ['Horas', Math.round((me.total_minutes || 0) / 60)],
          ].map(([label, val]) => (
            <div key={label} style={{
              background: theme.surface, border: `1px solid ${theme.lineSoft}`,
              borderRadius: 6, padding: '14px 10px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: TT.display, fontSize: 30, color: theme.ink,
                lineHeight: 1, letterSpacing: -0.5, fontStyle: 'italic', fontWeight: 500,
              }}>{val}</div>
              <div style={{
                fontFamily: TT.sans, fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 1,
                color: theme.inkMuted, marginTop: 6,
              }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...statLabel(theme), marginBottom: 10 }}>Logros</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 28 }}>
          {badges.map(b => {
            const ok = earned.includes(b.id);
            return (
              <div key={b.id} style={{
                background: theme.surface, border: `1px solid ${ok ? theme.gold : theme.lineSoft}`,
                borderRadius: 6, padding: '12px 6px', textAlign: 'center', opacity: ok ? 1 : 0.32,
              }}>
                <div style={{ fontSize: 22, filter: ok ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
                <div style={{ fontFamily: TT.sans, fontSize: 9, color: theme.inkSoft, marginTop: 4, lineHeight: 1.2, fontWeight: 600 }}>
                  {b.name}
                </div>
              </div>
            );
          })}
        </div>

        {friends.length > 0 && (
          <>
            <div style={{ ...statLabel(theme), marginBottom: 10 }}>Compañeros frecuentes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {friends.map(([name, count]) => (
                <div key={name} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 14px', background: theme.surface,
                  border: `1px solid ${theme.lineSoft}`, borderRadius: 4,
                }}>
                  <span style={{ fontFamily: TT.display, fontSize: 15, fontStyle: 'italic', color: theme.ink }}>{name}</span>
                  <span style={{ fontFamily: TT.mono, fontSize: 11, color: theme.inkMuted }}>{count} partidas</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.LDMobile = { MobileLogin, MobileHome, MobileNewMatch, MobileCatalog, MobileProfile, MobileMatchDetail, MobileRanking };

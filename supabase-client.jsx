// ═══════════════════════════════════════════════════════════════
//  Cliente Supabase + estado global — El Dragón
// ═══════════════════════════════════════════════════════════════

const SB_KEY = 'eldragon_sb_creds';
const USER_KEY = 'eldragon_user';
const ADMIN_KEY = 'eldragon_admin_pin';

let _sbLoading = null;
function loadSupabaseSDK() {
  if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
  if (_sbLoading) return _sbLoading;
  _sbLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
    s.onload = () => resolve(window.supabase);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _sbLoading;
}

function getStoredCreds() { try { return JSON.parse(localStorage.getItem(SB_KEY) || 'null'); } catch { return null; } }
function setStoredCreds(c) { c ? localStorage.setItem(SB_KEY, JSON.stringify(c)) : localStorage.removeItem(SB_KEY); }
function getStoredUser() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } }
function setStoredUser(u) { u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY); }

// ─── Datos demo ───────────────────────────────────────────────
const DEMO_GAMES = [
  { id: 'g1', name: 'Catan',          min_players: 3, max_players: 4, avg_duration: 90, category: 'estrategia', available: true },
  { id: 'g2', name: 'Carcassonne',    min_players: 2, max_players: 5, avg_duration: 45, category: 'familiar',   available: true },
  { id: 'g3', name: 'Wingspan',       min_players: 1, max_players: 5, avg_duration: 70, category: 'estrategia', available: true },
  { id: 'g4', name: 'Codenames',      min_players: 4, max_players: 8, avg_duration: 20, category: 'party',      available: true },
  { id: 'g5', name: 'Azul',           min_players: 2, max_players: 4, avg_duration: 35, category: 'familiar',   available: false },
  { id: 'g6', name: '7 Wonders Duel', min_players: 2, max_players: 2, avg_duration: 30, category: 'estrategia', available: true },
  { id: 'g7', name: 'Dixit',          min_players: 3, max_players: 6, avg_duration: 30, category: 'party',      available: true },
  { id: 'g8', name: 'Splendor',       min_players: 2, max_players: 4, avg_duration: 30, category: 'estrategia', available: true },
];
const DEMO_PLAYERS = [
  { id: 'p1', username: 'mara',   display_name: 'Mara',   avatar_emoji: '🦊', matches_played: 18, wins: 7,  total_minutes: 980 },
  { id: 'p2', username: 'tito',   display_name: 'Tito',   avatar_emoji: '🐉', matches_played: 22, wins: 11, total_minutes: 1340 },
  { id: 'p3', username: 'lupita', display_name: 'Lupita', avatar_emoji: '🦉', matches_played: 14, wins: 9,  total_minutes: 720 },
  { id: 'p4', username: 'dani',   display_name: 'Dani',   avatar_emoji: '🐺', matches_played: 9,  wins: 3,  total_minutes: 410 },
  { id: 'p5', username: 'rocio',  display_name: 'Rocío',  avatar_emoji: '🐱', matches_played: 11, wins: 4,  total_minutes: 540 },
  { id: 'p6', username: 'kike',   display_name: 'Kike',   avatar_emoji: '🦅', matches_played: 7,  wins: 2,  total_minutes: 320 },
];
const DEMO_MATCHES = [
  { id: 'm1', game_id: 'g1', game_name: 'Catan',          played_at: '2026-05-03T19:30:00', duration_min: 95, difficulty: 3, winner: 'tito',   players: ['mara','tito','lupita','dani'], notes: 'Tito construyó muralla en el último turno' },
  { id: 'm2', game_id: 'g4', game_name: 'Codenames',      played_at: '2026-05-03T17:00:00', duration_min: 25, difficulty: 2, winner: 'mara',   players: ['mara','rocio','kike','dani'] },
  { id: 'm3', game_id: 'g3', game_name: 'Wingspan',       played_at: '2026-05-02T20:00:00', duration_min: 75, difficulty: 4, winner: 'lupita', players: ['lupita','tito','mara'] },
  { id: 'm4', game_id: 'g2', game_name: 'Carcassonne',    played_at: '2026-05-02T15:30:00', duration_min: 50, difficulty: 2, winner: 'tito',   players: ['tito','rocio'] },
  { id: 'm5', game_id: 'g6', game_name: '7 Wonders Duel', played_at: '2026-05-01T21:00:00', duration_min: 35, difficulty: 3, winner: 'lupita', players: ['lupita','tito'] },
  { id: 'm6', game_id: 'g5', game_name: 'Azul',           played_at: '2026-05-01T18:00:00', duration_min: 40, difficulty: 2, winner: 'rocio',  players: ['rocio','dani','mara'] },
  { id: 'm7', game_id: 'g7', game_name: 'Dixit',          played_at: '2026-04-30T19:00:00', duration_min: 30, difficulty: 1, winner: 'kike',   players: ['kike','mara','lupita','dani','rocio'] },
];
const DEMO_BADGES = [
  { id: 'first_match', name: 'Primera partida',  emoji: '🎲' },
  { id: 'first_win',   name: 'Primera victoria', emoji: '🏆' },
  { id: 'marathon',    name: 'Maratonista',      emoji: '⏰' },
  { id: 'explorer',    name: 'Explorador',       emoji: '🧭' },
  { id: 'regular',     name: 'Habitual',         emoji: '☕' },
  { id: 'strategist',  name: 'Estratega',        emoji: '♟️' },
];

const Api = {
  mode() { return getStoredCreds() ? 'live' : 'demo'; },

  async client() {
    const creds = getStoredCreds();
    if (!creds) return null;
    const sb = await loadSupabaseSDK();
    if (!Api._client) Api._client = sb.createClient(creds.url, creds.key);
    return Api._client;
  },

  async listGames() {
    const c = await Api.client();
    if (!c) return DEMO_GAMES;
    const { data, error } = await c.from('games').select('*').order('name');
    return error ? DEMO_GAMES : data;
  },

  async listPlayers() {
    const c = await Api.client();
    if (!c) return DEMO_PLAYERS;
    const { data, error } = await c.from('player_stats').select('*').order('wins', { ascending: false });
    return error ? DEMO_PLAYERS : data;
  },

  async listMatches(limit = 30) {
    const c = await Api.client();
    if (!c) return DEMO_MATCHES;
    const { data, error } = await c
      .from('matches')
      .select('*, games(name), winner:players!matches_winner_id_fkey(username), match_players(player_id, score, players(username))')
      .order('played_at', { ascending: false }).limit(limit);
    if (error) return DEMO_MATCHES;
    return (data || []).map(m => ({
      id: m.id, game_id: m.game_id,
      game_name: m.games?.name || '—',
      played_at: m.played_at, duration_min: m.duration_min, difficulty: m.difficulty,
      notes: m.notes,
      winner: m.winner?.username,
      players: (m.match_players || []).map(mp => mp.players?.username).filter(Boolean),
    }));
  },

  async listBadges() { return DEMO_BADGES; },

  async findPlayer(username) {
    username = username.trim().toLowerCase();
    if (!username) throw new Error('Falta nombre');
    const c = await Api.client();
    if (!c) return DEMO_PLAYERS.find(p => p.username === username) || null;
    const { data } = await c.from('players').select('*').eq('username', username).maybeSingle();
    return data;
  },

  async createPlayer(username, pin, emoji) {
    username = username.trim().toLowerCase();
    const c = await Api.client();
    if (!c) return { id: 'demo-' + username, username, display_name: username, avatar_emoji: emoji };
    const pin_hash = await hashPin(pin);
    const { data, error } = await c.from('players').insert({
      username, display_name: username, avatar_emoji: emoji, pin_hash,
    }).select().single();
    if (error) throw error;
    return data;
  },

  async loginPlayer(username, pin) {
    username = username.trim().toLowerCase();
    const c = await Api.client();
    if (!c) return DEMO_PLAYERS.find(p => p.username === username) || { id: 'demo-' + username, username, display_name: username, avatar_emoji: '🎲' };
    const pin_hash = await hashPin(pin);
    const { data, error } = await c.from('players').select('*').eq('username', username).eq('pin_hash', pin_hash).maybeSingle();
    if (error || !data) throw new Error('PIN incorrecto');
    return data;
  },

  async createMatch(payload) {
    const c = await Api.client();
    if (!c) { console.log('[demo] partida:', payload); return { ok: true, demo: true }; }
    const { game_id, played_at, duration_min, difficulty, winner_id, players, notes, created_by } = payload;
    const { data: match, error: e1 } = await c.from('matches').insert({
      game_id, played_at, duration_min, difficulty, winner_id, notes, created_by,
    }).select().single();
    if (e1) throw e1;
    if (players?.length) {
      const rows = players.map(pid => ({ match_id: match.id, player_id: pid }));
      await c.from('match_players').insert(rows);
    }
    return { ok: true, match };
  },

  async addGame(name, category = null) {
    const c = await Api.client();
    if (!c) return { id: 'g-' + Date.now(), name, category, min_players: 2, max_players: 4, avg_duration: 30 };
    const { data, error } = await c.from('games').insert({ name, category }).select().single();
    if (error) throw error;
    return data;
  },
};

async function hashPin(pin) {
  const enc = new TextEncoder().encode('eldragon-' + pin);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

window.Api = Api;
window.LigaDragon = { getStoredCreds, setStoredCreds, getStoredUser, setStoredUser, ADMIN_KEY };

// ═══════════════════════════════════════════════════════════════
//  Panel de configuración Supabase
// ═══════════════════════════════════════════════════════════════

const TS = window.LDUI.T;
const { Btn: SBtn, Field: SField, Input: SInput, Pill: SPill } = window.LDUI;

function SupabaseConfig({ theme, onChanged }) {
  const stored = window.LigaDragon.getStoredCreds();
  const [url, setUrl] = React.useState(stored?.url || '');
  const [key, setKey] = React.useState(stored?.key || '');
  const [showSql, setShowSql] = React.useState(false);
  const [sql, setSql] = React.useState('');
  const [status, setStatus] = React.useState(stored ? 'connected' : 'disconnected');
  const [testing, setTesting] = React.useState(false);

  React.useEffect(() => {
    fetch('supabase-schema.sql').then(r => r.text()).then(setSql).catch(() => {});
  }, []);

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
      } else {
        setStatus('error');
      }
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
      background: theme.bg, color: theme.ink, fontFamily: TS.sans, padding: '32px 36px',
    }}>
      <div style={{ maxWidth: 720 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: theme.inkMuted }}>
          Configuración
        </div>
        <h1 style={{
          fontFamily: TS.serif, fontSize: 40, fontWeight: 400, margin: '4px 0 8px',
          letterSpacing: -1,
        }}>
          Conectar a <em style={{ fontStyle: 'italic', color: theme.accent }}>Supabase</em>
        </h1>
        <p style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.55, marginBottom: 28, maxWidth: 560 }}>
          Pega el <strong>Project URL</strong> y la <strong>anon key</strong> de tu proyecto.
          Las guardamos en <code style={{ fontFamily: TS.mono, fontSize: 12, background: theme.chip, padding: '2px 6px', borderRadius: 4 }}>localStorage</code> de tu navegador.
        </p>

        {/* Status banner */}
        <div style={{
          padding: '14px 18px', borderRadius: 12, marginBottom: 24,
          background: status === 'connected' ? theme.chip : theme.surface,
          border: `1px solid ${status === 'connected' ? theme.accent : theme.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.ink }}>
              {status === 'connected' && '🟢 Conectado'}
              {status === 'testing' && '⏳ Probando…'}
              {status === 'error' && '🔴 No pude conectar — revisa URL y key'}
              {status === 'disconnected' && '⚪ Modo demo (datos en memoria)'}
            </div>
            <div style={{ fontFamily: TS.mono, fontSize: 11, color: theme.inkMuted, marginTop: 2 }}>
              {status === 'connected' ? 'Datos reales · persistentes' : 'Sin persistencia'}
            </div>
          </div>
          {status === 'connected' && (
            <SBtn theme={theme} variant="ghost" onClick={disconnect}>Desconectar</SBtn>
          )}
        </div>

        {/* Form */}
        <SField label="Project URL" theme={theme} hint="ej. https://abcd1234.supabase.co">
          <SInput theme={theme} value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://xxxxx.supabase.co" />
        </SField>
        <SField label="Anon (public) key" theme={theme} hint="La anon key — NO la service_role">
          <SInput theme={theme} value={key} onChange={e => setKey(e.target.value)}
            placeholder="eyJhbGc…" type="password" />
        </SField>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <SBtn theme={theme} onClick={test} style={{ padding: '12px 20px' }}>
            {testing ? 'Probando…' : 'Conectar'}
          </SBtn>
          <SBtn theme={theme} variant="ghost" onClick={() => setShowSql(!showSql)}>
            {showSql ? '↑ Ocultar SQL' : '↓ Ver script SQL'}
          </SBtn>
        </div>

        {/* SQL block */}
        {showSql && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <h3 style={{ fontFamily: TS.serif, fontSize: 20, margin: 0, fontStyle: 'italic', fontWeight: 400 }}>
                Script de inicialización
              </h3>
              <button onClick={() => navigator.clipboard.writeText(sql)} style={{
                background: theme.chip, border: 'none', color: theme.ink,
                fontFamily: TS.sans, fontSize: 12, fontWeight: 600,
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              }}>Copiar</button>
            </div>
            <p style={{ fontSize: 13, color: theme.inkSoft, marginBottom: 10 }}>
              En Supabase: <strong>SQL Editor → New query</strong>, pega esto y ejecuta.
            </p>
            <pre style={{
              background: theme.surface, border: `1px solid ${theme.line}`,
              borderRadius: 12, padding: '16px', fontFamily: TS.mono, fontSize: 11,
              color: theme.inkSoft, lineHeight: 1.55, maxHeight: 360, overflow: 'auto',
              margin: 0, whiteSpace: 'pre-wrap',
            }}>{sql || 'cargando…'}</pre>
          </div>
        )}

        {/* Steps */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: TS.serif, fontSize: 20, margin: '0 0 12px', fontStyle: 'italic', fontWeight: 400 }}>
            Pasos rápidos
          </h3>
          <ol style={{ fontSize: 14, color: theme.inkSoft, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
            <li>Crea un proyecto en <a href="https://supabase.com" target="_blank" style={{ color: theme.accent }}>supabase.com</a></li>
            <li>Copia el script SQL de arriba y ejecútalo en el SQL Editor</li>
            <li>Ve a <strong>Settings → API</strong> y copia el Project URL + anon public key</li>
            <li>Pega los valores aquí arriba y dale a "Conectar"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

window.LDSupabase = SupabaseConfig;

// ═══════════════════════════════════════════════════════════════
//  Tokens y primitivos compartidos — Liga Dragón
// ═══════════════════════════════════════════════════════════════

const T = {
  // tipografía
  serif: '"Instrument Serif", "Iowan Old Style", Georgia, serif',
  sans:  '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',

  // light
  light: {
    bg:       '#f6f4ef',
    surface:  '#ffffff',
    card:     '#fdfcf9',
    ink:      '#15140f',
    inkSoft:  '#5b574d',
    inkMuted: '#8a8478',
    line:     '#e6e1d6',
    lineSoft: '#efeae0',
    accent:   '#c4533c',  // rojo terracota — nuestro acento
    accentInk:'#ffffff',
    gold:     '#a87b1f',
    chip:     '#f0ebde',
  },
  // dark
  dark: {
    bg:       '#16140f',
    surface:  '#1d1b15',
    card:     '#221f18',
    ink:      '#f4f0e6',
    inkSoft:  '#aaa496',
    inkMuted: '#7a7468',
    line:     '#2c2920',
    lineSoft: '#262318',
    accent:   '#d96b53',
    accentInk:'#15140f',
    gold:     '#d4a64f',
    chip:     '#2a2719',
  },
};

function useTheme(mode) {
  return mode === 'dark' ? T.dark : T.light;
}

// ─── primitivos UI ────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', theme, style = {}, ...rest }) {
  const base = {
    border: 'none', borderRadius: 999, padding: '12px 18px',
    fontFamily: T.sans, fontSize: 14, fontWeight: 550, letterSpacing: -0.1,
    cursor: 'pointer', transition: 'transform .08s ease, opacity .15s',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  };
  const v = {
    primary:   { background: theme.accent, color: theme.accentInk },
    secondary: { background: theme.chip,   color: theme.ink },
    ghost:     { background: 'transparent', color: theme.ink, border: `1px solid ${theme.line}` },
    text:      { background: 'transparent', color: theme.accent, padding: '8px 4px' },
  }[variant];
  return (
    <button onClick={onClick} style={{ ...base, ...v, ...style }} {...rest}>{children}</button>
  );
}

function Field({ label, children, theme, hint }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{
        fontFamily: T.sans, fontSize: 11, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 0.8,
        color: theme.inkSoft, marginBottom: 6,
      }}>{label}</div>
      {children}
      {hint && <div style={{
        fontFamily: T.sans, fontSize: 12, color: theme.inkMuted, marginTop: 4,
      }}>{hint}</div>}
    </label>
  );
}

function Input({ theme, style = {}, ...rest }) {
  return (
    <input
      style={{
        width: '100%', boxSizing: 'border-box',
        background: theme.surface, color: theme.ink,
        border: `1px solid ${theme.line}`, borderRadius: 12,
        padding: '12px 14px', fontFamily: T.sans, fontSize: 15,
        outline: 'none', transition: 'border-color .15s',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = theme.accent}
      onBlur={e => e.target.style.borderColor = theme.line}
      {...rest}
    />
  );
}

function Pill({ children, theme, tone = 'neutral', style = {} }) {
  const tones = {
    neutral:  { bg: theme.chip,    fg: theme.inkSoft },
    accent:   { bg: theme.accent,  fg: theme.accentInk },
    gold:     { bg: 'transparent', fg: theme.gold, border: `1px solid ${theme.gold}` },
    outline:  { bg: 'transparent', fg: theme.inkSoft, border: `1px solid ${theme.line}` },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: tones.bg, color: tones.fg,
      border: tones.border || 'none',
      borderRadius: 999, padding: '4px 10px',
      fontFamily: T.sans, fontSize: 11, fontWeight: 550,
      letterSpacing: 0.2,
      ...style,
    }}>{children}</span>
  );
}

// Logotipo simple — un dado tipográfico
function DragonLogo({ size = 28, theme }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: theme.ink, color: theme.bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.serif, fontSize: size * 0.62, fontWeight: 400,
      lineHeight: 1, paddingBottom: size * 0.06,
    }}>D</div>
  );
}

// Etiqueta "LIGA DRAGÓN"
function WordMark({ theme, size = 'sm' }) {
  const fs = size === 'lg' ? 22 : 13;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <DragonLogo size={size === 'lg' ? 36 : 22} theme={theme} />
      <span style={{
        fontFamily: T.serif, fontSize: fs, fontWeight: 400,
        color: theme.ink, letterSpacing: -0.2, lineHeight: 1,
      }}>
        Liga <em style={{ fontStyle: 'italic', color: theme.accent }}>Dragón</em>
      </span>
    </div>
  );
}

window.LDUI = { T, useTheme, Btn, Field, Input, Pill, DragonLogo, WordMark };

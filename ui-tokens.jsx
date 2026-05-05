// ═══════════════════════════════════════════════════════════════
//  Brand: El Dragón Board Games & Grill
// ═══════════════════════════════════════════════════════════════

const T = {
  serif: '"Cormorant Garamond", "Iowan Old Style", Georgia, serif',
  sans:  '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  display: '"Cormorant Garamond", Georgia, serif',

  light: {
    bg:       '#f4ede0',         // pergamino cálido
    surface:  '#fbf6ec',
    card:     '#ffffff',
    ink:      '#1c1410',         // marrón muy oscuro casi negro
    inkSoft:  '#5a4838',
    inkMuted: '#9c8a73',
    line:     '#e2d5bc',
    lineSoft: '#ece1c8',
    accent:   '#a82a1f',         // rojo dragón
    accentDk: '#8a1d14',
    accentInk:'#fbf6ec',
    gold:     '#b88420',         // dorado heráldico
    goldSoft: '#d9b35a',
    chip:     '#ece1c8',
    fire:     '#d96b1e',         // naranja fuego (para acentos secundarios)
    deep:     '#2d1810',         // marrón profundo (alt sobre claro)
  },
  dark: {
    bg:       '#15110c',         // noche pergamino
    surface:  '#1c1812',
    card:     '#221d15',
    ink:      '#f4ecd8',
    inkSoft:  '#b3a589',
    inkMuted: '#7a6f5a',
    line:     '#2c2519',
    lineSoft: '#241e14',
    accent:   '#d04534',
    accentDk: '#a82a1f',
    accentInk:'#15110c',
    gold:     '#d9b35a',
    goldSoft: '#b88420',
    chip:     '#2a2218',
    fire:     '#e58044',
    deep:     '#0f0b07',
  },
};

function useTheme(mode) { return mode === 'dark' ? T.dark : T.light; }

// ─── Logo: medallón heráldico con D ornamentada ──────────────
function DragonMark({ size = 40, color, fire = '#d96b1e', accent }) {
  // Medallón circular con D itálica + chispa de fuego.
  // Más legible y elegante que un dragón ilustrativo en miniatura.
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Anillo exterior */}
      <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1" fill="none" opacity="0.35"/>
      <circle cx="32" cy="32" r="27" fill={color}/>
      {/* Anillo interior dorado fino */}
      <circle cx="32" cy="32" r="24" stroke={fire} strokeWidth="0.6" fill="none" opacity="0.5"/>

      {/* Cuatro estrellas heráldicas en N/S/E/O */}
      <g fill={fire} opacity="0.6">
        <circle cx="32" cy="6" r="1"/>
        <circle cx="32" cy="58" r="1"/>
        <circle cx="6" cy="32" r="1"/>
        <circle cx="58" cy="32" r="1"/>
      </g>

      {/* D ornamentada itálica */}
      <text x="32" y="45" fontFamily='"Cormorant Garamond", Georgia, serif'
            fontSize="38" fontStyle="italic" fontWeight="500"
            fill={accent} textAnchor="middle" letterSpacing="-1">D</text>

      {/* Llamita encima de la D, como tilde de fuego */}
      <path d="M 26 14 Q 28 10, 30 14 Q 31 11, 33 14 Q 34 11, 36 14 Q 37 12, 38 15 L 36 17 L 34 15 L 32 17 L 30 15 L 28 17 Z"
            fill={fire} opacity="0.85"/>
    </svg>
  );
}

// Logo simplificado para tamaños pequeños (avatar, favicon)
function DragonGlyph({ size = 24, theme }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.2,
      background: theme.deep, color: theme.gold,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.display, fontStyle: 'italic', fontWeight: 500,
      fontSize: size * 0.6, lineHeight: 1, paddingBottom: size * 0.04,
      letterSpacing: -0.5,
    }}>D</div>
  );
}

function WordMark({ theme, size = 'sm', stacked = false }) {
  const fs = size === 'lg' ? 38 : size === 'md' ? 22 : 14;
  const sub = size === 'lg' ? 10 : 9;
  if (stacked) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <DragonMark size={size === 'lg' ? 72 : 40} color={theme.deep} accent={theme.accent} fire={theme.fire}/>
        <div style={{
          fontFamily: T.display, fontSize: fs, fontWeight: 500, fontStyle: 'italic',
          color: theme.ink, lineHeight: 1, letterSpacing: -0.5, textAlign: 'center',
        }}>
          El <span style={{ color: theme.accent }}>Dragón</span>
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: sub, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 3,
          color: theme.inkMuted, lineHeight: 1, whiteSpace: 'nowrap',
        }}>
          Board Games · Grill
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <DragonMark size={size === 'lg' ? 44 : 30} color={theme.deep} accent={theme.accent} fire={theme.fire}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{
          fontFamily: T.display, fontSize: fs, fontWeight: 500, fontStyle: 'italic',
          color: theme.ink, lineHeight: 1, letterSpacing: -0.3,
        }}>
          El <span style={{ color: theme.accent }}>Dragón</span>
        </span>
        <span style={{
          fontFamily: T.sans, fontSize: sub, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: 1.6,
          color: theme.inkMuted, lineHeight: 1,
        }}>
          Board Games · Grill
        </span>
      </div>
    </div>
  );
}

// ─── primitivos UI ────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', theme, style = {}, ...rest }) {
  const base = {
    border: 'none', borderRadius: 4, padding: '12px 18px',
    fontFamily: T.sans, fontSize: 13, fontWeight: 600, letterSpacing: 0.4,
    textTransform: 'uppercase',
    cursor: 'pointer', transition: 'transform .08s ease, opacity .15s, background .15s',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  };
  const v = {
    primary:   { background: theme.accent, color: theme.accentInk },
    dark:      { background: theme.deep, color: theme.gold },
    secondary: { background: theme.chip,   color: theme.ink },
    ghost:     { background: 'transparent', color: theme.ink, border: `1px solid ${theme.line}` },
    text:      { background: 'transparent', color: theme.accent, padding: '8px 4px', textTransform: 'none', letterSpacing: 0 },
  }[variant];
  return (
    <button onClick={onClick} style={{ ...base, ...v, ...style }} {...rest}>{children}</button>
  );
}

function Field({ label, children, theme, hint }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{
        fontFamily: T.sans, fontSize: 10, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 1.2,
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
        border: `1px solid ${theme.line}`, borderRadius: 4,
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
    neutral:  { bg: theme.chip, fg: theme.inkSoft },
    accent:   { bg: theme.accent, fg: theme.accentInk },
    gold:     { bg: 'transparent', fg: theme.gold, border: `1px solid ${theme.gold}` },
    fire:     { bg: theme.fire, fg: '#fff' },
    outline:  { bg: 'transparent', fg: theme.inkSoft, border: `1px solid ${theme.line}` },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: tones.bg, color: tones.fg,
      border: tones.border || 'none',
      borderRadius: 3, padding: '3px 8px',
      fontFamily: T.sans, fontSize: 10, fontWeight: 700,
      letterSpacing: 0.8, textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

// Decoración: grabado heráldico — esquinas y bordes
function HeraldicCorner({ size = 24, color, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path d="M 0 8 L 0 0 L 8 0 M 16 0 L 24 0 L 24 8 M 0 16 L 0 24 L 8 24 M 16 24 L 24 24 L 24 16"
            stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="0" cy="0" r="1.5" fill={color}/>
      <circle cx="24" cy="0" r="1.5" fill={color}/>
      <circle cx="0" cy="24" r="1.5" fill={color}/>
      <circle cx="24" cy="24" r="1.5" fill={color}/>
    </svg>
  );
}

// Línea decorativa con rombo central
function Divider({ theme, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0', ...style }}>
      <div style={{ flex: 1, height: 1, background: theme.line }}/>
      <svg width="8" height="8" viewBox="0 0 8 8">
        <path d="M 4 0 L 8 4 L 4 8 L 0 4 Z" fill={theme.gold}/>
      </svg>
      <div style={{ flex: 1, height: 1, background: theme.line }}/>
    </div>
  );
}

window.LDUI = { T, useTheme, Btn, Field, Input, Pill, DragonMark, DragonGlyph, WordMark, HeraldicCorner, Divider };

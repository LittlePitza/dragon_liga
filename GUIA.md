# 🐉 El Dragón — Guía de uso

App para registrar partidas de juegos de mesa en El Dragón Board Games & Grill.

---

## 📱 Primer arranque (modo demo)

Abre `El Dragon.html` en cualquier navegador. La app arranca en **modo demo** con datos de ejemplo (6 jugadores, 7 partidas, 8 juegos). Puedes probar todo el flujo sin configurar nada.

> El logo del Dragón (medallón circular con "D" dorada) confirma que estás en la app correcta.

---

## 🎲 Para jugadores (móvil)

### 1. Login con PIN
- Escribe tu **nombre o apodo** (ej. *Mara*) y elige un **avatar** (emoji)
- Si es la primera vez → te pide **crear un PIN** de 4-6 dígitos
- Si ya existías → te pide tu PIN para entrar

> 🔒 Tu PIN se guarda hasheado (SHA-256). No se guarda en texto plano.

### 2. Pantalla principal (Home)
- **Botón grande "Registrar partida"** — el flujo principal, toma 20 segundos
- **Crónicas recientes** — toca cualquiera para ver el detalle (ganador, duración, dificultad, notas)
- **Ranking** y **Catálogo** en accesos rápidos
- Tu avatar arriba a la derecha → abre tu **perfil**

### 3. Registrar una partida (2 pasos)

**Paso 1 — Juego:**
- Busca por nombre, o agrega uno nuevo con `+ Agregar "..."`
- Toca el juego en la lista para seleccionarlo

**Paso 2 — Detalles:**
- Solo el juego es obligatorio
- Opcionales: cuándo, duración (min), dificultad ★, jugadores, ganador, notas/anécdota

> Pro tip: las **notas** se renderan como cita en cursiva — ideal para anécdotas memorables ("remontó al final", "ganó por suerte con un 12").

### 4. Tu perfil
Avatar grande, stats (partidas / victorias / horas), logros desbloqueados (los grises se desbloquean automáticamente), compañeros frecuentes.

### 5. Ranking
Lista pública ordenada por victorias. Top 3 con colores de medalla (oro, plata, bronce).

---

## 🛡️ Para el dueño (admin)

### Ruta `?admin` o `#admin`
- Primera vez → **crea un PIN** de admin (queda guardado en este navegador)
- Veces siguientes → te pide ese PIN

### Vistas del dashboard
- **Resumen** — KPIs (partidas, jugadores, horas, juegos en uso) + ranking + más jugados + crónicas recientes
- **Partidas** — listado completo
- **Jugadores** — todos con sus stats
- **Inventario** — catálogo con disponibilidad

> El indicador en la esquina inferior izquierda dice si estás en **● Conectado** (Supabase real) o **○ Demo** (memoria).

---

## 🗄️ Conectar a Supabase (datos reales)

Por defecto, la app usa datos demo en memoria — al recargar, vuelve al estado inicial. Para datos persistentes:

### 1. Crea un proyecto en Supabase
- Ve a [supabase.com](https://supabase.com) → New project
- Anota la **Project URL** y la **anon (public) key** (Settings → API)

### 2. Ejecuta el script SQL
- En tu app, ve a `?config`
- Click en **"↓ Ver script SQL"** → **Copiar**
- En Supabase: **SQL Editor → New query** → pega → **Run**
- Eso crea las tablas: `players`, `games`, `matches`, `match_players`, vistas y políticas

### 3. Conecta
- En `?config`, pega URL y anon key → **Conectar**
- Si todo está bien verás **"● Conectado"**
- A partir de aquí, todos los registros se guardan en tu base

> Las credenciales se guardan en `localStorage` del navegador. Cada dispositivo se conecta una vez.

---

## 🌐 Rutas / URLs

| URL | Para quién |
|---|---|
| `?` (raíz) | Jugadores — app móvil |
| `?admin` | Dueño — dashboard |
| `?ranking` | Público — ranking compartible |
| `?config` | Conectar Supabase |

---

## 🚀 Publicar en Netlify

1. Renombra `El Dragon.html` → `index.html`
2. Ve a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta
3. Listo — te da una URL pública

---

## 🎨 Tweaks (panel de personalización)

Click en el ícono de tweaks (toolbar) → activa el panel:
- **Modo:** Pergamino (claro) ↔ Noche (oscuro)
- **Rutas:** atajos a las 4 vistas

---

## 🆘 Preguntas comunes

**¿Olvidé mi PIN.**  
Por ahora, el reset manual: abre Supabase → tabla `players` → borra esa fila (o el `pin_hash` para reusar el nombre).

**¿Cómo agrego juegos al catálogo?**  
Desde el flujo de "registrar partida": al buscar un juego que no existe, sale el botón `+ Agregar "..."`.

**¿Puedo cambiar mi PIN o avatar?**  
En esta versión no hay edición de perfil — me avisas si lo agregamos.

**¿Funciona offline?**  
La app carga, pero las escrituras necesitan conexión a Supabase. En modo demo funciona offline.

---

## 📋 Checklist de lanzamiento

- [ ] Probar el flujo completo en demo
- [ ] Crear proyecto Supabase + ejecutar script SQL
- [ ] Conectar la app desde `?config`
- [ ] Crear el PIN de admin en `?admin`
- [ ] Cargar el catálogo real de juegos (agregar desde la app)
- [ ] Subir a Netlify y compartir el QR/URL en el local
- [ ] (Opcional) Imprimir QR en las mesas

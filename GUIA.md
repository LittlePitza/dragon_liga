# El Dragon — Guia de uso

App para registrar partidas de juegos de mesa en El Dragon Board Games & Grill.

---

## Primer arranque (modo demo)

Abre `index.html` en cualquier navegador. La app arranca en modo demo con datos de ejemplo (6 jugadores, 7 partidas, 8 juegos). Puedes probar todo el flujo sin configurar nada.

---

## Para jugadores (movil)

### 1. Login con PIN
- Escribe tu nombre o apodo y elige un avatar (emoji)
- Si es la primera vez, te pide crear un PIN de 4-6 digitos
- Si ya existias, te pide tu PIN para entrar
- Tu PIN se guarda hasheado (SHA-256). No se guarda en texto plano.

### 2. Pantalla principal (Home)
- Boton grande "Registrar partida" — el flujo principal, toma 20 segundos
- Cronicas recientes — toca cualquiera para ver el detalle
- Ranking y Catalogo en accesos rapidos
- Tu avatar arriba a la derecha abre tu perfil

### 3. Registrar una partida (2 pasos)
- Paso 1: Busca el juego por nombre, o agrega uno nuevo con "+ Agregar"
- Paso 2: Detalles opcionales (cuando, duracion, dificultad, jugadores, ganador, notas)

### 4. Tu perfil
Avatar, stats (partidas/victorias/horas), logros desbloqueados, companeros frecuentes.

### 5. Ranking
Lista publica ordenada por victorias. Top 3 con colores de medalla.

---

## Para el dueno (admin)

### Ruta /admin
- Primera vez: crea un PIN de admin
- Veces siguientes: te pide ese PIN

### Vistas del dashboard
- Resumen: KPIs + ranking + mas jugados + cronicas recientes
- Partidas: listado completo
- Jugadores: todos con sus stats
- Inventario: catalogo con disponibilidad

El dashboard es responsive: en pantallas grandes muestra sidebar lateral, en movil muestra menu hamburguesa.

---

## Conectar a Supabase (datos reales)

### 1. Crea un proyecto en Supabase
- Ve a supabase.com, crea un nuevo proyecto
- Anota la Project URL y la anon (public) key

### 2. Ejecuta el script SQL
- En la app, ve a /config
- Click en "Ver script SQL", copia el contenido
- En Supabase: SQL Editor, New query, pega y ejecuta

### 3. Conecta
- En /config, pega URL y anon key, dale a "Conectar"

---

## Rutas / URLs

| URL       | Para quien              |
|-----------|-------------------------|
| /         | Jugadores — app movil   |
| /admin    | Dueno — dashboard       |
| /ranking  | Publico — ranking       |
| /config   | Conectar Supabase       |

---

## Publicar en Netlify

1. Ve a app.netlify.com/drop y arrastra la carpeta del proyecto
2. Listo — te da una URL publica

---

## Modo claro / oscuro

Boton flotante en la esquina inferior derecha para alternar entre modo Pergamino (claro) y Noche (oscuro).

---

## Estructura del proyecto

| Archivo              | Descripcion                        |
|----------------------|------------------------------------|
| index.html           | App completa (todo consolidado)    |
| supabase-schema.sql  | Esquema SQL para Supabase          |
| _redirects           | Reglas de redireccion para Netlify |
| GUIA.md              | Este archivo                       |

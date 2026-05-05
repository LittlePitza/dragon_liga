# Supabase conectado por defecto

Este repo ya trae configurado Supabase por defecto en `index.html`:

- Project URL: `https://hkastiwleddbyugcgmhi.supabase.co`
- Publishable/anon key: configurada en `DEFAULT_SUPABASE_ANON_KEY`

Con esto, los usuarios pueden abrir la app en `/`, `/ranking` o `/admin` sin entrar a `/config`.

## Importante

La publishable/anon key puede vivir en el frontend, pero la seguridad real depende de las policies RLS de Supabase. Antes de usarlo con clientes reales, revisa las policies de `supabase-schema.sql`.

## Para forzar actualización en iPhone

Después de subir este cambio a Netlify, abre:

```txt
https://TU-SITIO.netlify.app/?v=2026.05.05.4
```

Si la app fue agregada a pantalla de inicio, bórrala y agrégala otra vez una sola vez.

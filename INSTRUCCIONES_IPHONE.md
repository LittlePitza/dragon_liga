# iPhone sigue mostrando version vieja

Si en computadora ya sale la version nueva pero iPhone sigue con la anterior, el problema ya no es el codigo ni Netlify: es cache local de iOS.

Haz esto una sola vez despues de subir este repo:

1. Abre la app en iPhone con `?v=2026-05-05-2` al final de la URL.
   Ejemplo: `https://TU-SITIO.netlify.app/?v=2026-05-05-2`

2. Si la tienes agregada a pantalla de inicio, elimina ese icono y agregala de nuevo.

3. Si sigue igual: Configuracion > Safari > Avanzado > Datos de sitios web > busca tu dominio > Eliminar.

Este repo ya incluye `_headers`, `netlify.toml`, `VERSION.txt` y un verificador automatico de version para que no vuelva a quedarse vieja despues de esta limpieza inicial.

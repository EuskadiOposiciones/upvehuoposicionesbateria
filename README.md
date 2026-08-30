# Web UPV/EHU 2026 — lista para GitHub Pages

Landing comercial + páginas SEO para vender una app de entrenamiento de las baterías oficiales de la OPE UPV/EHU 2026.

## Qué incluye

- `index.html`: landing principal de conversión.
- `administrativo-upv-ehu/`: página específica de Administrativa.
- `subalterno-upv-ehu/`: página específica de Subalterna.
- `respuestas-bateria-administrativo-upv-ehu/`: página SEO/confianza sobre respuestas.
- `respuestas-bateria-subalterno-upv-ehu/`: equivalente para Subalterna.
- `bolsa-trabajo-upv-ehu/`: información de bolsa con fuente oficial.
- `assets/css/styles.css`: diseño responsive.
- `assets/js/config.js`: **único archivo que debes editar para app/precio/contacto**.
- `assets/js/site.js`: navegación, CTA, canonical dinámico y eventos de analítica.
- `sitemap.xml`, `robots.txt`, `.nojekyll`, `404.html`.

## Antes de publicar: 4 cambios

### 1) Enlace de la app
Abre `assets/js/config.js` y pega la URL real de Google Play/App Store:

```js
APP_URL: "https://...",
```

Mientras esté vacío, los CTA no quedan rotos: llevan al bloque de producto de la propia página.

### 2) Precio
En el mismo archivo:

```js
PRICE: "9,99 €",
PRICE_SUFFIX: "/mes",
```

Si se deja vacío, la web muestra `Precio en la app`.

### 3) URL de GitHub Pages
La versión entregada presupone:

`https://euskadioposiciones.github.io/ehuoposicionesbateria/`

Si la URL final es distinta, desde la raíz ejecuta:

```bash
python tools/update-base-url.py https://TU-USUARIO.github.io/TU-REPO/
```

Esto cambia `config.js`, `robots.txt` y `sitemap.xml` de una vez.

### 4) Capturas reales
La home incluye una vista conceptual creada con HTML/CSS. Antes de campaña final conviene sustituirla o complementarla con 2–3 capturas reales de la app. La copia ya está preparada para ello.

## GitHub Pages

Sube **el contenido de esta carpeta a la raíz del repositorio**, no la carpeta contenedora.

En GitHub:

1. `Settings` → `Pages`.
2. `Build and deployment` → `Deploy from a branch`.
3. Branch: `main`.
4. Folder: `/ (root)`.
5. Guardar.

Los enlaces son relativos, así que la web funciona tanto en un repositorio tipo `usuario.github.io` como en un Project Page `/repositorio/`.

## PostHog / analítica

`site.js` ya emite eventos **si `window.posthog` existe**. No incluye ninguna clave ni secreto.

Eventos preparados:

- `cta_app_click`
- `home_page_viewed`
- `admin_page_viewed`
- `subalterno_page_viewed`
- `answers_admin_page_viewed`
- `answers_sub_page_viewed`
- `bolsa_page_viewed`
- `scroll_depth_reached` (25/50/75/90)

Para activar la captura, conserva o añade en el `<head>` el snippet de PostHog que ya use tu proyecto actual. No pegues claves privadas en el repositorio.

## Mensajes comerciales que NO deben cambiar sin motivo

1. **Las preguntas del examen ya están publicadas. Ahora toca dominarlas.**
2. **No necesitas estudiar mejor. Necesitas repetir mejor.**
3. **Hay algo peor que fallar una pregunta: aprenderla mal.**
4. **Nosotros revisamos. Tú repites.**
5. La web habla siempre de **respuestas revisadas y contrastadas**, nunca de “respuestas oficiales”, salvo que la EHU publique realmente una plantilla oficial.
6. Plaza + bolsa se presentan juntas, pero la web no promete llamada ni contratación: remite a las condiciones oficiales.

## Datos oficiales incrustados (revisados 30/08/2026)

- Administrativa: 37 plazas totales (36 libre + 1 discapacidad), batería máxima de 500 preguntas, examen de 60 + 20 de reserva en 80 minutos; errores/no contestadas no penalizan.
- Subalterna: 10 plazas totales (9 libre + 1 discapacidad), batería máxima de 400 preguntas, examen de 40 + 20 de reserva en 60 minutos; errores/no contestadas no penalizan.
- Solicitudes: 1–21 de septiembre de 2026.
- Bases generales 9.4: aprobados sin plaza que alcancen la nota mínima indicada en las bases específicas se integran en la correspondiente bolsa temporal de la EHU.

Fuentes oficiales enlazadas dentro de `assets/js/config.js`.

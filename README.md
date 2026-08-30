# Web UPV/EHU 2026 — V2 para GitHub Pages

Landing comercial + páginas SEO para vender la app de entrenamiento de las baterías de la OPE UPV/EHU 2026.

## URL pública preparada

`https://euskadioposiciones.github.io/upvehuoposicionesbateria/`

Esta URL coincide con la entrada EHU que figura en el documento de control de Search Console del proyecto. Si cambia el repositorio, ejecuta:

```bash
python tools/update-base-url.py https://TU-USUARIO.github.io/TU-REPO/
```

## Qué mejora la V2

- Canonical estático y `og:url` en cada página.
- `og:image` 1200×630 incluida en `assets/img/`.
- Home enlazada siempre a la URL canónica, sin `index.html`.
- `404.html` marcado `noindex,nofollow`.
- Ningún texto interno de producción visible.
- La sección de precio se oculta si todavía no hay precio configurado.
- La home explica la trazabilidad de respuestas sin afirmar que exista una plantilla oficial.
- Administrativo incorpora titulación, tasa, perfiles, formato de examen y enlace de solicitud.
- Subalterna incorpora grupo, titulación, tasa, plazas y formato de examen.
- Las páginas de respuestas resuelven arriba la duda esencial: batería oficial sí; plantilla oficial enlazada por EHU, no.
- PostHog puede cargarse automáticamente cuando se añade el project API key.
- Galería de capturas reales opcional; no se muestran capturas inventadas como si fueran el producto final.

## Configuración antes de vender

Edita solo `assets/js/config.js`:

```js
APP_URL: "https://...",
PRICE: "... €",
PRICE_SUFFIX: "/mes",
PRICE_NOTE: "Cancela cuando quieras", // solo si es cierto
POSTHOG_KEY: "phc_...",
APP_SCREENSHOTS: [
  "assets/img/app-1.webp",
  "assets/img/app-2.webp",
  "assets/img/app-3.webp"
]
```

Si `PRICE` está vacío, toda la sección de precio permanece oculta. Si `APP_URL` está vacío, los CTA llevan al bloque que explica el producto y no generan un enlace muerto.

## Analítica

Al añadir `POSTHOG_KEY`, `site.js` carga PostHog y registra:

- `cta_app_click`
- `home_page_viewed`
- `admin_page_viewed`
- `subalterno_page_viewed`
- `answers_admin_page_viewed`
- `answers_sub_page_viewed`
- `bolsa_page_viewed`
- `scroll_depth_reached` (25/50/75/90)

El project API key de PostHog se utiliza en cliente por diseño; no pongas claves secretas o personales en este archivo.

## Fuentes oficiales incrustadas

- Página general OPE 2023–2024 EHU.
- Escala Administrativa EHU.
- Bases específicas Administrativa BOPV 3396/2026.
- Bases específicas Subalterna BOPV 3395/2026.
- Bases generales BOPV 3397/2026.
- Portal oficial de empleo EHU.

## Antes del lanzamiento comercial

1. Añadir enlace real de la app.
2. Añadir precio y condiciones reales.
3. Añadir capturas auténticas de la app.
4. Completar las páginas de respuestas con ejemplos concretos solo cuando esas fichas estén certificadas para publicación.
5. Probar el embudo completo desde móvil: Google → página → CTA → tienda → instalación/suscripción.

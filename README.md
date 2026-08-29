# Test OPE UPV/EHU 2026 — GitHub Pages

Micrositio centrado exclusivamente en la OPE 2023–2024 del PTGAS de la UPV/EHU para las escalas de acceso general:

- Escala Administrativa: 500 preguntas oficiales.
- Escala Subalterna: 400 preguntas oficiales.

## Estructura SEO

- `/` → búsqueda general: oposiciones UPV/EHU 2026, test EHU.
- `/administrativo/` → test administrativo UPV/EHU, batería 500 preguntas.
- `/subalterno/` → test subalterno UPV/EHU, batería 400 preguntas.
- `/baterias/` → baterías oficiales EHU y funcionamiento del examen.

Cada página resuelve una intención principal para evitar canibalización.

## Antes de publicar

Edita `app.js` y completa:

```js
const SITE_CONFIG = {
  appUrl: "ENLACE_GENERAL_DE_LA_APP",
  adminUrl: "ENLACE_ADMINISTRATIVO_SI_EXISTE",
  subalternoUrl: "ENLACE_SUBALTERNO_SI_EXISTE",
  monthlyPrice: "X,XX €/mes"
};
```

Si solo hay un enlace común a la app, basta con rellenar `appUrl`.

## SEO técnico pendiente de la URL definitiva

Cuando conozcas `usuario.github.io/repositorio/` conviene añadir:

1. URL canonical absoluta en las cuatro páginas indexables.
2. `sitemap.xml` con URLs absolutas.
3. Sitemap en Google Search Console.
4. Propiedad de Search Console para medir impresiones y clics reales.

No se han incluido canonicals ni sitemap con una URL ficticia para no enviar señales SEO incorrectas.

## Transparencia importante

La web distingue:

- **preguntas oficiales**: proceden de las baterías publicadas;
- **respuestas contrastadas**: no se presentan como plantilla oficial de la UPV/EHU, ya que la universidad publica la batería sin soluciones oficiales.

## Publicar en GitHub Pages

1. Crear repositorio público.
2. Subir el contenido de esta carpeta a la raíz.
3. `Settings → Pages`.
4. `Deploy from a branch`.
5. Branch `main`, carpeta `/root`.


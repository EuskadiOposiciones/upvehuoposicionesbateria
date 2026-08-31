# OPE Osakidetza — V10 comercial

Versión estática lista para GitHub Pages. Conserva las 16 URLs canónicas del sitemap anterior y reorganiza la experiencia para que la app sea visible desde el primer pantallazo sin perder las páginas informativas.

## Publicación
Sube estos archivos sobre la rama publicada manteniendo la misma ruta `/opeosakidetza/` y las mismas URLs.

### Search Console
La V10 incluye `googleb84d1a031c785654.html` con el token de verificación que aparece en el repositorio actual. Los archivos antiguos con sufijos `(1)`, `(2)`, etc. pueden permanecer; no es necesario borrarlos para publicar la V10.

## Lo que no se ha inventado
- Precio: solo se comunica `pago único` porque la ficha de Google Play no expone aquí el importe.
- Respuestas: se distingue oficial de contrastada.
- Fechas de Fase II: se remite al portal oficial para día/hora/sede.

## Analítica
Se mantiene PostHog EU cookieless y los eventos existentes: `$pageview`, `google_play_clicked`, `official_source_clicked`, `category_link_clicked`, `scroll_depth_reached`, más `study_plan_calculated`.

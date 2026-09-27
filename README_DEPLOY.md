# Capturas reales de la app · integración web
Fecha: 27/09/2026
Destino: rama `main`
Repositorio: `EuskadiOposiciones/upvehuoposicionesbateria`

## Qué cambia
Solo dos archivos:
- `assets/js/site.js`
- `assets/css/styles.css`

No se modifican HTML, titles, H1, canonicals, URLs ni sitemap.

## Fuente visual
Se usan las 4 capturas públicas que Google Play sirve actualmente para:
`com.jocyf.opeupvehuadministrativo`

La ficha no expone actualmente un vídeo promocional, por lo que no se añade vídeo.

## Dónde aparecen
- `/administrativo/app-test-upv-ehu/`: las 4 capturas.
- `/administrativo/`: 1 captura + enlace a la landing.
- `/bateria-500-preguntas-administrativo-ehu/`: 2 capturas + enlace a la landing.

## Rendimiento
- Dimensiones width/height declaradas.
- Primera captura de la landing: carga prioritaria.
- Resto: lazy loading + decoding async.
- CSS responsive.
- No embeds de vídeo ni scripts externos adicionales.

## UTM
Se conserva V10.0 y la atribución de enlaces a Google Play.
La nueva capa visual no rompe ni elimina las campañas existentes.

## Despliegue
Descomprimir y subir el contenido a `main`, conservando las rutas.

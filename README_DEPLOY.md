# SEO UPV/EHU — ejecución puntos 1, 2, 4 y 9
Fecha: 27/09/2026
Rama de destino: `main`
Repositorio: `EuskadiOposiciones/upvehuoposicionesbateria`

## Qué ejecuta este paquete

### 1. Estado post-plazo en Administrativo
- Mantiene la etiqueta oficial de la ficha EHU: `Abierta`.
- Deja claro que el plazo de solicitudes **cerró el 21/09/2026**.
- Indica que a 27/09 no están publicados tribunal, admitidos provisionales ni fecha/lugar del examen.
- No cambia title, H1, canonical ni URL de `/administrativo/`.

### 2. UTM para todos los enlaces a Google Play
`assets/js/site.js` añade automáticamente:
- `utm_source=euskadioposiciones`
- `utm_medium=website`
- `utm_campaign=<pagina>`
- `utm_content=cta_N`

Cada URL del clúster tiene campaña propia (`home`, `administrativo`, `bateria_500`, `baterias`, `radiografia_500`, etc.).
No hace falta reescribir los enlaces de todas las páginas: el JS los etiqueta al cargar.

### 4. Nueva landing de la app
Nueva URL:
`/administrativo/app-test-upv-ehu/`

Objetivo:
- búsquedas de app/test UPV-EHU;
- explicar el producto antes de Play;
- enlazar análisis propio + práctica;
- mantener transparencia sobre independencia y respuestas contrastadas.

No se usa `SoftwareApplication` schema porque el precio/suscripción exacto no se ha codificado en la web y no se debe inventar `offers.price`.

### 9. Subalterno con profundidad propia
- `/subalterno/` pasa de página breve a hub completo.
- Nueva URL:
  `/subalterno/bateria-400-preguntas/`
- Datos oficiales usados:
  - 10 plazas;
  - 9 libre + 1 discapacidad;
  - 6 PL2 preceptivo + 3 PL1 preceptivo en libre;
  - batería 400;
  - 20 temas;
  - examen 40 + 20;
  - 60 minutos;
  - sin penalización;
  - mínimo 10/20;
  - concurso máximo 9 puntos;
  - tasa 20,68 €;
  - Certificado de Escolaridad.
- Se deja explícito que la app publicada es solo de Administrativo.

## Archivos del ZIP
- `administrativo/index.html`
- `administrativo/app-test-upv-ehu/index.html`
- `subalterno/index.html`
- `subalterno/bateria-400-preguntas/index.html`
- `assets/js/site.js`
- `sitemap.xml`

## Despliegue
Descomprime el ZIP y sube el contenido a `main`, conservando las rutas y sustituyendo los archivos existentes cuando corresponda.

## Fuentes oficiales verificadas el 27/09/2026
Administrativo:
https://www.ehu.eus/es/web/azp/epe-bilatzailea?acceso=&anyo=&estado=&fecha-convocatoria=&grupo=&idioma=es&pestanya=1&proceso=432&regimen=&tipo-convocatoria=1
https://www.euskadi.eus/web01-bopv/es/bopv2/datos/2026/07/2603396a.shtml

Subalterno:
https://www.ehu.eus/es/web/azp/epe-bilatzailea?acceso=&anyo=&estado=&fecha-convocatoria=&grupo=&idioma=es&pestanya=1&proceso=433&regimen=&tipo-convocatoria=1
https://www.euskadi.eus/web01-bopv/es/bopv2/datos/2026/07/2603395a.shtml

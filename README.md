# Web Administrativo/a UPV/EHU — GitHub Pages

Versión corregida y lista para publicar en `euskadioposiciones.github.io/upvehuoposicionesbateria/`.

## Qué corrige esta versión

- La web se centra **exclusivamente en Administrativo/a**.
- La app se anuncia como **Próximamente**: no hay botones de compra, acceso o suscripción ficticios.
- La convocatoria se ha actualizado con datos oficiales revisados el **1 de septiembre de 2026**:
  - 37 plazas de acceso general para la Escala Administrativa.
  - Convocatorias de acceso general publicadas el 30 de julio de 2026.
  - Solicitudes del 1 al 21 de septiembre de 2026, ambos inclusive.
- Incluye enlaces directos a las fuentes oficiales de la EHU.
- Refuerza la propuesta de valor: preguntas oficiales, repetición y trazabilidad de respuestas.
- Añade SEO técnico: canonical, metadatos sociales, JSON-LD, `robots.txt`, `sitemap.xml` y `404.html`.
- Diseño responsive y menú móvil sin dependencias externas.

## Publicación

1. Descomprime el ZIP.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio `upvehuoposicionesbateria` (no la carpeta contenedora).
3. Sustituye los archivos antiguos cuando GitHub lo pregunte.
4. En **Settings → Pages**, confirma que la web se publica desde la rama correcta y la raíz `/`.
5. Abre `https://euskadioposiciones.github.io/upvehuoposicionesbateria/` y fuerza una recarga para comprobar la versión nueva.
6. En Google Search Console, solicita nueva indexación de la home después de verificar la publicación.

## Fuentes oficiales usadas

- OPE 2023-2024 EHU: `https://www.ehu.eus/es/web/azp/epe-2023_24`
- Bolsas de trabajo PTGAS: `https://www.ehu.eus/es/web/azp/bolsas_trabajo1`
- Acceso a listados de bolsas: `https://www.ehu.eus/es/web/azp/lanpoltseen-sarrera`
- Portal PTGAS: `https://www.ehu.eus/es/web/azp`

## Al cambiar el estado de la app

Cuando la app esté publicada, hay que revisar como mínimo:

- hero (`App: próximamente`),
- bloque `#app`,
- FAQ sobre disponibilidad,
- metadescription y Open Graph,
- JSON-LD,
- CTA principal,
- fecha de última revisión.

No publiques un enlace de suscripción hasta que el acceso real esté operativo.

## Verificación local

Desde la carpeta del proyecto:

```bash
python tests/verify_site.py
```

El resultado esperado es `PASS: paquete web verificado`.

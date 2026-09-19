# SEO_UPVEHU_PROPUESTAS_2_Y_4_COMBINADAS

Paquete delta listo para copiar sobre el repositorio `EuskadiOposiciones/upvehuoposicionesbateria`.

## Archivos que cambia
- `administrativo/index.html`
- `sitemap.xml` (solo `lastmod` de Administrativo a 2026-09-19)

## Lo que deliberadamente NO cambia
- `<title>`
- `<h1>`
- meta description
- canonical
- URL / arquitectura
- navegación principal
- páginas profundas

## Objetivo SEO
Combina las dos mejoras: propuesta de valor analítica visible + metodología de verificación. Es la versión recomendada si se quieren desplegar ambas, porque evita sobrescribir un `administrativo/index.html` con otro paquete independiente.

## Benchmark competitivo usado
- ApruebaTuOPE: https://apruebatuope.com/upv-ehu/administrativo/ y /preguntas
- OsasunTest: https://www.osasuntest.es/ehu/escala-administrativa/
- EuskadiOPE: https://euskadiope.es/oposiciones/ehu/escala-administrativa-upv-ehu

La comparación se ha usado para mejorar claridad de propuesta de valor, confianza y enlazado interno; no para copiar estructura ni texto.

## Despliegue
1. Descomprime el ZIP.
2. Copia `administrativo/index.html` sobre el archivo del mismo path del repositorio.
3. Copia `sitemap.xml` sobre el sitemap actual.
4. Publica el commit.
5. Verifica que el title y H1 siguen idénticos y que la página devuelve 200 con canonical autorreferente.

## Criterio durante la migración
Este paquete respeta la decisión de no cambiar title, H1 ni arquitectura mientras la migración desde GitHub Pages siga consolidándose.

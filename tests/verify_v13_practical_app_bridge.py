from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []

def require(cond, msg):
    if not cond:
        errors.append(msg)

def text(path):
    p = ROOT / path
    require(p.exists(), f'Falta {path}')
    return p.read_text(encoding='utf-8') if p.exists() else ''

def meta_description(html):
    m = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', html, re.I)
    return m.group(1) if m else ''

targets = {
    'hub': text('index.html'),
    'administrativo': text('administrativo/index.html'),
    'baterias': text('baterias/index.html'),
    'guia500': text('bateria-500-preguntas-administrativo-ehu/index.html'),
    'radiografia': text('administrativo/radiografia-500-preguntas/index.html'),
}

for name, html in targets.items():
    low = html.lower()
    require('play.google.com' not in low, f'{name}: no debe enlazar Google Play antes de publicación')
    require('11,99' not in low and '11.99' not in low, f'{name}: no debe mostrar precio antes de publicación')
    require('próximamente' in low or 'proximamente' in low, f'{name}: debe mantener estado Próximamente')
    require('2026-09-13' in html, f'{name}: falta dateModified/fecha de revisión 2026-09-13')

for name in ('hub','administrativo','baterias','guia500'):
    low = targets[name].lower()
    require('data-app-bridge="prelaunch"' in low, f'{name}: falta puente práctico hacia la app')
    require('haz preguntas' in low, f'{name}: falta lenguaje centrado en hacer preguntas')
    require('repite' in low or 'repetir' in low, f'{name}: falta utilidad de repetición')
    require('estadísticas' in low or 'estadisticas' in low, f'{name}: faltan estadísticas explicadas como utilidad')
    require('primeras 25 preguntas' in low, f'{name}: falta explicar la prueba gratuita de 25 preguntas')
    require('aria-disabled="true"' in low, f'{name}: el estado de Google Play debe verse como no disponible, no como CTA falso')

banned = ['controlar la batería', 'centro operativo', 'convertir este método', 'demostración conceptual']
for name, html in targets.items():
    low = html.lower()
    for phrase in banned:
        require(phrase not in low, f'{name}: conserva lenguaje interno: {phrase}')

require('método de repetición' not in meta_description(targets['guia500']).lower(), 'guia500: la meta description sigue vendiendo un método interno')
require('preguntas, respuestas y método' not in targets['baterias'].lower(), 'baterias: el H1/JSON-LD sigue centrado en “método” en lugar de práctica')
radio = targets['radiografia'].lower()
require('cómo aprovechar este análisis al practicar' in radio, 'radiografia: falta traducción del análisis a utilidad práctica')
require('qué publicamos y qué reservamos para la app' not in radio, 'radiografia: conserva una sección centrada en organización interna')
require('primeras 25' not in radio, 'radiografia: debe seguir siendo una página de confianza, no una landing comercial')

sitemap_path = ROOT / 'sitemap.xml'
require(sitemap_path.exists(), 'Falta sitemap.xml actualizado')
if sitemap_path.exists():
    sitemap = sitemap_path.read_text(encoding='utf-8')
    for url in [
        'https://euskadioposiciones.com/upvehuoposicionesbateria/',
        'https://euskadioposiciones.com/upvehuoposicionesbateria/administrativo/',
        'https://euskadioposiciones.com/upvehuoposicionesbateria/baterias/',
        'https://euskadioposiciones.com/upvehuoposicionesbateria/bateria-500-preguntas-administrativo-ehu/',
        'https://euskadioposiciones.com/upvehuoposicionesbateria/administrativo/radiografia-500-preguntas/',
    ]:
        pattern = re.escape(f'<loc>{url}</loc>') + r'<lastmod>2026-09-13</lastmod>'
        require(re.search(pattern, sitemap) is not None, f'sitemap: lastmod no actualizado para {url}')

if errors:
    print('FAIL')
    for e in errors: print('-', e)
    sys.exit(1)
print('PASS: V13 EHU práctico, pre-lanzamiento y sin CTA falso a Google Play')

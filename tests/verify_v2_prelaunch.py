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

def exact_tag(html, tag):
    m = re.search(fr'<{tag}[^>]*>(.*?)</{tag}>', html, re.I | re.S)
    return re.sub(r'<[^>]+>', '', m.group(1)).strip() if m else ''

def canonical(html):
    m = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html, re.I)
    return m.group(1) if m else ''

hub = text('index.html')
admin = text('administrativo/index.html')
radio = text('administrativo/radiografia-500-preguntas/index.html')

# Congelación SEO estructural: estos valores deben seguir exactamente como en main.
require(exact_tag(hub, 'title') == 'OPE UPV/EHU 2026: 52 plazas PTGAS, plazo y baterías', 'Cambió el title del hub')
require('Oposiciones UPV/EHU 2026:' in exact_tag(hub, 'h1') and '52 plazas PTGAS' in exact_tag(hub, 'h1'), 'Cambió el H1 del hub')
require(canonical(hub) == 'https://euskadioposiciones.com/upvehuoposicionesbateria/', 'Cambió el canonical del hub')

require(exact_tag(admin, 'title') == 'Administrativo UPV/EHU 2026 | 500 preguntas y 37 plazas', 'Cambió el title de Administrativo')
require(exact_tag(admin, 'h1') == 'Administrativo UPV/EHU 2026: 37 plazas y batería de 500 preguntas', 'Cambió el H1 de Administrativo')
require(canonical(admin) == 'https://euskadioposiciones.com/upvehuoposicionesbateria/administrativo/', 'Cambió el canonical de Administrativo')

require(exact_tag(radio, 'title') == '500 preguntas Administrativo UPV/EHU 2026: radiografía y análisis', 'Cambió el title de Radiografía')
require(exact_tag(radio, 'h1') == 'Radiografía de las 500 preguntas de Administrativo UPV/EHU 2026', 'Cambió el H1 de Radiografía')
require(canonical(radio) == 'https://euskadioposiciones.com/upvehuoposicionesbateria/administrativo/radiografia-500-preguntas/', 'Cambió el canonical de Radiografía')

# Pre-lanzamiento: no simular disponibilidad, precio ni ficha de Google Play.
for name, html in [('hub', hub), ('Administrativo', admin), ('Radiografía', radio)]:
    low = html.lower()
    require('próximamente' in low or 'proximamente' in low, f'{name}: falta estado Próximamente')
    require('11,99' not in html and '11.99' not in html, f'{name}: aparece precio antes del lanzamiento')
    require('play.google.com' not in low, f'{name}: aparece Google Play antes del lanzamiento')

# Producto real, sin funciones inventadas ni dependencia comercial de Osakidetza.
for name, html in [('hub', hub), ('Administrativo', admin)]:
    low = html.lower()
    require('primeras 25' in low, f'{name}: falta la prueba de las primeras 25')
    require('temporizador' in low, f'{name}: falta temporizador')
    require('estadísticas' in low or 'estadisticas' in low, f'{name}: faltan estadísticas')
    require('correctas e incorrectas' in low, f'{name}: falta seguimiento de correctas e incorrectas')
    require('falladas' in low, f'{name}: falta repetición de falladas')
    require('modo examen' in low, f'{name}: falta modo examen')
    require('osakidetza' not in low, f'{name}: no debe venderse como adaptación de Osakidetza')
    require('repetición dirigida' not in low and 'repeticion dirigida' not in low, f'{name}: aparece “repetición dirigida”')

require('ejemplo de test' in hub.lower(), 'Hub: la maqueta debe identificarse como ejemplo de test')

# Diferenciación y precisión editorial en Administrativo.
admin_low = admin.lower()
require('respuestas de estudio' in admin_low, 'Administrativo: falta distinguir respuestas de estudio')
require('fuente oficial' in admin_low, 'Administrativo: falta prevalencia de la fuente oficial')
require('500 preguntas oficiales' in admin_low, 'Administrativo: falta núcleo de 500 preguntas oficiales')

# Radiografía: página de confianza, no landing comercial.
radio_low = radio.lower()
require('<div class="icon">web</div>' in radio_low, 'Radiografía: debe decir WEB, no SEO')
require('<div class="icon">seo</div>' not in radio_low, 'Radiografía: sigue exponiendo la etiqueta SEO')
require('primeras 25' not in radio_low, 'Radiografía: no debe promocionar las 25 gratis en pre-lanzamiento')
require('temporizador' in radio_low and 'estadísticas' in radio_low and 'correctas e incorrectas' in radio_low and 'falladas' in radio_low and 'modo examen' in radio_low, 'Radiografía: descripción de app incompleta o inexacta')
require('sesiones' not in radio_low and 'seguimiento personal' not in radio_low, 'Radiografía: conserva funciones no verificadas')

if errors:
    print('FAIL')
    for e in errors:
        print('-', e)
    sys.exit(1)
print('PASS: V2 pre-lanzamiento EHU coherente; SEO estructural congelado')

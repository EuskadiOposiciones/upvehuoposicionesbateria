#!/usr/bin/env python3
"""Aplica mejoras SEO y de conversion sin sustituir contenido original.

Uso: python scripts/aplicar_mejoras_ehu.py
Se ejecuta desde la raiz del repositorio upvehuoposicionesbateria.
No usa dependencias externas ni hace solicitudes de red.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://euskadioposiciones.com/upvehuoposicionesbateria/"
PLAY = "https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo"
OFFICIAL_BATTERY = (
    "https://app.ehu.eus/api/meta4empleo/ptgas/oposiciones/documento"
    "?idContenido=BAT_PREGUNTAS&amp;idioma=es&amp;ordinal-convocatoria=1&amp;pestanya=1&amp;proceso=432"
)
BOE = "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229"
OG = BASE + "assets/img/seo/ehu-social-1200x630.png"
MARKER = "<!-- EHU-SEO-CONVERSION-V1 -->"
END_MARKER = "<!-- /EHU-SEO-CONVERSION-V1 -->"


def require(text: str, fragment: str, context: str) -> None:
    if fragment not in text:
        raise ValueError(f"No se encuentra el anclaje esperado en {context}: {fragment[:100]!r}. No se ha escrito ningun archivo.")


def add_assets(text: str, relative_prefix: str) -> str:
    """Add a fresh CSS/JS layer, never overwriting original analytics."""
    css = f'<link rel="stylesheet" href="{relative_prefix}assets/css/seo-ehu.css">'
    js = f'<script defer src="{relative_prefix}assets/js/seo-ehu.js"></script>'
    if css not in text:
        require(text, "</head>", "HTML head")
        text = text.replace("</head>", css + "\n</head>", 1)
    if js not in text:
        require(text, "</body>", "HTML body")
        text = text.replace("</body>", js + "\n</body>", 1)
    if '<meta property="og:image"' not in text:
        text = text.replace("</head>", (
            f'<meta property="og:image" content="{OG}">\n'
            '<meta property="og:image:width" content="1200">\n'
            '<meta property="og:image:height" content="630">\n'
            '<meta property="og:image:alt" content="UPV/EHU: batería de 500 preguntas, test gratuito y preparación de Administrativo">\n'
            "</head>"), 1)
    return text


def section_band(kind: str) -> str:
    if kind == "admin":
        test, appinfo = "test-gratis/", "app-test-upv-ehu/"
        lead = "Prepara la batería oficial de 500 preguntas"
        body = "Prueba primero 10 preguntas en esta web sin registro. En Android tienes otra muestra de 25 preguntas y, mediante suscripción, acceso a la batería completa."
        addon = ('<a class="seo-mini-link" href="preguntas-resueltas/">Consultar 30 preguntas con explicación y fuente →</a>')
        screenshot = '../assets/img/app/ehu-app-simulacro.webp'
    elif kind == "baterias":
        test, appinfo = "../administrativo/test-gratis/", "../administrativo/app-test-upv-ehu/"
        lead = "De la batería oficial al test: empieza gratis"
        body = "La muestra web permite responder 10 preguntas reales sin instalar nada. La app para Administrativo tiene una prueba diferente de 25 preguntas en Android."
        addon = ('<a class="seo-mini-link" href="../administrativo/preguntas-resueltas/">Ver 30 preguntas resueltas con fuentes →</a>')
        screenshot = '../assets/img/app/ehu-app-25-preguntas-gratis.webp'
    else:
        raise ValueError(kind)
    return f'''\n{MARKER}
<div class="seo-action-band" aria-label="Empieza a practicar">
 <div class="seo-action-copy">
  <p class="seo-kicker">PRACTICA ANTES DE DECIDIR</p>
  <h2>{lead}</h2>
  <p>{body}</p>
  <div class="seo-cta-row"><a class="btn" href="{test}" data-cta-position="seo_band_{kind}">Hacer 10 preguntas en la web</a>
  <a class="btn secondary" href="{PLAY}" target="_blank" rel="noopener" data-cta-position="seo_band_{kind}">Probar 25 preguntas en Android ↗</a></div>
  <div class="seo-sub-actions"><a class="seo-mini-link" href="{appinfo}">Ver capturas de la app y condiciones →</a>{addon}</div>
 </div>
 <figure class="seo-band-visual"><img src="{screenshot}" alt="Pantalla real de la app de Administrativo UPV/EHU" width="320" height="480" loading="lazy" decoding="async"><figcaption>Captura real de la app</figcaption></figure>
</div>
{END_MARKER}\n'''


def demo_card() -> str:
    opts = [
        ("A", "En la unidad de la Nación Española."),
        ("B", "En el compromiso de unidad de todos los pueblos y nacionalidades integrantes de la Nación Española."),
        ("C", "En la indisoluble unidad de la Nación Española."),
        ("D", "En la pluralidad de pueblos integrantes de la Nación Española."),
    ]
    rows = "\n".join(
        f'<button type="button" class="seo-demo-choice" data-answer="{letter}"><span class="seo-letter">{letter}</span><span>{answer}</span></button>'
        for letter, answer in opts
    )
    return f'''<div class="seo-demo" data-seo-demo role="region" aria-labelledby="seo-demo-title">
 <p class="seo-kicker">PREGUNTA 1 · BATERÍA OFICIAL DE ADMINISTRATIVO</p>
 <h2 id="seo-demo-title">Una pregunta real. Cuatro opciones. Una explicación.</h2>
 <p class="seo-demo-question">LA CONSTITUCIÓN SE FUNDAMENTA:</p>
 <div class="seo-demo-options" role="group" aria-label="Selecciona una opción">{rows}</div>
 <div class="seo-demo-feedback" data-demo-feedback hidden role="status" aria-live="polite">
  <strong data-feedback-title></strong>
  <p>Respuesta de estudio: <strong>C</strong>. El artículo 2 de la Constitución utiliza la expresión «indisoluble unidad de la Nación española».</p>
  <p><a href="{OFFICIAL_BATTERY}" target="_blank" rel="noopener">Batería oficial de la UPV/EHU ↗</a> · <a href="{BOE}" target="_blank" rel="noopener">Constitución, art. 2 ↗</a></p>
 </div>
 <p class="seo-demo-disclaimer">La respuesta es una <strong>clave de estudio elaborada y contrastada</strong>, no una plantilla oficial de respuestas de la UPV/EHU.</p>
 <div class="seo-demo-links"><a class="btn" href="administrativo/test-gratis/" data-cta-position="home_demo">Hacer el test gratuito de 10</a><a class="seo-mini-link" href="administrativo/preguntas-resueltas/#p1">Ver la pregunta documentada →</a></div>
</div>'''


def showcase() -> str:
    imgs = [
        ("assets/img/app/ehu-app-25-preguntas-gratis.webp", "Pregunta y prueba", "Descubre las 25 preguntas gratuitas de Android", 1280, 1920),
        ("assets/img/app/ehu-app-simulacro.webp", "Modo examen", "Practica con simulacros y temporizador", 395, 592),
        ("assets/img/app/ehu-app-estadisticas.webp", "Progreso", "Consulta estadísticas para localizar fallos", 1280, 1920),
    ]
    cards = "\n".join(f'''<figure class="seo-screen-card"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy" decoding="async"><figcaption><strong>{heading}</strong><span>{alt}</span></figcaption></figure>''' for src,heading,alt,w,h in imgs)
    return f'''
{MARKER}
<section class="seo-showcase section" aria-labelledby="seo-showcase-heading"><div class="wrap">
 <div class="seo-showcase-header"><div><p class="seo-kicker">EL PRODUCTO POR DENTRO</p><h2 id="seo-showcase-heading">Así se practica en la app de Administrativo</h2><p>Capturas reales: prueba gratuita, simulacro y seguimiento. La app para Android permite practicar 25 preguntas sin suscribirse; las 500 se desbloquean mediante suscripción.</p></div>
 <a class="seo-mini-link" href="administrativo/app-test-upv-ehu/">Ver la app, el QR y las condiciones →</a></div>
 <div class="seo-showcase-grid">{cards}</div>
 <div class="seo-showcase-footer"><a class="btn" href="administrativo/test-gratis/" data-cta-position="home_showcase">Hacer 10 preguntas en la web</a><a class="btn secondary" href="{PLAY}" target="_blank" rel="noopener" data-cta-position="home_showcase">Probar 25 en Android ↗</a></div>
</div></section>
{END_MARKER}
'''


def modify_home(html: str) -> str:
    # A documented test question replaces the fictitious 3-answer diagram.
    fake = re.compile(
        r'<div class="app-card" aria-label="Vista conceptual del entrenamiento">.*?</div></div></section>',
        re.DOTALL,
    )
    match = fake.search(html)
    if not match:
        raise ValueError("No se encuentra la tarjeta ficticia de la portada; revisar el HTML antes de aplicar.")
    html = html[:match.start()] + demo_card() + "</div></div></section>" + html[match.end():]
    actions = '<div class="actions"><a class="btn" href="administrativo/">Administrativo UPV/EHU 2026</a><a class="btn secondary" href="#que-se-convoca">Ver plazas y escalas</a></div>'
    require(html, actions, "home/hero/actions")
    html = html.replace(actions, (
        '<div class="actions seo-hero-actions">'
        '<a class="btn" href="administrativo/test-gratis/" data-cta-position="home_primary">Hacer 10 preguntas gratis</a>'
        '<a class="btn secondary" href="administrativo/">Preparar las 500 de Administrativo</a>'
        '<a class="seo-mini-link" href="#que-se-convoca">Ver plazas y convocatoria →</a>'
        '</div>'
    ), 1)
    # Just below the first screen, proof instead of repeated promotional promises.
    anchor = '<section class="section" id="que-se-convoca"'
    require(html, anchor, "home: convocatoria")
    html = html.replace(anchor, showcase() + anchor, 1)
    return html


def modify_administrativo(html: str) -> str:
    token = '<section class="section"><div class="wrap content">'
    require(html, token, "administrativo: primera sección")
    return html.replace(token, token + section_band('admin'), 1)


def modify_baterias(html: str) -> str:
    token = '<section class="section"><div class="wrap content">'
    require(html, token, "baterias: primera sección")
    return html.replace(token, token + section_band('baterias'), 1)


def modify_guide(html: str) -> str:
    # Existing CTAs are good. Reinforce the proof and avoid duplicating buttons.
    token = '<div class="actions" data-practice-choice>'
    require(html, token, "guia 500: CTA existente")
    msg = (f'''\n{MARKER}
<div class="seo-guide-proof"><strong>Comprueba una pregunta resuelta antes de instalar.</strong> '
        'Puedes ver las cuatro alternativas, la explicación y la fuente normativa de una pregunta publicada en la batería. '
        '<a href="../administrativo/preguntas-resueltas/#p1">Ver ejemplo completo →</a> · '
        '<a href="../administrativo/app-test-upv-ehu/">Capturas de la app y QR →</a></div>
{END_MARKER}\n''')
    html = html.replace(token, msg + token, 1)
    return html


PAGES = {
    'index.html': (modify_home, ''),
    'administrativo/index.html': (modify_administrativo, '../'),
    'baterias/index.html': (modify_baterias, '../'),
    'bateria-500-preguntas-administrativo-ehu/index.html': (modify_guide, '../'),
}


def modify_sitemap(sitemap: str, changed_paths: list[str], today: str) -> str:
    for path in changed_paths:
        canonical = BASE + path.removesuffix('index.html')
        pattern = re.compile(r'(<url>\s*<loc>' + re.escape(canonical) + r'</loc>\s*<lastmod>)(\d{4}-\d{2}-\d{2})(</lastmod>)')
        sitemap, count = pattern.subn(lambda m: m[1] + today + m[3], sitemap, count=1)
        if count != 1:
            raise ValueError(f"La URL editada no figura en el sitemap: {canonical}")
    return sitemap


def main() -> int:
    if not (ROOT / "robots.txt").exists():
        print("ERROR: ejecutar desde el repositorio UPV/EHU que ya tiene robots.txt", file=sys.stderr)
        return 2
    today = datetime.now(timezone.utc).date().isoformat()
    # Build everything in memory first. If one HTML no longer matches, leave the repository untouched.
    out: dict[Path, str] = {}
    changed: list[str] = []
    for path, (transform, relative) in PAGES.items():
        file = ROOT / path
        if not file.exists():
            raise FileNotFoundError(f"No existe {file}. Estas mejoras requieren el repositorio web original.")
        original = file.read_text(encoding="utf-8")
        if MARKER in original:
            print(f"Sin cambios (ya aplicado): {path}")
            continue
        new = add_assets(transform(original), relative)
        if new == original or MARKER not in new:
            raise ValueError(f"No se aplicaron las mejoras correctamente a {path}")
        if new.count('<link rel="canonical"') != original.count('<link rel="canonical"'):
            raise ValueError(f"Se alteró la URL canónica en {path}")
        out[file] = new
        changed.append(path)
    if changed:
        sitemap_file = ROOT / 'sitemap.xml'
        out[sitemap_file] = modify_sitemap(sitemap_file.read_text(encoding='utf-8'), changed, today)
    # Validate dependencies before writing.
    for dep in ["assets/js/site.js", "assets/js/seo-ehu.js", "assets/css/seo-ehu.css",
                "assets/img/app/ehu-app-25-preguntas-gratis.webp",
                "assets/img/app/ehu-app-simulacro.webp",
                "assets/img/app/ehu-app-estadisticas.webp",
                "assets/img/seo/ehu-social-1200x630.png"]:
        if not (ROOT / dep).is_file():
            raise FileNotFoundError(f"Falta recurso requerido, abortando: {dep}")
    for file, contents in out.items():
        file.write_text(contents, encoding='utf-8')
        print(f"Actualizado: {file.relative_to(ROOT)}")
    print(f"Resultado: {len(changed)} páginas mejoradas. Originales conservados; cambios listos para publicar.")
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)

#!/usr/bin/env python3
"""Activa Embudo UPV/EHU V2 sobre el repositorio vivo, sin sobreescribir V1.

Dependencias: únicamente Python 3.9+ estándar. Idempotente.
Se usa desde la acción .github/workflows/embudo-v2.yml.
"""
from __future__ import annotations
from datetime import datetime, timezone
from html import escape
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://euskadioposiciones.com/upvehuoposicionesbateria/'
PLAY = 'https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo'
MARK = '<!-- EHU-EMBUDO-V2 -->'
END = '<!-- /EHU-EMBUDO-V2 -->'
CSS = 'assets/css/embudo-v2.css'
JS = 'assets/js/embudo-v2.js'
QUIZJS = 'assets/js/test-gratis-v2.js'


def require(html: str, anchor: str, label: str) -> None:
    if anchor not in html:
        raise ValueError(f'No se encontro el anclaje de {label}: {anchor[:100]!r}. No se realiza ningun cambio.')


def assets(html: str, prefix: str) -> str:
    tag = f'<link rel="stylesheet" href="{prefix}{CSS}">'
    script = f'<script defer src="{prefix}{JS}"></script>'
    require(html, '</head>', 'head')
    require(html, '</body>', 'body')
    if tag not in html:
        html = html.replace('</head>', tag + '\n</head>', 1)
    if script not in html:
        html = html.replace('</body>', script + '\n</body>', 1)
    return html


def inline_question(kind: str) -> str:
    if kind == 'admin':
        number, question, answer, explanation = '2', 'LOS VALORES SUPERIORES DEL ORDENAMIENTO JURÍDICO PROPUGNADOS DESDE LA CONSTITUCIÓN SON:', 'A', 'El artículo 1.1 de la Constitución enumera libertad, justicia, igualdad y pluralismo político.'
        choices = [
            'La libertad, la justicia, la igualdad y el pluralismo político.',
            'La libertad, la justicia y la libre competencia.',
            'La libertad, la igualdad y el pluralismo político y sindical.',
            'La libertad, la igualdad y la fraternidad.',
        ]
        source = 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229'
        source_label = 'Constitución, art. 1.1'
        href = 'test-gratis/'
        btn_pos = 'admin_question_v2'
    elif kind == 'baterias':
        number, question, answer, explanation = '23', 'SEÑALE LA RESPUESTA CORRECTA:', 'A', 'El artículo 15.1 del Tratado de la Unión Europea establece que el Consejo Europeo no ejercerá función legislativa alguna.'
        choices = [
            'El Consejo Europeo no tiene competencia legislativa.',
            'El Consejo Europeo estará compuesto por los Ministros de Asuntos Exteriores de los Estados miembros.',
            'Participará en los trabajos del Consejo Europeo el Alto Representante de la Unión para Asuntos Fiscales y Política Económica.',
            'El Consejo Europeo se reunirá una vez por semestre por convocatoria de su Presidente.',
        ]
        source = 'https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:12016M015'
        source_label = 'Tratado de la Unión Europea, art. 15.1'
        href = '../administrativo/test-gratis/'
        btn_pos = 'baterias_question_v2'
    else:
        raise ValueError('Desconocido: ' + kind)
    buttons = '\n'.join(
        '<button type="button" data-answer="' + letter + '"><strong>' + letter + '</strong> · ' + escape(text) + '</button>'
        for letter, text in zip('ABCD', choices)
    )
    return f'''\n{MARK}
<section class="ehu-v2-quick-card" data-ehu-v2-inline-quiz data-correct="{answer}" data-question-number="{number}" aria-label="Pregunta real de muestra">
 <p class="ehu-v2-kicker">PRUEBA ANTES DE INSTALAR · PREGUNTA {number}</p>
 <h2>Responde una pregunta real de la batería</h2>
 <p class="ehu-v2-question">{escape(question)}</p>
 <div class="ehu-v2-choices" role="group" aria-label="Elige una de cuatro respuestas">{buttons}</div>
 <div class="ehu-v2-inline-feedback" role="status" aria-live="polite" data-v2-inline-feedback hidden><strong data-v2-inline-answer></strong><p>{escape(explanation)}</p><p><a href="{escape(source, quote=True)}" target="_blank" rel="noopener">Consultar {escape(source_label)} ↗</a></p></div>
 <div class="ehu-v2-inline-footer"><a class="btn" data-ehu-v2-next="{number}" data-cta-position="{btn_pos}" href="{href}">Hacer 3 preguntas gratis (ampliable a 10)</a><span class="ehu-v2-inline-disclaimer">Sin registro · explicaciones y fuentes · respuestas de estudio, no plantilla oficial</span></div>
</section>
{END}\n'''


def modify_entry(html: str, kind: str) -> str:
    anchor = '<!-- EHU-SEO-CONVERSION-V1 -->'
    require(html, anchor, kind + ': se necesita la capa V1 ya publicada')
    require(html, 'seo-action-band', kind + ': accesos actuales')
    return html.replace(anchor, inline_question(kind) + '\n' + anchor, 1)


def modify_home(html: str) -> str:
    require(html, 'data-seo-demo', 'portada: pregunta real V1')
    original = 'Hacer el test gratuito de 10'
    require(html, original, 'portada: CTA pregunta')
    html = html.replace(original, 'Probar 3 preguntas gratis (seguir hasta 10)', 1)
    anchor = '<div class="actions seo-hero-actions">'
    require(html, anchor, 'portada: acciones principales')
    note = (f'{MARK}<p class="ehu-v2-device-note ehu-v2-device-note--android">'
            'Si preparas Administrativo desde Android, puedes probar 25 preguntas gratis en la app. '
            f'<a href="{PLAY}" target="_blank" rel="noopener" data-cta-position="hero_android_v2">Abrir Google Play ↗</a></p>'
            '<p class="ehu-v2-device-note ehu-v2-device-note--desktop">'
            'Empieza por el test de 3 preguntas sin registro (puedes ampliar a 10). '
            '<a href="administrativo/test-gratis/">Ir al test gratuito →</a></p>'
            + END)
    # Insertar después del cierre de acciones, sin reemplazar ni ocultar el contenido V1.
    start = html.index(anchor)
    close = html.index('</div>', start) + len('</div>')
    return html[:close] + note + html[close:]


def modify_test(html: str) -> str:
    require(html, 'window.EHU_FREE_TEST=[', 'test: datos con 10 preguntas reales')
    require(html, 'src="../../assets/js/test-gratis.js"', 'test: script original')
    require(html, '<div class="quiz-start">', 'test: inicio')
    require(html, '<div class="quiz-stage" hidden>', 'test: preguntas')
    require(html, '<div class="quiz-result" hidden>', 'test: resultados')
    html = html.replace('src="../../assets/js/test-gratis.js"', 'src="../../assets/js/test-gratis-v2.js"', 1)
    html = html.replace('<div class="quiz-start">', '<div class="quiz-start" hidden>', 1)
    html = html.replace('<div class="quiz-stage" hidden>', '<div class="quiz-stage" hidden>', 1)
    html = html.replace('10 preguntas · 4 opciones · corrección inmediata.', 'Primero 3 preguntas · puedes continuar hasta 10 · corrección inmediata.', 1)
    marker = '<div id="free-test" class="quiz-shell" data-question-count="10">'
    require(html, marker, 'test: contenedor')
    prelude = f'''{marker}\n{MARK}
<div class="ehu-v2-prelude" data-ehu-v2-prelude><p><strong>Empieza ya:</strong> primera pregunta lista, sin cuenta ni pantalla de inicio.</p><button type="button" data-ehu-v2-full>Prefiero hacer directamente las 10</button></div>
{END}'''
    html = html.replace(marker, prelude, 1)
    head = '<section class="section"><div class="wrap content">'
    require(html, head, 'test: contenido')
    note = ('\n<div class="ehu-v2-test-intro"><strong>Nuevo:</strong> tres preguntas rápidas con explicación. '
            'Al terminar puedes seguir con las diez. Son preguntas de la batería EHU con claves de estudio contrastadas, no una plantilla oficial de respuestas.</div>'
            '<div class="ehu-v2-device-note ehu-v2-device-note--android">En Android también puedes probar 25 preguntas gratis en la app. '
            f'<a href="{PLAY}" target="_blank" rel="noopener" data-cta-position="test_android_v2">Ver en Google Play ↗</a></div>'
            '<div class="ehu-v2-device-note ehu-v2-device-note--desktop">Puedes hacer el test aquí. Si quieres instalar después la app, te mostraremos su código QR al terminar.</div>\n')
    return html.replace(head, head + note, 1)


def modify_guide(html: str) -> str:
    anchor = '<div class="actions" data-practice-choice>'
    require(html, anchor, 'guia: botones')
    note = f'{MARK}<p class="ehu-v2-device-note ehu-v2-device-note--android">En Android, prueba 25 preguntas sin pagar antes de decidir si te interesa acceder a las 500.</p><p class="ehu-v2-device-note ehu-v2-device-note--desktop">¿Aún no has probado la batería? Empieza con tres preguntas gratis y sigue hasta diez si quieres.</p>{END}\n'
    return html.replace(anchor, note + anchor, 1)


def modify_app(html: str) -> str:
    anchor = '<section class="section"><div class="wrap content">'
    require(html, anchor, 'app: contenido')
    note = f'{MARK}<div class="ehu-v2-device-note ehu-v2-device-note--android">En Android, la prueba de la app contiene 25 preguntas gratuitas. La batería completa de 500 requiere suscripción, según las condiciones vigentes en Google Play.</div><div class="ehu-v2-device-note ehu-v2-device-note--desktop">En ordenador puedes explorar las capturas y escanear el código QR de esta página desde Android, o <a href="../test-gratis/">probar tres preguntas en la web</a>.</div>{END}\n'
    return html.replace(anchor, anchor + note, 1)


PAGES = {
    'index.html': (modify_home, ''),
    'administrativo/index.html': (lambda s: modify_entry(s, 'admin'), '../'),
    'baterias/index.html': (lambda s: modify_entry(s, 'baterias'), '../'),
    'administrativo/test-gratis/index.html': (modify_test, '../../'),
    'administrativo/app-test-upv-ehu/index.html': (modify_app, '../../'),
    'bateria-500-preguntas-administrativo-ehu/index.html': (modify_guide, '../'),
}


def update_sitemap(sitemap: str, changed: list[str], today: str) -> str:
    for path in changed:
        url = BASE + path.removesuffix('index.html')
        pattern = re.compile(r'(<url>\s*<loc>' + re.escape(url) + r'</loc>\s*<lastmod>)(\d{4}-\d{2}-\d{2})(</lastmod>)')
        sitemap, n = pattern.subn(lambda m: m[1] + today + m[3], sitemap, count=1)
        if n != 1:
            raise ValueError('Falta la URL del sitemap para la pagina realmente editada: ' + url)
    return sitemap


def main() -> int:
    if not (ROOT / 'robots.txt').is_file() or not (ROOT / 'assets/js/site.js').is_file():
        raise RuntimeError('Este paquete debe aplicarse en el repositorio original UPV/EHU.')
    for path in [CSS, JS, QUIZJS, 'assets/css/seo-ehu.css', 'assets/js/seo-ehu.js',
                 'assets/img/app/qr-google-play.png']:
        if not (ROOT / path).is_file():
            raise FileNotFoundError('Dependencia no encontrada: ' + path)
    results: dict[Path, str] = {}
    changed: list[str] = []
    # Todo en memoria: no escribe nada si una pagina o el sitemap no encajan.
    for path, (fn, relative) in PAGES.items():
        f = ROOT / path
        if not f.is_file():
            raise FileNotFoundError('La pagina original no existe: ' + path)
        html = f.read_text(encoding='utf-8')
        if MARK in html:
            if f'{relative}{JS}' not in html:
                raise RuntimeError('Se encontro V2 incompleto en ' + path + '. Revisa manualmente.')
            print('Ya aplicado: ' + path)
            continue
        modified = assets(fn(html), relative)
        if modified.count('<link rel="canonical"') != html.count('<link rel="canonical"'):
            raise ValueError('La URL canonical ha cambiado en ' + path)
        if MARK not in modified:
            raise ValueError('No se detecta la nueva seccion en ' + path)
        results[f] = modified
        changed.append(path)
    if changed:
        f = ROOT / 'sitemap.xml'
        if not f.is_file():
            raise FileNotFoundError('Falta sitemap.xml')
        results[f] = update_sitemap(f.read_text(encoding='utf-8'), changed, datetime.now(timezone.utc).date().isoformat())
    # Escritura solo tras validar todas las dependencias y anclajes.
    for f, data in results.items():
        f.write_text(data, encoding='utf-8')
        print('Actualizado: ' + str(f.relative_to(ROOT)))
    print('Embudo V2: ' + str(len(changed)) + ' paginas; contenido oficial y capa V1 preservados.')
    return 0

if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as exc:
        print('ERROR: ' + str(exc), file=sys.stderr)
        raise SystemExit(1)

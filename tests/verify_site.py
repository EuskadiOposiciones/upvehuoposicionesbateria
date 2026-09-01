from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
errors=[]

def require(cond,msg):
    if not cond: errors.append(msg)

index = ROOT/'index.html'
require(index.exists(),'Falta index.html')
require((ROOT/'assets'/'styles.css').exists(),'Falta assets/styles.css')
require((ROOT/'assets'/'app.js').exists(),'Falta assets/app.js')
require((ROOT/'robots.txt').exists(),'Falta robots.txt')
require((ROOT/'sitemap.xml').exists(),'Falta sitemap.xml')
require((ROOT/'404.html').exists(),'Falta 404.html')
require((ROOT/'README.md').exists(),'Falta README.md')

if index.exists():
    html=index.read_text(encoding='utf-8')
    low=html.lower()
    require('administrativo' in low or 'administrativa' in low,'La home no está centrada en Administrativo/a')
    require('próximamente' in low or 'proximamente' in low,'No aparece el estado Próximamente')
    require('37' in html,'No aparece el número oficial de 37 plazas')
    require('1 de septiembre de 2026' in low,'No aparece la apertura del plazo')
    require('21 de septiembre de 2026' in low,'No aparece el cierre del plazo')
    require('ehu.eus/es/web/azp/epe-2023_24' in html,'Falta enlace a la fuente oficial OPE')
    require('ehu.eus/es/web/azp/bolsas_trabajo1' in html,'Falta enlace oficial a bolsas')
    require('subaltern' not in low,'La home contiene referencias a Subalterno/a')
    require('osakidetza' not in low,'La home contiene referencias a Osakidetza')
    require('<title>' in low and 'administrativ' in re.search(r'<title>(.*?)</title>', html, re.I|re.S).group(1).lower(),'El title SEO no está centrado en Administrativo/a')
    require('application/ld+json' in low,'Faltan datos estructurados')
    require('aria-disabled="true"' in low,'El CTA de app no está marcado como no disponible')
    require('suscríbete ahora' not in low and 'accede ahora' not in low,'Hay un CTA que simula disponibilidad inmediata')

if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('PASS: paquete web verificado')

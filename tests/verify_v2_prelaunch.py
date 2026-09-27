# Nombre histórico del test; desde 27/09/2026 valida el estado post-lanzamiento.
from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
APP="https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo"
errors=[]
def req(c,m):
    if not c: errors.append(m)
def tag(h,t):
    m=re.search(fr'<{t}[^>]*>(.*?)</{t}>',h,re.I|re.S); return re.sub(r'<[^>]+>','',m.group(1)).strip() if m else ''
def canon(h):
    m=re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"',h,re.I); return m.group(1) if m else ''
hub=(ROOT/'index.html').read_text(encoding='utf-8'); admin=(ROOT/'administrativo/index.html').read_text(encoding='utf-8')
req(tag(hub,'title')=='OPE UPV/EHU 2026: 52 plazas PTGAS, plazo y baterías','Cambió title hub')
req('52 plazas PTGAS' in tag(hub,'h1'),'Cambió H1 hub')
req(canon(hub)=='https://euskadioposiciones.com/upvehuoposicionesbateria/','Cambió canonical hub')
req(tag(admin,'title')=='Administrativo UPV/EHU 2026 | 500 preguntas y 37 plazas','Cambió title Administrativo')
req(tag(admin,'h1')=='Administrativo UPV/EHU 2026: 37 plazas y batería de 500 preguntas','Cambió H1 Administrativo')
req(canon(admin)=='https://euskadioposiciones.com/upvehuoposicionesbateria/administrativo/','Cambió canonical Administrativo')
for name,h in [('hub',hub),('admin',admin)]:
    req(APP in h,f'{name}: falta app publicada')
    req('próximamente' not in h.lower(),f'{name}: lenguaje pre-lanzamiento')
if errors:
 print('FAIL'); [print('-',e) for e in errors]; sys.exit(1)
print('PASS: SEO estructural congelado + lanzamiento app')

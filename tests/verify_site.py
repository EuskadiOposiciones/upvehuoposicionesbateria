from pathlib import Path
import re, sys
ROOT=Path(__file__).resolve().parents[1]
APP="https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo"
errors=[]
def req(c,m):
    if not c: errors.append(m)
for path in ['index.html','administrativo/index.html','baterias/index.html','bateria-500-preguntas-administrativo-ehu/index.html']:
    p=ROOT/path; req(p.exists(),f'Falta {path}')
    if p.exists():
        h=p.read_text(encoding='utf-8'); low=h.lower()
        req(APP in h,f'{path}: falta enlace Google Play')
        req('próximamente' not in low and 'proximamente' not in low,f'{path}: conserva lenguaje pre-lanzamiento')
        req('aria-disabled="true"' not in low,f'{path}: conserva CTA desactivado')
req((ROOT/'assets/js/site.js').exists(),'Falta assets/js/site.js')
if errors:
 print('FAIL'); [print('-',e) for e in errors]; sys.exit(1)
print('PASS: lanzamiento Google Play verificado')

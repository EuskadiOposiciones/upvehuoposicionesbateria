from pathlib import Path
import sys
ROOT=Path(__file__).resolve().parents[1]
APP="https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo"
errors=[]
def req(c,m):
    if not c: errors.append(m)
for path in ['index.html','administrativo/index.html','baterias/index.html','bateria-500-preguntas-administrativo-ehu/index.html']:
    h=(ROOT/path).read_text(encoding='utf-8').lower()
    req('data-app-bridge="live"' in h,f'{path}: falta estado live')
    req(APP.lower() in h,f'{path}: falta Google Play')
    req('haz preguntas' in h or 'practicar' in h,f'{path}: falta utilidad práctica')
js=(ROOT/'assets/js/site.js').read_text(encoding='utf-8')
req(APP in js,'site.js: falta compatibilidad global de Google Play')
if errors:
 print('FAIL'); [print('-',e) for e in errors]; sys.exit(1)
print('PASS: V13 migrado a lanzamiento real de la app')

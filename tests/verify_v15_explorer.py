from pathlib import Path
import json,csv,re,sys
ROOT=Path(__file__).resolve().parents[1]
errs=[]
def req(x,m):
    if not x: errs.append(m)
for p in ['administrativo/explorador-500/index.html','assets/js/explorador-500.js','assets/data/ehu-500-metadata.json','descargas/radiografia-500-preguntas-upv-ehu.csv','descargas/radiografia-500-preguntas-upv-ehu.pdf','assets/js/site.js','sitemap.xml']:
    req((ROOT/p).exists(),f'Falta {p}')
data=json.loads((ROOT/'assets/data/ehu-500-metadata.json').read_text(encoding='utf-8'))
qs=data['questions'];req(len(qs)==500,'El dataset no tiene 500 filas')
from collections import Counter
c=Counter(x['clasificacion'] for x in qs);req(c=={'Encaje directo':374,'Transversal':79,'Sin encaje directo':47},f'Conteos incorrectos: {c}')
req(sum(bool(x['respuesta_explicada_publica']) for x in qs)==30,'No hay 30 respuestas públicas')
req(sum(x['estado_publico']=='Corrección documentada' for x in qs)==12,'No hay 12 correcciones')
req(sum(x['estado_publico']=='Salvedad técnica' for x in qs)==2,'No hay 2 salvedades')
site=(ROOT/'assets/js/site.js').read_text(encoding='utf-8');req('explorador_500' in site,'site.js no mide el explorador');req("searchParams.set('referrer'" in site,'site.js no prepara Install Referrer');req('data-free-test-cta' in site,'Faltan CTA del test gratis')
sm=(ROOT/'sitemap.xml').read_text(encoding='utf-8');req('/administrativo/explorador-500/' in sm,'Explorer fuera de sitemap')
if errs:
 print('FAIL');[print('-',e) for e in errs];sys.exit(1)
print('PASS: paquete EHU integral verificado')


document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const el=document.querySelector(a.getAttribute("href"));
    if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});

// V10.0 — app publicada + atribución de adquisición web → Google Play.
const APP_BASE_URL = "https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo";

// Compatibilidad con cualquier HTML pre-lanzamiento que pueda quedar en caché.
document.querySelectorAll('a.btn').forEach(a=>{
  const t=(a.textContent||'').trim().toLowerCase();
  if(t.includes('app próximamente') || t.includes('app proximamente')){
    a.href=APP_BASE_URL;
    a.target='_blank';
    a.rel='noopener';
    a.textContent='App en Google Play ↗';
  }
});
document.querySelectorAll('[data-app-bridge="prelaunch"]').forEach(el=>el.setAttribute('data-app-bridge','live'));
document.querySelectorAll('span.btn[aria-disabled="true"]').forEach(span=>{
  if((span.textContent||'').toLowerCase().includes('google play')){
    const a=document.createElement('a');
    a.className=span.className;
    a.href=APP_BASE_URL;
    a.target='_blank';
    a.rel='noopener';
    a.textContent='Abrir en Google Play ↗';
    span.replaceWith(a);
  }
});

// UTM: una campaña distinta por página y un utm_content distinto por CTA.
// Google Play Console puede separar adquisición externa por source/campaign.
const path = window.location.pathname.replace(/\/+$/,'/');
const campaignRules = [
  [/\/administrativo\/app-test-upv-ehu\/$/, 'app_landing'],
  [/\/administrativo\/radiografia-500-preguntas\/$/, 'radiografia_500'],
  [/\/administrativo\/preguntas-por-tema\/$/, 'preguntas_por_tema'],
  [/\/administrativo\/preguntas-dudosas\/$/, 'preguntas_dudosas'],
  [/\/administrativo\/que-preguntas-se-repiten\/$/, 'preguntas_repetidas'],
  [/\/administrativo\/$/, 'administrativo'],
  [/\/bateria-500-preguntas-administrativo-ehu\/$/, 'bateria_500'],
  [/\/baterias\/$/, 'baterias'],
  [/\/subalterno\/bateria-400-preguntas\/$/, 'subalterno_bateria_400'],
  [/\/subalterno\/$/, 'subalterno'],
  [/\/bolsa-trabajo-upv-ehu\/$/, 'bolsa_ehu'],
  [/\/upvehuoposicionesbateria\/$/, 'home']
];
const campaign = (campaignRules.find(([rx])=>rx.test(path)) || [null,'site'])[1];

document.querySelectorAll('a[href*="play.google.com/store/apps/details"][href*="com.jocyf.opeupvehuadministrativo"]').forEach((a,index)=>{
  try{
    const url=new URL(a.href);
    url.searchParams.set('utm_source','euskadioposiciones');
    url.searchParams.set('utm_medium','website');
    url.searchParams.set('utm_campaign',campaign);
    url.searchParams.set('utm_content','cta_'+(index+1));
    a.href=url.toString();
  }catch(_){}
});

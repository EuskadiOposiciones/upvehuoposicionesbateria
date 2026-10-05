document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}));
const APP='https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo';const path=location.pathname.replace(/\/+$/,'/');
document.querySelectorAll('a.btn').forEach(a=>{const t=(a.textContent||'').toLowerCase();if(t.includes('app próximamente')||t.includes('app proximamente')){a.href=APP;a.target='_blank';a.rel='noopener';a.textContent='App en Google Play ↗'}});
(function(){const target='/upvehuoposicionesbateria/administrativo/preguntas-resueltas/';document.querySelectorAll('.links').forEach(nav=>{if(!nav.querySelector('a[href*="preguntas-resueltas"]')){const a=document.createElement('a');a.href=target;a.textContent='Resueltas';nav.appendChild(a)}});const p=document.querySelector('.related-links p');if(p&&!p.querySelector('a[href*="preguntas-resueltas"]')){const a=document.createElement('a');a.className='btn secondary';a.href=target;a.textContent='Preguntas resueltas';p.append(' ',a)}})();
if(/\/administrativo\/$/.test(path)){const n=[...document.querySelectorAll('.notice')].find(x=>(x.textContent||'').includes('App ya publicada'));if(n&&!document.querySelector('.app-admin-preview')){const f=document.createElement('figure');f.className='app-admin-preview';f.innerHTML='<img src="../assets/img/app/ehu-app-25-preguntas-gratis.webp" width="1280" height="1920" loading="lazy" alt="Configurador de Test Administrativo UPV/EHU con 25 preguntas gratis"><p>Captura real de la app. <a href="app-test-upv-ehu/">Ver todas las capturas y el vídeo →</a></p>';n.insertAdjacentElement('afterend',f)}}
if(/\/bateria-500-preguntas-administrativo-ehu\/$/.test(path)){const p=document.querySelector('.product');if(p&&!document.querySelector('.app-battery-preview')){const s=document.createElement('section');s.className='app-battery-preview';s.innerHTML='<h2>De la batería a la práctica</h2><div class="app-screenshot-grid"><figure class="app-screenshot"><img src="../assets/img/app/ehu-app-simulacro.webp" width="395" height="592" loading="lazy" alt="Modo test con temporizador en Test Administrativo UPV/EHU"><figcaption>Simula una sesión con temporizador y corrección.</figcaption></figure><figure class="app-screenshot"><img src="../assets/img/app/ehu-app-estadisticas.webp" width="1280" height="1920" loading="lazy" alt="Estadísticas de Test Administrativo UPV/EHU"><figcaption>Repite fallos y consulta la evolución.</figcaption></figure></div><p><a href="../administrativo/app-test-upv-ehu/">Ver las cuatro capturas y el vídeo →</a></p>';p.insertAdjacentElement('beforebegin',s)}}
// CTA contextual al test gratuito: solo en las tres páginas EHU con tráfico útil.
(function(){
  const target='/upvehuoposicionesbateria/administrativo/test-gratis/';
  let anchor=null,label='';
  if(/\/baterias\/$/.test(path)){
    const notices=[...document.querySelectorAll('.content .notice')];
    anchor=notices[notices.length-1]||null;
    label='Haz 10 preguntas gratis · sin registro';
  }else if(/\/administrativo\/radiografia-500-preguntas\/$/.test(path)){
    anchor=document.querySelector('.content .quick-answer');
    label='Prueba 10 preguntas de la batería · gratis';
  }else if(/\/administrativo\/preguntas-por-tema\/$/.test(path)){
    anchor=document.querySelector('.content .quick-answer');
    label='Haz 10 preguntas gratis · sin registro';
  }
  if(anchor&&!document.querySelector('[data-free-test-cta]')){
    const box=document.createElement('div');
    box.className='actions';
    box.dataset.freeTestCta='1';
    const a=document.createElement('a');
    a.className='btn';
    a.href=target;
    a.textContent=label;
    box.appendChild(a);
    anchor.insertAdjacentElement('afterend',box);
  }
})();
// Explorador e informe descargable: distribución del análisis propio sin crear páginas programáticas.
(function(){
  const explorer='/upvehuoposicionesbateria/administrativo/explorador-500/';
  const csv='/upvehuoposicionesbateria/descargas/radiografia-500-preguntas-upv-ehu.csv';
  const pdf='/upvehuoposicionesbateria/descargas/radiografia-500-preguntas-upv-ehu.pdf';
  function addActions(after,items){if(!after||document.querySelector('[data-explorer-actions="'+campaignSafe()+'"]'))return;const d=document.createElement('div');d.className='actions';d.dataset.explorerActions=campaignSafe();items.forEach(it=>{const a=document.createElement('a');a.className='btn'+(it.secondary?' secondary':'');a.href=it.href;a.textContent=it.label;if(it.download)a.setAttribute('download','');if(it.kind)a.dataset.analysisDownload=it.kind;d.appendChild(a)});after.insertAdjacentElement('afterend',d)}
  function campaignSafe(){return path.replace(/[^a-z0-9]+/gi,'-')||'home'}
  const quick=document.querySelector('.content .quick-answer');
  if(/\/administrativo\/radiografia-500-preguntas\/$/.test(path))addActions(quick,[{href:explorer,label:'Explorar las 500'},{href:csv,label:'Descargar CSV',secondary:true,download:true,kind:'csv'},{href:pdf,label:'Informe PDF',secondary:true,kind:'pdf'}]);
  else if(/\/administrativo\/preguntas-por-tema\/$/.test(path))addActions(quick,[{href:explorer,label:'Explorar por número y tema'},{href:csv,label:'Descargar mapa CSV',secondary:true,download:true,kind:'csv'}]);
  else if(/\/administrativo\/preguntas-dudosas\/$/.test(path))addActions(quick,[{href:explorer+'?estado=Revisión%20individual',label:'Ver casos revisados en el explorador'},{href:'/upvehuoposicionesbateria/administrativo/test-gratis/',label:'Probar 10 preguntas',secondary:true}]);
  else if(/\/administrativo\/preguntas-resueltas\/$/.test(path))addActions(quick,[{href:explorer+'?estado=Respuesta%20explicada',label:'Ver respuestas dentro de las 500'},{href:'/upvehuoposicionesbateria/administrativo/test-gratis/',label:'Hacer test gratis',secondary:true}]);
  else if(/\/administrativo\/que-preguntas-se-repiten\/$/.test(path))addActions(quick,[{href:explorer,label:'Explorar la batería completa'}]);
  else if(/\/administrativo\/$/.test(path)){
    const h=[...document.querySelectorAll('h2')].find(x=>(x.textContent||'').includes('500 preguntas analizadas'));
    const sec=h&&h.closest('section');const strip=sec&&sec.querySelector('.data-strip');if(strip&&!sec.querySelector('a[href*="explorador-500"]')){const d=document.createElement('div');d.className='actions';d.innerHTML='<a class="btn" href="explorador-500/">Explorar las 500 preguntas</a><a class="btn secondary" href="../descargas/radiografia-500-preguntas-upv-ehu.pdf">Descargar radiografía PDF</a>';strip.insertAdjacentElement('afterend',d)}
  }
  if(/\/upvehuoposicionesbateria\/$/.test(path)){
    const grids=[...document.querySelectorAll('.grid2')];const g=grids.find(x=>x.querySelector('a[href*="radiografia-500-preguntas"]'));if(g&&!g.querySelector('a[href*="explorador-500"]')){const a=document.createElement('a');a.className='card link-card';a.href='administrativo/explorador-500/';a.innerHTML='<div class="icon">⌕</div><h3>Explorador de las 500</h3><p>Busca por número, tema, encaje y estado de revisión; descarga también el dataset.</p>';g.appendChild(a)}
  }
})();
const campaigns=[[/\/administrativo\/explorador-500\/$/,'explorador_500'],[/\/administrativo\/test-gratis\/$/,'test_gratis'],[/\/administrativo\/historial-correcciones\/$/,'historial_correcciones'],[/\/administrativo\/app-test-upv-ehu\/$/,'app_landing'],[/\/administrativo\/preguntas-resueltas\/$/,'preguntas_resueltas'],[/\/administrativo\/radiografia-500-preguntas\/$/,'radiografia_500'],[/\/administrativo\/preguntas-por-tema\/$/,'preguntas_por_tema'],[/\/administrativo\/preguntas-dudosas\/$/,'preguntas_dudosas'],[/\/administrativo\/que-preguntas-se-repiten\/$/,'preguntas_repetidas'],[/\/administrativo\/$/,'administrativo'],[/\/bateria-500-preguntas-administrativo-ehu\/$/,'bateria_500'],[/\/baterias\/$/,'baterias'],[/\/subalterno\/$/,'subalterno'],[/\/upvehuoposicionesbateria\/$/,'home']];const campaign=(campaigns.find(([r])=>r.test(path))||[null,'site'])[1];
document.querySelectorAll('a[href*="play.google.com/store/apps/details"][href*="com.jocyf.opeupvehuadministrativo"]').forEach((a,i)=>{try{const u=new URL(a.href);u.searchParams.set('utm_source','euskadioposiciones');u.searchParams.set('utm_medium','website');u.searchParams.set('utm_campaign',campaign);u.searchParams.set('utm_content','cta_'+(i+1));const ref=new URLSearchParams({utm_source:'euskadioposiciones',utm_medium:'website',utm_campaign:campaign,utm_content:'cta_'+(i+1)});u.searchParams.set('referrer',ref.toString());a.href=u.toString()}catch(_){}});
const TOKEN='phc_nyXj9NDnjEt7ngcrAuSZT8jPN9mkqW5ySCBNtLp6SMWH',API='https://eu.i.posthog.com',UI='https://eu.posthog.com';function capture(n,p){if(window.posthog&&typeof window.posthog.capture==='function')window.posthog.capture(n,Object.assign({product:'ehu',page_path:path,page_title:document.title,campaign},p||{}))}
!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],o='init capture'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);window.posthog.init(TOKEN,{api_host:API,ui_host:UI,defaults:'2026-05-30',cookieless_mode:'always',person_profiles:'never',autocapture:false,capture_pageview:false,capture_pageleave:true,disable_session_recording:true,respect_dnt:true});capture('$pageview');
document.querySelectorAll('[data-youtube-id]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.youtubeId,i=document.createElement('iframe');i.className='video-frame';i.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0';i.title='Vídeo de Test Administrativo UPV/EHU';i.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';i.allowFullscreen=true;b.replaceWith(i);capture('app_video_started',{video_id:id})},{once:true}));
const pls=[...document.querySelectorAll('a[href*="play.google.com/store/apps/details"]')];if('IntersectionObserver'in window){const seen=new WeakSet(),ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.5&&!seen.has(e.target)){seen.add(e.target);capture('play_cta_viewed',{cta_label:(e.target.textContent||'').trim().slice(0,100)});ob.unobserve(e.target)}}),{threshold:[.5]});pls.forEach(a=>ob.observe(a))}
document.addEventListener('click',e=>{const a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;let u;try{u=new URL(a.href,location.href)}catch(_){return}if(u.hostname==='play.google.com')capture('google_play_clicked',{cta_label:(a.textContent||'').trim().slice(0,100)});if(u.pathname.includes('/preguntas-resueltas/'))capture('resolved_questions_clicked');if(u.pathname.includes('/test-gratis/'))capture('free_test_link_clicked');if(u.pathname.includes('/historial-correcciones/'))capture('correction_history_clicked');if(u.pathname.includes('/explorador-500/'))capture('explorer_link_clicked');if(a.dataset&&a.dataset.analysisDownload)capture('analysis_download_clicked',{format:a.dataset.analysisDownload})},{passive:true});

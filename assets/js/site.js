
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const el=document.querySelector(a.getAttribute("href"));
    if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});

// V10.1 — app publicada + capturas oficiales de Google Play + atribución web → Play.
const APP_BASE_URL = "https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo";

const APP_SCREENSHOTS = [
  "https://play-lh.googleusercontent.com/u6hQ-cpBopDT_Y8oYvh-sVnVH3Hxz4oDFPQLE7miSpyxqG1OuMbFoNA0gqpt0c7FJAqLJStUbwU914Z76jiErg=w526-h296",
  "https://play-lh.googleusercontent.com/9U0nYRaoF8NEG1GB5eRicoeTqKubzaUxoGVurZz67r5QGEwN9LkMKQFk-DiMopTxGPIcyZOw40G9ocTuQm6R_Xc=w526-h296",
  "https://play-lh.googleusercontent.com/WzprNC8vdB7CV_HCuZoa8SLuD7DTtSOh3n4Pu2i5Pa_Uc0pHt6qFW-ccGniShHZMOvmlieHVZncwfdtlYM0uTw=w526-h296",
  "https://play-lh.googleusercontent.com/LEUi-rZMAlk7uCcQEYxP6tbSmwi-AXPPh0Rah3Ge7i5G4er_Lbd1day5ziTxTF7yWNhNs1Qavu3kfEIaxEhW=w526-h296"
];

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

const path = window.location.pathname.replace(/\/+$/,'/');

function screenshotFigure(src,index,eager=false){
  const figure=document.createElement('figure');
  figure.className='app-screenshot';

  const img=document.createElement('img');
  img.src=src;
  img.width=526;
  img.height=296;
  img.alt=`Captura real ${index + 1} de la app Test Administrativo UPV/EHU publicada en Google Play`;
  img.decoding='async';
  img.loading = eager ? 'eager' : 'lazy';
  if(eager) img.fetchPriority='high';

  figure.appendChild(img);
  return figure;
}

function galleryBlock({title,lead,count=4,className='',eagerFirst=false}){
  const section=document.createElement('section');
  section.className=`app-media-block ${className}`.trim();

  if(title){
    const h2=document.createElement('h2');
    h2.textContent=title;
    section.appendChild(h2);
  }

  if(lead){
    const p=document.createElement('p');
    p.className='app-media-lead';
    p.textContent=lead;
    section.appendChild(p);
  }

  const grid=document.createElement('div');
  grid.className='app-screenshot-grid';

  APP_SCREENSHOTS.slice(0,count).forEach((src,i)=>{
    grid.appendChild(screenshotFigure(src,i,eagerFirst && i===0));
  });

  section.appendChild(grid);

  const note=document.createElement('p');
  note.className='app-media-note';
  note.textContent='Capturas reales de la versión publicada en Google Play.';
  section.appendChild(note);

  return section;
}

// Landing propia de la app: las cuatro capturas, inmediatamente después del primer CTA.
if(/\/administrativo\/app-test-upv-ehu\/$/.test(path)){
  const content=document.querySelector('.content');
  const firstActions=content?.querySelector('.actions');

  if(firstActions && !document.querySelector('.app-media-block.app-full-gallery')){
    const block=galleryBlock({
      title:'La app por dentro',
      lead:'Antes de instalarla, puedes ver el aspecto real de la aplicación publicada.',
      count:4,
      className:'app-full-gallery',
      eagerFirst:true
    });

    firstActions.insertAdjacentElement('afterend',block);
  }
}

// Administrativo: una sola muestra visual para demostrar el producto sin convertir la página en una landing.
if(/\/administrativo\/$/.test(path)){
  const appNotice=[...document.querySelectorAll('.notice')].find(el=>(el.textContent||'').includes('App ya publicada'));

  if(appNotice && !document.querySelector('.app-media-block.app-admin-preview')){
    const block=galleryBlock({
      title:'',
      lead:'',
      count:1,
      className:'app-admin-preview',
      eagerFirst:false
    });

    const link=document.createElement('p');
    link.className='app-media-link';
    link.innerHTML='<a href="app-test-upv-ehu/">Ver más capturas y funciones de la app →</a>';
    block.appendChild(link);

    appNotice.insertAdjacentElement('afterend',block);
  }
}

// Guía de las 500: dos capturas para conectar la estrategia de estudio con la práctica real.
if(/\/bateria-500-preguntas-administrativo-ehu\/$/.test(path)){
  const product=document.querySelector('.product');

  if(product && !document.querySelector('.app-media-block.app-battery-preview')){
    const block=galleryBlock({
      title:'Así se ve la práctica en la app',
      lead:'Dos vistas reales de la aplicación publicada para trabajar la batería desde el móvil.',
      count:2,
      className:'app-battery-preview',
      eagerFirst:false
    });

    const link=document.createElement('p');
    link.className='app-media-link';
    link.innerHTML='<a href="../administrativo/app-test-upv-ehu/">Ver las cuatro capturas y todas las funciones →</a>';
    block.appendChild(link);

    product.insertAdjacentElement('beforebegin',block);
  }
}

// UTM: una campaña distinta por página y un utm_content distinto por CTA.
// Google Play Console puede separar adquisición externa por source/campaign.
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

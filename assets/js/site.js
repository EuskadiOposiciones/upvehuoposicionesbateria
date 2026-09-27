
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",e=>{
    const el=document.querySelector(a.getAttribute("href"));
    if(el){e.preventDefault();el.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});

// V9.0 — app publicada: compatibilidad para páginas analíticas que conservan HTML pre-lanzamiento.
const APP_URL = "https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo";
document.querySelectorAll('a.btn').forEach(a=>{
  const t=(a.textContent||'').trim().toLowerCase();
  if(t.includes('app próximamente') || t.includes('app proximamente')){
    a.href=APP_URL; a.target='_blank'; a.rel='noopener'; a.textContent='App en Google Play ↗';
  }
});
document.querySelectorAll('[data-app-bridge="prelaunch"]').forEach(el=>el.setAttribute('data-app-bridge','live'));
document.querySelectorAll('span.btn[aria-disabled="true"]').forEach(span=>{
  if((span.textContent||'').toLowerCase().includes('google play')){
    const a=document.createElement('a'); a.className=span.className; a.href=APP_URL; a.target='_blank'; a.rel='noopener'; a.textContent='Abrir en Google Play ↗'; span.replaceWith(a);
  }
});

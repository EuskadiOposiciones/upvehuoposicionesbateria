(function(){
  const c = window.EHU_SITE_CONFIG || {};
  document.querySelectorAll('[data-app-cta]').forEach(a=>{
    if(c.appUrl){
      try{
        const u = new URL(c.appUrl, window.location.href);
        u.searchParams.set('utm_source','ehu_web');
        u.searchParams.set('utm_medium','cta');
        u.searchParams.set('utm_campaign','ehu_2026');
        u.searchParams.set('utm_content',a.dataset.cta || 'generic');
        a.href=u.toString();
      }catch(e){a.href=c.appUrl}
    } else {
      a.href = (c.siteBase || '') + '/#precio';
    }
  });
  document.querySelectorAll('[data-track]').forEach(el=>{
    el.addEventListener('click',()=>window.posthog?.capture?.(el.dataset.track,{cta:el.dataset.cta||'',page_path:location.pathname}));
  });
  const demo=document.querySelector('[data-demo]');
  if(demo){
    const btn=demo.querySelector('button');
    const result=demo.querySelector('.demo-result');
    btn?.addEventListener('click',()=>{
      const checked=demo.querySelector('input:checked');
      result.classList.add('show');
      result.innerHTML=checked ? '<strong>Así debe sentirse la práctica:</strong> respondes, compruebas la clave utilizada para estudiar y vuelves después sobre los fallos. En la app completa trabajas toda la batería.' : 'Selecciona una opción para ver cómo funcionaría una pregunta de demostración.';
      window.posthog?.capture?.('demo_question_checked',{page_path:location.pathname,has_answer:!!checked});
    });
  }
})();

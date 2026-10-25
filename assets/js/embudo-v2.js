/* EHU V2: adaptación por dispositivo y preguntas reales en páginas de entrada.
   No altera site.js, conserva UTMs y la captura delegada de clicks a Google Play. */
(function(){
  'use strict';
  const android = /android/i.test(navigator.userAgent || '');
  const desktop = !/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
  document.documentElement.classList.add(android ? 'ehu-v2-device-android' : (desktop ? 'ehu-v2-device-desktop' : 'ehu-v2-device-other'));
  function track(name, data){
    if(window.posthog && typeof window.posthog.capture === 'function'){
      window.posthog.capture(name,Object.assign({product:'ehu',surface:'funnel_v2',page_path:location.pathname,device_variant:android?'android':desktop?'desktop':'other'},data||{}));
    }
  }
  // Conservar accesos a ambas ofertas: solo se invierte la prioridad visual en Android.
  document.querySelectorAll('.seo-cta-row').forEach(function(row){
    const links=Array.from(row.querySelectorAll('a.btn'));
    const play=links.find(function(a){return a.href.includes('play.google.com/store/apps/details');});
    const test=links.find(function(a){return a.href.includes('/test-gratis/');});
    if(!play || !test) return;
    row.dataset.ehuV2Device='true';
    if(android){
      play.classList.remove('secondary');
      test.classList.add('secondary');
      row.prepend(play);
    }
  });
  // Preguntas verificadas de la batería, insertadas en las dos páginas de mayor intención.
  document.querySelectorAll('[data-ehu-v2-inline-quiz]').forEach(function(card){
    const correct=card.getAttribute('data-correct');
    const qno=card.getAttribute('data-question-number');
    const feedback=card.querySelector('[data-v2-inline-feedback]');
    let completed=false;
    card.querySelectorAll('button[data-answer]').forEach(function(option){
      option.addEventListener('click',function(){
        if(completed)return;
        completed=true;
        const answer=option.dataset.answer;
        const ok=answer===correct;
        card.querySelectorAll('button[data-answer]').forEach(function(btn){
          btn.disabled=true;
          if(btn.dataset.answer===correct)btn.classList.add('ehu-v2-right');
          if(btn===option && !ok)btn.classList.add('ehu-v2-wrong');
        });
        feedback.hidden=false;
        feedback.querySelector('[data-v2-inline-answer]').textContent=ok?'Correcto.':'La respuesta de estudio es '+correct+'.';
        track('ehu_v2_inline_answered',{question_number:qno,chosen:answer,correct:ok});
      });
    });
  });
  // Seguimiento del clic en la acción de pasar desde la pregunta breve al test.
  document.addEventListener('click',function(e){
    const a=e.target&&e.target.closest?e.target.closest('[data-ehu-v2-next]'):null;
    if(a)track('ehu_v2_inline_next_clicked',{question_number:a.dataset.ehuV2Next});
  },{passive:true});
})();

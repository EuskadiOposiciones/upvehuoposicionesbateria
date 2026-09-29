(function(){
const root=document.getElementById('free-test');if(!root||!Array.isArray(window.EHU_FREE_TEST))return;
const qs=window.EHU_FREE_TEST,start=root.querySelector('.quiz-start'),stage=root.querySelector('.quiz-stage'),result=root.querySelector('.quiz-result');
const qText=root.querySelector('.quiz-question'),topic=root.querySelector('.quiz-topic'),opts=root.querySelector('.quiz-options'),fb=root.querySelector('.quiz-feedback'),next=root.querySelector('.quiz-next'),progressText=root.querySelector('.quiz-progress-text'),bar=root.querySelector('.quiz-progress-bar i');
let index=0,score=0,answered=false,byTopic={};
const letters=['A','B','C','D'];
function ph(name,props){if(window.posthog&&typeof window.posthog.capture==='function')window.posthog.capture(name,Object.assign({product:'ehu',surface:'free_test'},props||{}));}
function render(){
  const q=qs[index];answered=false;fb.hidden=true;next.hidden=true;opts.innerHTML='';
  progressText.textContent='Pregunta '+(index+1)+' de '+qs.length;bar.style.width=((index)/qs.length*100)+'%';
  topic.textContent=q.topic+' · pregunta '+q.n+' de la batería';qText.textContent=q.question;
  q.options.forEach((txt,i)=>{const b=document.createElement('button');b.type='button';b.className='quiz-option';b.innerHTML='<span>'+letters[i]+'</span><strong></strong>';b.querySelector('strong').textContent=txt;b.addEventListener('click',()=>answer(i,b));opts.appendChild(b);});
}
function answer(i,btn){
  if(answered)return;answered=true;const q=qs[index],chosen=letters[i],ok=chosen===q.correct;
  byTopic[q.topic]=byTopic[q.topic]||{right:0,total:0};byTopic[q.topic].total++;if(ok){score++;byTopic[q.topic].right++;}
  [...opts.children].forEach((b,j)=>{b.disabled=true;if(letters[j]===q.correct)b.classList.add('is-correct');});
  if(!ok)btn.classList.add('is-wrong');
  fb.hidden=false;fb.className='quiz-feedback '+(ok?'is-ok':'is-bad');
  fb.innerHTML='<strong>'+(ok?'Correcta.':'La respuesta correcta es '+q.correct+'.')+'</strong><p></p><p class="quiz-source"><a target="_blank" rel="noopener">Ver fuente ↗</a></p>';
  fb.querySelector('p').textContent=q.explanation;const a=fb.querySelector('a');a.href=q.sourceUrl;a.textContent=q.sourceLabel+' ↗';
  next.hidden=false;next.textContent=index===qs.length-1?'Ver resultado':'Siguiente';
  ph('ehu_test_answered',{question_number:q.n,topic:q.topic,correct:ok,chosen:chosen});
}
function finish(){
  stage.hidden=true;result.hidden=false;bar.style.width='100%';
  const pct=Math.round(score/qs.length*100);
  const rows=Object.entries(byTopic).map(([t,v])=>'<li><strong>'+t+':</strong> '+v.right+'/'+v.total+'</li>').join('');
  let msg=pct>=80?'Muy buen resultado.':pct>=60?'Buena base; revisa los fallos.':'La muestra te sirve para localizar qué conviene repasar.';
  result.innerHTML='<div class="quiz-score"><span>'+score+'/'+qs.length+'</span><strong>'+pct+'% de aciertos</strong></div><h2>'+msg+'</h2><ul class="quiz-breakdown">'+rows+'</ul><div class="actions"><a class="btn" href="'+
    'https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo'+'" target="_blank" rel="noopener">Continúa con las 500 en la app ↗</a><a class="btn secondary" href="../preguntas-resueltas/">Revisar 30 preguntas explicadas</a><button class="btn secondary quiz-restart" type="button">Repetir test</button></div>';
  result.querySelector('.quiz-restart').addEventListener('click',()=>{index=0;score=0;byTopic={};result.hidden=true;stage.hidden=false;render();ph('ehu_test_restarted');});
  ph('ehu_test_completed',{score:score,total:qs.length,percent:pct});
}
root.querySelector('.quiz-start-btn').addEventListener('click',()=>{start.hidden=true;stage.hidden=false;render();ph('ehu_test_started',{total:qs.length});});
next.addEventListener('click',()=>{if(!answered)return;if(index<qs.length-1){index++;render();}else finish();});
})();
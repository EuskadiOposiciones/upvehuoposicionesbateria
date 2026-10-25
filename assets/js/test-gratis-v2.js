/* EHU V2 | El banco EHU_FREE_TEST (10 preguntas) sigue en el HTML original.
   Conserva ehu_test_started/completed EXCLUSIVAMENTE para el recorrido completo de 10. */
(function () {
  'use strict';
  const root = document.getElementById('free-test');
  if (!root || !Array.isArray(window.EHU_FREE_TEST) || window.EHU_FREE_TEST.length !== 10) return;

  const questions = window.EHU_FREE_TEST;
  const start = root.querySelector('.quiz-start');
  const stage = root.querySelector('.quiz-stage');
  const result = root.querySelector('.quiz-result');
  const questionText = root.querySelector('.quiz-question');
  const topic = root.querySelector('.quiz-topic');
  const opts = root.querySelector('.quiz-options');
  const feedback = root.querySelector('.quiz-feedback');
  const next = root.querySelector('.quiz-next');
  const progressText = root.querySelector('.quiz-progress-text');
  const progressBar = root.querySelector('.quiz-progress-bar i');
  const prelude = root.querySelector('[data-ehu-v2-prelude]');
  const fullButton = root.querySelector('[data-ehu-v2-full]');
  const letters = ['A', 'B', 'C', 'D'];
  let index = 0, score = 0, answered = false, goal = 3;
  let startedMini = false, startedFull = false;
  const mistakes = [];
  const topicScores = {};
  const play = 'https://play.google.com/store/apps/details?id=com.jocyf.opeupvehuadministrativo';
  const storeReferrer = new URLSearchParams({utm_source:'euskadioposiciones',utm_medium:'website',utm_campaign:'ehu_test_v2',utm_content:'result'});
  const playUrl = play + '&utm_source=euskadioposiciones&utm_medium=website&utm_campaign=ehu_test_v2&referrer=' + encodeURIComponent(storeReferrer.toString());

  function track(name, properties) {
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(name, Object.assign({product:'ehu',surface:'free_test_v2',test_mode:goal === 3 ? 'mini3' : 'full10'}, properties || {}));
    }
  }
  function isAndroid() { return /android/i.test(navigator.userAgent || ''); }
  function isDesktop() { return !/android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || ''); }
  function markFullStart(source) {
    if (!startedFull) {
      startedFull = true;
      track('ehu_test_started', {total:10, entry_point:source});
      track('ehu_v2_full_started', {entry_point:source});
    }
  }
  function render() {
    const q = questions[index];
    answered = false;
    feedback.hidden = true;
    next.hidden = true;
    opts.replaceChildren();
    progressText.textContent = 'Pregunta ' + (index + 1) + ' de ' + goal + (goal === 3 ? ' · prueba rápida' : ' · test completo');
    progressBar.style.width = ((index / goal) * 100) + '%';
    topic.textContent = q.topic + ' · pregunta ' + q.n + ' de la batería';
    questionText.textContent = q.question;
    q.options.forEach(function (txt, i) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.innerHTML = '<span>' + letters[i] + '</span><strong></strong>';
      button.querySelector('strong').textContent = txt;
      button.addEventListener('click', function () { answer(i, button); });
      opts.appendChild(button);
    });
    track('ehu_v2_question_viewed', {position:index + 1, question_number:q.n, total:goal});
  }
  function answer(i, button) {
    if (answered) return;
    if (goal === 3 && !startedMini) {
      startedMini = true;
      track('ehu_v2_mini_started', {total:3});
    }
    answered = true;
    const q = questions[index], chosen = letters[i], correct = chosen === q.correct;
    const entry = topicScores[q.topic] || (topicScores[q.topic] = {right:0,total:0});
    entry.total++;
    if (correct) { score++; entry.right++; }
    else mistakes.push({n:q.n,topic:q.topic,correct:q.correct,explanation:q.explanation});
    Array.from(opts.children).forEach(function (b,j) {
      b.disabled = true;
      if (letters[j] === q.correct) b.classList.add('is-correct');
    });
    if (!correct) button.classList.add('is-wrong');
    feedback.hidden = false;
    feedback.className = 'quiz-feedback ' + (correct ? 'is-ok' : 'is-bad');
    feedback.innerHTML = '<strong></strong><p></p><p class="quiz-source"><a target="_blank" rel="noopener"></a></p>';
    feedback.querySelector('strong').textContent = correct ? 'Correcta.' : 'La clave de estudio es ' + q.correct + '.';
    feedback.querySelector('p').textContent = q.explanation;
    const link = feedback.querySelector('a');
    link.href = q.sourceUrl;
    link.textContent = q.sourceLabel + ' ↗';
    next.hidden = false;
    next.textContent = index === goal - 1 ? 'Ver mi resultado' : 'Siguiente pregunta';
    track('ehu_test_answered', {question_number:q.n,position:index + 1,topic:q.topic,correct:correct,chosen:chosen,test_mode:goal === 3 ? 'mini3' : 'full10'});
    track('ehu_v2_question_answered', {question_number:q.n,position:index + 1,correct:correct,total:goal});
  }
  function resultActions(full) {
    const androidCta = '<a class="btn ehu-v2-android-cta" data-v2-result-play href="' + playUrl + '" target="_blank" rel="noopener">Probar 25 preguntas gratis en Android ↗</a>';
    const desktop = '<div class="ehu-v2-qr-area"><a data-v2-qr-link href="' + playUrl + '" target="_blank" rel="noopener" aria-label="Abrir la app en Google Play"><img src="../../assets/img/app/qr-google-play.png" alt="Código QR de la app de Administrativo UPV/EHU" width="135" height="135" loading="lazy"></a><p><strong>¿Estás en ordenador?</strong> Escanea este QR desde Android para probar 25 preguntas gratis. La batería de 500 requiere suscripción.</p></div>';
    const continueLink = full ? '' : '<button class="btn" data-v2-continue type="button">Continuar hasta las 10 preguntas</button>';
    const secondary = '<button class="btn secondary" data-v2-restart type="button">Repetir desde el principio</button>';
    const infoLink = '<a class="ehu-v2-muted-link" href="../app-test-upv-ehu/">Capturas reales y condiciones de la app →</a>';
    return '<div class="ehu-v2-result-actions"><div class="actions">' + continueLink + androidCta + secondary + '</div>' + desktop + infoLink + '</div>';
  }
  function finish() {
    stage.hidden = true;
    result.hidden = false;
    progressBar.style.width = '100%';
    const full = goal === 10;
    const percent = Math.round(score / goal * 100);
    const message = percent >= 80 ? 'Muy buen resultado.' : percent >= 60 ? 'Buena base; revisa tus fallos.' : 'Ya sabes qué conviene repasar.';
    const subheading = full ? 'Has completado las 10 preguntas gratuitas' : 'Has terminado la prueba rápida de 3 preguntas';
    const errors = mistakes.length ? mistakes.map(function (m) {
      return '<li><strong>Pregunta ' + m.n + ' · ' + escapeHtml(m.topic) + ':</strong> clave de estudio ' + m.correct + '. ' + escapeHtml(m.explanation) + '</li>';
    }).join('') : '<li>Has acertado todas las preguntas de esta prueba.</li>';
    const byTopic = Object.keys(topicScores).map(function (t) {
      return '<li>' + escapeHtml(t) + ': ' + topicScores[t].right + '/' + topicScores[t].total + '</li>';
    }).join('');
    result.innerHTML = '<div class="ehu-v2-result">' +
      '<p class="ehu-v2-kicker">RESULTADO DE LA MUESTRA · CLAVES DE ESTUDIO CONTRASTADAS</p>' +
      '<h2>' + subheading + '</h2>' +
      '<div class="quiz-score"><span>' + score + '/' + goal + '</span><strong>' + percent + '% de aciertos</strong></div>' +
      '<p>' + message + '</p><h3>Preguntas que revisar</h3><ul class="ehu-v2-errors">' + errors + '</ul>' +
      '<details class="ehu-v2-topic-details"><summary>Ver aciertos por materia</summary><ul>' + byTopic + '</ul></details>' +
      resultActions(full) + '</div>';
    if (!full) {
      track('ehu_v2_mini_completed', {score:score,total:3,percent:percent,mistakes:mistakes.length});
      result.querySelector('[data-v2-continue]').addEventListener('click', function () {
        goal = 10;
        index = 3;
        markFullStart('mini_result');
        result.hidden = true;
        stage.hidden = false;
        if (prelude) prelude.hidden = true;
        render();
        root.scrollIntoView({behavior:'smooth',block:'start'});
      });
    } else {
      // Se mantiene el evento histórico para medir exclusivamente finalizar 10 preguntas.
      track('ehu_test_completed', {score:score,total:10,percent:percent});
      track('ehu_v2_full_completed', {score:score,total:10,percent:percent,mistakes:mistakes.length});
    }
    result.querySelector('[data-v2-restart]').addEventListener('click', function () {
      index = 0;score = 0;goal = 3;startedMini = false;startedFull = false;
      mistakes.length = 0;Object.keys(topicScores).forEach(function (t) { delete topicScores[t]; });
      result.hidden = true;stage.hidden = false;
      if (prelude) prelude.hidden = false;
      track('ehu_v2_quiz_restarted', {});
      render();root.scrollIntoView({behavior:'smooth',block:'start'});
    });
    result.querySelectorAll('[data-v2-result-play], [data-v2-qr-link]').forEach(function (link) {
      link.addEventListener('click', function () {track('ehu_v2_result_play_clicked', {total:goal,cta_type:link.hasAttribute('data-v2-qr-link') ? 'qr_link' : 'button'});});
    });
    const qr = result.querySelector('.ehu-v2-qr-area');
    if (qr && isDesktop()) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
          if (entries.some(function (entry) {return entry.isIntersecting;})) {
            track('ehu_v2_qr_viewed', {total:goal});observer.disconnect();
          }
        }, {threshold:0.5});observer.observe(qr);
      } else track('ehu_v2_qr_viewed', {total:goal});
    }
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  if (fullButton) fullButton.addEventListener('click', function () {
    // Si ya contestó alguna de la muestra de 3, reiniciar: sin doble puntuación.
    index = 0;
    score = 0;
    answered = false;
    startedMini = false;
    mistakes.length = 0;
    Object.keys(topicScores).forEach(function (t) { delete topicScores[t]; });
    goal = 10;
    markFullStart('direct_full');
    if (prelude) prelude.hidden = true;
    render();
  });
  next.addEventListener('click', function () {
    if (!answered) return;
    if (index < goal - 1) {index++;render();} else finish();
  });
  if (start) start.hidden = true;
  result.hidden = true;
  stage.hidden = false;
  render();
  track('ehu_v2_quiz_loaded', {default_mode:'mini3',first_question_visible:true});
})();

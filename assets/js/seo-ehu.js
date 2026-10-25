/* Pregunta real de la batería, respuesta de estudio contrastada. PostHog sigue en site.js. */
(function () {
  'use strict';
  var demo = document.querySelector('[data-seo-demo]');
  if (!demo) return;
  var options = Array.prototype.slice.call(demo.querySelectorAll('[data-answer]'));
  var feedback = demo.querySelector('[data-demo-feedback]');
  var title = demo.querySelector('[data-feedback-title]');
  var answered = false;
  options.forEach(function (option) {
    option.addEventListener('click', function () {
      if (answered) return;
      answered = true;
      var choice = option.getAttribute('data-answer');
      var correct = choice === 'C';
      title.textContent = correct ? 'Correcto: has elegido la opción C.' : 'La clave de estudio es C. Revisa la explicación.';
      options.forEach(function (button) {
        button.disabled = true;
        if (button.getAttribute('data-answer') === 'C') button.classList.add('is-correct');
        if (button === option && !correct) button.classList.add('is-incorrect');
      });
      feedback.hidden = false;
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture('ehu_demo_question_answered', {
          product: 'ehu', page_path: location.pathname,
          selected_answer: choice, correct: correct, question_number: 1,
          surface: 'home_real_question'
        });
      }
    });
  });
})();

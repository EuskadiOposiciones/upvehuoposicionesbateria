(() => {
  const button = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#nav-principal');
  if (!button || !nav) return;

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });
})();

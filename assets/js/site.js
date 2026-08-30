(function () {
  const cfg = window.EHU_SITE_CONFIG || {};
  const analyticsQueue = [];

  function flushAnalytics() {
    if (!window.posthog || typeof window.posthog.capture !== 'function') return;
    while (analyticsQueue.length) {
      const item = analyticsQueue.shift();
      try { window.posthog.capture(item.name, item.props); } catch (_) {}
    }
  }

  function track(name, props) {
    const payload = props || {};
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(name, payload);
      } else {
        analyticsQueue.push({ name: name, props: payload });
      }
    } catch (_) {}
  }

  async function initPostHog() {
    const key = (cfg.POSTHOG_KEY || '').trim();
    if (!key) return;
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/posthog-js/+esm');
      const ph = mod.default || mod;
      ph.init(key, {
        api_host: cfg.POSTHOG_HOST || 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true
      });
      window.posthog = ph;
      flushAnalytics();
    } catch (_) {
      // La web sigue funcionando si el proveedor de analítica no carga.
    }
  }

  initPostHog();

  const menuButton = document.querySelector('[data-menu-button]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-app-cta]').forEach(function (el) {
    const destination = (cfg.APP_URL || '').trim();
    if (destination) {
      el.setAttribute('href', destination);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      if (cfg.APP_CTA_LABEL) el.textContent = cfg.APP_CTA_LABEL;
    } else {
      el.setAttribute('href', '#app');
      if (el.dataset.fallbackLabel) el.textContent = el.dataset.fallbackLabel;
    }
    el.addEventListener('click', function () {
      track('cta_app_click', {
        page_path: location.pathname,
        cta_location: el.dataset.ctaLocation || 'unknown',
        destination_configured: Boolean(destination)
      });
    });
  });

  const price = (cfg.PRICE || '').trim();
  document.querySelectorAll('[data-price-section]').forEach(function (section) {
    if (price) section.hidden = false;
  });
  document.querySelectorAll('[data-price]').forEach(function (el) {
    if (price) {
      el.innerHTML = '<span>' + price + '</span><small>' + (cfg.PRICE_SUFFIX || '') + '</small>';
    }
  });
  document.querySelectorAll('[data-price-note]').forEach(function (el) {
    const note = (cfg.PRICE_NOTE || '').trim();
    if (note) el.textContent = note; else el.hidden = true;
  });

  const officialMap = {
    ope: cfg.OFFICIAL_OPE_URL,
    admin: cfg.OFFICIAL_ADMIN_URL,
    adminbases: cfg.OFFICIAL_ADMIN_BASES_URL,
    subbases: cfg.OFFICIAL_SUB_BASES_URL,
    portal: cfg.OFFICIAL_PORTAL_URL,
    bases: cfg.OFFICIAL_GENERAL_BASES_URL
  };
  document.querySelectorAll('[data-official]').forEach(function (el) {
    const url = officialMap[el.dataset.official];
    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
    }
  });

  document.querySelectorAll('[data-support-email]').forEach(function (el) {
    if (cfg.SUPPORT_EMAIL) {
      el.href = 'mailto:' + cfg.SUPPORT_EMAIL;
      el.textContent = cfg.SUPPORT_EMAIL;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  const screenshotHost = document.querySelector('[data-app-screenshots]');
  if (screenshotHost && Array.isArray(cfg.APP_SCREENSHOTS) && cfg.APP_SCREENSHOTS.length) {
    screenshotHost.innerHTML = '';
    cfg.APP_SCREENSHOTS.slice(0, 4).forEach(function (src, idx) {
      const figure = document.createElement('figure');
      figure.className = 'screenshot-card';
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Captura real de la app de preparación UPV/EHU ' + (idx + 1);
      img.loading = 'lazy';
      figure.appendChild(img);
      screenshotHost.appendChild(figure);
    });
    screenshotHost.hidden = false;
  }

  const pageType = document.body.dataset.pageType;
  if (pageType) track(pageType + '_page_viewed', { page_path: location.pathname });

  const marks = [25, 50, 75, 90];
  const seen = new Set();
  window.addEventListener('scroll', function () {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const pct = Math.round((window.scrollY / max) * 100);
    marks.forEach(function (mark) {
      if (pct >= mark && !seen.has(mark)) {
        seen.add(mark);
        track('scroll_depth_reached', { depth: mark, page_path: location.pathname });
      }
    });
  }, { passive: true });
})();

(function () {
  const cfg = window.EHU_SITE_CONFIG || {};

  function track(name, props) {
    try {
      if (window.posthog && typeof window.posthog.capture === 'function') {
        window.posthog.capture(name, props || {});
      }
    } catch (_) {}
  }

  // Navegación móvil
  const menuButton = document.querySelector('[data-menu-button]');
  const navLinks = document.querySelector('[data-nav-links]');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  // CTA de la app. Si todavía no hay URL, lleva al bloque de producto sin dejar enlaces muertos.
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

  // Precio configurable.
  document.querySelectorAll('[data-price]').forEach(function (el) {
    if ((cfg.PRICE || '').trim()) {
      el.innerHTML = '<span>' + cfg.PRICE + '</span><small>' + (cfg.PRICE_SUFFIX || '') + '</small>';
    } else {
      el.textContent = 'Precio en la app';
    }
  });

  // Enlaces oficiales configurables.
  const officialMap = {
    ope: cfg.OFFICIAL_OPE_URL,
    admin: cfg.OFFICIAL_ADMIN_URL,
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

  // Contacto opcional.
  document.querySelectorAll('[data-support-email]').forEach(function (el) {
    if (cfg.SUPPORT_EMAIL) {
      el.href = 'mailto:' + cfg.SUPPORT_EMAIL;
      el.textContent = cfg.SUPPORT_EMAIL;
    } else {
      el.hidden = true;
    }
  });

  // Canonical dinámico: funciona tanto en un dominio propio como en un GitHub Project Page.
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = location.origin + location.pathname;

  // Eventos de lectura de páginas de alta intención.
  const pageType = document.body.dataset.pageType;
  if (pageType) {
    track(pageType + '_page_viewed', { page_path: location.pathname });
  }

  // Profundidad de lectura simple (25/50/75/90), compatible con PostHog si ya está cargado.
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

/**
 * Wuppertaler Integrations- und Bildungsverein e.V. (WIB)
 * JavaScript – Navigation, Einblenden, Parallax, Formulare
 * Übergänge und Tipp-Feedback: motion.js / motion.css
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     DOM READY
     ═══════════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initScrollTop();
    initScrollReveal();
    initHeroParallax();
    initLinkSmoothScroll();
    initZakatCalculator();
    initContactForm();
    initMapConsent();
  });

  const isTurkish = document.documentElement.lang === 'tr';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══════════════════════════════════════════════════════════════════════
     HEADER SCROLL
     ═══════════════════════════════════════════════════════════════════════ */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('header-scrolled', y > 50);

      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', y > 400);
      }

      lastScroll = y;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MOBILE NAVIGATION
     ═══════════════════════════════════════════════════════════════════════ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav');
    const links = document.querySelectorAll('.nav-link');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    };

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('active');
      menu.classList.add('active');
      document.body.classList.add('overflow-hidden');
    };

    toggle.addEventListener('click', () => {
      menu.classList.contains('active') ? closeMenu() : openMenu();
    });

    links.forEach(link => link.addEventListener('click', closeMenu));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SCROLL TO TOP
     ═══════════════════════════════════════════════════════════════════════ */
  function initScrollTop() {
    const btn = document.querySelector('.scroll-top-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SCROLL REVEAL (Intersection Observer)
     ═══════════════════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
      '.section-title-wrapper, .post-card, .project-card-large, .book-card, ' +
      '.contact-card, .gallery-item, .about-content, .about-info-box, ' +
      '.zakat-calc-container, .bank-details-box, .timeline-step, .legal-content'
    );
    const grids = document.querySelectorAll('.services-grid');
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    // Klassen nach dem Einblenden wieder entfernen, damit Hover-Übergänge greifen
    const settle = (el, cls, ms) => {
      setTimeout(() => el.classList.remove(cls, 'visible'), ms);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        if (el.classList.contains('reveal-stagger')) settle(el, 'reveal-stagger', 1600);
        else settle(el, 'reveal', 1000);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    // Was beim Laden schon zu sehen ist, wird nicht nachträglich eingeblendet
    const belowFold = (el) => el.getBoundingClientRect().top > window.innerHeight * 0.92;

    revealTargets.forEach(el => {
      if (el.closest('.services-grid') || !belowFold(el)) return;
      el.classList.add('reveal');
      observer.observe(el);
    });

    grids.forEach(grid => {
      if (!belowFold(grid)) return;
      grid.classList.add('reveal-stagger');
      observer.observe(grid);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     HERO PARALLAX
     ═══════════════════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || reduceMotion) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY <= heroHeight) {
        // Parallax the ::before pseudo background
        const speed = 0.35;
        const yOffset = scrollY * speed;
        hero.style.setProperty('--parallax-y', `${yOffset}px`);

      }
    }, { passive: true });

    // Apply the CSS variable to a style tag for the ::before
    const style = document.createElement('style');
    style.id = 'parallax-style';
    style.textContent = `
      .hero::before {
        transform: translateY(var(--parallax-y, 0px)) scale(1.1);
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SMOOTH SCROLL FOR ANCHOR LINKS (except hash routes)
     ═══════════════════════════════════════════════════════════════════════ */
  function initLinkSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     ZAKAT CALCULATOR
     ═══════════════════════════════════════════════════════════════════════ */
  function initZakatCalculator() {
    const form = document.getElementById('zakatForm');
    if (!form) return;

    const inputCash = document.getElementById('zakatCash');
    const inputGold = document.getElementById('zakatGold');
    const inputInvest = document.getElementById('zakatInvest');
    const inputLiabilities = document.getElementById('zakatLiabilities');
    const resultVal = document.getElementById('zakatResultVal');
    const statusText = document.getElementById('zakatStatusText');

    const nisabThreshold = 6375.00;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cash = parseFloat(inputCash.value) || 0;
      const gold = parseFloat(inputGold.value) || 0;
      const invest = parseFloat(inputInvest.value) || 0;
      const liabilities = parseFloat(inputLiabilities.value) || 0;
      const netAssets = (cash + gold + invest) - liabilities;

      const fmt = (v) => v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (netAssets <= 0) {
        resultVal.textContent = '0,00 EUR';
        statusText.innerHTML = isTurkish
          ? 'Net mal varlığınız sıfırın altında olduğundan zekat düşmez.'
          : 'Ihr Nettovermögen liegt unter null. Es ist keine Zakat fällig.';
      } else if (netAssets < nisabThreshold) {
        resultVal.textContent = '0,00 EUR';
        statusText.innerHTML = isTurkish
          ? `<strong>${fmt(netAssets)} EUR</strong> tutarındaki net mal varlığınız <strong>${fmt(nisabThreshold)} EUR</strong> nisap sınırının altında olduğundan zekat düşmez.`
          : `Ihr Nettovermögen von <strong>${fmt(netAssets)} EUR</strong> liegt unter der Nisab-Schwelle von <strong>${fmt(nisabThreshold)} EUR</strong>. Es ist keine Zakat fällig.`;
      } else {
        const zakatDue = netAssets * 0.025;
        resultVal.textContent = `${fmt(zakatDue)} EUR`;
        statusText.innerHTML = isTurkish
          ? `<strong>${fmt(netAssets)} EUR</strong> tutarındaki net mal varlığınız <strong>${fmt(nisabThreshold)} EUR</strong> nisap sınırının üzerindedir. Zekatınız, mal varlığınızın %2,5'idir. Allah zekatınızı kabul etsin.`
          : `Ihr Nettovermögen von <strong>${fmt(netAssets)} EUR</strong> liegt über der Nisab-Schwelle von <strong>${fmt(nisabThreshold)} EUR</strong>. Die Zakat beträgt 2,5 % Ihres Vermögens. Möge Allah Ihre Zakat annehmen.`;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CONTACT FORM
     ═══════════════════════════════════════════════════════════════════════ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    if (!form) return;

    const recipient = form.dataset.recipient || 'info@wib-wuppertal.de';
    const texts = isTurkish ? {
      missing: 'Lütfen tüm zorunlu alanları doldurun.',
      opened: 'E-posta programınız açılıyor. Mesajı göndermek için orada "Gönder"e tıklayın. Program açılmazsa bize doğrudan ' + recipient + ' adresine yazabilirsiniz.',
      from: 'Gönderen'
    } : {
      missing: 'Bitte füllen Sie alle erforderlichen Felder aus.',
      opened: 'Ihr E-Mail-Programm wird geöffnet. Bitte senden Sie die vorbereitete Nachricht dort ab. Falls sich kein Programm öffnet, schreiben Sie uns direkt an ' + recipient + '.',
      from: 'Absender'
    };

    const showStatus = (msg, type) => {
      statusEl.textContent = msg;
      statusEl.className = `form-status ${type}`;
      statusEl.style.display = '';
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showStatus(texts.missing, 'error');
        return;
      }

      // Kein Server vorhanden: Nachricht wird im E-Mail-Programm des Besuchers vorbereitet
      const body = `${message}\n\n${texts.from}: ${name} <${email}>`;
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showStatus(texts.opened, 'success');
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     GOOGLE MAPS – erst nach Klick laden (Datenschutz)
     ═══════════════════════════════════════════════════════════════════════ */
  function initMapConsent() {
    document.querySelectorAll('.map-consent-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const container = btn.closest('.map-container');
        const iframe = document.createElement('iframe');
        iframe.title = container.dataset.title;
        iframe.src = container.dataset.src;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.allowFullscreen = true;
        container.replaceChildren(iframe);
      });
    });
  }

})();
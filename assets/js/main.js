/**
 * Wuppertaler Integrations- und Bildungsverein e.V. (WIB)
 * Enhanced JavaScript – Scroll Reveal, Parallax, Particles, Ripple
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
    initHeroParticles();
    initButtonRipple();
    initLinkSmoothScroll();
    initZakatCalculator();
    initNewsFilter();
    initContactForm();
    initLangToggle();
  });

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
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    };

    const openMenu = () => {
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     SCROLL REVEAL (Intersection Observer)
     ═══════════════════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    // Add .reveal to sections, cards, etc. that don't have it yet
    const revealTargets = document.querySelectorAll(
      '.section, .service-card, .post-card, .project-card-large, .book-card, ' +
      '.contact-card, .gallery-item, .about-content, .about-info-box, ' +
      '.zakat-calc-container, .bank-details-box, .timeline-step, .legal-content'
    );

    revealTargets.forEach(el => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    // Stagger children for service grids
    document.querySelectorAll('.services-grid').forEach(grid => {
      grid.classList.add('reveal-stagger');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     HERO PARALLAX
     ═══════════════════════════════════════════════════════════════════════ */
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY <= heroHeight) {
        // Parallax the ::before pseudo background
        const speed = 0.35;
        const yOffset = scrollY * speed;
        hero.style.setProperty('--parallax-y', `${yOffset}px`);

        // Also shift hero content slightly for depth
        const content = hero.querySelector('.hero-content');
        const graphic = hero.querySelector('.hero-graphic');
        if (content) content.style.transform = `translateY(${scrollY * 0.08}px)`;
        if (graphic) graphic.style.transform = `translateY(${scrollY * 0.15}px)`;
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
     HERO PARTICLES (Canvas)
     ═══════════════════════════════════════════════════════════════════════ */
  function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'heroParticles';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const createParticles = () => {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 0.8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.15
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 160, 58, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 160, 58, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     BUTTON RIPPLE EFFECT
     ═══════════════════════════════════════════════════════════════════════ */
  function initButtonRipple() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      // Remove old ripples
      const oldRipple = btn.querySelector('.ripple');
      if (oldRipple) oldRipple.remove();

      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;

      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);

      // Clean up after animation
      ripple.addEventListener('animationend', () => ripple.remove());
    });
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
        target.scrollIntoView({ behavior: 'smooth' });
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
        statusText.innerHTML = 'Ihr steuerbares Nettovermögen beträgt weniger als Null. Es ist keine Zakat fällig.';
      } else if (netAssets < nisabThreshold) {
        resultVal.textContent = '0,00 EUR';
        statusText.innerHTML = `Ihr Nettovermögen von <strong>${fmt(netAssets)} EUR</strong> liegt unter der Nisab-Schwelle von <strong>${fmt(nisabThreshold)} EUR</strong>. Es ist keine Zakat fällig.`;
      } else {
        const zakatDue = netAssets * 0.025;
        resultVal.textContent = `${fmt(zakatDue)} EUR`;
        statusText.innerHTML = `Ihr Nettovermögen von <strong>${fmt(netAssets)} EUR</strong> liegt über der Nisab-Schwelle von <strong>${fmt(nisabThreshold)} EUR</strong>. Die Zakat beträgt 2,5 % Ihres Vermögens.`;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     NEWS FILTER
     ═══════════════════════════════════════════════════════════════════════ */
  function initNewsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const postCards = document.querySelectorAll('.post-card');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        postCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'grid';
            card.offsetHeight; // force reflow
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     CONTACT FORM
     ═══════════════════════════════════════════════════════════════════════ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    if (!form) return;

    const showStatus = (msg, type) => {
      statusEl.textContent = msg;
      statusEl.className = `form-status ${type}`;
      if (type === 'success') {
        setTimeout(() => { statusEl.style.display = 'none'; }, 8000);
      }
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const orig = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Wird gesendet...';

      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.disabled = false;
        showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.', 'success');
        form.reset();
      }, 1500);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     LANGUAGE TOGGLE
     ═══════════════════════════════════════════════════════════════════════ */
  function initLangToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      alert('Die türkische Übersetzung dieser Webseite befindet sich aktuell im Aufbau.\n\nTürkçe çevirimiz yakında hizmetinizde olacaktır.');
    });
  }

})();
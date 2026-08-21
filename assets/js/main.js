/**
 * Wuppertaler Integrations- und Bildungsverein e.V. (WIB)
 * Core JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Animation (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-in');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    animateElements.forEach(el => observer.observe(el));
  }

  // --- Sticky Header Scroll Effect ---
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  // --- Scroll-to-Top Action ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Mobile Navigation Menu ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden'); // Prevent background scrolling
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --- Zakat Calculator Logic ---
  const zakatForm = document.getElementById('zakatForm');
  if (zakatForm) {
    const inputCash = document.getElementById('zakatCash');
    const inputGold = document.getElementById('zakatGold');
    const inputInvest = document.getElementById('zakatInvest');
    const inputLiabilities = document.getElementById('zakatLiabilities');
    
    const resultVal = document.getElementById('zakatResultVal');
    const statusText = document.getElementById('zakatStatusText');
    
    // Static Nisab value based on 85g of gold at a standard rate of 75 EUR per gram
    const nisabThreshold = 6375.00;
    
    zakatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cash = parseFloat(inputCash.value) || 0;
      const gold = parseFloat(inputGold.value) || 0;
      const invest = parseFloat(inputInvest.value) || 0;
      const liabilities = parseFloat(inputLiabilities.value) || 0;
      
      const netAssets = (cash + gold + invest) - liabilities;
      
      if (netAssets <= 0) {
        resultVal.textContent = '0,00 EUR';
        statusText.innerHTML = 'Ihr steuerbares Nettovermögen beträgt weniger als Null. Es ist keine Zakat fällig.';
      } else if (netAssets < nisabThreshold) {
        resultVal.textContent = '0,00 EUR';
        statusText.innerHTML = 'Ihr Nettovermögen von <strong>' + netAssets.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR</strong> liegt unter der Nisab-Schwelle von <strong>' + nisabThreshold.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR</strong>. Es ist keine Zakat fällig.';
      } else {
        const zakatDue = netAssets * 0.025;
        resultVal.textContent = zakatDue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';
        statusText.innerHTML = 'Ihr Nettovermögen von <strong>' + netAssets.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR</strong> liegt über der Nisab-Schwelle von <strong>' + nisabThreshold.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR</strong>. Die Zakat beträgt 2,5 % Ihres Vermögens.';
      }
    });
  }

  // --- News & Events Filter System ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.post-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // Filter post cards
      postCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'grid';
          // Force reflow for transitions
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          // Delay display change to match transition duration
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Contact Form Interactive Handler ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const privacyCheck = document.getElementById('privacyCheck');

      // Check fields
      if (!name || !email || !subject || !message) {
        showStatus('Bitte füllen Sie alle erforderlichen Felder aus.', 'error');
        return;
      }

      // Check privacy checkbox
      if (privacyCheck && !privacyCheck.checked) {
        showStatus('Bitte bestätigen Sie die Datenschutzerklärung, um Ihre Nachricht zu senden.', 'error');
        return;
      }


      // Simulate sending animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Wird gesendet...';

      setTimeout(() => {
        // Mock success response
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }

  const showStatus = (msg, type) => {
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    
    // Clear status after 8 seconds on success
    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 8000);
    }
  };

  // --- Prayer Times Widget (Wuppertal) ---
  const prayerDateEl = document.getElementById('prayerDate');
  const prayerTimesWidget = document.getElementById('prayerTimesWidget');

  if (prayerTimesWidget) {
    const prayerEls = {
      Fajr: document.getElementById('prayerFajr'),
      Dhuhr: document.getElementById('prayerDhuhr'),
      Asr: document.getElementById('prayerAsr'),
      Maghrib: document.getElementById('prayerMaghrib'),
      Isha: document.getElementById('prayerIsha')
    };

    // Wuppertal coordinates
    const lat = 51.2562;
    const lng = 7.1508;

    const loadPrayerTimes = () => {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10);

      // Display today's date in German
      if (prayerDateEl) {
        prayerDateEl.textContent = 'Heute, ' + today.toLocaleDateString('de-DE', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      fetch('https://api.aladhan.com/v1/timings/' + dateStr + '?latitude=' + lat + '&longitude=' + lng + '&method=3')
        .then(response => response.json())
        .then(data => {
          const timings = data.data.timings;
          prayerEls.Fajr.textContent = timings.Fajr;
          prayerEls.Dhuhr.textContent = timings.Dhuhr;
          prayerEls.Asr.textContent = timings.Asr;
          prayerEls.Maghrib.textContent = timings.Maghrib;
          prayerEls.Isha.textContent = timings.Isha;
        })
        .catch(() => {
          // Fallback if API is unavailable
          prayerEls.Fajr.textContent = '--:--';
          prayerEls.Dhuhr.textContent = '--:--';
          prayerEls.Asr.textContent = '--:--';
          prayerEls.Maghrib.textContent = '--:--';
          prayerEls.Isha.textContent = '--:--';
        });
    };

    loadPrayerTimes();
  }
});


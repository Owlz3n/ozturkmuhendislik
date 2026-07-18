/* ── app.js – Öztürk Orman Mühendislik ── */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  // Set initial navbar state (important for pages without hero section)
  const updateNavbarState = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  updateNavbarState(); // Call on page load
  window.addEventListener('scroll', updateNavbarState);
}

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.style.opacity = open ? '0.7' : '1';
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.style.opacity = '1';
    });
  });
}

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll(
  '.service-card, .highlight-card, .why-card, .stat-card, .feat-item, .ci-item, .about-content, .about-image-wrap, .contact-form-wrap, .contact-info, .info-card, .info-link-card'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Contact form ── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form && submitBtn && formSuccess) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Gönderiliyor...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.append('ajax', '1');

    fetch('mail-gonder.php', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ağ hatası oluştu');
        }
        return response.json();
      })
      .then(data => {
        submitBtn.textContent = 'Mesajı Gönder →';
        submitBtn.disabled = false;

        if (data.status === 'success') {
          formSuccess.textContent = '✅ ' + data.message;
          formSuccess.style.background = 'rgba(82, 183, 136, 0.1)';
          formSuccess.style.color = 'var(--green-dark)';
          formSuccess.classList.add('visible');
          form.reset();
        } else {
          formSuccess.textContent = '❌ ' + data.message;
          formSuccess.style.background = 'rgba(230, 57, 70, 0.1)';
          formSuccess.style.color = '#c92a2a';
          formSuccess.classList.add('visible');
        }
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      })
      .catch(error => {
        console.error('Hata:', error);
        submitBtn.textContent = 'Mesajı Gönder →';
        submitBtn.disabled = false;
        formSuccess.textContent = '❌ Bir bağlantı veya sunucu hatası oluştu. Lütfen tekrar deneyin.';
        formSuccess.style.background = 'rgba(230, 57, 70, 0.1)';
        formSuccess.style.color = '#c92a2a';
        formSuccess.classList.add('visible');
        setTimeout(() => formSuccess.classList.remove('visible'), 5000);
      });
  });
}

/* ── Scroll-to-Top Button ── */
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

if (sections.length && navItems.length) {
  // Determine current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Highlight active link for sub-pages
  if (currentPage !== 'index.html' && currentPage !== '') {
    navItems.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.style.color = 'var(--green-pale)';
      }
    });
  }

  // Scroll-based highlight (only works on index.html with hash links)
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navItems.forEach(link => {
      const href = link.getAttribute('href');
      // Only update hash-based links
      if (href && href.startsWith('#')) {
        link.style.color = href === `#${current}` ? 'var(--green-pale)' : '';
      } else if (href && href.startsWith('index.html#')) {
        const hash = href.split('#')[1];
        link.style.color = hash === current ? 'var(--green-pale)' : '';
      }
    });
  }, { passive: true });
} else {
  // Sub-page: highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.color = 'var(--green-pale)';
    }
  });
}

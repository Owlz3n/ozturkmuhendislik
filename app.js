/* ── app.js – Öztürk Orman Mühendislik ── */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
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

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll(
  '.service-card, .highlight-card, .why-card, .stat-card, .feat-item, .ci-item, .about-content, .about-image-wrap, .contact-form-wrap, .contact-info'
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
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitBtn.textContent = 'Gönderiliyor...';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = 'Mesajı Gönder →';
    submitBtn.disabled = false;
    formSuccess.classList.add('visible');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1200);
});

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navItems.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--green-pale)'
      : '';
  });
}, { passive: true });

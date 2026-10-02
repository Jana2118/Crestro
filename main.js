// Theme
const body = document.body;
const themeBtn = document.getElementById('themeBtn');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const saved = localStorage.getItem('crestro-theme');
if (saved === 'light') {
  body.classList.remove('dark');
  if (sunIcon) sunIcon.style.display = 'none';
  if (moonIcon) moonIcon.style.display = 'block';
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    localStorage.setItem('crestro-theme', isDark ? 'dark' : 'light');
    if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none';
    if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block';
  });
}

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}
function closeMenu() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// Custom cursor
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
  let x = 0, y = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    cursorDot.style.left = x + 'px';
    cursorDot.style.top = y + 'px';
  }, { passive: true });
  (function loop() {
    dx += (x - dx) * 0.18;
    dy += (y - dy) * 0.18;
    cursor.style.left = dx + 'px';
    cursor.style.top = dy + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .interactive').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Reveal animations (including left/right/scale + stagger parents)
const revealSelector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger';
const revealEls = document.querySelectorAll(revealSelector);
if (revealEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // if stagger container, also mark children
          if (entry.target.classList.contains('stagger')) {
            entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((child) => {
              child.classList.add('visible');
            });
          }
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  // Show everything if reduced motion
  document.querySelectorAll(revealSelector).forEach((el) => el.classList.add('visible'));
}

// Smooth anchor offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMenu();
      }
    }
  });
});

// Subtle parallax on hero orbs
const orbs = document.querySelectorAll('.orb');
if (orbs.length && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY * 0.08;
      orbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (i % 2 === 0 ? 1 : -0.6)}px)`;
      });
    },
    { passive: true }
  );
}

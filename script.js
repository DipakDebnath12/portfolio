/* =========================================================
   Dipak Debnath — Portfolio Script
   Vanilla JS. No frameworks. Reusable, small functions.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initLoadingScreen();
  initCursor();
  initNavbar();
  initMobileNav();
  initScrollSpy();
  initThemeToggle();
  initTypedRole();
  initHeroTimeline();
  initScrollReveal();
  initTiltCards();
  initCounters();
  initSkillBars();
  initBackToTop();
  initSmoothAnchors();
  initContactForm();
  initPlaceholderLinks();
  initVideoModal();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Lucide icons ---------- */
function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  } else {
    // Lucide script loads with `defer`; retry shortly if not ready yet.
    window.addEventListener('load', () => window.lucide && window.lucide.createIcons());
  }
}

/* ---------- Loading screen ---------- */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' is delayed by slow external fonts/scripts.
  setTimeout(() => screen.classList.add('hidden'), 3000);
}

/* ---------- Custom cursor ---------- */
function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactive = 'a, button, input, textarea, .project-card, .skill-hover-card, .tool-card, [data-video-trigger]';
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
}

/* ---------- Navbar background on scroll ---------- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const burger = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- Active nav link on scroll (scrollspy) ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Dark / light theme toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  // Dark is the default theme; light is opt-in and remembered per visitor.
  const stored = localStorage.getItem('dd-theme');
  if (stored === 'light') root.setAttribute('data-theme', 'light');

  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    if (next === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    localStorage.setItem('dd-theme', next);
  });
}

/* ---------- Hero typing effect ---------- */
function initTypedRole() {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const roles = ['BCA Graduate', 'Full Stack Developer', 'AI Enthusiast', 'Problem Solver'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { el.textContent = roles[1]; return; }

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const full = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = full.slice(0, charIndex);
      if (charIndex === full.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      charIndex--;
      el.textContent = full.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }
  tick();
}

/* ---------- Hero entrance animation (GSAP timeline) ---------- */
function initHeroTimeline() {
  const hero = document.querySelector('.hero-copy');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hero || reduceMotion || !window.gsap) return;

  const targets = [
    hero.querySelector('.eyebrow'),
    hero.querySelector('.hero-title'),
    hero.querySelector('.hero-role'),
    hero.querySelector('.hero-desc'),
    hero.querySelector('.hero-social'),
    hero.querySelector('.hero-cta'),
    hero.querySelector('.stat-card'),
  ].filter(Boolean);
  if (!targets.length) return;

  gsap.set(targets, { opacity: 0, y: 24 });
  gsap.to(targets, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12, delay: 0.4,
  });
}

/* ---------- Scroll reveal (GSAP ScrollTrigger, staggers siblings) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fallback: no GSAP/ScrollTrigger available, or reduced motion — reveal instantly via IntersectionObserver.
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((item) => observer.observe(item));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        onComplete: () => batch.forEach((el) => el.classList.add('in-view')),
      });
    },
  });
}

/* ---------- Tilt-on-hover for project cards (GSAP quickTo) ---------- */
function initTiltCards() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap) return;

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.style.transformPerspective = '900px';
    const setRotateX = gsap.quickTo(card, 'rotateX', { duration: 0.45, ease: 'power3.out' });
    const setRotateY = gsap.quickTo(card, 'rotateY', { duration: 0.45, ease: 'power3.out' });
    const setY = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3.out' });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setRotateY(px * 8);
      setRotateX(py * -8);
      setY(-6);
    });

    card.addEventListener('mouseleave', () => {
      setRotateX(0);
      setRotateY(0);
      setY(0);
    });
  });
}

/* ---------- Animated stat counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => observer.observe(c));
}

/* ---------- Animated skill progress bars ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-level]');
  if (!bars.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.width = el.getAttribute('data-level') + '%';
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  bars.forEach((b) => observer.observe(b));
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Smooth anchor scrolling with navbar offset ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    subject: (v) => v.trim().length >= 3 || 'Subject is a little short.',
    message: (v) => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };

  function showError(field, message) {
    const wrapper = form.querySelector(`#${field}`).closest('.form-field');
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (wrapper) wrapper.classList.toggle('invalid', Boolean(message));
    if (errorEl) errorEl.textContent = message && message !== true ? message : '';
  }

  Object.keys(validators).forEach((field) => {
    const input = form.querySelector(`#${field}`);
    if (!input) return;
    input.addEventListener('blur', () => {
      const result = validators[field](input.value);
      showError(field, result === true ? '' : result);
    });
  });

  function setSending(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.classList.toggle('is-loading', isSending);
    if (submitLabel) submitLabel.textContent = isSending ? 'Sending…' : 'Send Message';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    Object.keys(validators).forEach((field) => {
      const input = form.querySelector(`#${field}`);
      const result = validators[field](input.value);
      showError(field, result === true ? '' : result);
      if (result !== true) valid = false;
    });

    if (!valid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.className = 'form-status error';
      return;
    }

    // The form endpoint below is a placeholder until a real Formspree form
    // is connected (see README.md → "Contact form backend"). Fail gracefully
    // rather than let visitors hit a broken/misleading submission.
    if (!form.action || form.action.includes('YOUR_FORM_ID')) {
      status.textContent = 'Form isn\u2019t connected yet \u2014 add a real Formspree endpoint in index.html (see README).';
      status.className = 'form-status error';
      return;
    }

    setSending(true);
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        status.textContent = "Thanks! Your message is on its way \u2014 I'll reply as soon as I can.";
        status.className = 'form-status success';
        form.reset();
      } else {
        let message = 'Something went wrong sending that. Please try again or email me directly.';
        try {
          const data = await response.json();
          if (data && Array.isArray(data.errors) && data.errors.length) {
            message = data.errors.map((err) => err.message).join(', ');
          }
        } catch (_) {
          // Response wasn't JSON — keep the generic message above.
        }
        status.textContent = message;
        status.className = 'form-status error';
      }
    } catch (_) {
      status.textContent = 'Network error \u2014 please check your connection and try again.';
      status.className = 'form-status error';
    } finally {
      setSending(false);
    }
  });
}

/* ---------- Placeholder link notices (demo/github not yet linked) ---------- */
function initPlaceholderLinks() {
  document.querySelectorAll('[data-live-demo], [data-github-placeholder]').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        // eslint-disable-next-line no-alert
        alert('Add your live deployment / repository link here.');
      }
    });
  });
}

/* ---------- Video demo modal ---------- */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  const titleEl = document.getElementById('video-modal-title');
  const bodyEl = document.getElementById('video-modal-body');
  let lastFocused = null;

  function openModal({ type, src, title }) {
    titleEl.textContent = title || 'Project Demo';
    bodyEl.innerHTML = '';

    if (type === 'youtube' && src) {
      const iframe = document.createElement('iframe');
      const sep = src.includes('?') ? '&' : '?';
      iframe.src = `${src}${sep}autoplay=1&rel=0`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = title || 'Project demo video';
      bodyEl.appendChild(iframe);
    } else if (type === 'mp4' && src) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      bodyEl.appendChild(video);
    } else {
      // No real video wired up yet — friendly placeholder instead of a broken player.
      bodyEl.innerHTML = `
        <div class="video-placeholder">
          <i data-lucide="film"></i>
          <p>Demo video coming soon. Add a YouTube or hosted video link
          (<code>data-video-type</code> / <code>data-video-src</code>) on this
          button in index.html to show it here.</p>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
    }

    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.video-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    bodyEl.innerHTML = ''; // stop any playing video/embed
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('[data-video-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        type: btn.getAttribute('data-video-type'),
        src: btn.getAttribute('data-video-src'),
        title: btn.getAttribute('data-video-title'),
      });
    });
  });

  modal.querySelectorAll('[data-video-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

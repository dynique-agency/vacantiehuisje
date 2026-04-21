/* ============================================================
   VACANTIEHUISJE.NL — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ===== SCROLL PROGRESS ===== */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width = ((window.scrollY / max) * 100) + '%';
    }, { passive: true });
  }

  /* ===== NAVIGATION ===== */
  const nav = document.querySelector('.nav');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* active link */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* mobile menu */
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* close on Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = parseInt(el.dataset.counter);
        const dur = 1600;
        const t0  = performance.now();
        function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }

  /* ===== PARALLAX HERO ===== */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }, { passive: true });
  }

  /* ===== PAGE TRANSITION ===== */
  const transition = document.querySelector('.page-transition');
  if (transition) {
    transition.classList.add('exit');
    document.querySelectorAll(
      'a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"])'
    ).forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        transition.classList.remove('exit');
        transition.classList.add('enter');
        setTimeout(() => { window.location = href; }, 440);
      });
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== GALLERY LIGHTBOX ===== */
  const galleryItems = document.querySelectorAll('.gallery__item');
  if (galleryItems.length) {
    const lb = document.createElement('div');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Afbeelding weergave');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lightbox__backdrop"></div>
      <div class="lightbox__content">
        <button class="lightbox__close" aria-label="Sluiten">&times;</button>
        <img class="lightbox__img" src="" alt="" />
        <div class="lightbox__caption" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(lb);

    const lbStyle = document.createElement('style');
    lbStyle.textContent = `
      .lightbox {
        position:fixed;inset:0;z-index:9500;
        display:flex;align-items:center;justify-content:center;
        opacity:0;pointer-events:none;transition:opacity 360ms;
      }
      .lightbox.open{opacity:1;pointer-events:all;}
      .lightbox__backdrop{position:absolute;inset:0;background:rgba(8,16,8,.9);backdrop-filter:blur(8px);}
      .lightbox__content{position:relative;z-index:1;max-width:min(92vw,1080px);max-height:92vh;display:flex;flex-direction:column;align-items:center;gap:.85rem;}
      .lightbox__img{max-width:100%;max-height:80vh;object-fit:contain;border-radius:10px;box-shadow:0 32px 80px rgba(0,0,0,.5);}
      .lightbox__caption{color:rgba(255,255,255,.45);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;}
      .lightbox__close{position:absolute;top:-1.25rem;right:-1.25rem;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:#fff;font-size:1.4rem;display:flex;align-items:center;justify-content:center;transition:background 280ms;}
      .lightbox__close:hover{background:rgba(255,255,255,.2);}
      .lightbox__close:focus-visible{outline:2px solid var(--gold);outline-offset:3px;}
    `;
    document.head.appendChild(lbStyle);

    const lbImg     = lb.querySelector('.lightbox__img');
    const lbCaption = lb.querySelector('.lightbox__caption');
    const lbClose   = lb.querySelector('.lightbox__close');
    let lastFocused = null;

    function openLightbox(item) {
      const img = item.querySelector('img');
      if (!img) return;
      lastFocused = document.activeElement;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = item.querySelector('.gallery__item__label')?.textContent || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    galleryItems.forEach(item => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', () => openLightbox(item));
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); } });
    });

    lbClose.addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox(); });
  }

  /* ===== CONTACT FORM ===== */
  const contactForm = document.querySelector('.js-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Verzonden';
      btn.setAttribute('aria-label', 'Bericht verzonden');
      btn.disabled = true;
      btn.style.background = '#2D6B2D';
      setTimeout(() => {
        btn.textContent = original;
        btn.removeAttribute('aria-label');
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3200);
    });
  }

})();

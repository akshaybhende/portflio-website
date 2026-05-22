/* ============================================================
   Akshay Bhende — Portfolio v2 · motion + interactions
   ============================================================ */

(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Custom cursor ---------- */
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover && !prefersReduce) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverables = 'a, button, [data-cursor-hover], .value-card, .project, .fun-panel, .contact-row, .tag, .slot-btn';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('is-hover'); ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('is-hover'); ring.classList.remove('is-hover'); });
    });
  } else {
    document.querySelector('.cursor-dot')?.remove();
    document.querySelector('.cursor-ring')?.remove();
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .section-head, .focus').forEach(el => io.observe(el));

  /* ---------- Page load ---------- */
  requestAnimationFrame(() => {
    document.querySelector('.nav')?.classList.add('is-ready');
    document.querySelector('.hero')?.classList.add('is-ready');
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => navLinks.classList.toggle('is-open'));
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('is-open')));

  /* ---------- Smooth scroll for nav anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Nav scrollspy ---------- */
  const spyIds = ['experience', 'projects', 'stack', 'contact'];
  const spySections = spyIds.map((id) => document.getElementById(id)).filter(Boolean);
  const spyLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  function setActiveNav(id) {
    spyLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function clearActiveNav() {
    spyLinks.forEach((link) => {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    });
  }

  function updateScrollSpy() {
    const offset = (document.querySelector('.nav')?.offsetHeight ?? 56) + 80;
    const scrollPos = window.scrollY + offset;
    let activeId = null;

    for (const section of spySections) {
      if (section.offsetTop <= scrollPos) activeId = section.id;
    }

    if (activeId) setActiveNav(activeId);
    else clearActiveNav();
  }

  let spyTicking = false;
  window.addEventListener('scroll', () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
      updateScrollSpy();
      spyTicking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* ============================================================
     SLOT MACHINE — gamified
     ============================================================ */
  const ITEM_H        = 124;
  const TOKEN_START   = 100;
  const TOKEN_COST    = 5;
  const JACKPOT_PROB  = 0.20;   // true RNG: 20% per spin, no rigging
  const POINTS_WIN    = 100;
  const ICON_KEYS     = ['react','next','angular','ts','js','tailwind','html','expo'];

  const ICON_SVGS = {
    react: `<svg viewBox="0 0 64 64"><g fill="none" stroke="#e8793a" stroke-width="2.5">
      <ellipse cx="32" cy="32" rx="22" ry="9"/>
      <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(120 32 32)"/>
      </g><circle cx="32" cy="32" r="4" fill="#e8793a"/></svg>`,
    next: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <path d="M22 18 V46 M22 18 L42 46 M42 18 V40" stroke="#e8793a" stroke-width="3" fill="none" stroke-linecap="square"/></svg>`,
    angular: `<svg viewBox="0 0 64 64"><path d="M32 6 L56 14 L52 48 L32 58 L12 48 L8 14 Z" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <path d="M32 16 L20 44 H25 L28 36 H36 L39 44 H44 Z M30 30 H34 L32 24 Z" fill="#e8793a"/></svg>`,
    ts: `<svg viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <text x="32" y="42" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="22" fill="#e8793a">TS</text></svg>`,
    js: `<svg viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="4" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <text x="32" y="42" text-anchor="middle" font-family="Space Mono, monospace" font-weight="700" font-size="22" fill="#e8793a">JS</text></svg>`,
    tailwind: `<svg viewBox="0 0 64 64"><g fill="none" stroke="#e8793a" stroke-width="3" stroke-linecap="round">
      <path d="M8 36 Q16 22 24 30 T40 30"/>
      <path d="M24 44 Q32 30 40 38 T56 38"/></g></svg>`,
    html: `<svg viewBox="0 0 64 64"><path d="M12 8 L52 8 L48 50 L32 56 L16 50 Z" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <path d="M22 22 H42 L41 28 H22 L23 36 H40 L39 44 L32 46 L25 44 L24.5 40" fill="none" stroke="#e8793a" stroke-width="2"/></svg>`,
    expo: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#e8e4dc" stroke-width="2"/>
      <path d="M32 14 L48 50 H42 L32 28 L22 50 H16 Z" fill="#e8793a"/></svg>`,
  };

  const reels      = Array.from(document.querySelectorAll('.reel'));
  const slotBtn    = document.querySelector('.slot-btn');
  const resetBtn   = document.querySelector('.slot-reset-btn');
  const slotEl     = document.querySelector('.slot');
  const result     = document.querySelector('.slot-result');
  const overlay    = document.querySelector('.slot-win-overlay');
  const confetti   = document.querySelector('.confetti');
  const tokensEl   = document.querySelector('.tokens-val');
  const pointsEl   = document.querySelector('.points-val');
  const tokenFill  = document.querySelector('.slot-token-fill');

  let spinning = false;
  let tokens   = TOKEN_START;
  let points   = 0;

  function updateStats() {
    tokensEl.textContent = tokens;
    const pct = (tokens / TOKEN_START) * 100;
    tokenFill.style.width = pct + '%';
    tokenFill.classList.toggle('danger', pct <= 30);

    if (tokens < TOKEN_COST) {
      slotEl.classList.add('is-empty');
      result.classList.remove('is-win');
      result.textContent = 'Out of tokens — reset to play again';
    }
  }

  function animateCount(el, from, to) {
    const dur = 700;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (t < 1) requestAnimationFrame(tick);
      else {
        el.textContent = to;
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 400);
      }
    };
    requestAnimationFrame(tick);
  }

  function showPointsPopup(amt) {
    const pop = document.createElement('div');
    pop.className = 'pts-popup';
    pop.textContent = `+${amt}`;
    slotEl.appendChild(pop);
    setTimeout(() => pop.remove(), 920);
  }

  function initReel(reel, index) {
    const strip = reel.querySelector('.reel-strip');
    strip.innerHTML = '';
    const startKey = ICON_KEYS[(index * 2) % ICON_KEYS.length];
    const div = document.createElement('div');
    div.className = 'reel-icon';
    div.innerHTML = ICON_SVGS[startKey];
    strip.appendChild(div);
    strip.style.transform = 'translateY(0)';
    reel.dataset.value = startKey;
  }
  reels.forEach(initReel);

  function buildStrip(finalKey, count) {
    const items = [];
    for (let i = 0; i < count; i++) items.push(ICON_KEYS[Math.floor(Math.random() * ICON_KEYS.length)]);
    items.push(finalKey);
    return items;
  }

  function spin(free = false) {
    if (spinning) return;
    if (!free && tokens < TOKEN_COST) return;
    spinning = true;
    slotBtn.disabled = true;
    slotEl.classList.remove('is-win');
    overlay.classList.remove('is-on');
    confetti.classList.remove('is-on');
    result.classList.remove('is-win');
    result.textContent = 'Spinning…';

    if (!free) {
      tokens -= TOKEN_COST;
      updateStats();
    }

    // True RNG: 20% jackpot probability, no rigging
    const isJackpot  = Math.random() < JACKPOT_PROB;
    const jackpotKey = ICON_KEYS[Math.floor(Math.random() * ICON_KEYS.length)];
    const finalKeys  = [];

    reels.forEach((reel, i) => {
      const key = isJackpot ? jackpotKey : ICON_KEYS[Math.floor(Math.random() * ICON_KEYS.length)];
      finalKeys.push(key);

      const strip = reel.querySelector('.reel-strip');
      const items = buildStrip(key, 22 + i * 6);
      strip.innerHTML = items.map(k => `<div class="reel-icon">${ICON_SVGS[k]}</div>`).join('');
      strip.style.transition = 'none';
      strip.style.transform  = 'translateY(0)';
      void strip.offsetHeight;

      const finalOffset = (items.length - 1) * ITEM_H;
      const duration    = 1.6 + i * 0.45;
      strip.style.transition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
      strip.style.transform  = `translateY(-${finalOffset}px)`;
      reel.dataset.value = key;
    });

    const totalMs = (1.6 + 2 * 0.45) * 1000 + 80;
    setTimeout(() => {
      const allMatch = finalKeys[0] === finalKeys[1] && finalKeys[1] === finalKeys[2];
      if (allMatch) {
        slotEl.classList.add('is-win');
        overlay.classList.add('is-on');
        confetti.classList.add('is-on');
        result.classList.add('is-win');
        result.textContent = `🎉 Jackpot — ${finalKeys[0].toUpperCase()}`;
        const prev = points;
        points += POINTS_WIN;
        animateCount(pointsEl, prev, points);
        showPointsPopup(POINTS_WIN);
      } else {
        result.textContent = tokens < TOKEN_COST ? 'Out of tokens — reset to play again' : 'No match — try again';
      }
      spinning = false;
      if (tokens >= TOKEN_COST) slotBtn.disabled = false;
    }, totalMs);
  }

  function resetGame() {
    tokens = TOKEN_START;
    slotEl.classList.remove('is-empty');
    result.classList.remove('is-win');
    result.textContent = 'Recharged — spin again!';
    updateStats();
    reels.forEach(initReel);
    slotBtn.disabled = false;
    tokensEl.classList.add('flash');
    setTimeout(() => tokensEl.classList.remove('flash'), 400);
  }

  slotBtn?.addEventListener('click', () => spin(false));
  resetBtn?.addEventListener('click', resetGame);

  // Build confetti dots
  if (confetti) {
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('i');
      const angle = (i / 30) * Math.PI * 2;
      const dist  = 80 + Math.random() * 90;
      dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      dot.style.setProperty('--r',  `${Math.floor(Math.random() * 360)}deg`);
      dot.style.animationDelay = `${Math.random() * 120}ms`;
      dot.style.background = i % 2 === 0 ? '#e8793a' : '#00a5c9';
      confetti.appendChild(dot);
    }
  }

  // Free demo spin on load — no token cost
  if (!prefersReduce) setTimeout(() => spin(true), 1400);

  updateStats();

  /* ============================================================
     PROJECTS CAROUSEL
     ============================================================ */
  const scroll = document.querySelector('.projects-scroll');
  const prevBtn = document.querySelector('.projects-nav .prev');
  const nextBtn = document.querySelector('.projects-nav .next');
  const progress = document.querySelector('.projects-progress-fill');
  const count = document.querySelector('.projects-count');

  if (scroll) {
    const cards = scroll.querySelectorAll('.project');
    if (count) count.querySelector('.total').textContent = String(cards.length).padStart(2, '0');

    const cardWidth = () => {
      const card = scroll.querySelector('.project');
      return card ? card.getBoundingClientRect().width + 1 : 420;
    };

    const updateNav = () => {
      const max = scroll.scrollWidth - scroll.clientWidth;
      const pos = scroll.scrollLeft;
      prevBtn.disabled = pos <= 1;
      nextBtn.disabled = pos >= max - 1;
      if (progress) progress.style.width = max > 0 ? `${(pos / max) * 100}%` : '100%';
      // Update current
      const visibleIdx = Math.round(pos / cardWidth()) + 1;
      if (count) count.querySelector('.current').textContent = String(Math.min(visibleIdx, cards.length)).padStart(2, '0');
    };

    prevBtn?.addEventListener('click', () => scroll.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => scroll.scrollBy({ left:  cardWidth(), behavior: 'smooth' }));
    scroll.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);

    // Keyboard nav
    scroll.tabIndex = 0;
    scroll.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scroll.scrollBy({ left:  cardWidth(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); scroll.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); }
    });

    // Swipe is native via overflow-x: auto + scroll-snap
    updateNav();
  }
})();

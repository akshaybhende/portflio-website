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
     SLOT MACHINE
     ============================================================ */
  const ITEM_H        = 124;
  const TOKEN_START   = 100;
  const TOKEN_COST    = 5;
  const JACKPOT_PROB  = 0.20;
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
      const visibleIdx = Math.round(pos / cardWidth()) + 1;
      if (count) count.querySelector('.current').textContent = String(Math.min(visibleIdx, cards.length)).padStart(2, '0');
    };

    prevBtn?.addEventListener('click', () => scroll.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    nextBtn?.addEventListener('click', () => scroll.scrollBy({ left:  cardWidth(), behavior: 'smooth' }));
    scroll.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);

    scroll.tabIndex = 0;
    scroll.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scroll.scrollBy({ left:  cardWidth(), behavior: 'smooth' }); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); scroll.scrollBy({ left: -cardWidth(), behavior: 'smooth' }); }
    });

    let dragStartX = 0;
    let didDrag = false;
    scroll.addEventListener('pointerdown', (e) => {
      dragStartX = e.clientX;
      didDrag = false;
    }, { passive: true });
    scroll.addEventListener('pointermove', (e) => {
      if (Math.abs(e.clientX - dragStartX) > 10) didDrag = true;
    }, { passive: true });
    scroll.addEventListener('click', (e) => {
      const link = e.target.closest('a.project');
      if (link && didDrag) {
        e.preventDefault();
        didDrag = false;
      }
    });

    updateNav();
  }

  /* ============================================================
     SKILLS AQUARIUM — underwater ocean scene with tech fish
     ============================================================ */
  {
    const canvas = document.getElementById('aquarium-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const FISH_DATA = [
        { name: 'React',          color: '#61DAFB' },
        { name: 'TypeScript',     color: '#3178C6' },
        { name: 'Next.js',        color: '#e8e4dc' },
        { name: 'Tailwind CSS',   color: '#38BDF8' },
        { name: 'React Native',   color: '#5BD3F3' },
        { name: 'Supabase',       color: '#3ECF8E' },
        { name: 'Figma',          color: '#A259FF' },
        { name: 'Node.js',        color: '#68A063' },
        { name: 'Zustand',        color: '#FF7262' },
        { name: 'React Query',    color: '#FF4154' },
        { name: 'Expo',           color: '#7B9FE0' },
        { name: 'Claude Code',    color: '#D97559' },
        { name: 'Angular',        color: '#DD0031' },
        { name: 'PostgreSQL',     color: '#4169E1' },
        { name: 'Docker',         color: '#2496ED' },
        { name: 'JavaScript',     color: '#F7DF1E' },
        { name: 'Git',            color: '#F05032' },
        { name: 'Vite',           color: '#646CFF' },
        { name: 'shadcn/ui',      color: '#a8a8a8' },
        { name: 'Design Systems', color: '#e8793a' },
      ];

      function hexLum(hex) {
        const r = parseInt(hex.slice(1,3),16)/255,
              g = parseInt(hex.slice(3,5),16)/255,
              b = parseInt(hex.slice(5,7),16)/255;
        return 0.299*r + 0.587*g + 0.114*b;
      }

      let W = 0, H = 0, frame = 0, raf;
      let fishes = [], bubbles = [], seaweeds = [], shells = [], starfishes = [], crabs = [];

      function sandY(x, t) {
        return H - 56 + Math.sin(x * 0.016 + (t||0) * 0.0015) * 5 + Math.sin(x * 0.036) * 2.5;
      }

      function setup() {
        W = canvas.offsetWidth;
        H = canvas.offsetHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = '700 11px "Space Mono", monospace';

        const floorTop = H - 100;

        const FISH_TYPES = ['standard', 'round', 'slim', 'angel'];
        const TYPE_CONFIG = {
          standard: { bwMult: 1.00, bhRatio: 0.28 },
          round:    { bwMult: 0.88, bhRatio: 0.50 },
          slim:     { bwMult: 1.12, bhRatio: 0.19 },
          angel:    { bwMult: 0.82, bhRatio: 0.58 },
        };

        fishes = FISH_DATA.map((d, i) => {
          const type = FISH_TYPES[i % 4];
          const tc   = TYPE_CONFIG[type];
          const tw   = ctx.measureText(d.name).width;
          const bw   = Math.max(tw * 0.54 + 22, 38) * tc.bwMult * 0.85;
          const bh   = Math.max(11, bw * tc.bhRatio);
          const spd  = (0.4 + Math.random() * 1.0) * (Math.random() > 0.5 ? 1 : -1);
          const topB = bh * 3 + 20;
          const botB = floorTop - bh * 3.5;
          const by   = topB + Math.random() * Math.max(10, botB - topB);
          return {
            name: d.name, color: d.color, type,
            x: Math.random() * W, y: by, baseY: by,
            speed: spd, dir: Math.sign(spd),
            bw, bh,
            bob:  Math.random() * Math.PI * 2,
            tail: Math.random() * Math.PI * 2,
            ink:  hexLum(d.color) > 0.5 ? '#050e1a' : '#f0ece4',
          };
        });

        starfishes = Array.from({ length: 3 + Math.floor(Math.random() * 2) }, (_, si) => ({
          x:    40 + (si * 173) % (W - 80),
          size: 10 + Math.random() * 14,
          rot:  Math.random() * Math.PI * 2,
        }));

        crabs = Array.from({ length: 2 }, (_, ci) => ({
          x:     W * (0.22 + ci * 0.52) + (Math.random() - 0.5) * 60,
          size:  13 + Math.random() * 7,
          phase: Math.random() * Math.PI * 2,
        }));

        bubbles = Array.from({ length: 24 }, () => ({
          x: 20 + Math.random() * (W - 40),
          y: H - 15 - Math.random() * 35,
          r: 1.5 + Math.random() * 3.5,
          vy: 0.28 + Math.random() * 0.45,
          wobble: Math.random() * Math.PI * 2,
          wSpd:   0.022 + Math.random() * 0.016,
          alpha:  0.22 + Math.random() * 0.28,
        }));

        const swCount = Math.max(6, Math.floor(W / 140));
        seaweeds = Array.from({ length: swCount }, (_, i) => {
          const span = W / swCount;
          return {
            x:     span * i + span * 0.2 + Math.random() * span * 0.6,
            h:     48 + Math.random() * 58,
            phase: Math.random() * Math.PI * 2,
            spd:   0.01 + Math.random() * 0.009,
            hue:   118 + Math.random() * 35,
            w:     2.2 + Math.random() * 2,
          };
        });

        shells = Array.from({ length: 8 }, () => ({
          x:    20 + Math.random() * (W - 40),
          size: 7 + Math.random() * 12,
          type: Math.random() > 0.42 ? 'spiral' : 'fan',
          tilt: (Math.random() - 0.5) * 0.8,
          hue:  28 + Math.random() * 28,
          sat:  28 + Math.random() * 22,
          lit:  50 + Math.random() * 22,
        }));
      }

      function drawBg(t) {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0,    '#02101e');
        g.addColorStop(0.55, '#031828');
        g.addColorStop(1,    '#04180e');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 5; i++) {
          const rx = W * (0.1 + i * 0.18) + Math.sin(t * 0.0012 + i * 1.3) * 18;
          const rg = ctx.createLinearGradient(rx, 0, rx + 50, H * 0.65);
          rg.addColorStop(0, 'rgba(70,155,255,0.028)');
          rg.addColorStop(1, 'rgba(70,155,255,0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(rx - 6, 0);
          ctx.lineTo(rx + 6, 0);
          ctx.lineTo(rx + 62, H * 0.65);
          ctx.lineTo(rx + 50, H * 0.65);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      function drawWaterSurface(t) {
        for (let i = 0; i < 4; i++) {
          const ph = t * 0.006 + i * 1.5;
          ctx.save();
          ctx.strokeStyle = `rgba(110,185,255,${0.11 - i * 0.022})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const wy = 3 + i * 5;
          for (let wx = 0; wx <= W; wx += 4) {
            const yy = wy + Math.sin(wx * 0.028 + ph) * 3;
            wx === 0 ? ctx.moveTo(wx, yy) : ctx.lineTo(wx, yy);
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      function drawSeaweed(sw, t) {
        const baseY = sandY(sw.x, t);
        const ph = sw.phase + t * sw.spd;
        const segs = 7;
        ctx.save();
        ctx.strokeStyle = `hsl(${sw.hue},48%,20%)`;
        ctx.lineWidth = sw.w;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.88;
        ctx.beginPath();
        ctx.moveTo(sw.x, baseY);
        let px = sw.x, py = baseY;
        for (let i = 1; i <= segs; i++) {
          const prog = i / segs;
          const sway = Math.sin(ph + prog * Math.PI * 1.6) * 13 * prog;
          const nx = sw.x + sway;
          const ny = baseY - sw.h * prog;
          ctx.quadraticCurveTo((px + nx) / 2, (py + ny) / 2, nx, ny);
          px = nx; py = ny;
        }
        ctx.stroke();
        ctx.fillStyle = `hsl(${sw.hue},52%,24%)`;
        ctx.globalAlpha = 0.55;
        for (let li = 2; li <= segs - 1; li += 2) {
          const prog = li / segs;
          const sway = Math.sin(ph + prog * Math.PI * 1.6) * 13 * prog;
          const lx = sw.x + sway;
          const ly = baseY - sw.h * prog;
          const lf = Math.sin(ph + li) * 0.5;
          ctx.beginPath();
          ctx.ellipse(lx + 6, ly, 7, 3.2, lf, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(lx - 6, ly, 6, 2.8, -lf, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      function drawSandFloor(t) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(W, H);
        for (let x = W; x >= 0; x -= 3) ctx.lineTo(x, sandY(x, t));
        ctx.closePath();
        const sg = ctx.createLinearGradient(0, H - 60, 0, H);
        sg.addColorStop(0,   '#50381a');
        sg.addColorStop(0.3, '#3a2810');
        sg.addColorStop(1,   '#1e1508');
        ctx.fillStyle = sg;
        ctx.fill();

        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.strokeStyle = '#c8a060';
        ctx.lineWidth = 1;
        for (let ri = 0; ri < 6; ri++) {
          ctx.beginPath();
          const ry = H - 34 + ri * 6;
          for (let rx2 = 0; rx2 <= W; rx2 += 4) {
            const y = ry + Math.sin(rx2 * 0.042 + ri * 1.3) * 1.5;
            rx2 === 0 ? ctx.moveTo(rx2, y) : ctx.lineTo(rx2, y);
          }
          ctx.stroke();
        }
        ctx.restore();

        ctx.save();
        for (let pi = 0; pi < 70; pi++) {
          const px2 = (pi * 137.5) % W;
          const py2 = sandY(px2, t) + 3 + Math.abs(Math.sin(pi * 3.8)) * 10;
          if (py2 > H - 2) continue;
          const pr = 0.8 + Math.abs(Math.sin(pi * 5.2)) * 2.2;
          ctx.beginPath();
          ctx.arc(px2, py2, pr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(175,140,88,${0.12 + Math.abs(Math.sin(pi * 2)) * 0.22})`;
          ctx.fill();
        }
        ctx.restore();
      }

      function drawShell(sh, t) {
        const sy = sandY(sh.x, t) - sh.size * 0.2;
        ctx.save();
        ctx.translate(sh.x, sy);
        ctx.rotate(sh.tilt);
        ctx.globalAlpha = 0.82;
        if (sh.type === 'spiral') {
          const g = ctx.createRadialGradient(-sh.size*0.2, -sh.size*0.15, 0, 0, 0, sh.size);
          g.addColorStop(0, `hsl(${sh.hue},${sh.sat+12}%,${sh.lit+10}%)`);
          g.addColorStop(1, `hsl(${sh.hue},${sh.sat}%,${sh.lit-14}%)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(0, 0, sh.size, sh.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = `hsla(${sh.hue-10},18%,28%,0.4)`;
          ctx.lineWidth = 0.7;
          for (let r = 1; r <= 3; r++) {
            ctx.beginPath();
            ctx.ellipse(0, 0, sh.size*(r/3.8), sh.size*0.55*(r/3.8), 0, 0, Math.PI*2);
            ctx.stroke();
          }
        } else {
          const fa = Math.PI * 0.65;
          const ribs = 7;
          const g = ctx.createLinearGradient(-sh.size*0.2, -sh.size, sh.size*0.2, 0);
          g.addColorStop(0, `hsl(${sh.hue},${sh.sat+8}%,${sh.lit+8}%)`);
          g.addColorStop(1, `hsl(${sh.hue},${sh.sat}%,${sh.lit-10}%)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, sh.size, Math.PI - fa/2, Math.PI + fa/2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `hsla(${sh.hue-10},18%,22%,0.35)`;
          ctx.lineWidth = 0.6;
          for (let r = 0; r < ribs; r++) {
            const ang = (Math.PI - fa/2) + (fa/(ribs-1))*r;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang)*sh.size, Math.sin(ang)*sh.size);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      function drawBubbles(t) {
        bubbles.forEach(b => {
          if (!prefersReduce) {
            b.y -= b.vy;
            b.x += Math.sin(b.wobble) * 0.55;
            b.wobble += b.wSpd;
            if (b.y < -b.r * 3) {
              b.y = H - 10 - Math.random() * 30;
              b.x = 20 + Math.random() * (W - 40);
            }
          }
          ctx.save();
          ctx.globalAlpha = b.alpha;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(155,215,255,0.85)';
          ctx.lineWidth = 0.9;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fill();
          ctx.restore();
        });
      }

      function paintFish(f) {
        const { x, y, dir, bw, bh, color, ink, tail, name, type } = f;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(dir, 1);
        const wag = Math.sin(tail) * (type === 'angel' ? 0.2 : 0.28);

        if (type === 'standard') {
          // Forked V-tail
          ctx.save();
          ctx.translate(-bw * 0.9, 0); ctx.rotate(wag);
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(-bw * 0.65, -bh * 1.6);
          ctx.lineTo(-bw * 0.15, 0); ctx.lineTo(-bw * 0.65, bh * 1.6);
          ctx.closePath();
          ctx.fillStyle = color; ctx.globalAlpha = 0.72; ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 0.92;
          ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();
          // Dorsal spike
          ctx.globalAlpha = 0.62; ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(-bw * 0.1, -bh); ctx.lineTo(bw * 0.2, -bh * 1.9); ctx.lineTo(bw * 0.42, -bh);
          ctx.closePath(); ctx.fill();

        } else if (type === 'round') {
          // Wide fan tail
          ctx.save();
          ctx.translate(-bw * 0.88, 0); ctx.rotate(wag * 0.85);
          ctx.beginPath();
          ctx.moveTo(0, -bh * 0.4);
          ctx.bezierCurveTo(-bw * 0.3, -bh * 1.9, -bw * 0.95, -bh * 1.5, -bw * 1.05, -bh * 0.2);
          ctx.quadraticCurveTo(-bw * 1.1, 0, -bw * 1.05, bh * 0.2);
          ctx.bezierCurveTo(-bw * 0.95, bh * 1.5, -bw * 0.3, bh * 1.9, 0, bh * 0.4);
          ctx.closePath();
          ctx.fillStyle = color; ctx.globalAlpha = 0.68; ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 0.92;
          ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();
          // Mid-body stripe
          ctx.globalAlpha = 0.2; ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.beginPath(); ctx.ellipse(0, 0, bw * 0.82, bh * 0.28, 0, 0, Math.PI * 2); ctx.fill();

        } else if (type === 'slim') {
          // Crescent/lunate spread tail
          ctx.save();
          ctx.translate(-bw * 0.93, 0); ctx.rotate(wag * 1.2);
          ctx.fillStyle = color; ctx.globalAlpha = 0.66;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-bw * 0.2, -bh * 2.6, -bw * 0.88, -bh * 1.85);
          ctx.quadraticCurveTo(-bw * 0.48, -bh * 0.5, 0, 0); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-bw * 0.2, bh * 2.6, -bw * 0.88, bh * 1.85);
          ctx.quadraticCurveTo(-bw * 0.48, bh * 0.5, 0, 0); ctx.closePath(); ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 0.92;
          ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();
          // Metallic lateral sheen
          const sheen = ctx.createLinearGradient(0, -bh, 0, bh);
          sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
          sheen.addColorStop(0.5, 'rgba(255,255,255,0.04)');
          sheen.addColorStop(1, 'rgba(255,255,255,0.16)');
          ctx.fillStyle = sheen; ctx.globalAlpha = 0.45;
          ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2); ctx.fill();

        } else {
          // angel — tall disc with swept fins
          ctx.save();
          ctx.translate(-bw * 0.85, 0); ctx.rotate(wag * 0.9);
          ctx.fillStyle = color; ctx.globalAlpha = 0.62;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-bw * 0.22, -bh * 0.9, -bw * 0.72, -bh * 2.9);
          ctx.quadraticCurveTo(-bw * 0.42, -bh * 1.0, 0, 0); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-bw * 0.22, bh * 0.9, -bw * 0.72, bh * 2.9);
          ctx.quadraticCurveTo(-bw * 0.42, bh * 1.0, 0, 0); ctx.closePath(); ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 0.92;
          ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.fill();
          // Tall dorsal fin
          ctx.globalAlpha = 0.66; ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(-bw * 0.28, -bh);
          ctx.quadraticCurveTo(-bw * 0.08, -bh * 2.9, bw * 0.32, -bh * 2.55);
          ctx.quadraticCurveTo(bw * 0.52, -bh * 1.5, bw * 0.52, -bh); ctx.closePath(); ctx.fill();
          // Ventral fin
          ctx.beginPath();
          ctx.moveTo(-bw * 0.28, bh);
          ctx.quadraticCurveTo(-bw * 0.1, bh * 2.4, bw * 0.22, bh * 2.1);
          ctx.quadraticCurveTo(bw * 0.4, bh * 1.5, bw * 0.4, bh); ctx.closePath(); ctx.fill();
        }

        // Shared shading
        const shade = ctx.createRadialGradient(0, bh * 0.45, 0, 0, 0, bh * 1.3);
        shade.addColorStop(0, 'rgba(0,0,0,0.22)'); shade.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shade; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2); ctx.fill();

        const hi = ctx.createLinearGradient(0, -bh, 0, 0);
        hi.addColorStop(0, 'rgba(255,255,255,0.28)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hi; ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.ellipse(0, -bh * 0.25, bw * 0.7, bh * 0.6, 0, Math.PI, Math.PI * 2); ctx.fill();

        // Gill
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(bw * 0.3, 0, bh * 0.76, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1.5; ctx.stroke();

        // Eye
        ctx.globalAlpha = 1;
        const er = Math.max(2.5, bh * 0.31);
        ctx.beginPath();
        ctx.arc(bw * 0.61, -bh * 0.13, er, 0, Math.PI * 2);
        ctx.fillStyle = '#080e14'; ctx.fill();
        ctx.beginPath();
        ctx.arc(bw * 0.63, -bh * 0.21, er * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.fill();

        // Undo flip — text never mirrored
        ctx.scale(dir, 1);
        ctx.font = '700 11px "Space Mono", monospace';
        ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(name, 0, 0);

        ctx.restore();
      }

      function drawStarfish(sf, t) {
        const sy = sandY(sf.x, t) - sf.size * 0.3;
        ctx.save();
        ctx.translate(sf.x, sy);
        ctx.rotate(sf.rot);
        ctx.globalAlpha = 0.82;

        const arms = 5, outerR = sf.size, innerR = sf.size * 0.42;
        ctx.beginPath();
        for (let i = 0; i < arms * 2; i++) {
          const a = (i * Math.PI) / arms - Math.PI / 2;
          const r = i % 2 === 0 ? outerR : innerR;
          i === 0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r)
                  : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        }
        ctx.closePath();
        const g = ctx.createRadialGradient(-outerR*0.18, -outerR*0.18, 0, 0, 0, outerR);
        g.addColorStop(0, '#d96020'); g.addColorStop(1, '#882808');
        ctx.fillStyle = g; ctx.fill();

        ctx.fillStyle = 'rgba(255,170,80,0.3)';
        for (let i = 0; i < arms; i++) {
          const a = (i * Math.PI * 2) / arms - Math.PI / 2;
          for (let d = 0.3; d <= 0.9; d += 0.28) {
            ctx.beginPath();
            ctx.arc(Math.cos(a)*outerR*d, Math.sin(a)*outerR*d, sf.size * 0.07, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, innerR * 0.8);
        cg.addColorStop(0, '#e07828'); cg.addColorStop(1, '#a03c10');
        ctx.beginPath(); ctx.arc(0, 0, innerR * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = cg; ctx.fill();
        ctx.restore();
      }

      function drawCrab(c, t) {
        const cy = sandY(c.x, t) - c.size * 0.38;
        const lw = Math.sin(t * 0.018 + c.phase) * 0.15;
        ctx.save();
        ctx.translate(c.x, cy);
        ctx.globalAlpha = 0.87;

        // Walking legs (3 per side, behind body)
        ctx.lineCap = 'round';
        for (let si = -1; si <= 1; si += 2) {
          for (let li = 0; li < 3; li++) {
            const legY = -c.size * 0.08 + li * c.size * 0.22;
            const legX = si * c.size * (0.85 + li * 0.08);
            const ang  = si * (0.9 + li * 0.18) + lw * si;
            const kx   = legX + Math.cos(ang) * c.size * 0.75;
            const ky   = legY + Math.sin(ang) * c.size * 0.3;
            ctx.strokeStyle = '#952808'; ctx.lineWidth = Math.max(1, c.size * 0.1);
            ctx.beginPath(); ctx.moveTo(legX, legY); ctx.lineTo(kx, ky);
            ctx.lineTo(kx + si * c.size * 0.28, ky + c.size * 0.44); ctx.stroke();
          }
        }

        // Carapace
        const bg = ctx.createRadialGradient(-c.size*0.22, -c.size*0.18, 0, 0, 0, c.size * 1.2);
        bg.addColorStop(0, '#e05228'); bg.addColorStop(0.65, '#b83012'); bg.addColorStop(1, '#7a1e08');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(-c.size * 1.05, c.size * 0.28);
        ctx.bezierCurveTo(-c.size * 1.18, -c.size * 0.08, -c.size * 0.68, -c.size * 0.62, 0, -c.size * 0.68);
        ctx.bezierCurveTo(c.size * 0.68, -c.size * 0.62, c.size * 1.18, -c.size * 0.08, c.size * 1.05, c.size * 0.28);
        ctx.bezierCurveTo(c.size * 0.85, c.size * 0.58, -c.size * 0.85, c.size * 0.58, -c.size * 1.05, c.size * 0.28);
        ctx.closePath(); ctx.fill();

        // Shell ridges
        ctx.strokeStyle = 'rgba(0,0,0,0.13)'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.55, -c.size * 0.42);
        ctx.quadraticCurveTo(0, -c.size * 0.3, c.size * 0.55, -c.size * 0.42); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-c.size * 0.28, c.size * 0.08);
        ctx.quadraticCurveTo(0, c.size * 0.02, c.size * 0.28, c.size * 0.08); ctx.stroke();

        // Claws
        for (let ci = -1; ci <= 1; ci += 2) {
          const cw = Math.sin(t * 0.015 + c.phase + ci * 1.5) * 0.08;
          ctx.save();
          ctx.translate(ci * c.size * 1.05, -c.size * 0.12);
          ctx.rotate(ci * (0.28 + cw));
          ctx.fillStyle = '#b83010';
          ctx.beginPath(); ctx.ellipse(ci * c.size * 0.38, -c.size * 0.08, c.size * 0.42, c.size * 0.2, ci * 0.28, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#c03a18';
          ctx.beginPath(); ctx.ellipse(ci * c.size * 0.82, -c.size * 0.18, c.size * 0.32, c.size * 0.18, ci * 0.18, 0, Math.PI * 2); ctx.fill();
          ctx.save();
          ctx.translate(ci * c.size * 0.82, -c.size * 0.18);
          ctx.rotate(ci * -(0.38 + cw * 2));
          ctx.fillStyle = '#d04420';
          ctx.beginPath(); ctx.ellipse(0, -c.size * 0.17, c.size * 0.24, c.size * 0.11, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          ctx.restore();
        }

        // Eyestalks
        for (let ei = -1; ei <= 1; ei += 2) {
          ctx.strokeStyle = '#8a2208'; ctx.lineWidth = Math.max(1, c.size * 0.1); ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(ei * c.size * 0.32, -c.size * 0.58);
          ctx.lineTo(ei * c.size * 0.36, -c.size * 0.88); ctx.stroke();
          ctx.beginPath(); ctx.arc(ei * c.size * 0.36, -c.size * 0.94, c.size * 0.14, 0, Math.PI * 2);
          ctx.fillStyle = '#101010'; ctx.fill();
          ctx.beginPath(); ctx.arc(ei * c.size * 0.38, -c.size * 0.96, c.size * 0.055, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
        }

        ctx.restore();
      }

      function tick() {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);

        drawBg(frame);
        drawWaterSurface(frame);

        // Seaweeds behind sand (roots covered by sand fill)
        seaweeds.forEach(sw => drawSeaweed(sw, frame));

        // Sand floor covers seaweed roots naturally
        drawSandFloor(frame);

        // Shells rest on the sand surface
        shells.forEach(sh => drawShell(sh, frame));

        // Starfish and crabs on the sand
        starfishes.forEach(sf => drawStarfish(sf, frame));
        crabs.forEach(c => drawCrab(c, frame));

        // Fish swim in the water column
        fishes.forEach(f => {
          if (!prefersReduce) {
            f.x += f.speed;
            f.tail += 0.11;
            f.y = f.baseY + Math.sin(frame * 0.001 + f.bob) * 8;
            const edge = f.bw * 2.5;
            if (f.speed > 0 && f.x > W + edge) f.x = -edge;
            else if (f.speed < 0 && f.x < -edge) f.x = W + edge;
          }
          paintFish(f);
        });

        // Bubbles rise above everything
        drawBubbles(frame);

        if (!prefersReduce) {
          frame++;
          raf = requestAnimationFrame(tick);
        }
      }

      let rzTimer;
      window.addEventListener('resize', () => {
        clearTimeout(rzTimer);
        rzTimer = setTimeout(() => {
          cancelAnimationFrame(raf);
          setup();
          tick();
        }, 180);
      }, { passive: true });

      setup();
      tick();
    }
  }

})();

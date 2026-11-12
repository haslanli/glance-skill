/* glance site: the hero, the scroll builds and every control around the pictures.
   The pictures themselves are kit HTML; kit.js wires their sort, filter and search. */
(() => {
  const d = document, root = d.documentElement;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const G = () => typeof window.gsap !== 'undefined';
  const $ = (s, el = d) => el.querySelector(s), $$ = (s, el = d) => [...el.querySelectorAll(s)];
  // One clock for the whole site (site.css has the same as --t-* and --ease): quick is a control answering,
  // ui a small piece moving, move a layout changing, show something arriving. One easing for all of it,
  // cubic-bezier(.2,0,0,1): a gentle first frame or two (so a slow frame never turns into a jump), then quick,
  // then a long soft landing.
  const bezier = (x1, y1, x2, y2) => {
    const f = (t, a, b) => (((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
    const df = (t, a, b) => 3 * (1 - 3 * b + 3 * a) * t * t + 2 * (3 * b - 6 * a) * t + 3 * a;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 24; i++) {
        const e = f(t, x1, x2) - x; if (Math.abs(e) < 1e-6) break;
        if (e < 0) lo = t; else hi = t;
        const s = df(t, x1, x2), n = s > 1e-6 ? t - e / s : NaN;
        t = n > lo && n < hi ? n : (lo + hi) / 2;
      }
      return f(t, y1, y2);
    };
  };
  const T = { quick: .15, ui: .24, move: .45, show: .5 }, EASE = bezier(.2, 0, 0, 1);

  /* ---------------- theme ----------------
     What moves where: the new theme spreads out from the switch as a growing circle over the old one (a view
     transition), so the change visibly starts where it was asked for; the switch's half-filled icon turns
     over and its label slides to the other word. Without view transitions every colour crossfades instead;
     with reduced motion the theme just changes. */
  const themeBtn = $('#theme'), themeLabel = $('.theme-l');
  themeLabel && labelBox(themeLabel, ['Dark', 'Light']);
  const mq = matchMedia('(prefers-color-scheme: dark)');
  let saved = null; try { saved = localStorage.getItem('glance-theme'); } catch (e) {}
  const applyTheme = (animate) => {
    root.dataset.theme = saved || (mq.matches ? 'dark' : 'light');
    const text = root.dataset.theme === 'dark' ? 'Light' : 'Dark';
    if (themeLabel) relabel(themeBtn, text, themeLabel, !(animate && themeLabel.offsetParent));
  };
  const crossfade = () => { root.classList.add('theming'); clearTimeout(crossfade.t); crossfade.t = setTimeout(() => root.classList.remove('theming'), 500); };
  const switchTheme = from => {
    if (REDUCED) { applyTheme(false); return; }
    if (!d.startViewTransition || !from) { crossfade(); applyTheme(true); return; }
    const r = from.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    // inside the circle the new theme is already whole: no colour of its own fades in late
    const vt = d.startViewTransition(() => { root.classList.add('vt'); applyTheme(true); });
    vt.ready.then(() => root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 600, easing: 'cubic-bezier(.2,0,0,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    vt.finished.finally(() => root.classList.remove('vt'));
  };
  applyTheme(false);
  mq.addEventListener('change', () => { if (!saved) switchTheme(null); });
  themeBtn && themeBtn.addEventListener('click', () => {
    saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('glance-theme', saved); } catch (e) {}
    switchTheme(themeBtn);
  });

  /* ---------------- helpers ---------------- */
  const norm = s => s.replace(/[\u00a0\u2009\u202f]/g, ' ').replace(/−/g, '-').replace(/\s+/g, ' ').replace(/\s%/g, '%').trim().toLowerCase();
  const NUM = /([+\-−]?)(\$?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?/g;
  // Count every number in el up to its value (from 0, or from the previous step in a before → after row).
  function countUp(tl, el, at, steps) {
    const nodes = [], walker = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('small,.gl-n,.gl-mk') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = walker.nextNode())) nodes.push(n);
    const toks = [];
    for (const node of nodes) {
      const text = node.data; NUM.lastIndex = 0; let m;
      while ((m = NUM.exec(text))) toks.push({ node, i: m.index, len: m[0].length, sign: m[1], pre: m[2], comma: m[3].includes(','),
        dec: m[4] ? m[4].length - 1 : 0, value: parseFloat(m[3].replace(/,/g, '') + (m[4] || '')) });
    }
    if (!toks.length) return;
    toks.forEach((t, k) => t.from = steps ? (k === 0 ? t.value : toks[k - 1].value) : 0);
    const orig = new Map(nodes.map(nd => [nd, nd.data]));
    const fmt = (t, v) => t.sign + t.pre + (t.comma ? v.toLocaleString('en-US', { minimumFractionDigits: t.dec, maximumFractionDigits: t.dec }) : v.toFixed(t.dec));
    const render = p => {
      for (const nd of nodes) {
        let s = orig.get(nd), shift = 0;
        for (const t of toks.filter(t => t.node === nd)) {
          const out = fmt(t, t.from + (t.value - t.from) * p);
          s = s.slice(0, t.i + shift) + out + s.slice(t.i + shift + t.len); shift += out.length - t.len;
        }
        nd.data = s;
      }
    };
    // hold the box at its final width while the digits change, so the row around it never reflows
    const finalW = el.getBoundingClientRect().width;
    const o = { p: 0 };
    tl.add(() => { el.style.minWidth = finalW + 'px'; render(0); }, Math.max(0, at - .001));
    tl.to(o, { p: 1, duration: .7, ease: EASE, onUpdate: () => render(o.p),
      onComplete: () => { nodes.forEach(nd => nd.data = orig.get(nd)); el.style.minWidth = ''; } }, at);
  }

  /* ---------------- hero ---------------- */
  const FACTS = [['$2,110', 'sep'], ['$4,760', 'oct'], ['2.25×', 'x'], ['Two Terraform changes', 'tf'], ['95%', 'pct'],
    ['NAT Gateway', 'nat'], ['+$2,130', 'natv'], ['CloudWatch', 'cw'], ['+$380', 'cwv'], ['Other', 'oth'], ['+$95', 'othv'],
    ['EC2 / RDS / S3', 'ec2'], ['+$45', 'ec2v']];
  // where each fact lands in the picture: the headline figure, its note, and the table's names and changes
  const PIC = [['95%', 'pct'], ['2.25×', 'x'], ['NAT Gateway', 'nat'], ['+2,130', 'natv'], ['CloudWatch', 'cw'], ['+380', 'cwv'],
    ['Other', 'oth'], ['+95', 'othv'], ['EC2 / RDS / S3', 'ec2'], ['+45', 'ec2v'], ['2,110', 'sepv'], ['4,760', 'octv']];
  const ORDER = ['tf', 'pct', 'x', 'nat', 'natv', 'cw', 'cwv', 'oth', 'othv', 'ec2', 'ec2v', 'sepv', 'octv'];
  const hero = $('.hero'), answer = $('#hero-answer'), card = $('#hero-card'), layer = $('#layer');
  const back = $('#hero-back'), front = $('#hero-front'), glow = $('#hero-glow'), rig = $('#rig');
  let heroTl = null, heroReady = false;

  function markFacts() {
    for (const [text, key] of FACTS) {
      if ($(`.fact[data-k="${key}"]`, answer)) continue;
      const w = d.createTreeWalker(answer, NodeFilter.SHOW_TEXT); let node;
      while ((node = w.nextNode())) {
        const i = node.data.indexOf(text); if (i < 0) continue;
        const r = d.createRange(); r.setStart(node, i); r.setEnd(node, i + text.length);
        const s = d.createElement('span'); s.className = 'fact'; s.dataset.k = key; r.surroundContents(s); break;
      }
    }
    const pic = $('.pic', card), skip = n => n.parentElement.closest('.sr-only, [data-k]');
    const texts = () => { const out = [], w = d.createTreeWalker(pic, NodeFilter.SHOW_TEXT); for (let n; (n = w.nextNode());) if (n.data.trim() && !skip(n)) out.push(n); return out; };
    for (const [text, k] of PIC) {
      if ($(`[data-k="${k}"]`, pic)) continue;
      const node = texts().find(n => n.data.includes(text)); if (!node) continue;
      const r = d.createRange(), i = node.data.indexOf(text); r.setStart(node, i); r.setEnd(node, i + text.length);
      const s = d.createElement('span'); s.dataset.k = k; r.surroundContents(s);
    }
    // every other run of text in the picture, so labels and notes can fade in around the facts
    if (!$('.pw', pic)) for (const node of texts()) { const s = d.createElement('span'); s.className = 'pw'; node.replaceWith(s); s.append(node); }
    // the sentence's own words, so they can write themselves in around the facts
    const sent = $('.gsent', card);
    if (!$('.mw', sent)) for (const node of [...sent.childNodes]) if (node.nodeType === 3) {
      const frag = d.createDocumentFragment();
      node.data.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) frag.append(part); else { const s = d.createElement('span'); s.className = 'mw'; s.textContent = part; frag.append(s); } });
      sent.replaceChild(frag, node);
    }
  }

  function heroFinal() {
    hero.classList.add('ready');
    $$('.fact', answer).forEach(f => f.classList.add('gone'));
    if (G()) gsap.set([front, glow, card, back], { clearProps: 'opacity,transform' });
  }

  /* The hero is one reversible timeline. Every flight is built up front from measured positions, and every
     change is a tween or a set, never a one-way callback, so Replay can rewind it: the bullets drop out, the
     bars shrink, the words un-write, the facts fly back into the answer and the card sinks away, then it
     plays again. */
  function buildHero(delay) {
    markFacts();
    const facts = $$('.fact', answer), targets = $$('[data-k]', card);
    const words = $$('.gsent .mw', card), runs = $$('.pic .pw', card);
    const rows = runs.filter(e => !e.closest('small')), notes = runs.filter(e => e.closest('small'));
    const bars = $$('.pic .gl-ga > i, .pic .gl-bars .t > i, .pic .gl-col > i', card), bul = $$('.gbul > *, .gbul li', card), you = $('.you', card);
    layer.innerHTML = '';
    // measured in the finished layout, before anything is set to its start
    const L = layer.getBoundingClientRect(), route = { sepv: 'sep', octv: 'oct' }, fl = [];
    const textRects = el => { const r = d.createRange(); r.selectNodeContents(el); return r.getClientRects(); };
    facts.forEach(f => { f.classList.remove('gone'); f.dataset.gone = '0'; });
    gsap.set(card, { clearProps: 'transform' });
    for (const dst of targets) {
      const k = dst.dataset.k, src = $(`.fact[data-k="${route[k] || k}"]`, answer); if (!src) continue;
      // aim at where the text itself sits (a right-aligned value is not at its cell's left edge)
      const a = textRects(src)[0] || src.getBoundingClientRect();
      const dr = textRects(dst), b = dr[0] || dst.getBoundingClientRect(), wraps = dr.length > 1;
      const cs = getComputedStyle(src), ds = getComputedStyle(dst);
      const s = parseFloat(ds.fontSize) / parseFloat(cs.fontSize);
      // Two layers: the answer's type, crossfading into the glance's type drawn at 1/s so that,
      // scaled by s on landing, it matches the target exactly and the hand-over is invisible.
      const f = d.createElement('span'); f.className = 'flyer';
      f.style.cssText = `font-family:${cs.fontFamily};font-size:${cs.fontSize};line-height:${b.height / s}px`;
      const from = d.createElement('span'); from.textContent = src.textContent;
      from.style.cssText = `font-weight:${cs.fontWeight};letter-spacing:${cs.letterSpacing};font-variant-numeric:${cs.fontVariantNumeric}`;
      const to = d.createElement('span'); to.className = 'fl-to'; to.textContent = dst.textContent;
      const ls = parseFloat(ds.letterSpacing);
      to.style.cssText = `font-family:${ds.fontFamily};font-weight:${ds.fontWeight};font-variant-numeric:${ds.fontVariantNumeric};letter-spacing:${isNaN(ls) ? 'normal' : ls / s + 'px'}`;
      f.append(from, to); layer.append(f);
      fl.push({ f, from, to, dst, k, wraps, x0: a.left - L.left, y0: a.top - L.top, x1: b.left - L.left, y1: b.top - L.top, s, color: ds.color });
    }
    fl.sort((p, q) => ORDER.indexOf(p.k) - ORDER.indexOf(q.k));

    // the start
    gsap.set(facts, { backgroundSize: '0% 100%' });
    gsap.set([...words, ...rows, ...notes, ...bul, you, ...targets], { autoAlpha: 0 });
    gsap.set(bars, { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set(bul, { y: 10 }); gsap.set(card, { y: 30, opacity: 0 }); gsap.set(glow, { opacity: 0 }); gsap.set(back, { opacity: 1 });
    fl.forEach(p => gsap.set(p.f, { x: p.x0, y: p.y0, autoAlpha: 0, force3D: true }));
    hero.classList.add('ready');

    const tl = gsap.timeline({ delay, paused: !delay });
    tl.to(facts, { backgroundSize: '100% 100%', duration: .4, stagger: .035, ease: EASE }, 0);
    tl.to(card, { y: 0, opacity: 1, duration: .8, ease: EASE }, .45);
    tl.to(glow, { opacity: 1, duration: 1.4, ease: EASE }, .6);
    tl.to(you, { autoAlpha: 1, duration: .35 }, .75);
    // each fact lifts off the answer (leaving its outline behind) and flies to its place in the glance
    tl.set(facts, { attr: { 'data-gone': 1 } }, 1.0);
    fl.forEach((p, i) => {
      const lift = 46 + (i % 5) * 15, mx = p.x0 + (p.x1 - p.x0) * .45, my = Math.min(p.y0, p.y1) - lift;
      const ft = gsap.timeline();
      ft.set(p.f, { autoAlpha: 1, immediateRender: false })
        .to(p.f, { x: mx, y: my, scale: (1 + p.s) / 2 + .1, duration: .5, ease: EASE })
        .to(p.f, { x: p.x1, y: p.y1, scale: p.s, duration: .55, ease: EASE })
        .to(p.from, { opacity: 0, duration: .45, ease: EASE }, .35)
        .to(p.to, { opacity: 1, duration: .45, ease: EASE }, .35)
        .to(p.f, { backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', color: p.color, duration: .25 }, '-=.25');
      if (p.wraps)   // the target breaks over two lines: crossfade rather than swap
        ft.to(p.dst, { autoAlpha: 1, duration: .3 }).to(p.f, { autoAlpha: 0, duration: .3 }, '<');
      else ft.set(p.dst, { autoAlpha: 1 }).set(p.f, { autoAlpha: 0 });
      tl.add(ft, 1.0 + i * .075);
    });
    tl.to(back, { opacity: .42, duration: 1.4, ease: EASE }, 1.25);
    tl.to(words, { autoAlpha: 1, duration: .6, stagger: .028, ease: EASE }, 1.4);
    tl.to(rows, { autoAlpha: 1, duration: .4, stagger: .018 }, 2.05);
    tl.to(bars, { scaleX: 1, duration: .75, stagger: .08, ease: EASE }, 2.25);
    tl.to(notes, { autoAlpha: 1, duration: .4, stagger: .03 }, 2.7);
    tl.to(bul, { autoAlpha: 1, y: 0, duration: .5, stagger: .045, ease: EASE, force3D: false }, 3.05);
    // played back to the start (Replay), it plays forward again
    tl.eventCallback('onReverseComplete', () => { tl.timeScale(1); gsap.delayedCall(.25, () => { if (tl === heroTl) tl.play(); }); });
    return tl;
  }

  function playHero() {
    if (!G() || REDUCED) { heroFinal(); return; }
    heroTl && heroTl.kill();
    heroTl = buildHero(.35);
  }

  function replayHero() {
    if (!G() || REDUCED) return;
    if (heroTl && heroTl.reversed() && heroTl.isActive()) return;   // already rewinding
    if (!heroTl || heroTl.progress() === 1) {
      // finished: build it afresh from today's layout (the window may have changed) and show it at its end,
      // which is exactly what's on screen, so the rewind starts from what the reader sees
      heroTl && heroTl.kill();
      heroTl = buildHero(0); heroTl.progress(1);
    }
    heroTl.timeScale(Math.max(2.4, heroTl.time() / 1.4)).reverse();
  }

  function initHero() {
    if (!hero) return;
    markFacts();
    $('#replay').addEventListener('click', () => { if (G() && !REDUCED) { window.scrollTo({ top: 0, behavior: 'smooth' }); replayHero(); } });
    if (!G() || REDUCED) { heroFinal(); return; }
    (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(playHero));
    if (FINE) {
      const rx = gsap.quickTo(rig, 'rotationX', { duration: .9, ease: EASE }), ry = gsap.quickTo(rig, 'rotationY', { duration: .9, ease: EASE });
      const stage = $('#stage');
      stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 5); rx(-((e.clientY - r.top) / r.height - .5) * 3.5); });
      stage.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }
    if (window.ScrollTrigger && matchMedia('(min-width: 901px)').matches) {
      gsap.to('#stage', { y: -60, ease: 'none', scrollTrigger: { trigger: '#stage', start: 'top 30%', end: 'bottom top', scrub: .6 } });
    }
  }

  /* ---------------- examples ---------------- */
  let peeked = false;   // the drag-to-compare hint plays once on the page, on the first example the reader reaches
  function initCompare(ex) {
    const cmp = $('.cmp', ex), input = $('.cmp-handle input', cmp), knob = $('.knob', cmp);   // its own range input, not the table's search box
    let dragging = false;
    const set = p => {
      if (ex._peekTl) { ex._peekTl.kill(); ex._peekTl = null; }   // the reader has the slider now; the hint is over
      p = Math.max(0, Math.min(100, p)); cmp.style.setProperty('--pos', p + '%'); cmp.classList.toggle('on', p > .5); input.value = p; ex.dataset.touched = '1';
    };
    const fromX = x => { const r = cmp.getBoundingClientRect(); set((x - r.left) / r.width * 100); };
    knob.addEventListener('pointerdown', e => { dragging = true; cmp.classList.add('drag'); knob.setPointerCapture(e.pointerId); e.preventDefault(); });
    knob.addEventListener('pointermove', e => dragging && fromX(e.clientX));
    const end = () => { dragging = false; cmp.classList.remove('drag'); };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
    knob.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.addEventListener('input', () => set(+input.value));
    ex._cmpPos = () => parseFloat(cmp.style.getPropertyValue('--pos')) || 0;
    ex._cmpReset = () => { cmp.style.setProperty('--pos', '0%'); cmp.classList.remove('on'); input.value = 0; };
    ex._peek = () => {
      if (!G() || REDUCED || peeked || ex.dataset.touched || $('.ex-stage', ex).classList.contains('is-narrow')) return;
      peeked = true;
      const o = { p: 0 }, onUpdate = () => { if (!ex.dataset.touched) { cmp.style.setProperty('--pos', o.p + '%'); cmp.classList.toggle('on', o.p > .5); } };
      ex._peekTl = gsap.timeline().to(o, { p: 16, duration: T.move, ease: EASE, onUpdate }).to(o, { p: 0, duration: T.move, delay: .3, ease: EASE, onUpdate });
    };
  }

  /* ---------------- morph ----------------
     Every state change in an example runs through here: note where each piece sits, switch to the
     final layout in one go, then move each piece from its old place to its new one. Boxes (cells,
     bars, tiles, flags) may also resize; words never do, they are counter-scaled inside a resizing
     box so text never stretches. A piece with no counterpart fades out where it was (a ghost copy)
     or fades in where it lands. Transforms and opacity only, all on one clock. */
  const BOXES = '.gl-card, .gl-hd, .gl-fig, .gl-sup, .gl-col > i, .gl-axis > div, .gl-br .n, .gl-br .v, .gl-br .t > i, .gl-bars .n, .gl-bars .t > i, .gl-bars .v, .gl-zoom, .gl-split, .gl-split > i, .gl-row > *, .gl-gh, .gl-ga, .gl-ga > i, .gl-spk, .gl-dv .n, .gl-dv i, .gl-dv .v, .gl-pick, .gl-alt, .gl-kv, .gl-mini > div, .gl-cell, .gl-nm small, .gl-find, .gl-more, .gl-plot, .gl-head';
  const ATOMS = '.mw, .seg, .hint, button, code';
  const rectOf = el => { if (!el || !el.getClientRects().length) return null; const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const lerp = (a, b, v) => a + (b - a) * v;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  // Words become their own boxes once, so they can travel when a line re-wraps.
  function splitWords(root) {
    if (root.dataset.split) return; root.dataset.split = '1';
    const skip = '.sr-only, button, input, code, .hint, .mw, script, style';
    const walker = d.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => !n.data.trim() || n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const frag = d.createDocumentFragment();
      for (const part of node.data.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) frag.append(part);
        else { const w = d.createElement('span'); w.className = 'mw'; w.textContent = part; frag.append(w); }
      }
      node.replaceWith(frag);
    }
  }
  // morph(scope, stage, mutate, opts): returns the running tween (or null when nothing animates).
  function morph(scope, stage, mutate, { duration = T.move, ease = EASE, extra, done, skip } = {}) {
    // a morph still running here is taken over from where its pieces are seen right now, not from its end
    const prev = scope._morph;
    const nodes = $$(BOXES + ',' + ATOMS, scope).filter(el => !el.closest('.cmp-before, .cmp-handle, .sr-only' + (skip ? ', ' + skip : '')));
    const before = new Map(nodes.map(el => [el, rectOf(el)]));
    // a clamped teaser clips its rows to its box; during the move that window travels too, instead of
    // cutting everything to the final box at once. Its fade leaves when the rows end up fitting the box.
    const clips = $$('.pic.clamp:not(.open)', scope).map(el => {
      const c = { el, a: el._win || rectOf(el), fa: el._co !== undefined ? el._co : el.classList.contains('fits') ? 0 : 1 };
      delete el._win; delete el._co; return c;
    });
    const styleOf = new Map();
    for (const el of nodes) if (before.get(el)) {
      const cs = getComputedStyle(el);
      styleOf.set(el, `font:${cs.font};color:${cs.color};letter-spacing:${cs.letterSpacing};text-align:${cs.textAlign};white-space:${cs.whiteSpace};padding:${cs.padding};background-color:${cs.backgroundColor};background-image:${cs.backgroundImage};box-shadow:${cs.boxShadow};max-width:none`);
    }
    const carried = prev ? prev.stop() : [];
    mutate();
    const after = new Map(nodes.map(el => [el, rectOf(el)]));
    for (const c of clips) { c.b = rectOf(c.el); c.fb = c.el.classList.contains('fits') ? 0 : 1; c.el.style.overflow = 'visible'; c.el.classList.add('clip-morph'); }
    const S = rectOf(stage), top = scrollY - 300, bottom = scrollY + innerHeight + 300;
    const seen = r => r && r.y + r.h > top && r.y < bottom;
    const nodeOf = new Map(), travel = [], leaving = [], entering = [];
    for (const el of nodes) {
      const a = before.get(el), b = after.get(el), atom = el.matches(ATOMS);
      if (a && b) { if (atom && !seen(a) && !seen(b)) continue; const n = { el, a, b, atom }; nodeOf.set(el, n); travel.push(n); }
      else if (a && seen(a) && !(el.parentElement && el.parentElement.closest(BOXES) && !after.get(el.parentElement.closest(BOXES)) && before.get(el.parentElement.closest(BOXES)))) leaving.push({ el, a });
      else if (b && seen(b)) entering.push(el);
    }
    for (const n of travel) {
      let p = n.el.parentElement; while (p && p !== scope && !nodeOf.has(p)) p = p.parentElement;
      n.parent = p && p !== scope ? nodeOf.get(p) : null; n.el.style.transformOrigin = '0 0';
      // a resizing box's corners and inset bar are counter-scaled every frame, so they keep their true size
      if (!n.atom) {
        const cs = getComputedStyle(n.el), r = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(k => parseFloat(cs['border' + k + 'Radius']) || 0);
        const m = /^(.*\)) (-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px (-?[\d.]+)px inset$/.exec(cs.boxShadow);
        if (r.some(Boolean)) n.radius = r;
        if (m) n.shadow = { color: m[1], x: +m[2], y: +m[3], blur: +m[4], spread: +m[5] };
      }
    }
    // ghosts: a copy of each piece that leaves, at the place it left from
    const layer = d.createElement('div'); layer.className = 'morph-layer gl'; layer.style.containerType = 'normal'; stage.append(layer);
    const ghosts = leaving.filter(g => !leaving.some(o => o !== g && o.el.contains(g.el))).map(({ el, a }) => {
      const wrap = d.createElement('div'); wrap.className = 'morph-ghost';
      wrap.style.cssText = `left:${a.x - S.x}px;top:${a.y - S.y}px;width:${a.w}px;height:${a.h}px`;
      const c = el.cloneNode(true); c.style.cssText += `;display:block;width:100%;height:100%;box-sizing:border-box;${styleOf.get(el) || ''}`;
      wrap.append(c); layer.append(wrap); return wrap;
    });
    const enter = entering.filter(e => !entering.some(o => o !== e && o.contains(e)));
    // pieces a taken-over morph was still fading in carry on from their opacity; a ghost already took a copy
    const fadeUp = [];
    for (const el of carried) { if (nodeOf.has(el)) fadeUp.push({ el, o: parseFloat(el.style.opacity) || 0 }); else if (!enter.includes(el)) el.style.opacity = ''; }
    const render = v => {
      for (const n of travel) {
        const P = n.parent && n.parent.M, psx = P ? P.sx : 1, psy = P ? P.sy : 1, pox = P ? P.ox : 0, poy = P ? P.oy : 0;
        const kx = n.atom || !n.b.w ? 1 : lerp(n.a.w, n.b.w, v) / n.b.w, ky = n.atom || !n.b.h ? 1 : lerp(n.a.h, n.b.h, v) / n.b.h;
        const Dx = lerp(n.a.x, n.b.x, v), Dy = lerp(n.a.y, n.b.y, v);
        n.el.style.transform = `translate(${(Dx - pox) / psx - n.b.x}px,${(Dy - poy) / psy - n.b.y}px) scale(${kx / psx},${ky / psy})`;
        n.M = { sx: kx, sy: ky, ox: Dx - n.b.x * kx, oy: Dy - n.b.y * ky };
        if (n.radius) n.el.style.borderRadius = n.radius.map(r => r / kx + 'px').join(' ') + ' / ' + n.radius.map(r => r / ky + 'px').join(' ');
        if (n.shadow) { const s = n.shadow; n.el.style.boxShadow = `${s.color} ${s.x / kx}px ${s.y / ky}px ${s.blur / kx}px ${s.spread / kx}px inset`; }
      }
      const out = 1 - clamp01(v / .45), inn = clamp01((v - .5) / .5);
      for (const g of ghosts) { g.style.opacity = out; g.style.transform = `scale(${.96 + .04 * out})`; }
      for (const e of enter) e.style.opacity = inn;
      for (const f of fadeUp) f.el.style.opacity = lerp(f.o, 1, clamp01(v / .5));
      for (const c of clips) if (c.a && c.b) {
        // the teaser's window, travelling from its old box to its new one; it may reach past its own box
        const x = lerp(c.a.x, c.b.x, v) - c.b.x, y = lerp(c.a.y, c.b.y, v) - c.b.y, w = lerp(c.a.w, c.b.w, v), h = lerp(c.a.h, c.b.h, v);
        c.el.style.clipPath = `inset(${y}px ${c.b.w - x - w}px ${c.b.h - y - h}px ${x}px)`;
        c.el.style.setProperty('--fx', x + 'px'); c.el.style.setProperty('--fy', y + h * .82 + 'px');
        c.el.style.setProperty('--fw', w + 'px'); c.el.style.setProperty('--fh', h * .18 + 'px');
        c.co = lerp(c.fa, c.fb, v); c.el.style.setProperty('--co', c.co);
        c.win = { x: c.b.x + x, y: c.b.y + y, w, h };
      }
      extra && extra(v);
    };
    const unclip = () => { for (const c of clips) { c.el.classList.remove('clip-morph'); c.el.style.overflow = ''; c.el.style.clipPath = ''; for (const k of ['--fx', '--fy', '--fw', '--fh', '--co']) c.el.style.removeProperty(k); } };
    const untransform = () => { for (const n of travel) { n.el.style.transform = ''; n.el.style.transformOrigin = ''; if (n.radius) n.el.style.borderRadius = ''; if (n.shadow) n.el.style.boxShadow = ''; } };
    const finish = () => {
      unclip(); untransform();
      for (const e of enter) e.style.opacity = '';
      for (const f of fadeUp) f.el.style.opacity = '';
      layer.remove(); scope._morph = null;
      done && done();
    };
    render(0);
    const o = { v: 0 };
    // the clock starts on the first painted frame: the layout work above can make that frame slow, and an easing
    // that starts fast would otherwise skip ahead over it, a visible jump
    const tween = gsap.to(o, { v: 1, duration, ease, paused: true, onUpdate: () => render(o.v), onComplete: finish });
    requestAnimationFrame(() => { if (!tween._held && tween.progress() < 1) tween.play(); });
    // taken over by a newer morph: everything stands where it is seen, its ghosts keep fading out, and the
    // newer morph learns which pieces were still fading in and where the teaser's window was
    tween.stop = () => {
      tween._held = true; tween.kill(); untransform(); unclip(); scope._morph = null;
      for (const c of clips) if (c.win) { c.el._win = c.win; c.el._co = c.co; }
      gsap.to(layer, { opacity: 0, duration: T.quick, ease: 'none', onComplete: () => layer.remove() });
      return [...enter, ...fadeUp.map(f => f.el)].filter(el => el.style.opacity !== '');
    };
    scope._morph = tween;
    return tween;
  }

  // Wide/Narrow control: the pressed pill slides from one choice to the other.
  function initThumb(seg) {
    const t = d.createElement('span'); t.className = 'seg-thumb no-anim'; t.setAttribute('aria-hidden', 'true'); seg.prepend(t);
    const place = () => { const b = $('button[aria-pressed=true]', seg); if (b) { t.style.width = b.offsetWidth + 'px'; t.style.transform = `translateX(${b.offsetLeft}px)`; } };
    place(); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.remove('no-anim')));
    d.fonts && d.fonts.ready.then(place);
    return place;
  }

  /* Wide <-> Narrow. What moves where:
     - the card's look (shell: background, shadow, glow) resizes from the wide box to the narrow one;
     - every piece of the glance travels to its new place; the kit's narrow layout moves flags under
       names and muted values under labels, and the endpoints' target-bar column leaves where it was;
     - the sheet (Claude's answer) slides out from behind the shrinking card, its hidden height opens
       up and it settles as the panel; going wide it slides back and tucks behind the growing card;
     - a partly open compare layer hands off into that panel: its open window slides out of the card
       and widens to the panel while its text cross-fades into the panel's, and the handle glides back
       to the start; going wide the handle comes back out of the panel, the slider closed;
     - the page below follows the example's height. */
  function initWidth(ex) {
    const frame = $('.ex-frame', ex), stage = $('.ex-stage', ex), sheet = $('.ex-sheet', ex), shell = $('.ex-shell', ex);
    const card = $('.ex-card', ex), seg = $('.seg', ex), cmp = $('.cmp', ex), cmpLayer = $('.cmp-before', ex), layerText = $('.orig', cmpLayer), knob = $('.knob', ex);
    const place = initThumb(seg);
    const panelFits = () => getComputedStyle(sheet).display !== 'none';
    const fit = () => { stage.style.minHeight = frame.classList.contains('narrow') && panelFits() ? sheet.offsetHeight + 'px' : ''; };
    new ResizeObserver(() => { fit(); place(); }).observe(sheet);
    let running = null;
    $$('.seg button', ex).forEach(b => b.addEventListener('click', () => {
      const narrow = b.dataset.w === 'narrow';
      if (narrow === frame.classList.contains('narrow')) return;
      running && running.progress(1);
      $$('.seg button', ex).forEach(o => o.setAttribute('aria-pressed', o === b)); place();
      switchTo(narrow);
    }));
    function switchTo(narrow) {
      ex._build && ex._build.progress(1); ex._moreTween && ex._moreTween.progress(1); ex._tableTween && ex._tableTween.progress(1);
      // the one-time peek hint stops for good: the switch decides where the compare layer goes now
      ex.dataset.touched = '1';
      if (ex._peekTl) { const mid = ex._peekTl.isActive(); ex._peekTl.kill(); ex._peekTl = null; if (mid) ex._cmpReset(); }   // a hint caught mid-way isn't the reader's position
      const apply = () => {
        frame.classList.toggle('narrow', narrow); stage.classList.toggle('is-narrow', narrow); fit(); ex._fits && ex._fits();
        if (narrow && panelFits()) ex._cmpReset();       // the panel takes over from the compare layer
      };
      if (!G() || REDUCED) { apply(); place(); window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep(); return; }
      splitWords($('.cmp-after', ex)); ex.classList.add('morphing');
      const panel = panelFits(), pos = ex._cmpPos(), handoff = narrow && panel && pos > .5;
      const c0 = rectOf(card), h0 = stage.offsetHeight, k0 = rectOf(knob), l0 = rectOf(cmpLayer), o0 = rectOf($('.orig-h', cmpLayer));
      const sh = rectOf(sheet), sheetOrigin = rectOf($('.orig-h', sheet));
      if (panel) sheet.classList.add('moving');
      let c1, h1, k1, l1;
      if (handoff) sheet.style.zIndex = 2;   // the answer rides above the card while it leaves it
      running = ex._widthTween = morph(card, stage, () => {
        // the compare layer keeps its wide size and wrap while it travels, so its text doesn't jump
        if (handoff) Object.assign(cmpLayer.style, { left: '-10px', top: '-6px', right: 'auto', bottom: 'auto', width: l0.w + 'px', height: l0.h + 'px' });
        apply();
        // the example's final height; its minimum is only set once the move ends, so the height can travel
        h1 = narrow && panel ? Math.max(frame.offsetHeight, sheet.offsetHeight) : frame.offsetHeight;
        stage.style.minHeight = ''; stage.style.height = h0 + 'px';
        c1 = rectOf(card); k1 = rectOf(knob); l1 = rectOf(cmpLayer);
      }, {
        extra: v => {
          stage.style.height = lerp(h0, h1, v) + 'px';
          const x = lerp(c0.x, c1.x, v), y = lerp(c0.y, c1.y, v);
          Object.assign(shell.style, { left: x - c1.x + 'px', top: y - c1.y + 'px', width: lerp(c0.w, c1.w, v) + 'px', height: lerp(c0.h, c1.h, v) + 'px' });
          if (!panel) return;
          if (handoff) {
            // the open window of the compare layer travels to the panel's place and size
            const W0 = { x: l0.x, y: l0.y, w: l0.w * pos / 100, h: l0.h }, W = { x: lerp(W0.x, sh.x, v), y: lerp(W0.y, sh.y, v), w: lerp(W0.w, sh.w, v), h: lerp(W0.h, sh.h, v) };
            const dx = (o0.x - sheetOrigin.x) * (1 - v), dy = (o0.y - sheetOrigin.y) * (1 - v);
            const sx = sh.x + dx, sy = sh.y + dy;
            sheet.style.transform = `translate(${dx}px,${dy}px)`;
            sheet.style.clipPath = `inset(${Math.max(0, W.y - sy)}px ${Math.max(0, sx + sh.w - W.x - W.w)}px ${Math.max(0, sy + sh.h - W.y - W.h)}px ${Math.max(0, W.x - sx)}px round ${22 * v}px)`;
            // a clean hand-over: the layer's text fades out on its solid background, then the panel (on top)
            // fades in, then the layer steps away; never two texts, never the glance showing through
            sheet.style.opacity = clamp01((v - .12) / .16);
            layerText.style.opacity = 1 - clamp01(v / .14);
            // the layer's text rides along with the sheet's, so both read as one block changing its wrap
            const lxx = (sheetOrigin.x + dx) - o0.x + l0.x - l1.x, lyy = (sheetOrigin.y + dy) - o0.y + l0.y - l1.y;
            cmpLayer.style.transform = `translate(${lxx}px,${lyy}px)`;
            const lsx = l1.x + lxx, lsy = l1.y + lyy;
            cmpLayer.style.clipPath = `inset(${Math.max(0, W.y - lsy)}px ${Math.max(0, lsx + l1.w - W.x - W.w)}px ${Math.max(0, lsy + l1.h - W.y - W.h)}px ${Math.max(0, W.x - lsx)}px)`;
            cmpLayer.style.opacity = v < .3 ? 1 : 0;
            knob.style.transform = `translate(${lerp(k0.x, k1.x, v) - k1.x}px,${lerp(k0.y, k1.y, v) - k1.y}px)`;
            knob.style.opacity = 1 - clamp01((v - .55) / .45);
            return;
          }
          // tucked behind the card (wide) <-> the panel (narrow); its hidden height opens as it comes out
          const t = narrow ? 1 - v : v, cardH = narrow ? c0.h : c1.h, hidden = Math.max(0, sh.h - (cardH - 28));
          sheet.style.transform = `translate(${32 * t}px,0) scale(${1 - .04 * t})`;
          sheet.style.clipPath = `inset(0 0 ${hidden * t}px 0 round 22px)`;
          if (narrow) {   // the closed handle rides with the card's edge and fades there
            knob.style.transform = `translate(${lerp(k0.x, k1.x, v) - k1.x}px,${lerp(k0.y, k1.y, v) - k1.y}px)`;
            knob.style.opacity = 1 - clamp01(v / .4);
          }
          else {   // the handle comes back out of the panel to the card's edge, closed
            knob.style.transform = `translate(${lerp(sh.x + sh.w - 17 - k1.x, 0, v)}px,0)`;
            knob.style.opacity = clamp01((v - .35) / .5);
          }
        },
        done: () => {
          for (const el of [sheet, cmpLayer, knob]) { el.style.transform = ''; el.style.clipPath = ''; el.style.opacity = ''; }
          layerText.style.opacity = '';
          Object.assign(cmpLayer.style, { left: '', top: '', right: '', bottom: '', width: '', height: '' }); sheet.style.zIndex = '';
          Object.assign(shell.style, { left: '', top: '', width: '', height: '' });
          stage.style.height = ''; fit(); sheet.classList.remove('moving'); ex.classList.remove('morphing'); running = ex._widthTween = null;
          window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep();
        }
      });
    }
  }

  const refresh = () => { window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep(); };

  /* A button whose label changes keeps its width: labelBox lays every label it can show in one grid cell (the
     unused ones hidden), so nothing around it moves. The swap answers on the first frame: the old words lift 6px
     and fade while the new ones rise 6px into place, all inside a quarter second. */
  function labelBox(el, labels) {
    if ($('.lbl-box', el)) return;
    const box = d.createElement('span'), lbl = d.createElement('span');
    box.className = 'lbl-box'; lbl.className = 'lbl'; lbl.textContent = el.textContent.trim(); box.append(lbl);
    for (const t of new Set([lbl.textContent, ...labels])) { const s = d.createElement('span'); s.className = 'lbl-sz'; s.setAttribute('aria-hidden', 'true'); s.textContent = t; box.append(s); }
    el.textContent = ''; el.append(box);
  }
  function relabel(btn, text, own, still) {
    const host = own || btn; labelBox(host, [text]);
    const box = $('.lbl-box', host), lbl = $('.lbl', box);
    if (!$$('.lbl-sz', box).some(s => s.textContent === text)) { const s = d.createElement('span'); s.className = 'lbl-sz'; s.setAttribute('aria-hidden', 'true'); s.textContent = text; box.append(s); }
    if (lbl.textContent === text) return;
    $$('.lbl-old', box).forEach(n => n.remove());
    if (still || !G() || REDUCED) { lbl.textContent = text; return; }
    gsap.killTweensOf(lbl);
    const ghost = lbl.cloneNode(true); ghost.className = 'lbl-old'; ghost.setAttribute('aria-hidden', 'true'); box.append(ghost);
    lbl.textContent = text;   // the new words are in the button at once, for readers and assistive tech
    gsap.fromTo(ghost, { opacity: 1, y: 0 }, { opacity: 0, y: -6, duration: T.quick, ease: EASE, onComplete: () => ghost.remove() });
    gsap.fromTo(lbl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: T.ui, delay: .06, ease: EASE, clearProps: 'transform,opacity' });
  }

  /* Show all / Show fewer. What moves where: the teaser's height travels to the table's full height, so
     the rows below are uncovered as it grows, and its bottom fade rides the moving edge, leaving only as
     it reaches the end. Collapsing reverses it while the page stays anchored to the button, so the table
     folds up toward the pointer instead of throwing the button out of view. The label changes in place. */
  function initMore(ex) {
    const more = $('.more', ex); if (!more) return;
    const pic = $('.pic', ex), label = more.textContent.trim(), CLAMP = 860;
    labelBox(more, [label, 'Show fewer']);
    // rows that fit the teaser (a filter can leave only a few) hide nothing: no fade, no button
    ex._fits = () => pic.classList.toggle('fits', pic.scrollHeight <= CLAMP + 1);
    ex._fits();
    more.addEventListener('click', () => {
      ex._moreTween && ex._moreTween.progress(1); ex._tableTween && ex._tableTween.progress(1); ex._widthTween && ex._widthTween.progress(1);
      const open = !pic.classList.contains('open');
      more.setAttribute('aria-expanded', open); relabel(more, open ? 'Show fewer' : label);
      if (!G() || REDUCED) { pic.classList.toggle('open', open); refresh(); return; }
      const h0 = pic.offsetHeight, root = d.documentElement;
      pic.classList.add('fading'); pic.style.setProperty('--fo', open ? 1 : 0);
      Object.assign(pic.style, { overflow: 'hidden', maxHeight: 'none', height: h0 + 'px' });
      pic.classList.toggle('open', open);
      const h1 = open ? pic.scrollHeight : Math.min(CLAMP, pic.scrollHeight);
      const anchor = open ? null : more.getBoundingClientRect().top;
      root.style.overflowAnchor = 'none';   // this tween keeps the button in place itself
      const o = { v: 0 };
      const mt = ex._moreTween = gsap.to(o, { v: 1, duration: Math.min(.7, T.ui + Math.abs(h1 - h0) / 3000), ease: EASE, paused: true,
        onUpdate: () => {
          pic.style.height = lerp(h0, h1, o.v) + 'px';
          pic.style.setProperty('--fo', open ? 1 - clamp01((o.v - .7) / .3) : clamp01(o.v / .3));
          if (anchor !== null) { const dy = more.getBoundingClientRect().top - anchor; if (Math.abs(dy) > .5) scrollBy({ top: dy, behavior: 'instant' }); }
        },
        onComplete: () => {
          Object.assign(pic.style, { overflow: '', maxHeight: '', height: '' }); pic.style.removeProperty('--fo');
          pic.classList.remove('fading'); root.style.overflowAnchor = ''; ex._moreTween = null; refresh();
        } });
      requestAnimationFrame(() => { if (mt.progress() < 1) mt.play(); });
    });
  }

  /* Live tables: filter chips, search and sort. The kit's own script does the work; the site replays each
     of its events inside a morph, so the kit stays exactly as glance ships it. What moves where:
     - rows that stay travel to their new places (a sort moves every row; columns that change width morph);
     - rows that leave fade where they stood while the rest close up; rows that come back fade in at
       their places while the rest make room;
     - the card's background, its edge and the page below follow the table's height; rows are revealed
       or covered at that moving edge;
     - the pressed chip's highlight slides from the old chip to the new one, and its label's weight and
       colour morph; the count runs from the old number to the new one;
     - typing in search takes over from wherever the rows are mid-move. */
  function initTables(ex) {
    const after = $('.cmp-after', ex), views = $$('[data-gl-view]', after || ex).filter(v => $('.gl-tb .gl-row', v));
    if (!after || !views.length) return;
    const stage = $('.ex-stage', ex), shell = $('.ex-shell', ex), card = $('.ex-card', ex);
    const thumbs = new Map();
    for (const seg of $$('.gl-ctl', after).filter(s => $('.gl-chip', s))) {
      for (const c of $$('.gl-chip', seg)) c.dataset.bold = c.textContent.trim();   // reserves its bold width (site.css)
      const t = d.createElement('span'); t.className = 'chip-thumb'; t.setAttribute('aria-hidden', 'true');
      ($('.gl-chip[aria-pressed=true]', seg) || $('.gl-chip', seg)).append(t); seg.classList.add('has-thumb'); thumbs.set(seg, t);
    }
    const slide = seg => {
      const t = thumbs.get(seg), to = $('.gl-chip[aria-pressed=true]', seg);
      if (!t || !to || t.parentElement === to) return;
      const r0 = t.getBoundingClientRect(); gsap.killTweensOf(t._o || {}); t.style.cssText = ''; to.append(t);
      const o = t._o = { v: 0 };
      gsap.to(o, { v: 1, duration: T.ui, ease: EASE,
        onUpdate: () => {   // the chip is measured live: its label's weight is changing under the thumb
          const c = to.getBoundingClientRect();
          t.style.cssText = `width:${lerp(r0.width, c.width, o.v)}px;height:${lerp(r0.height, c.height, o.v)}px;transform:translate(${lerp(r0.left, c.left, o.v) - c.left}px,${lerp(r0.top, c.top, o.v) - c.top}px)`;
        },
        onComplete: () => { t.style.cssText = ''; } });
    };
    // the sort arrow: one piece per table (the kit's drawn arrow is hidden on the site) that travels from the
    // old sorted header to the new one and turns over when the direction flips
    const arrows = new Map();
    for (const v of views) if ($('.gl-row.h [data-k]', v)) {
      const ar = d.createElement('span'); ar.className = 'sort-ar'; ar.setAttribute('aria-hidden', 'true'); ar.innerHTML = ' <i>↓</i>';
      v.classList.add('has-sortar'); arrows.set(v, ar);
    }
    const glide = (v, animate) => {
      const ar = arrows.get(v); if (!ar) return;
      const th = $('.gl-row.h [aria-sort]', v), btn = th && $('button', th);
      if (!btn) { ar.remove(); return; }
      const i = $('i', ar), from = ar.isConnected && ar.parentElement !== btn ? ar.getBoundingClientRect() : null, fresh = !ar.isConnected;
      gsap.killTweensOf(ar._o || {}); ar.style.transform = ''; ar.style.opacity = '';
      if (ar.parentElement !== btn) btn.append(ar);
      i.style.transform = th.getAttribute('aria-sort') === 'ascending' ? 'rotate(180deg)' : '';
      if (!animate || !G() || REDUCED) return;
      const off = ar.getBoundingClientRect(), b0 = btn.getBoundingClientRect(), dx = off.left - b0.left, dy = off.top - b0.top, o = ar._o = { v: 0 };
      gsap.to(o, { v: 1, duration: T.ui, ease: EASE,
        onUpdate: () => {   // the header button may itself be moving: aim at where the arrow sits in it now
          const b = btn.getBoundingClientRect(), nx = b.left + dx, ny = b.top + dy;
          if (from) ar.style.transform = `translate(${lerp(from.left, nx, o.v) - nx}px,${lerp(from.top, ny, o.v) - ny}px)`;
          else if (fresh) { ar.style.opacity = o.v; ar.style.transform = `translateX(${-6 * (1 - o.v)}px)`; }
        },
        onComplete: () => { ar.style.transform = ''; ar.style.opacity = ''; } });
    };
    for (const v of arrows.keys()) glide(v, false);
    let pass = false;
    const run = (view, target, event, duration) => {
      ex._widthTween && ex._widthTween.progress(1); ex._moreTween && ex._moreTween.progress(1); ex._build && ex._build.progress(1);
      splitWords(after); ex.classList.add('tmorph');
      const cnt = $('.gl-count', view), seg = target.closest('.gl-ctl');
      const h0 = stage.getBoundingClientRect().height, H0 = shell.getBoundingClientRect().height, k0 = cnt ? parseInt(cnt.textContent, 10) : 0;
      let h1, H1, k1, final = '';
      const ot = target.matches('.gl-more') ? ($('.lbl', target) || target).textContent.trim() : null;   // its visible words only
      ex._tableTween = morph(after, card, () => {
        pass = true; target.dispatchEvent(event()); pass = false;
        // the table's own Show all / Show fewer: the kit swaps its words; here they change in place, at one width
        if (ot !== null) { const nt = target.textContent; target.textContent = ot; relabel(target, nt); }
        ex._fits && ex._fits();
        if (cnt) { final = cnt.textContent; k1 = parseInt(final, 10); }
        stage.style.height = ''; h1 = stage.offsetHeight; H1 = card.offsetHeight; stage.style.height = h0 + 'px';
        if (seg) slide(seg);
        glide(view, true);
      }, { duration, skip: '.gl-count, .gl-chip, .gl-more',
        extra: v => {
          stage.style.height = lerp(h0, h1, v) + 'px';
          const H = lerp(H0, H1, v);
          shell.style.height = H + 'px';
          card.style.clipPath = `inset(-60px -60px ${H1 - H}px -60px)`;
          if (cnt && k0 !== k1 && !isNaN(k0)) cnt.textContent = final.replace(/^\d+/, Math.round(lerp(k0, k1, v)));
        },
        done: () => {
          stage.style.height = ''; shell.style.height = ''; card.style.clipPath = ''; if (cnt) cnt.textContent = final;
          ex.classList.remove('tmorph'); ex._tableTween = null; refresh();
        } });
    };
    const still = () => !G() || REDUCED;
    for (const v of views) {
      // caught on the way down, before the kit's own listeners, and replayed inside the morph
      v.addEventListener('click', e => {
        const t = e.target.closest('.gl-chip, .gl-row.h button, .gl-more');
        if (!t || pass || still()) return;
        e.stopPropagation(); run(v, t, () => new MouseEvent('click', { bubbles: true, cancelable: true }), T.move);
      }, true);
      v.addEventListener('input', e => {
        if (pass || still() || !e.target.matches('.gl-find')) return;
        e.stopPropagation(); run(v, e.target, () => new Event('input', { bubbles: true }), T.ui);
      }, true);
      // without motion the kit acts alone; the teaser's fade and button still follow what's left
      const settle = () => { if (still()) { ex._fits && ex._fits(); for (const seg of thumbs.keys()) { const on = $('.gl-chip[aria-pressed=true]', seg); on && on.append(thumbs.get(seg)); } glide(v, false); refresh(); } };
      v.addEventListener('click', settle); v.addEventListener('input', settle);
    }
  }

  // Every number in the picture that appears in the original answer gets a tooltip with that line.
  const tip = $('#src-tip'), tipLine = $('.src-line', tip);
  function lineText(b) { return b.tagName === 'TR' ? $$('th,td', b).map(c => c.textContent.trim()).join(' · ') : (b.tagName === 'LI' ? [...b.childNodes].filter(n => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName))).map(n => n.textContent).join('') : b.textContent).replace(/\s+/g, ' ').trim(); }
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const TOK = /[+\-−]?\$?\d[\d,.]*(?:\s?(?:%|ms|s|kb|mb|gb|tb|×|x)\b)?/gi;
  const ownText = el => [...el.childNodes].filter(n => !(n.nodeType === 1 && n.matches('small, .gl-mk'))).map(n => n.textContent).join('');
  function initSources(ex) {
    // each line also knows its twin in the side panel's copy of the answer, to light it up in narrow mode
    const LINES = '.said :is(p, li, tr, h1, h2, h3)', mainLines = $$('.ex-sheet ' + LINES, ex), mainRows = $$('.ex-sheet .said tr', ex);
    const blocks = $$('.cmp-before ' + LINES, ex).map((b, i) => { const t = lineText(b); return { t, n: norm(t), main: mainLines[i] }; }).filter(b => b.n);
    // table cells: found by their row's name, then by the cell's own text in that row of the original
    const srcRows = $$('.cmp-before .said tr', ex).map((tr, i) => Object.assign($$('th,td', tr).map(c => c.textContent.trim()), { main: mainRows[i] }));
    const label = c => norm(c.firstChild ? c.firstChild.textContent : c.textContent);
    for (const tr of $$('.cmp-after .gl-tb .gl-row:not(.h)', ex)) {
      const cells = [...tr.children], row = srcRows.find(r => norm(r[0]) === label(cells[0])); if (!row) continue;
      cells.forEach((td, i) => {
        if (td.classList.contains('gc')) return;
        const t = i === 0 ? label(td) : norm(td.textContent);
        const j = norm(row[i] || '') === t ? i : row.findIndex(c => norm(c) === t); if (j < 0) return;
        td.classList.add('has-src'); td._src = { rows: [{ cells: row, mark: j }], mains: [row.main] };
      });
    }
    // anything else with a number in it: the line, or two, of the original that hold its numbers
    const cands = $$('.cmp-after .gl :is(div, span, b)', ex).filter(el =>
      !el.closest('.sr-only, .gl-row.h, button, .gl-ctl, .gl-count, .has-src') && !$$(':scope > :is(div, td)', el).length && /\d/.test(ownText(el)));
    for (const el of cands) {
      const own = norm(ownText(el));
      const toks = [...new Set((own.match(TOK) || []).map(t => t.trim()))];
      if (!toks.length) continue;
      let lines = [];
      const whole = blocks.find(b => b.n.includes(own));
      if (whole) lines = [whole];
      else {
        let left = toks.slice();
        while (left.length && lines.length < 2) {
          let best = null, bestN = 0;
          for (const b of blocks) { const n = left.filter(t => b.n.includes(t)).length; if (n > bestN) { best = b; bestN = n; } }
          if (!best) break;
          lines.push(best); left = left.filter(t => !best.n.includes(t));
        }
      }
      if (!lines.length) continue;
      el.classList.add('has-src'); el._src = { lines: lines.map(b => b.t), toks, mains: lines.map(b => b.main) };
    }
    ex.addEventListener('pointerover', e => { const el = e.target.closest('.has-src'); if (el && ex.contains(el)) showTip(el); });
    ex.addEventListener('pointerout', e => { const el = e.target.closest('.has-src'); if (el && !el.contains(e.relatedTarget)) hideTip(el); });
  }
  /* The tooltip grows out of the value it describes and shrinks back into it. Moving to a neighbouring value,
     the old tooltip shrinks into its value (from wherever it was) while the new one grows from the next. */
  let tipFor = null, litMain = [], tipHide = 0;
  function showTip(el) {
    const cs = getComputedStyle(tip), op = tip.hidden ? 0 : +cs.opacity;
    if (op > .02) {
      const g = tip.cloneNode(true); g.removeAttribute('id'); g.removeAttribute('role'); g.setAttribute('aria-hidden', 'true');
      g.classList.remove('on'); g.style.transition = 'none'; tip.before(g);   // behind the new one
      g.animate([{ opacity: op, transform: cs.transform }, { opacity: 0, transform: 'scale(.86)' }], { duration: 60 + 160 * op, easing: 'ease-in', fill: 'forwards' }).onfinish = () => g.remove();
    }
    clearTimeout(tipHide);
    tipFor && tipFor.classList.remove('lit'); tipFor = el; el.classList.add('lit');
    const src = el._src;
    let html;
    if (src.rows) html = src.rows.map(r => r.cells.map((c, k) => k === r.mark ? `<mark>${esc(c)}</mark>` : esc(c)).join(' · ')).join('<br>');
    else html = src.lines.map(line => {
      let h = esc(line);
      for (const t of src.toks) {
        const re = new RegExp('(^|[^\\d])(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[-−]').replace(/\s/g, '\\s?') + ')(?!\\d)', 'i');
        h = h.replace(re, (m, a, b) => `${a}<mark>${b}</mark>`);
      }
      return h;
    }).join('<br><br>');
    tipLine.innerHTML = html; tip.hidden = false;
    // in narrow mode Claude's answer sits beside the glance, in full: light the same line there
    const stage = el.closest('.ex-stage'), panel = stage && $('.ex-sheet', stage);
    if (panel && stage.classList.contains('is-narrow') && getComputedStyle(panel).display !== 'none') {
      litMain = (src.mains || []).filter(Boolean);
      litMain.forEach(m => m.classList.add('src-lit'));
    }
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), innerWidth - tw - 12), y = r.top - th - 10;
    const below = y < 70; if (below) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    // grow from the point of the value it describes
    tip.style.setProperty('--ox', r.left + r.width / 2 - x + 'px'); tip.style.setProperty('--oy', below ? '-10px' : th + 10 + 'px');
    tip.style.transition = 'none'; tip.classList.remove('on'); void tip.offsetWidth; tip.style.transition = ''; tip.classList.add('on');
  }
  function hideTip(el) {
    if (tipFor !== el) return;
    el.classList.remove('lit'); tip.classList.remove('on'); tipFor = null;
    clearTimeout(tipHide); tipHide = setTimeout(() => { if (!tip.classList.contains('on')) tip.hidden = true; }, 260);
    litMain.forEach(m => m.classList.remove('src-lit')); litMain = [];
  }
  addEventListener('scroll', () => tipFor && hideTip(tipFor), { passive: true });

  // The build: the sentence, then the picture assembles itself, red settles last. Bars, columns and gauges grow
  // from their baselines (the part worth watching); everything else arrives quickly, and no group of rows or
  // cells takes longer than a third of a second to arrive, however many there are.
  const spread = (n, each = .04, cap = .3) => n > 1 ? Math.min(each, cap / (n - 1)) : 0;
  function prepBuild(ex) {
    // clearProps: once built, nothing keeps a leftover transform, so later moves start from clean boxes
    const after = $('.cmp-after', ex), tl = gsap.timeline({ paused: true, defaults: { force3D: false, clearProps: 'transform', ease: EASE } });
    const sent = $('.g-sent', after), secs = $$('.gl > .gl-card, .gl > .gl-hd, .gl > .gl-bento', after);
    tl.from(sent, { autoAlpha: 0, y: 10, duration: T.show }, 0);
    let t = .15;
    const grow = (els, at, from = '0 50%') => { if (els.length) tl.from(els, { scaleX: 0, transformOrigin: from, duration: .6, stagger: spread(els.length, .05) }, at); };
    for (const sec of secs) {
      if (sec.matches('.gl-hd')) { tl.from(sec, { autoAlpha: 0, y: 8, duration: T.show }, t); t += .1; continue; }
      tl.from(sec, { autoAlpha: 0, y: 12, duration: T.show }, t);
      const hd = $(':scope > .gl-hd', sec); if (hd) tl.from(hd, { autoAlpha: 0, y: 6, duration: T.show }, t + .04);
      const ctl = $('.gl-ctl, .gl-seg', sec); if (ctl) tl.from(ctl, { autoAlpha: 0, y: 6, duration: T.show }, t + .08);
      t += .12;
      // headline figures: each rises, its number counts up, a gauge under it fills
      const figs = $$('.gl-fig', sec);
      if (figs.length) {
        tl.from(figs, { autoAlpha: 0, y: 10, duration: T.show, stagger: spread(figs.length, .06) }, t);
        figs.forEach((f, i) => { const v = $('.gl-v', f); if (v) countUp(tl, v, t + .05 + i * spread(figs.length, .06)); });
        grow($$('.gl-fig .gl-ga > i', sec), t + .15);
        t += .35;
      }
      // the comparison: the pick lands first, the others right after it
      const tiles = $$('.gl-pick, .gl-alt', sec);
      if (tiles.length) {
        tl.from(tiles, { autoAlpha: 0, y: 12, duration: T.show, stagger: spread(tiles.length, .08) }, t);
        tiles.forEach((tile, i) => { const p = $('.gl-price b, .gl-pr2 b', tile); if (p) countUp(tl, p, t + .1 + i * spread(tiles.length, .08)); });
        t += .4;
      }
      // columns grow from the baseline; their values count up in the row under them
      const cols = $$('.gl-col > i', sec);
      if (cols.length) {
        const each = spread(cols.length, .05);
        tl.from(cols, { scaleY: 0, transformOrigin: '50% 100%', duration: .7, stagger: each }, t);
        $$('.gl-axis b', sec).forEach((b, i) => countUp(tl, b, t + .04 + i * each));
        t += .6;
      }
      // a line draws itself from left to right, then its points and headline arrive
      const plot = $('.gl-plot', sec);
      if (plot) {
        tl.fromTo($('svg', plot), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .8, ease: EASE }, t);
        tl.from($$('.gl-pt, .gl-lab', plot), { autoAlpha: 0, duration: T.ui, stagger: spread($$('.gl-pt, .gl-lab', plot).length) }, t + .25);
        if (!cols.length) $$('.gl-axis b', sec).forEach((b, i) => countUp(tl, b, t + .05 + i * .05));
        const head = $('.gl-head b', sec); if (head) countUp(tl, head, t + .4);
        t += .7;
      }
      // a bridge: steps arrive together, their bars grow
      const br = $('.gl-br', sec);
      if (br) {
        tl.from($$('.n, .v', br), { autoAlpha: 0, duration: T.ui, stagger: spread($$('.n, .v', br).length, .02) }, t);
        grow($$('.t > i', br), t + .05);
        t += .5;
      }
      // bars, diverging bars and the split bar grow out of their baselines
      for (const bars of $$('.gl-bars', sec)) {
        tl.from($$('.n, .v, .gl-zoom', bars), { autoAlpha: 0, duration: T.ui, stagger: spread($$('.n, .v, .gl-zoom', bars).length, .02) }, t);
        grow($$('.t > i', bars), t + .05);
        $$('.v', bars).forEach((v, i) => countUp(tl, v, t + .05 + i * .05));
        t += .5;
      }
      const dv = $('.gl-dv', sec);
      if (dv) {
        tl.from($$('.n, .v', dv), { autoAlpha: 0, duration: T.ui, stagger: spread($$('.n, .v', dv).length, .02) }, t);
        grow($$('.l i', dv), t + .05, '100% 50%'); grow($$('.r i', dv), t + .05);
        t += .5;
      }
      const split = $('.gl-split', sec);
      if (split) { tl.fromTo(split, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: EASE }, t); t += .25; }
      // tables: a status grid fills in a quick wave; other tables rise row by row while their gauges grow
      const tb = $('.gl-tb', sec);
      if (tb) {
        const head = $(':scope > .gl-row.h', tb), rows = $$(':scope > .gl-row:not(.h), :scope > .gl-gh', tb).filter(r => !r.hidden).slice(0, 18);
        if (head) tl.from(head, { autoAlpha: 0, duration: T.ui }, t);
        if ($('.gl-cell', tb)) {
          const grid = rows.filter(r => r.matches('.gl-row')), cells = grid.flatMap(r => [...r.children]), ncol = grid[0] ? grid[0].children.length : 1;
          tl.from(cells, { autoAlpha: 0, y: 4, duration: T.ui, stagger: { grid: [grid.length, ncol], from: 'start', amount: .45 } }, t + .05);
          t += .6;
        } else {
          tl.from(rows, { autoAlpha: 0, y: 8, duration: T.show, stagger: spread(rows.length, .03, .35) }, t + .04);
          grow($$('.gl-ga > i, .gl-spk', tb).filter(e => !e.closest('[hidden]')).slice(0, 40), t + .12);
          t += .6;
        }
      }
      // values past a line settle red last, together
      const reds = $$('.x, .gl-cell.fail', sec).filter(e => !e.closest('.gl-hd'));
      reds.forEach(c => c.classList.add('pending'));
      reds.forEach((c, i) => tl.add(() => c.classList.remove('pending'), t + i * spread(reds.length, .04, .2)));
      if (reds.length) t += .25;
    }
    // notes arrive next to what they describe, all at once
    tl.from($$('.gl-nm small, .gl-n', after), { autoAlpha: 0, duration: T.ui }, Math.max(.4, t - .3));
    tl.add(() => ex._peek && ex._peek(), t + .2);
    return tl;
  }

  function initExamples() {
    for (const ex of $$('[data-ex]')) {
      initCompare(ex); initWidth(ex); initMore(ex); initTables(ex); initSources(ex);
      if (G() && !REDUCED) { const tl = prepBuild(ex); ex._build = tl; builds.push({ card: $('.ex-card', ex), tl }); }
    }
  }

  /* ---------------- reveals ----------------
     One check, run on every scroll, load, resize and anchor jump: whatever is now above the fold
     appears at once, whatever is coming into view animates in. Nothing waits on a scroll event
     that a jump can skip, so no text or picture is ever left hidden. */
  const texts = [], builds = [];
  // 2D moves only (force3D off), so text stays crisp the whole way instead of blurring and snapping
  const show = (els, animate) => gsap.to(els, { autoAlpha: 1, y: 0, duration: animate ? T.show : 0, stagger: animate ? Math.min(.05, .3 / Math.max(1, els.length - 1)) : 0,
    ease: EASE, overwrite: true, force3D: false });
  function sweep() {
    const vh = innerHeight, past = [], now = [];
    for (let i = 0; i < texts.length;) {
      const r = texts[i].getBoundingClientRect();
      if (r.bottom < 0) past.push(texts.splice(i, 1)[0]);
      else if (r.top < vh * .9) now.push(texts.splice(i, 1)[0]);
      else i++;
    }
    if (past.length) show(past, false);
    if (now.length) show(now, true);
    for (let i = 0; i < builds.length;) {
      const b = builds[i], r = b.card.getBoundingClientRect();
      if (r.bottom < 0) { b.tl.progress(1); builds.splice(i, 1); }
      else if (r.top < vh * .78) { b.tl.play(); builds.splice(i, 1); }
      else i++;
    }
  }
  let sweepRaf = 0;
  const queueSweep = () => { if (!sweepRaf) sweepRaf = requestAnimationFrame(() => { sweepRaf = 0; sweep(); }); };
  function initReveals() {
    if (!texts.length && !builds.length) return;
    sweep();
    addEventListener('scroll', queueSweep, { passive: true });
    for (const ev of ['resize', 'load', 'hashchange']) addEventListener(ev, () => setTimeout(sweep, 0));
  }

  /* ---------------- section entrances ---------------- */
  function initEntrances() {
    if (!G() || REDUCED) return;
    const groups = [['.sec-head > *'], ['.group > h3'], ['.ex-text > *'], ['.bt-head > *'], ['.bt-panel', '.bt-note'], ['.install-in > *'], ['.cmd-text > *', '.cmd-table tr'], ['.dataviz > h2', '.statement', '.dv-list li', '.dv-end'],
      ['.rd-text > *', '.rd-fig'], ['.credits h2', '.cr-grid p'], ['.foot-in']];
    for (const sels of groups) {
      const els = sels.flatMap(s => $$(s)); if (!els.length) continue;
      gsap.set(els, { autoAlpha: 0, y: 12, force3D: false });
      texts.push(...els);
    }
  }

  /* ---------------- small controls ---------------- */
  /* Copy and the colour-vision toggle: their labels change in place (relabel). The colour-blindness view
     doesn't snap on: its filter starts as no change at all and its colour matrix eases to the deutan one
     (and back, before the filter is taken off). */
  function initControls() {
    $$('[data-copy]').forEach(b => labelBox(b, ['Copy', 'Copied', 'Selected']));
    $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const text = $('#' + b.dataset.copy).textContent;
      try { await navigator.clipboard.writeText(text); relabel(b, 'Copied'); } catch (e) { relabel(b, 'Selected'); getSelection().selectAllChildren($('#' + b.dataset.copy)); }
      clearTimeout(b._t); b._t = setTimeout(() => relabel(b, 'Copy'), 1800);
    }));
    const cvd = $('.cvd-toggle'), fig = $('.rd-fig'), mat = $('#deutan feColorMatrix');
    const DEUT = mat && mat.getAttribute('values'), SAME = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0';
    let on = false;
    cvd && labelBox(cvd, ['See it with red-green color blindness', 'Back to full color vision']);
    cvd && cvd.addEventListener('click', () => {
      on = !on;
      cvd.setAttribute('aria-pressed', on);
      relabel(cvd, on ? 'Back to full color vision' : 'See it with red-green color blindness');
      if (!mat || !G() || REDUCED) { fig.classList.toggle('cvd', on); return; }
      gsap.killTweensOf(mat);
      if (on) {
        if (!fig.classList.contains('cvd')) { mat.setAttribute('values', SAME); fig.classList.add('cvd'); }
        gsap.to(mat, { attr: { values: DEUT }, duration: T.move, ease: EASE });
      } else gsap.to(mat, { attr: { values: SAME }, duration: T.move, ease: EASE, onComplete: () => { fig.classList.remove('cvd'); mat.setAttribute('values', DEUT); } });
    });
  }

  function start() {
    if (G() && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    initHero(); initExamples(); initEntrances(); initControls(); initReveals();
    root.classList.add('rv-ready');   // every start state is set; lift the first-paint hiding in the same frame
    window.glanceSweep = sweep;       // lets a test drive the reveal check without scrolling
    if (G() && window.ScrollTrigger && d.fonts) d.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();

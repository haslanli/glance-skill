/* glance site: the hero, the scroll builds and every control around the pictures.
   The pictures themselves are kit HTML; kit.js wires their sort, filter and search. */
(() => {
  const d = document, root = d.documentElement;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const G = () => typeof window.gsap !== 'undefined';
  const $ = (s, el = d) => el.querySelector(s), $$ = (s, el = d) => [...el.querySelectorAll(s)];

  /* ---------------- theme ---------------- */
  const themeBtn = $('#theme'), themeLabel = $('.theme-l');
  const mq = matchMedia('(prefers-color-scheme: dark)');
  let saved = null; try { saved = localStorage.getItem('glance-theme'); } catch (e) {}
  const applyTheme = () => {
    root.dataset.theme = saved || (mq.matches ? 'dark' : 'light');
    if (themeLabel) themeLabel.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark';
  };
  applyTheme(); mq.addEventListener('change', applyTheme);
  themeBtn && themeBtn.addEventListener('click', () => {
    saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('glance-theme', saved); } catch (e) {}
    applyTheme();
  });

  /* ---------------- helpers ---------------- */
  const norm = s => s.replace(/[\u00a0\u2009\u202f]/g, ' ').replace(/−/g, '-').replace(/\s+/g, ' ').replace(/\s%/g, '%').trim().toLowerCase();
  const NUM = /([+\-−]?)(\$?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?/g;
  // Count every number in el up to its value (from 0, or from the previous step in a before → after row).
  function countUp(tl, el, at, steps) {
    const nodes = [], walker = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('.gl-q,.gl-note,.gl-flag,.gl-tech,.why') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
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
    tl.to(o, { p: 1, duration: .9, ease: 'power2.out', onUpdate: () => render(o.p),
      onComplete: () => { nodes.forEach(nd => nd.data = orig.get(nd)); el.style.minWidth = ''; } }, at);
  }

  /* ---------------- hero ---------------- */
  const FACTS = [['$2,110', 'sep'], ['$4,760', 'oct'], ['2.25×', 'x'], ['Two Terraform changes', 'tf'], ['95%', 'pct'],
    ['NAT Gateway', 'nat'], ['+$2,130', 'natv'], ['CloudWatch', 'cw'], ['+$380', 'cwv'], ['Other', 'oth'], ['+$95', 'othv'],
    ['EC2 / RDS / S3', 'ec2'], ['+$45', 'ec2v']];
  const ORDER = ['sep', 'oct', 'x', 'tf', 'pct', 'sepv', 'nat', 'natv', 'cw', 'cwv', 'oth', 'othv', 'ec2', 'ec2v', 'octv'];
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
    const pairs = { nat: 'NAT Gateway', cw: 'CloudWatch', oth: 'Other', ec2: 'EC2 / RDS / S3' };
    for (const [k, text] of Object.entries(pairs)) {
      const n = $$('.gl-br .n', card).find(e => e.firstChild && e.firstChild.textContent.trim() === text);
      if (n && !$(`[data-k="${k}"]`, card)) { const s = d.createElement('span'); s.textContent = n.firstChild.textContent; s.dataset.k = k; n.replaceChild(s, n.firstChild); }
    }
    const vals = { natv: '+$2,130', cwv: '+$380', othv: '+$95', ec2v: '+$45', sepv: '$2,110', octv: '$4,760' };
    for (const [k, text] of Object.entries(vals)) { const v = $$('.gl-br .v', card).find(e => e.textContent.trim() === text); if (v) v.dataset.k = k; }
    // the sentence's own words, so they can write themselves in around the facts
    const sent = $('.gsent', card);
    if (!$('.w', sent)) for (const node of [...sent.childNodes]) if (node.nodeType === 3) {
      const frag = d.createDocumentFragment();
      node.data.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)) frag.append(part); else { const s = d.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); } });
      sent.replaceChild(frag, node);
    }
  }

  function heroFinal() {
    hero.classList.add('ready');
    $$('.fact', answer).forEach(f => f.classList.add('gone'));
    if (G()) gsap.set([front, glow, card, back], { clearProps: 'opacity,transform' });
  }

  function playHero() {
    if (!G() || REDUCED) { heroFinal(); return; }
    heroTl && heroTl.kill(); layer.innerHTML = '';
    markFacts();
    const facts = $$('.fact', answer), targets = $$('[data-k]', card);
    const words = $$('.gsent .w', card), cap = $('.gl-cap', card);
    const rows = $$('.gl-br > div:not(.t)', card).filter(e => !e.dataset.k), notes = $$('.gl-br .why, .gl-br .d', card);
    const bars = $$('.gl-br i', card), bul = $$('.gbul > *, .gbul li', card), you = $('.you', card);
    facts.forEach(f => f.classList.remove('gone'));
    gsap.set(facts, { backgroundSize: '0% 100%' });
    gsap.set([...words, cap, ...rows, ...notes, ...bul, you, ...targets], { autoAlpha: 0 });
    gsap.set(bars, { scaleX: 0, transformOrigin: '0 50%' });
    gsap.set(bul, { y: 10 }); gsap.set(card, { y: 30, opacity: 0 }); gsap.set(glow, { opacity: 0 }); gsap.set(back, { opacity: 1 });
    hero.classList.add('ready');

    const tl = heroTl = gsap.timeline({ delay: .35 });
    tl.to(facts, { backgroundSize: '100% 100%', duration: .4, stagger: .035, ease: 'power2.out' }, 0);
    tl.to(card, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' }, .45);
    tl.to(glow, { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, .6);
    tl.to(you, { autoAlpha: 1, duration: .35 }, .75);
    tl.add(() => {
      const L = layer.getBoundingClientRect();
      const route = { sepv: 'sep', octv: 'oct' };
      const fl = [];
      for (const dst of targets) {
        const k = dst.dataset.k, src = $(`.fact[data-k="${route[k] || k}"]`, answer); if (!src) continue;
        // aim at where the text itself sits (a right-aligned value is not at its cell's left edge)
        const textRects = el => { const r = d.createRange(); r.selectNodeContents(el); return r.getClientRects(); };
        const a = textRects(src)[0] || src.getBoundingClientRect();
        const dr = textRects(dst), b = dr[0] || dst.getBoundingClientRect(), wraps = dr.length > 1;
        const cs = getComputedStyle(src), ds = getComputedStyle(dst);
        const s = parseFloat(ds.fontSize) / parseFloat(cs.fontSize);
        // Two layers: the answer's type, crossfading into the glance's type drawn at 1/s so that,
        // scaled by s on landing, it matches the target exactly and the hand-over is invisible.
        const f = d.createElement('span'); f.className = 'flyer'; f.dataset.wraps = wraps ? '1' : '';
        f.style.cssText = `font-family:${cs.fontFamily};font-size:${cs.fontSize};line-height:${b.height / s}px`;
        const from = d.createElement('span'); from.textContent = src.textContent;
        from.style.cssText = `font-weight:${cs.fontWeight};letter-spacing:${cs.letterSpacing};font-variant-numeric:${cs.fontVariantNumeric}`;
        const to = d.createElement('span'); to.className = 'fl-to'; to.textContent = dst.textContent;
        const ls = parseFloat(ds.letterSpacing);
        to.style.cssText = `font-family:${ds.fontFamily};font-weight:${ds.fontWeight};font-variant-numeric:${ds.fontVariantNumeric};letter-spacing:${isNaN(ls) ? 'normal' : ls / s + 'px'}`;
        f.append(from, to); layer.append(f);
        fl.push({ f, from, to, dst, k, x0: a.left - L.left, y0: a.top - L.top, x1: b.left - L.left, y1: b.top - L.top, s, color: ds.color });
      }
      fl.sort((p, q) => ORDER.indexOf(p.k) - ORDER.indexOf(q.k));
      facts.forEach(f => f.classList.add('gone'));
      const now = tl.time();
      fl.forEach((p, i) => {
        gsap.set(p.f, { x: p.x0, y: p.y0, force3D: true });
        const lift = 46 + (i % 5) * 15, mx = p.x0 + (p.x1 - p.x0) * .45, my = Math.min(p.y0, p.y1) - lift;
        const ft = gsap.timeline();
        ft.to(p.f, { x: mx, y: my, scale: (1 + p.s) / 2 + .1, duration: .5, ease: 'power2.out' })
          .to(p.f, { x: p.x1, y: p.y1, scale: p.s, duration: .55, ease: 'power3.inOut' })
          .to(p.from, { opacity: 0, duration: .45, ease: 'power1.inOut' }, .35)
          .to(p.to, { opacity: 1, duration: .45, ease: 'power1.inOut' }, .35)
          .to(p.f, { backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', color: p.color, duration: .25 }, '-=.25');
        if (p.f.dataset.wraps)   // the target breaks over two lines: crossfade rather than swap
          ft.to(p.dst, { autoAlpha: 1, duration: .3 }).to(p.f, { opacity: 0, duration: .3 }, '<').add(() => p.f.remove());
        else ft.add(() => { gsap.set(p.dst, { autoAlpha: 1 }); p.f.remove(); });
        tl.add(ft, now + i * .075);   // nested, so Replay stops every flight with the rest
      });
    }, 1.0);
    tl.to(back, { opacity: .42, duration: 1.4, ease: 'power2.inOut' }, 1.25);
    tl.to(words, { autoAlpha: 1, duration: .6, stagger: .028, ease: 'power1.out' }, 1.4);
    tl.to([cap, ...rows], { autoAlpha: 1, duration: .4, stagger: .025 }, 2.05);
    tl.to(bars, { scaleX: 1, duration: .75, stagger: .08, ease: 'power3.out' }, 2.25);
    tl.to(notes, { autoAlpha: 1, duration: .4, stagger: .03 }, 2.7);
    tl.to(bul, { autoAlpha: 1, y: 0, duration: .5, stagger: .045, ease: 'power2.out', force3D: false }, 3.05);
  }

  function initHero() {
    if (!hero) return;
    markFacts();
    $('#replay').addEventListener('click', () => { if (G() && !REDUCED) { window.scrollTo({ top: 0, behavior: 'smooth' }); playHero(); } });
    if (!G() || REDUCED) { heroFinal(); return; }
    (d.fonts ? d.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(playHero));
    if (FINE) {
      const rx = gsap.quickTo(rig, 'rotationX', { duration: .9, ease: 'power3' }), ry = gsap.quickTo(rig, 'rotationY', { duration: .9, ease: 'power3' });
      const stage = $('#stage');
      stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 5); rx(-((e.clientY - r.top) / r.height - .5) * 3.5); });
      stage.addEventListener('pointerleave', () => { rx(0); ry(0); });
    }
    if (window.ScrollTrigger && matchMedia('(min-width: 901px)').matches) {
      gsap.to('#stage', { y: -60, ease: 'none', scrollTrigger: { trigger: '#stage', start: 'top 30%', end: 'bottom top', scrub: .6 } });
    }
  }

  /* ---------------- examples ---------------- */
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
      if (!G() || REDUCED || ex.dataset.touched || $('.ex-stage', ex).classList.contains('is-narrow')) return;
      const o = { p: 0 };
      ex._peekTl = gsap.timeline().to(o, { p: 26, duration: .9, ease: 'power2.inOut', onUpdate: () => { if (!ex.dataset.touched) { cmp.style.setProperty('--pos', o.p + '%'); cmp.classList.toggle('on', o.p > .5); } } })
        .to(o, { p: 0, duration: .8, delay: .5, ease: 'power2.inOut', onUpdate: () => { if (!ex.dataset.touched) { cmp.style.setProperty('--pos', o.p + '%'); cmp.classList.toggle('on', o.p > .5); } } });
    };
  }

  /* ---------------- morph ----------------
     Every state change in an example runs through here: note where each piece sits, switch to the
     final layout in one go, then move each piece from its old place to its new one. Boxes (cells,
     bars, tiles, flags) may also resize; words never do, they are counter-scaled inside a resizing
     box so text never stretches. A piece with no counterpart fades out where it was (a ghost copy)
     or fades in where it lands. Transforms and opacity only, all on one clock. */
  const BOXES = '.gl-tile, .gl-col .b, .gl-br > *, .gl-br i, .gl-cz > *, .gl-track, .gl-fill, .gl-ba > div, .gl-bars > *, .gl-split, .gl-split > i, .gl-tbl > div, .gl-dt th, .gl-dt td, .gl-bb, .gl-bb > *, .gl-flag, .gl-find';
  const ATOMS = '.w, .seg, .hint, button, code';
  const rectOf = el => { if (!el || !el.getClientRects().length) return null; const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
  const lerp = (a, b, v) => a + (b - a) * v;
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  // Words become their own boxes once, so they can travel when a line re-wraps.
  function splitWords(root) {
    if (root.dataset.split) return; root.dataset.split = '1';
    const skip = '.sr-only, button, input, code, .hint, .w, script, style';
    const walker = d.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => !n.data.trim() || n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const frag = d.createDocumentFragment();
      for (const part of node.data.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) frag.append(part);
        else { const w = d.createElement('span'); w.className = 'w'; w.textContent = part; frag.append(w); }
      }
      node.replaceWith(frag);
    }
  }
  // morph(scope, stage, mutate, opts): returns the running tween (or null when nothing animates).
  function morph(scope, stage, mutate, { duration = .62, ease = 'power2.inOut', extra, done } = {}) {
    const nodes = $$(BOXES + ',' + ATOMS, scope).filter(el => !el.closest('.cmp-before, .cmp-handle, .sr-only'));
    const before = new Map(nodes.map(el => [el, rectOf(el)]));
    // a clamped teaser clips its rows to its box; during the move that window travels too, instead of
    // cutting everything to the final box at once
    const clips = $$('.pic.clamp:not(.open)', scope).map(el => ({ el, a: rectOf(el) }));
    const styleOf = new Map();
    for (const el of nodes) if (before.get(el)) { const cs = getComputedStyle(el); styleOf.set(el, `font:${cs.font};color:${cs.color};letter-spacing:${cs.letterSpacing};text-align:${cs.textAlign};white-space:${cs.whiteSpace}`); }
    mutate();
    const after = new Map(nodes.map(el => [el, rectOf(el)]));
    for (const c of clips) { c.b = rectOf(c.el); c.el.style.overflow = 'visible'; c.el.classList.add('clip-morph'); }
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
      const wrap = d.createElement('div'); wrap.className = 'morph-ghost' + (el.closest('.gl-dt') ? ' gl-dt' : '');
      wrap.style.cssText = `left:${a.x - S.x}px;top:${a.y - S.y}px;width:${a.w}px;height:${a.h}px`;
      const c = el.cloneNode(true); c.style.cssText += `;display:block;width:100%;height:100%;box-sizing:border-box;${styleOf.get(el) || ''}`;
      wrap.append(c); layer.append(wrap); return wrap;
    });
    const enter = entering.filter(e => !entering.some(o => o !== e && o.contains(e)));
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
      for (const c of clips) if (c.a && c.b) {
        // the teaser's window, travelling from its old box to its new one; it may reach past its own box
        const x = lerp(c.a.x, c.b.x, v) - c.b.x, y = lerp(c.a.y, c.b.y, v) - c.b.y, w = lerp(c.a.w, c.b.w, v), h = lerp(c.a.h, c.b.h, v);
        c.el.style.clipPath = `inset(${y}px ${c.b.w - x - w}px ${c.b.h - y - h}px ${x}px)`;
        c.el.style.setProperty('--fx', x + 'px'); c.el.style.setProperty('--fy', y + h * .82 + 'px');
        c.el.style.setProperty('--fw', w + 'px'); c.el.style.setProperty('--fh', h * .18 + 'px');
      }
      extra && extra(v);
    };
    const finish = () => {
      for (const c of clips) { c.el.classList.remove('clip-morph'); c.el.style.overflow = ''; c.el.style.clipPath = ''; for (const k of ['--fx', '--fy', '--fw', '--fh']) c.el.style.removeProperty(k); }
      for (const n of travel) { n.el.style.transform = ''; n.el.style.transformOrigin = ''; if (n.radius) n.el.style.borderRadius = ''; if (n.shadow) n.el.style.boxShadow = ''; }
      for (const e of enter) e.style.opacity = '';
      layer.remove();
      done && done();
    };
    render(0);
    const o = { v: 0 };
    return gsap.to(o, { v: 1, duration, ease, onUpdate: () => render(o.v), onComplete: finish });
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
      ex._build && ex._build.progress(1); ex._moreTween && ex._moreTween.progress(1);
      // the one-time peek hint stops for good: the switch decides where the compare layer goes now
      ex.dataset.touched = '1';
      if (ex._peekTl) { const mid = ex._peekTl.isActive(); ex._peekTl.kill(); ex._peekTl = null; if (mid) ex._cmpReset(); }   // a hint caught mid-way isn't the reader's position
      const apply = () => {
        frame.classList.toggle('narrow', narrow); stage.classList.toggle('is-narrow', narrow); fit();
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
      running = morph(card, stage, () => {
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
          stage.style.height = ''; fit(); sheet.classList.remove('moving'); ex.classList.remove('morphing'); running = null;
          window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep();
        }
      });
    }
  }

  const refresh = () => { window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep(); };

  // A button's label changes in place: the old words slide up and out, the new ones slide in from below,
  // and the button's width travels between the two.
  function relabel(btn, text) {
    let lbl = $('.lbl', btn);
    if (!lbl) { lbl = d.createElement('span'); lbl.className = 'lbl'; lbl.textContent = btn.textContent; btn.textContent = ''; btn.append(lbl); }
    $$('.lbl-old', btn).forEach(n => n.remove());
    if (!G() || REDUCED) { lbl.textContent = text; return; }
    gsap.killTweensOf([btn, lbl]);
    // the new words are in the button at once (for readers and assistive tech); a copy of the old ones leaves
    const w0 = btn.getBoundingClientRect().width, ghost = lbl.cloneNode(true);
    ghost.className = 'lbl-old'; ghost.setAttribute('aria-hidden', 'true');
    Object.assign(ghost.style, { left: lbl.offsetLeft + 'px', top: lbl.offsetTop + 'px' });
    btn.style.width = ''; lbl.textContent = text; const w1 = btn.getBoundingClientRect().width;
    btn.append(ghost); btn.style.width = w0 + 'px'; gsap.set(lbl, { opacity: 0, y: 8 });
    gsap.to(btn, { width: w1, duration: .32, ease: 'power2.inOut', clearProps: 'width' });
    gsap.to(ghost, { opacity: 0, y: -8, duration: .18, ease: 'power1.in', onComplete: () => ghost.remove() });
    gsap.to(lbl, { opacity: 1, y: 0, duration: .24, delay: .1, ease: 'power2.out', clearProps: 'transform,opacity' });
  }

  /* Show all / Show fewer. What moves where: the teaser's height travels to the table's full height, so
     the rows below are uncovered as it grows, and its bottom fade rides the moving edge, leaving only as
     it reaches the end. Collapsing reverses it while the page stays anchored to the button, so the table
     folds up toward the pointer instead of throwing the button out of view. The label changes in place. */
  function initMore(ex) {
    const more = $('.more', ex); if (!more) return;
    const pic = $('.pic', ex), label = more.textContent.trim(), CLAMP = 860;
    more.addEventListener('click', () => {
      ex._moreTween && ex._moreTween.progress(1);
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
      ex._moreTween = gsap.to(o, { v: 1, duration: Math.min(.9, .35 + Math.abs(h1 - h0) / 2500), ease: 'power2.inOut',
        onUpdate: () => {
          pic.style.height = lerp(h0, h1, o.v) + 'px';
          pic.style.setProperty('--fo', open ? 1 - clamp01((o.v - .7) / .3) : clamp01(o.v / .3));
          if (anchor !== null) { const dy = more.getBoundingClientRect().top - anchor; if (Math.abs(dy) > .5) scrollBy({ top: dy, behavior: 'instant' }); }
        },
        onComplete: () => {
          Object.assign(pic.style, { overflow: '', maxHeight: '', height: '' }); pic.style.removeProperty('--fo');
          pic.classList.remove('fading'); root.style.overflowAnchor = ''; ex._moreTween = null; refresh();
        } });
    });
  }

  // Every number in the picture that appears in the original answer gets a tooltip with that line.
  const tip = $('#src-tip'), tipLine = $('.src-line', tip);
  function lineText(b) { return b.tagName === 'TR' ? $$('th,td', b).map(c => c.textContent.trim()).join(' · ') : (b.tagName === 'LI' ? [...b.childNodes].filter(n => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName))).map(n => n.textContent).join('') : b.textContent).replace(/\s+/g, ' ').trim(); }
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const TOK = /[+\-−]?\$?\d[\d,.]*(?:\s?(?:%|ms|s|kb|mb|gb|tb|×|x)\b)?/gi;
  const ownText = el => [...el.childNodes].filter(n => !(n.nodeType === 1 && n.matches('.gl-q, .gl-note, .gl-flag, .gl-tech, .why'))).map(n => n.textContent).join('');
  function initSources(ex) {
    // each line also knows its twin in the side panel's copy of the answer, to light it up in narrow mode
    const LINES = '.said :is(p, li, tr, h1, h2, h3)', mainLines = $$('.ex-sheet ' + LINES, ex), mainRows = $$('.ex-sheet .said tr', ex);
    const blocks = $$('.cmp-before ' + LINES, ex).map((b, i) => { const t = lineText(b); return { t, n: norm(t), main: mainLines[i] }; }).filter(b => b.n);
    // table cells: found by their row's name, then by the cell's own text in that row of the original
    const srcRows = $$('.cmp-before .said tr', ex).map((tr, i) => Object.assign($$('th,td', tr).map(c => c.textContent.trim()), { main: mainRows[i] }));
    const label = c => norm(c.firstChild ? c.firstChild.textContent : c.textContent);
    for (const tr of $$('.cmp-after .gl-dt tbody tr', ex)) {
      const row = srcRows.find(r => norm(r[0]) === label(tr.cells[0])); if (!row) continue;
      [...tr.cells].forEach((td, i) => {
        if (td.classList.contains('bbc')) return;
        const t = i === 0 ? label(td) : norm(td.textContent);
        const j = norm(row[i] || '') === t ? i : row.findIndex(c => norm(c) === t); if (j < 0) return;
        td.classList.add('has-src'); td._src = { rows: [{ cells: row, mark: j }], mains: [row.main] };
      });
    }
    // anything else with a number in it: the line, or two, of the original that hold its numbers
    const cands = $$('.cmp-after .gl :is(div, span, b)', ex).filter(el =>
      !el.closest('.sr-only, th, button, .gl-ctl, .gl-count, .has-src') && !$$(':scope > :is(div, td)', el).length && /\d/.test(ownText(el)));
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
  let tipFor = null, litMain = [];
  function showTip(el) {
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
    if (y < 70) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip(el) {
    if (tipFor !== el) return;
    el.classList.remove('lit'); tip.hidden = true; tipFor = null;
    litMain.forEach(m => m.classList.remove('src-lit')); litMain = [];
  }
  addEventListener('scroll', () => tipFor && hideTip(tipFor), { passive: true });

  // The build: the sentence, then the picture assembles itself, red settles last.
  function prepBuild(ex) {
    // clearProps: once built, nothing keeps a leftover transform, so later moves start from clean boxes
    const after = $('.cmp-after', ex), tl = gsap.timeline({ paused: true, defaults: { force3D: false, clearProps: 'transform' } });
    const sent = $('.g-sent', after), secs = $$('.gl > .gl-sec', after);
    tl.from(sent, { autoAlpha: 0, y: 14, duration: .55, ease: 'power2.out' }, 0);
    let t = .25;
    for (const sec of secs) {
      const cap = $(':scope > .gl-cap', sec); if (cap) tl.from(cap, { autoAlpha: 0, y: 8, duration: .4 }, t);
      const ctl = $('.gl-ctl', sec); if (ctl) tl.from(ctl, { autoAlpha: 0, y: 8, duration: .4 }, t + .05);
      // columns grow, their labels count up
      const cols = $$('.gl-col', sec);
      if (cols.length) {
        tl.from($$('.gl-col .b', sec), { scaleY: 0, transformOrigin: '50% 100%', duration: .8, stagger: .07, ease: 'power3.out' }, t + .1);
        tl.from($$('.gl-col .lv, .gl-col .lx', sec), { autoAlpha: 0, duration: .4, stagger: .035 }, t + .2);
        $$('.gl-col .lv', sec).forEach((lv, i) => countUp(tl, lv, t + .15 + i * .07));
        t += .9;
      }
      // a bridge: steps drop in one by one
      const br = $('.gl-br', sec);
      if (br) {
        tl.from($$(':scope > div:not(.t)', br), { autoAlpha: 0, duration: .35, stagger: .02 }, t);
        tl.from($$('i', br), { scaleX: 0, transformOrigin: '0 50%', duration: .7, stagger: .09, ease: 'power3.out' }, t + .1);
        t += .8;
      }
      // tiles: numbers count up
      const tiles = $$('.gl-tile', sec);
      if (tiles.length) { tl.from(tiles, { autoAlpha: 0, y: 12, duration: .5, stagger: .07, ease: 'power2.out' }, t); tiles.forEach((tile, i) => countUp(tl, $('.gl-v', tile), t + .1 + i * .07)); t += .5; }
      // before -> after rows: each later value counts from the one before it
      const ba = $('.gl-ba', sec);
      if (ba) {
        const cells = $$(':scope > div', ba);
        tl.from(cells, { autoAlpha: 0, y: 10, duration: .45, stagger: .03, ease: 'power2.out' }, t);
        $$(':scope > .v:not(.hd)', ba).forEach((v, i) => countUp(tl, v, t + .2 + i * .06, true));
        t += .9;
      }
      // causes stack in, each bar grows
      const cz = $('.gl-cz', sec);
      if (cz) {
        tl.from($$(':scope > *', cz), { autoAlpha: 0, y: 14, duration: .45, stagger: .04, ease: 'power2.out' }, t);
        tl.from($$('.gl-fill', cz), { scaleX: 0, transformOrigin: '0 50%', duration: .8, stagger: .12, ease: 'power3.out' }, t + .2);
        $$(':scope > .v', cz).forEach((v, i) => countUp(tl, v, t + .2 + i * .12));
        t += .8;
      }
      // split bar sweeps in, then the parts list
      const split = $('.gl-split', sec);
      if (split) { tl.fromTo(split, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut' }, t); t += .3; }
      const tbl = $('.gl-tbl', sec);
      if (tbl) { tl.from($$(':scope > div', tbl), { autoAlpha: 0, duration: .35, stagger: .012 }, t); t += .4; }
      const bars = $('.gl-bars', sec);
      if (bars) {
        tl.from($$(':scope > *', bars), { autoAlpha: 0, duration: .35, stagger: .03 }, t);
        tl.from($$('.gl-fill', bars), { scaleX: 0, transformOrigin: '0 50%', duration: .8, stagger: .12, ease: 'power3.out' }, t + .1);
        t += .7;
      }
      // tables: a status grid fills in a wave and its failures settle red last; others rise row by row
      const dt = $('.gl-dt', sec);
      if (dt) {
        const rows = $$('tbody tr', dt).slice(0, 16);
        if (dt.classList.contains('st')) {
          const cells = rows.flatMap(r => $$('td', r)), ncol = rows[0] ? rows[0].cells.length : 1;
          tl.from($('thead', dt), { autoAlpha: 0, duration: .35 }, t);
          tl.from(cells, { autoAlpha: 0, y: 6, duration: .35, ease: 'power2.out', stagger: { grid: [rows.length, ncol], from: 'start', amount: 1.1 } }, t + .1);
          t += 1.3;
        } else {
          tl.from($('thead', dt), { autoAlpha: 0, duration: .35 }, t);
          tl.from(rows, { autoAlpha: 0, y: 10, duration: .4, stagger: .045, ease: 'power2.out' }, t + .05);
          tl.from($$('.gl-bb i', dt).slice(0, 16), { scaleX: 0, transformOrigin: '0 50%', duration: .6, stagger: .045, ease: 'power3.out' }, t + .2);
          tl.from($$('.gl-bb b', dt).slice(0, 16), { scaleX: 0, transformOrigin: '0 50%', duration: .45, stagger: .045, ease: 'power2.out' }, t + .7);
          t += 1.2;
        }
        const reds = $$('td.x', dt);
        reds.forEach(c => c.classList.add('pending'));
        reds.forEach((c, i) => tl.add(() => c.classList.remove('pending'), t + i * .07));
        t += .2;
      }
      t += .1;
    }
    // flags and notes arrive last, next to what they describe
    tl.from($$('.gl-flag, .gl-note', after), { autoAlpha: 0, x: -4, duration: .4, stagger: .03 }, Math.max(.6, t - .4));
    tl.add(() => ex._peek && ex._peek(), t + .4);
    return tl;
  }

  function initExamples() {
    for (const ex of $$('[data-ex]')) {
      initCompare(ex); initWidth(ex); initMore(ex); initSources(ex);
      if (G() && FINE && !REDUCED) {   // the glow behind the card leans toward the pointer
        const glowEl = $('.ex-glow', ex), stage = $('.ex-stage', ex);
        const gx = gsap.quickTo(glowEl, 'x', { duration: 1.2, ease: 'power3' }), gy = gsap.quickTo(glowEl, 'y', { duration: 1.2, ease: 'power3' });
        stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; gx(px * 30); gy(py * 24); });
        stage.addEventListener('pointerleave', () => { gx(0); gy(0); });
      }
      if (G() && !REDUCED) { const tl = prepBuild(ex); ex._build = tl; builds.push({ card: $('.ex-card', ex), tl }); }
    }
  }

  /* ---------------- reveals ----------------
     One check, run on every scroll, load, resize and anchor jump: whatever is now above the fold
     appears at once, whatever is coming into view animates in. Nothing waits on a scroll event
     that a jump can skip, so no text or picture is ever left hidden. */
  const texts = [], builds = [];
  // 2D moves only (force3D off), so text stays crisp the whole way instead of blurring and snapping
  const show = (els, animate) => gsap.to(els, { autoAlpha: 1, y: 0, duration: animate ? .7 : 0, stagger: animate ? .07 : 0,
    ease: 'power3.out', overwrite: true, force3D: false });
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
    const groups = [['.sec-head > *'], ['.group > h3'], ['.ex-text > *'], ['.install-in > *'], ['.cmd-text > *', '.cmd-table tr'], ['.dataviz > h2', '.statement', '.dv-list li', '.dv-end'],
      ['.rd-text > *', '.rd-fig'], ['.credits h2', '.cr-grid p'], ['.foot-mark']];
    for (const sels of groups) {
      const els = sels.flatMap(s => $$(s)); if (!els.length) continue;
      gsap.set(els, { autoAlpha: 0, y: 18, force3D: false });
      texts.push(...els);
    }
    if (window.ScrollTrigger) gsap.from('.foot-mark', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: .5 } });
  }

  /* ---------------- small controls ---------------- */
  function initControls() {
    $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const text = $('#' + b.dataset.copy).textContent;
      try { await navigator.clipboard.writeText(text); b.textContent = 'Copied'; } catch (e) { b.textContent = 'Press ⌘C'; getSelection().selectAllChildren($('#' + b.dataset.copy)); }
      setTimeout(() => b.textContent = 'Copy', 1800);
    }));
    const cvd = $('.cvd-toggle'), fig = $('.rd-fig');
    cvd && cvd.addEventListener('click', () => {
      const on = fig.classList.toggle('cvd');
      cvd.setAttribute('aria-pressed', on);
      cvd.textContent = on ? 'Back to full color vision' : 'See it with red-green color blindness';
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

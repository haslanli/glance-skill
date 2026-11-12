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
    const cmp = $('.cmp', ex), input = $('input', cmp), knob = $('.knob', cmp);
    let dragging = false;
    const set = p => { p = Math.max(0, Math.min(100, p)); cmp.style.setProperty('--pos', p + '%'); cmp.classList.toggle('on', p > .5); input.value = p; ex.dataset.touched = '1'; };
    const fromX = x => { const r = cmp.getBoundingClientRect(); set((x - r.left) / r.width * 100); };
    knob.addEventListener('pointerdown', e => { dragging = true; cmp.classList.add('drag'); knob.setPointerCapture(e.pointerId); e.preventDefault(); });
    knob.addEventListener('pointermove', e => dragging && fromX(e.clientX));
    const end = () => { dragging = false; cmp.classList.remove('drag'); };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
    knob.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.addEventListener('input', () => set(+input.value));
    ex._peek = () => {
      if (!G() || REDUCED || ex.dataset.touched) return;
      const o = { p: 0 };
      gsap.timeline().to(o, { p: 26, duration: .9, ease: 'power2.inOut', onUpdate: () => { if (!ex.dataset.touched) { cmp.style.setProperty('--pos', o.p + '%'); cmp.classList.toggle('on', o.p > .5); } } })
        .to(o, { p: 0, duration: .8, delay: .5, ease: 'power2.inOut', onUpdate: () => { if (!ex.dataset.touched) { cmp.style.setProperty('--pos', o.p + '%'); cmp.classList.toggle('on', o.p > .5); } } });
    };
  }

  function initWidth(ex) {
    // Both directions tween the frame between two pixel widths; the class only sets where it ends.
    const frame = $('.ex-frame', ex), stage = $('.ex-stage', ex), main = $('.ex-main', ex);
    let resizing = null, leaving = null;
    const resize = narrow => {
      const w0 = frame.getBoundingClientRect().width;
      frame.style.width = ''; frame.classList.toggle('narrow', narrow);
      stage.classList.toggle('is-narrow', narrow);   // narrow brings Claude's own answer in beside it
      gsap.set(main, { clearProps: 'opacity' });
      const w1 = frame.getBoundingClientRect().width;
      const done = () => { frame.style.width = ''; resizing = null; window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep(); };
      if (G() && !REDUCED && Math.abs(w1 - w0) > 1) resizing = gsap.fromTo(frame, { width: w0 }, { width: w1, duration: .6, ease: 'power3.inOut', onComplete: done });
      else done();
    };
    $$('.seg button', ex).forEach(b => b.addEventListener('click', () => {
      const narrow = b.dataset.w === 'narrow';
      if (narrow === frame.classList.contains('narrow')) return;
      $$('.seg button', ex).forEach(o => o.setAttribute('aria-pressed', o === b));
      resizing && resizing.kill(); leaving && leaving.kill(); leaving = null;
      // going wide, let the answer fade out before the glance grows over its place
      if (!narrow && G() && !REDUCED && getComputedStyle(main).display !== 'none')
        leaving = gsap.to(main, { opacity: 0, duration: .18, ease: 'power1.in', onComplete: () => { leaving = null; resize(false); } });
      else resize(narrow);
    }));
    const more = $('.more', ex);
    if (more) {
      const label = more.textContent, pic = $('.pic', ex);
      more.addEventListener('click', () => {
        const open = pic.classList.toggle('open');
        more.setAttribute('aria-expanded', open); more.textContent = open ? 'Show fewer' : label;
        window.ScrollTrigger && ScrollTrigger.refresh(); queueSweep();
      });
    }
  }

  // Every number in the picture that appears in the original answer gets a tooltip with that line.
  const tip = $('#src-tip'), tipLine = $('.src-line', tip);
  function lineText(b) { return b.tagName === 'TR' ? $$('th,td', b).map(c => c.textContent.trim()).join(' · ') : (b.tagName === 'LI' ? [...b.childNodes].filter(n => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName))).map(n => n.textContent).join('') : b.textContent).replace(/\s+/g, ' ').trim(); }
  const esc = t => t.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const TOK = /[+\-−]?\$?\d[\d,.]*(?:\s?(?:%|ms|s|kb|mb|gb|tb|×|x)\b)?/gi;
  const ownText = el => [...el.childNodes].filter(n => !(n.nodeType === 1 && n.matches('.gl-q, .gl-note, .gl-flag, .gl-tech, .why'))).map(n => n.textContent).join('');
  function initSources(ex) {
    // each line also knows its twin in the side panel's copy of the answer, to light it up in narrow mode
    const LINES = '.said :is(p, li, tr, h1, h2, h3)', mainLines = $$('.ex-main ' + LINES, ex), mainRows = $$('.ex-main .said tr', ex);
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
    const stage = el.closest('.ex-stage'), panel = stage && $('.ex-main', stage);
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
    const after = $('.cmp-after', ex), tl = gsap.timeline({ paused: true, defaults: { force3D: false } });
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
      initCompare(ex); initWidth(ex); initSources(ex);
      if (G() && FINE && !REDUCED) {
        const backEl = $('.ex-back', ex), glowEl = $('.ex-glow', ex), stage = $('.ex-stage', ex);
        const bx = gsap.quickTo(backEl, 'x', { duration: 1, ease: 'power3' }), by = gsap.quickTo(backEl, 'y', { duration: 1, ease: 'power3' });
        const gx = gsap.quickTo(glowEl, 'x', { duration: 1.2, ease: 'power3' }), gy = gsap.quickTo(glowEl, 'y', { duration: 1.2, ease: 'power3' });
        stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; bx(-px * 18); by(-py * 14); gx(px * 30); gy(py * 24); });
        stage.addEventListener('pointerleave', () => { bx(0); by(0); gx(0); gy(0); });
      }
      if (G() && !REDUCED) builds.push({ card: $('.ex-card', ex), tl: prepBuild(ex) });
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

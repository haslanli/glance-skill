# glance UI kit

Build every glance picture from this kit. It handles spacing, type sizes, alignment, light and dark mode, and narrow /btw panels, so every picture comes out at the same quality.

## The look

Calm and product-like, the way a careful designer builds a report or a settings page. Type, alignment and whitespace do the work: hairline dividers, no boxes, no badges or pills.

It follows long-established design rules:

- **Color marks the exception, not the rule.** Normal and improved values stay uncolored. Only what's worse, over a limit or failing gets the alert color, and only the recommended or focused item gets the accent. Never paint a column of green. This also keeps the picture readable for color-blind people, since red and green are the pair they most often confuse.
- **Proximity.** A note sits right next to the thing it describes: under its value, or, for a table row, after the row's name with the whole row in the alert color. It never goes in a separate column at the far edge.
- **Alignment.** Text aligns left and numbers align right, each in its own column, with the header aligned the same way as its column. Rows line up across columns.
- **Less ink.** Anything that carries no information goes: legends the labels already cover, repeated captions, decoration. If a picture starts to look like a generated dashboard, take something away.

## How to use it

1. Put the CSS block below at the top of the widget, exactly as written.
2. Wrap the whole picture in one `<div class="gl">`.
3. Stack at most three sections, each a `<div class="gl-sec">`, usually headline figures, then the main chart, table or comparison, then one secondary table.
4. Use only these components. Don't restyle them and don't add inline styles, except the documented `--n`, `--r`, `--c`, bar `height` and bar `width`.
5. A value the original doesn't give is `—`, never a guess.

## CSS

```html
<style>
.gl{font-size:14px;line-height:1.45;color:var(--text-primary);font-variant-numeric:tabular-nums;container-type:inline-size}
.gl *{box-sizing:border-box}
.gl-sec+.gl-sec{margin-top:28px}
.gl-cap{font-size:12px;font-weight:500;color:var(--text-secondary);margin:0 0 8px}
.gl-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.gl-tile{background:var(--surface-1);border-radius:var(--radius);padding:12px 16px;min-width:0}
.gl-k{font-size:12px;color:var(--text-secondary)}
.gl-v{font-size:24px;font-weight:500;line-height:1.25;letter-spacing:-.01em;white-space:nowrap}.gl-v.bad{color:var(--text-danger)}
.gl-note{font-size:12px;line-height:1.35;color:var(--text-muted);white-space:nowrap}
.gl-note.bad{color:var(--text-danger)}.gl-note.warn{color:var(--text-warning)}.gl-note.pick{color:var(--text-accent)}.gl-note.good{color:var(--text-success)}
.gl-arw{color:var(--text-muted);font-weight:400;margin:0 .15em}
.gl .nw{white-space:nowrap}
.gl-tbl{display:grid;grid-template-columns:minmax(0,1fr) repeat(var(--c,2),max-content)}
.gl-tbl>div{padding:10px 0;border-top:0.5px solid var(--border);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gl-tbl>.num{text-align:right;padding-left:32px;overflow:visible}
.gl-tbl>.hd{font-size:12px;color:var(--text-secondary);border-top:0;padding:0 0 8px}
.gl-tbl>.x{color:var(--text-danger)}
.gl-name{font-size:14px}.gl-tech{font-size:12px;color:var(--text-muted)}
.gl-was{}.gl-now{}
.gl-bars{display:grid;grid-template-columns:max-content minmax(48px,1fr) max-content;gap:10px 12px;align-items:center}
.gl-bars .n{font-size:13px;color:var(--text-secondary)}
.gl-bars .v{font-size:13px;text-align:right;color:var(--text-secondary)}
.gl-track{height:8px;border-radius:2px;background:var(--surface-1)}
.gl-fill{height:100%;min-width:2px;border-radius:2px;background:#888780;opacity:.35}
.gl-bars .gl-track:has(.hi,.bad)+.v{color:var(--text-primary);font-weight:500}
.gl-fill.hi,.gl-fill.bad{opacity:1}.gl-fill.hi{background:#378ADD}.gl-fill.bad{background:#E24B4A}
.gl-cols{display:flex;align-items:flex-end;gap:8px;height:150px}
.gl-col{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.gl-col .lv{font-size:12px;color:var(--text-secondary);margin-bottom:4px;white-space:nowrap}
.gl-col:has(.b.hi,.b.bad) .lv{color:var(--text-primary);font-weight:500}
.gl-col .b{width:100%;max-width:40px;border-radius:3px 3px 0 0;background:#888780;opacity:.35}
.gl-col .b.hi,.gl-col .b.bad{opacity:1}.gl-col .b.hi{background:#378ADD}.gl-col .b.bad{background:#E24B4A}
.gl-col .lx{font-size:12px;color:var(--text-muted);margin-top:6px;white-space:nowrap}
.gl-cmp{display:grid;grid-template-columns:max-content repeat(var(--n),minmax(0,1fr));grid-template-rows:repeat(var(--r),auto)}
.gl-cmp>.col{display:grid;grid-template-rows:subgrid;grid-row:span var(--r);min-width:0}
.gl-cmp>.col>div{padding:9px 12px;border-top:0.5px solid var(--border);min-width:0;line-height:20px}
.gl-cmp>.col>.hd{border-top:0;padding-top:6px;padding-bottom:8px;font-weight:500;font-size:13px}
.gl-cmp>.labels>div{font-size:12px;color:var(--text-secondary);padding-left:0;padding-right:16px}
.gl-cmp>.col.pk{background:var(--bg-accent)}
.gl-cmp>.col.pk>div{border-top-color:color-mix(in srgb,var(--text-accent) 18%,transparent)}
.gl-cmp>.col.pk .gl-q{color:var(--text-secondary)}
.gl-val{display:block;font-size:14px;font-weight:500}.gl-q{display:block;font-size:12px;line-height:16px;color:var(--text-muted)}
.gl-cmp .flag .gl-q{color:var(--text-danger)}
.gl-cmp .none{color:var(--text-muted)}
@container (max-width:520px){.gl-tbl>.num{padding-left:20px}.gl-cmp{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.gl-cmp>.labels{display:none}.gl-cmp>.col{border:0.5px solid var(--border);border-radius:var(--radius)}.gl-cmp>.col>div[data-l]{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:7px 12px}.gl-cmp>.col>div[data-l]::before{content:attr(data-l);font-size:12px;color:var(--text-secondary);flex:none}.gl-cmp>.col>div[data-l]>*{text-align:right;min-width:0}}
</style>
```

## Components

### Section caption

```html
<div class="gl-sec"><div class="gl-cap">Monthly total</div> … </div>
```

A few words in sentence case. Skip it when headers already say it.

### Headline figures: 2 to 4 numbers the answer is about

```html
<div class="gl-sec gl-tiles">
  <div class="gl-tile"><div class="gl-k">Lighthouse score</div><div class="gl-v">41<span class="gl-arw">→</span>88</div></div>
  <div class="gl-tile"><div class="gl-k">Got worse</div><div class="gl-v bad">2 of 8</div></div>
</div>
```

Equal tiles with a soft fill. Add `bad` to a value only when that figure is the problem. An optional neutral `.gl-note` line can go under the value.

### Notes: a status in a word or a short phrase

```html
<span class="gl-note bad">worse</span>  <span class="gl-note warn">tight</span>  <span class="gl-note pick">Recommended</span>  <span class="gl-note">at peak</span>
```

Plain small text, never a badge. `bad` is for what's worse or failing, `warn` for borderline, and `pick` for the recommended item. A plain note is neutral. `good` exists, but use it only when the improvement is itself the one exception; normally an improvement stays uncolored. Put the note directly under or beside the value it's about. In tables, mark an exception row as described under Table instead.

### Table: items with a few numbers each, such as before and after, or month against month

```html
<div class="gl-sec gl-tbl" style="--c:2">
  <div class="hd">Metric</div><div class="hd num">Before</div><div class="hd num">After</div>
  <div>Largest Contentful Paint</div><div class="num">4.8 s</div><div class="num">2.1 s</div>
  <div class="x">Time to First Byte · worse</div><div class="num x">380 ms</div><div class="num x">410 ms</div>
</div>
```

- `--c` is the number of number columns. Each row is one name cell, then one `num` cell per column, all on one line.
- Use the name the original uses, kept short. If it needs explaining, explain it in the bullets, not under the name, so every row stays one line and the same height.
- All numbers have the same weight and color; the columns themselves make the comparison.
- For an exception (worse, over a limit, failing), add `x` to every cell in that row and end the name with " · worse" (or the original's word). The whole row turns the alert color, so it's found at a glance. Normal and improved rows stay plain.
- Sort by what matters (for example the biggest change first) unless the original's order matters.

### Columns: one series across up to 12 periods or categories

```html
<div class="gl-cols">
  <div class="gl-col"><div class="lv">$1,840</div><div class="b" style="height:39px"></div><div class="lx">May</div></div>
  <div class="gl-col"><div class="lv">$4,760</div><div class="b bad" style="height:100px"></div><div class="lx">Oct</div></div>
</div>
```

Bar height in px = round(value ÷ largest value × 100). Mark at most one or two bars with `bad` (the problem) or `hi` (the focus). The rest stay gray, and their labels stay muted.

### Bars: amounts across up to about 12 items

```html
<div class="gl-bars">
  <div class="n">Item</div><div class="gl-track"><div class="gl-fill hi" style="width:100%"></div></div><div class="v">$2,240</div>
  <div class="n">Item</div><div class="gl-track"><div class="gl-fill" style="width:20%"></div></div><div class="v">$450</div>
</div>
```

Width % = value ÷ largest value × 100, largest first. Mark only the item the answer is about.

### Comparison: 2 or more options sharing the same specs

```html
<div class="gl-cmp" style="--n:3;--r:3">
  <div class="col labels"><div class="hd"></div><div>Price</div><div>RAM</div></div>
  <div class="col pk"><div class="hd"><span class="nw">Option A-1</span><div class="gl-note pick">Recommended</div></div>
    <div data-l="Price"><span><span class="gl-val">$34/mo</span></span></div>
    <div data-l="RAM"><span><span class="gl-val">16 GB</span></span></div></div>
  <div class="col"><div class="hd">Option B</div>
    <div data-l="Price"><span><span class="gl-val">$28/mo</span></span></div>
    <div data-l="RAM" class="flag"><span><span class="gl-val">8 GB</span><span class="gl-q">tight with Postgres</span></span></div></div>
  <div class="col"><div class="hd">Option C</div>
    <div data-l="Price"><span><span class="gl-val">$42/mo</span><span class="gl-q">over budget</span></span></div>
    <div data-l="RAM"><span class="none">—</span></div></div>
</div>
```

- `--n` is the number of options and `--r` is the number of specs + 1. The first column is always `col labels` with an empty `hd`, then one label per spec.
- Each option is one `col`: its header, then one cell per spec, in the same order as the labels. Every cell carries `data-l` with its spec name, which is used in narrow panels.
- Write values number first, in the same unit across a row ("8 vCPU", "4 vCPU"). Put qualifiers in `.gl-q`, about 20 characters at most; longer notes go in the bullets.
- Add `pk` to the recommended option's `col` and a `pick` note in its header. This gives the column a solid accent fill from top to bottom: the one bold element in the picture, so nothing else should compete with it.
- Flag at most one deciding drawback per option, the one the original gives as its reason: add `flag` to that cell and give it a short `.gl-q`. Only the qualifier turns red; the value stays readable.
- Wrap names with hyphens or numbers in `.nw`.
- Rows stay locked across the options. In a narrow panel each option becomes a card with label–value lines, two side by side.

### Lines with many points (more than 12)

Use Chart.js only here; everything else is plain HTML.

```html
<div style="position:relative;height:180px"><canvas id="gl-line" role="img" aria-label="What the line shows">Values as text</canvas></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
const dk=document.documentElement.dataset.mode==='dark', mu='#898781';
new Chart(document.getElementById('gl-line'),{type:'line',data:{labels:[/* … */],datasets:[{data:[/* … */],borderColor:'#378ADD',borderWidth:2,pointRadius:0,tension:.25}]},
options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:mu,font:{size:12},maxRotation:0,autoSkipPadding:16}},y:{grid:{color:dk?'#2c2c2a':'#e1e0d9'},border:{display:false},ticks:{color:mu,font:{size:12}}}}}});
</script>
```

# glance UI kit

Build every glance picture from this kit. It handles spacing, type sizes, alignment, light and dark mode, and narrow /btw panels, so every picture comes out at the same quality.

Contents: The look · How to use it · CSS · Components: section caption, headline figures, notes, table, columns, bars, meters, split bar, diverging bars, comparison, bridge, lead item, table with an inline trend, before → after against a benchmark, causes with counts, interactive table, view switch, the script for interactive pieces, lines with many points.

## The look

Calm and product-like, the way a careful designer builds a report or a settings page. Type, alignment and whitespace do the work: hairline dividers, no boxes, no badges or pills.

It follows long-established design rules:

- **Color marks the exception, not the rule.** Normal and improved values stay uncolored. Only what's worse, over a limit or failing gets the alert color, and only the recommended or focused item gets the accent. Never paint a column of green. This also keeps the picture readable for color-blind people, since red and green are the pair they most often confuse. There is no third mark color: amber next to the alert red is nearly invisible to red-green color-blind readers, so "tight" or "borderline" is a word, never a colored mark (the word itself may take the warning text color).
- **Proximity.** A note sits right next to the thing it describes: under its value, or, for a table row, after the row's name with the whole row in the alert color. It never goes in a separate column at the far edge.
- **Alignment.** Text aligns left and numbers align right, each in its own column, with the header aligned the same way as its column. Rows line up across columns.
- **Thin marks.** Bars and columns are at most 24 px thick, rounded only at the value end and square at the baseline. Lines are 2 px. Touching parts are separated by a 2 px gap, never by a drawn border.
- **Every value is printed.** Each bar, column, meter and cell shows its value as text, so nothing waits behind a hover and the picture reads the same in a screenshot. There are two exceptions. A line with many points prints its last value, and a hover readout plus the canvas's text carry every point. An inline trend in a table row prints its first and last values, and each of its columns carries its own value on hover and in the row's screen-reader text.
- **Less ink.** Anything that carries no information goes: legends the labels already cover, repeated captions, decoration. If a picture starts to look like a generated dashboard, take something away.

## How to use it

1. Put the CSS block below at the top of the widget, exactly as written.
2. Right after it, one `<h2 class="sr-only">` with one sentence on what the picture shows, for screen readers.
3. Wrap the whole picture in one `<div class="gl">`.
4. Stack at most three sections, each a `<div class="gl-sec">`, usually headline figures, then the main chart, table or comparison, then one secondary table.
5. Use only these components. Don't restyle them and don't add inline styles, except the documented `--n`, `--r`, `--c`, `--v`, `--lim`, `--a`, `--w`, `--k`, `--h`, bar `height` and bar or meter `width`.
6. A value the original doesn't give is `—`, never a guess.

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
.gl-tbl>.hd{font-size:12px;color:var(--text-secondary);border-top:0;padding-top:0;padding-bottom:8px}
.gl-tbl>.x{color:var(--text-danger)}.gl-tbl>.w{color:var(--text-warning)}
.gl-name{font-size:14px}.gl-tech{font-size:12px;color:var(--text-muted)}
.gl-was{}.gl-now{}
.gl-bars{display:grid;grid-template-columns:max-content minmax(48px,1fr) max-content;gap:10px 12px;align-items:center}
.gl-bars .n{font-size:13px;color:var(--text-secondary)}
.gl-bars .v{font-size:14px;text-align:right;color:var(--text-primary)}
.gl-track{height:8px}
.gl-fill{height:100%;min-width:2px;border-radius:0 4px 4px 0;background:#888780;opacity:.35}
.gl-bars .gl-track:has(.hi,.bad)+.v{font-weight:500}
.gl-fill.hi,.gl-fill.bad{opacity:1}.gl-fill.hi{background:#378ADD}.gl-fill.bad{background:#E24B4A}
.gl-cols{display:flex;align-items:flex-end;gap:8px;height:150px}
.gl-col{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}
.gl-col .lv{font-size:12px;color:var(--text-secondary);margin-bottom:4px;white-space:nowrap}
.gl-col:has(.b.hi,.b.bad) .lv{color:var(--text-primary);font-weight:500}
.gl-col .b{width:100%;max-width:24px;border-radius:4px 4px 0 0;background:#888780;opacity:.35}
.gl-col .b.hi,.gl-col .b.bad{opacity:1}.gl-col .b.hi{background:#378ADD}.gl-col .b.bad{background:#E24B4A}
.gl-col .lx{font-size:12px;color:var(--text-muted);margin-top:6px;white-space:nowrap}
.gl-mtr{display:grid;grid-template-columns:max-content minmax(64px,1fr) max-content max-content;gap:10px 12px;align-items:center}
.gl-mtr .n{font-size:13px;color:var(--text-secondary);white-space:nowrap}
.gl-mtr .v{font-size:14px;color:var(--text-primary);text-align:right;white-space:nowrap}
.gl-mtr .d{font-size:12px;color:var(--text-muted);text-align:right;white-space:nowrap}
.gl-mtr .x{color:var(--text-danger)}
.gl-m{position:relative;height:8px;border-radius:4px;background:color-mix(in srgb,#888780 16%,transparent)}
.gl-m>i{display:block;height:100%;max-width:100%;border-radius:4px;background:color-mix(in srgb,#888780 55%,transparent)}
.gl-m[style*="--lim"]::after{content:"";position:absolute;left:calc(var(--lim) - 1px);top:-4px;bottom:-4px;width:2px;border-radius:1px;background:var(--text-muted)}
.gl-m.hi{background:color-mix(in srgb,#378ADD 18%,transparent)}.gl-m.hi>i{background:#378ADD}
.gl-m.bad{background:color-mix(in srgb,#E24B4A 18%,transparent)}.gl-m.bad>i{background:#E24B4A}
.gl-dv{display:grid;grid-template-columns:max-content minmax(40px,1fr) minmax(40px,1fr) max-content}
.gl-dv>div{height:28px;display:flex;align-items:center;min-width:0}
.gl-dv .n{font-size:13px;color:var(--text-secondary);white-space:nowrap}.gl-dv .v{font-size:14px;color:var(--text-primary);white-space:nowrap}
.gl-dv .n{padding-right:12px}.gl-dv .v{justify-content:flex-end;padding-left:12px}.gl-dv .x{color:var(--text-danger)}
.gl-dv .l{justify-content:flex-end;border-right:1px solid var(--border-strong)}
.gl-dv i{display:block;height:8px;min-width:2px;background:#888780;opacity:.35}
.gl-dv .l i{border-radius:4px 0 0 4px}.gl-dv .r i{border-radius:0 4px 4px 0}
.gl-dv i.hi,.gl-dv i.bad{opacity:1}.gl-dv i.hi{background:#378ADD}.gl-dv i.bad{background:#E24B4A}
.gl-split{display:flex;gap:2px;height:8px;border-radius:4px;overflow:hidden;margin-bottom:6px}
.gl-split>i{flex:var(--v) 1 0;min-width:2px}
.gl-sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:8px;vertical-align:-1px}
.gl-g1{background:color-mix(in srgb,#888780 75%,transparent)}.gl-g2{background:color-mix(in srgb,#888780 55%,transparent)}.gl-g3{background:color-mix(in srgb,#888780 40%,transparent)}.gl-g4{background:color-mix(in srgb,#888780 28%,transparent)}.gl-g5{background:color-mix(in srgb,#888780 18%,transparent)}
.gl-split>.hi,.gl-sw.hi{background:#378ADD}.gl-split>.bad,.gl-sw.bad{background:#E24B4A}
.gl-key{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12px;color:var(--text-secondary);margin:0 0 8px}
.gl-key i{display:inline-block;width:14px;height:2px;border-radius:1px;background:#888780;vertical-align:middle;margin-right:6px}.gl-key i.hi{background:#378ADD}
.gl-line{position:relative;height:180px}
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
.gl-br{display:grid;grid-template-columns:max-content minmax(64px,1fr) max-content;gap:10px 12px;align-items:center}.gl-br.d{grid-template-columns:max-content minmax(64px,1fr) max-content max-content}
.gl-br .d{font-size:12px;color:var(--text-muted);text-align:right;white-space:nowrap}
.gl-br .n{font-size:13px;color:var(--text-secondary);white-space:nowrap}.gl-br .v{font-size:14px;text-align:right;white-space:nowrap}
.gl-br .n.tot,.gl-br .v.tot{color:var(--text-primary);font-weight:500}.gl-br .x{color:var(--text-danger)}
.gl-br .t{position:relative;height:8px}
.gl-br .t>i{position:absolute;top:0;bottom:0;left:min(var(--a),calc(100% - 2px));width:var(--w);min-width:2px;border-radius:2px;background:#888780;opacity:.35}
.gl-br .t>i.tot{opacity:.75}.gl-br .t>i.hi,.gl-br .t>i.bad{opacity:1}.gl-br .t>i.hi{background:#378ADD}.gl-br .t>i.bad{background:#E24B4A}
.gl-tbl.tr{grid-template-columns:minmax(0,1fr) max-content repeat(var(--c,2),max-content)}
.gl-tbl>.sp{display:flex;align-items:center;padding-left:24px;overflow:visible}
.gl-spk{display:flex;align-items:flex-end;gap:2px;height:16px;width:calc(var(--k,6)*10px - 2px)}
.gl-spk>i{flex:1;height:var(--h);min-height:1px;border-radius:1px 1px 0 0;background:#888780;opacity:.4}
.gl-spk>i.hi,.gl-spk>i.bad{opacity:1}.gl-spk>i.hi{background:#378ADD}.gl-spk>i.bad{background:#E24B4A}
.gl-ba{display:grid;grid-template-columns:minmax(0,1fr) max-content}
.gl-ba>div{padding:9px 0;border-top:0.5px solid var(--border);min-width:0}
.gl-ba>.hd{font-size:12px;color:var(--text-secondary);border-top:0;padding-top:0;padding-bottom:8px}
.gl-ba>.v{text-align:right;padding-left:32px;white-space:nowrap}.gl-ba>.x{color:var(--text-danger)}
.gl-cz{display:grid;grid-template-columns:minmax(0,1fr) minmax(60px,28%) max-content}
.gl-cz>.n,.gl-cz>.b,.gl-cz>.v{border-top:0.5px solid var(--border);padding-top:10px;min-width:0}
.gl-cz>.b,.gl-cz>.v{display:flex;align-items:center;padding-left:12px}.gl-cz>.b>.gl-track{flex:1}
.gl-cz>.v{justify-content:flex-end}.gl-cz>.x{color:var(--text-danger)}
.gl-cz>.it{grid-column:1/-1;font-size:12px;line-height:16px;color:var(--text-muted);padding:3px 0 10px}
.gl-ctl{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 12px}
.gl-chip,.gl-seg>button{font:inherit;font-size:13px;line-height:20px;padding:3px 10px;border-radius:var(--radius);border:0.5px solid var(--border-strong);background:transparent;color:var(--text-secondary);cursor:pointer}
.gl-chip[aria-pressed=true],.gl-seg>button[aria-pressed=true]{background:var(--surface-1);border-color:var(--border-stronger);color:var(--text-primary);font-weight:500}
.gl-seg{display:flex;flex-wrap:wrap;gap:6px}
.gl-find{font:inherit;font-size:13px;height:28px;padding:0 10px;border-radius:var(--radius);border:0.5px solid var(--border-strong);background:transparent;color:var(--text-primary);flex:0 1 200px;min-width:0}
.gl-count{font-size:12px;color:var(--text-muted);margin-left:auto;white-space:nowrap}
.gl :focus-visible{outline:2px solid var(--border-accent);outline-offset:2px}
.gl-dt{width:100%;border-collapse:collapse}
.gl-dt th,.gl-dt td{padding:10px 0;border-top:0.5px solid var(--border);text-align:left;font-weight:400;white-space:nowrap}
.gl-dt th{font-size:12px;color:var(--text-secondary);border-top:0;padding:0 0 8px;vertical-align:bottom}
.gl-dt .num{text-align:right;padding-left:32px}
.gl-dt td:first-child{width:100%;max-width:0;overflow:hidden;text-overflow:ellipsis}
.gl-dt th button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit}
.gl-dt th[aria-sort=ascending] button::after{content:" ↑"}.gl-dt th[aria-sort=descending] button::after{content:" ↓"}
.gl-dt tr.x td,.gl-dt td.x{color:var(--text-danger)}.gl-dt td.w{color:var(--text-warning)}
.gl-dt tr[hidden],.gl-pane[hidden]{display:none}
@container (max-width:520px){.gl-dt .num{padding-left:12px}.gl-count{margin-left:0;flex-basis:100%}.gl-br.d{grid-template-columns:minmax(0,1fr) minmax(48px,32%) max-content;row-gap:4px}.gl-br.d .n{white-space:normal;padding-top:6px}.gl-br.d .t,.gl-br.d .v{padding-top:6px}.gl-br.d .d{grid-column:1/-1;text-align:left}.gl-br.d .d:empty{display:none}.gl-tbl>.num{padding-left:max(12px,calc(28px - var(--c,2)*3px))}.gl-tbl>.hd.num{white-space:normal}.gl-cmp{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}.gl-cmp>.labels{display:none}.gl-cmp>.col{border:0.5px solid var(--border);border-radius:var(--radius)}.gl-cmp>.col>div[data-l]{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:7px 12px}.gl-cmp>.col>div[data-l]::before{content:attr(data-l);font-size:12px;color:var(--text-secondary);flex:none}.gl-cmp>.col>div[data-l]>*{text-align:right;min-width:0}}
</style>
```

## Components

### Section caption

```html
<div class="gl-sec"><div class="gl-cap">Monthly total</div> … </div>
```

A few words in sentence case. Skip it when headers already say it.

### Headline figures: 1 to 4 numbers the answer is about

```html
<div class="gl-sec gl-tiles">
  <div class="gl-tile"><div class="gl-k">Lighthouse score</div><div class="gl-v">41<span class="gl-arw">→</span>88</div></div>
  <div class="gl-tile"><div class="gl-k">Got worse</div><div class="gl-v bad">2 of 8</div></div>
</div>
```

Equal tiles with a soft fill. Add `bad` to a value only when that figure is the problem. An optional neutral `.gl-note` line can go under the value. A single number is a tile, never a chart with one bar.

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
- **As a status grid** (each item in each setting, such as test suites across platforms): one `num` column per setting and one word in each cell ("pass", "fail", "flaky"). Counts and details ("3 of 40 failed") go in the bullets, so every column stays narrow. `x` goes only on the failing cells, not the whole row, so the failures show where they are; a borderline cell gets `w`, which colors only its word. A header with two parts can take two lines (`iOS<br>17`). About five settings fit a narrow panel; with more, split the grid in two.

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

Width % = value ÷ largest value × 100, largest first. Mark only the item the answer is about. Bars show amounts; for a share of a limit, use a meter.

### Meters: one or more values, each against its own limit or whole

```html
<div class="gl-mtr">
  <div class="n x">queue · over limit</div><div class="gl-m bad" style="--lim:93%"><i style="width:100%"></i></div><div class="v x">108 %</div><div class="d x">5.4 of 5 GB</div>
  <div class="n">cache <span class="gl-note warn">tight</span></div><div class="gl-m" style="--lim:93%"><i style="width:82%"></i></div><div class="v">89 %</div><div class="d">7.1 of 8 GB</div>
  <div class="n">db</div><div class="gl-m" style="--lim:93%"><i style="width:22%"></i></div><div class="v">24 %</div><div class="d">120 of 500 GB</div>
</div>
```

- Use for disk or memory against a limit, quota used, budget spent, coverage against a target: anywhere the limit is part of the meaning.
- Every row has four cells: name, meter, value, detail. The value column holds one figure in one format for every row: the share of the limit ("89 %") when the original gives it or it's exact arithmetic, otherwise the amount ("7.1 GB"). The detail column says what it's measured against, as the original writes it ("7.1 of 8 GB", or "of 8 GB"); leave it as an empty `<div class="d"></div>` when there's nothing to add.
- Each meter measures its row against its own limit, all on one shared scale. When nothing is over its limit, width % = the share (capped at 100). When something is over, let S be the largest share (108 for 108 %): width % = share ÷ S × 100, and every meter gets `style="--lim:…%"` set to 100 ÷ S × 100 (93 % here), which draws the limit as a mark, so the overshoot past it shows.
- Over the limit or failing: `bad` on the meter, `x` on the name, value and detail, and the original's word after the name (" · over limit"). Borderline: a `warn` note after the name and nothing else; the meter stays gray. The item the answer is about, when it isn't an exception: `hi`.
- Sort by how full, most first, unless the original's order matters. A single meter is one row.

### Split bar: one total and the parts it's made of

```html
<div class="gl-sec">
  <div class="gl-split"><i class="hi" style="--v:412"></i><i class="gl-g1" style="--v:210"></i><i class="gl-g2" style="--v:96"></i><i class="gl-g3" style="--v:31"></i></div>
  <div class="gl-tbl" style="--c:1">
    <div><i class="gl-sw hi"></i>Videos</div><div class="num">412 GB</div>
    <div><i class="gl-sw gl-g1"></i>Backups</div><div class="num">210 GB</div>
    <div><i class="gl-sw gl-g2"></i>Photos</div><div class="num">96 GB</div>
    <div><i class="gl-sw gl-g3"></i>Other</div><div class="num">31 GB</div>
  </div>
</div>
```

- For 2 to 6 parts, when the answer is about how one total splits ("most of the disk is videos"). To compare the parts with each other, or for more parts, use bars.
- `--v` is the part's value as a plain number, with no unit or separators. The bar has no text; the list under it gives every name and value, in the same order as the blocks, largest first.
- The part the answer is about gets `hi` (or `bad` when it's the problem) on both its block and its swatch. The other parts take `gl-g1`, `gl-g2` and on in order, darkest first, on block and swatch alike.
- Add a share column only when the original gives the shares.

### Diverging bars: changes that go up for some items and down for others

```html
<div class="gl-dv">
  <div class="n x">/feed · slower</div><div class="l"></div><div class="r"><i class="bad" style="width:100%"></i></div><div class="v x">+90 ms</div>
  <div class="n">/profile</div><div class="l"></div><div class="r"><i style="width:17%"></i></div><div class="v">+15 ms</div>
  <div class="n">/upload</div><div class="l"><i style="width:50%"></i></div><div class="r"></div><div class="v">−45 ms</div>
</div>
```

- Every row is one change in the same unit; the vertical line is zero. Decreases grow left from it (in the `l` cell), increases grow right (in the `r` cell); leave the other cell empty.
- Width % = the change's size ÷ the largest change's size × 100, on both sides.
- Only the direction that's bad for the reader is colored: `bad` on the bar, `x` on the name and value, and the original's word after the name. Changes in the good direction stay gray. Write the sign on every value ("+15 ms", "−45 ms").
- Sort by the change, largest first, or worst first, unless the original's order matters.

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

### Bridge: how a total got from A to B

```html
<div class="gl-br">
  <div class="n tot">September</div><div class="t"><i class="tot" style="--a:0%;--w:44%"></i></div><div class="v tot">$2,110</div>
  <div class="n x">NAT Gateway · debug logs</div><div class="t"><i class="bad" style="--a:44%;--w:44.4%"></i></div><div class="v x">+$2,130</div>
  <div class="n">CloudWatch</div><div class="t"><i style="--a:88.4%;--w:7.9%"></i></div><div class="v">+$380</div>
  <div class="n">Other</div><div class="t"><i style="--a:96.4%;--w:3.6%"></i></div><div class="v">+$175</div>
  <div class="n">Savings Plan credit</div><div class="t"><i style="--a:98.6%;--w:1.4%"></i></div><div class="v">−$65</div>
  <div class="n">EC2</div><div class="t"><i style="--a:98.6%;--w:0.6%"></i></div><div class="v">+$30</div>
  <div class="n tot">October</div><div class="t"><i class="tot" style="--a:0%;--w:99.3%"></i></div><div class="v tot">$4,760</div>
</div>
```

Here the running total peaks at $4,795 after "Other", above the end, so S = 4,795 and October's bar stops just short of the edge.

- For an answer that explains how one total became another through a few changes: a bill from one month to the next, a budget to its actual, a load time before and after several fixes. The rows read top to bottom: the start total, one row per change, the end total.
- **It must add up.** Start + every change = end, exactly, using only the answer's figures. If it doesn't, the answer has a remainder: show it as its own row under the answer's name for it ("Other", "not explained"), or, if the answer gives none, use a table instead.
- Geometry, all on one scale: let S be the largest running total (the start, the end or any total in between). A total row has `--a:0%` and `--w` = total ÷ S × 100. A change from running total c₀ to c₁ has `--a` = the smaller of c₀ and c₁ ÷ S × 100 and `--w` = the size of the change ÷ S × 100. Totals start at zero, so they compare honestly; the changes float between them.
- Order the changes biggest first, or in the answer's order when the order means something (steps of a migration). Running totals follow that order, so work them out after sorting.
- Write a sign on every change ("+$2,130", "−$65"). Only the change the answer is about gets `bad` (or `hi` when it's good news), with `x` on its name and value and the answer's word for it after the name; the rest stay gray, increases and decreases alike.
- **Amounts before and after.** When the answer also gives each item's own amounts (September and October for every service), add `d` to the `gl-br` and a fourth cell to every row with them, muted: `<div class="d">$110 → $2,240</div>` (an empty `<div class="d"></div>` on the total rows). Otherwise those numbers would be lost.
- Up to about 10 changes. With more, the answer is really a table.

### Lead item: one item made almost all of the change

```html
<div class="gl-sec gl-tiles">
  <div class="gl-tile"><div class="gl-k">Data transfer out</div><div class="gl-v bad">+$1,580</div><div class="gl-note">of +$1,610 in all · 98 % (calculated)</div></div>
</div>
<div class="gl-sec gl-bars"> … the other changes, largest first … </div>
```

A pattern, not a new component: when one item accounts for nearly all of a change and the rest are small, that item is the headline tile, with its share of the whole in the note when that's exact arithmetic on the answer's figures (marked "calculated"). Every other item follows as bars of their change on one scale, so the reader sees at once how small they are; when the answer gives more than the change for each item (amounts before and after), use a table with every one of its number columns instead, so none is lost. If two or more items matter, use the bridge instead.

### Table with an inline trend: several periods for each row

```html
<div class="gl-sec gl-tbl tr" style="--c:2">
  <div class="hd">Product</div><div class="hd sp">May–Oct</div><div class="hd num">May</div><div class="hd num">Oct</div>
  <div class="x">Logs · up every month</div><div class="sp"><div class="gl-spk" style="--k:6" role="img" aria-label="Logs, May to October: $1,020, $1,240, $1,460, $1,730, $2,040, $2,430"><i style="--h:42%" title="May $1,020"></i><i style="--h:51%" title="Jun $1,240"></i><i style="--h:60%" title="Jul $1,460"></i><i style="--h:71%" title="Aug $1,730"></i><i style="--h:84%" title="Sep $2,040"></i><i class="bad" style="--h:100%" title="Oct $2,430"></i></div></div><div class="num x">$1,020</div><div class="num x">$2,430</div>
  <div>Infra hosts</div><div class="sp"><div class="gl-spk" style="--k:6" role="img" aria-label="Infra hosts, May to October: $900, $870, $900, $870, $900, $900"><i style="--h:100%" title="May $900"></i><i style="--h:97%" title="Jun $870"></i><i style="--h:100%" title="Jul $900"></i><i style="--h:97%" title="Aug $870"></i><i style="--h:100%" title="Sep $900"></i><i style="--h:100%" title="Oct $900"></i></div></div><div class="num">$900</div><div class="num">$900</div>
</div>
```

- For a table where each row has a value per period (up to 12) and the answer is about how each row moved: which grew, which stayed flat, which jumped once. The trend shows the shape; the number columns print the first and last values.
- `--k` is the number of periods. Each `<i>` is one period, oldest first, with `--h` = value ÷ the row's largest value × 100 %, a `title` with the period and value, and the whole trend has a `role="img"` and an `aria-label` listing every value. Columns start at zero.
- Each row is scaled to its own largest value, so the trend compares shapes, not sizes; the printed numbers carry the sizes. Say so in the caption if the answer invites comparing rows by height.
- Mark the period the answer is about (`bad` for a jump that's the problem, `hi` otherwise) only in the row it's about. Exception rows follow the Table rules.
- When the answer gives only two periods, there's no trend to show: use the plain table.

### Before → after against a benchmark

```html
<div class="gl-sec gl-ba">
  <div class="hd">Team</div><div class="hd v">Q2 → Q3</div>
  <div class="x">Data platform · over budget</div><div class="v x">$41,200<span class="gl-arw">→</span>$58,900<span class="gl-q">budget $50,000</span></div>
  <div>Web</div><div class="v">$22,400<span class="gl-arw">→</span>$21,100<span class="gl-q">budget $25,000</span></div>
</div>
```

- For items that each moved from one value to another and are judged against a third value the answer gives for each: a budget, a target, a competitor's score. The benchmark sits muted under the new value, so the reader compares the two numbers that matter without a third column.
- Same unit within a row. The benchmark keeps the answer's own label ("budget", "AutoSync", "target").
- A row that ends on the wrong side of its benchmark gets `x` on both cells and the answer's word after the name ("· over budget", "· still behind"); rows on the right side stay plain.
- Sort with the rows that miss their benchmark first, then by the size of the change, unless the answer's order matters. This is the one table whose rows take two lines.

### Causes with counts: problems grouped by why they happen

```html
<div class="gl-sec gl-cz">
  <div class="n">Russian checked against an English track <span class="gl-note">fix built</span></div><div class="b"><div class="gl-track"><div class="gl-fill bad" style="width:100%"></div></div></div><div class="v">10</div>
  <div class="it">Sherlock RU first, Fargo RU best, Dark RU best, …every item the answer names</div>
  <div class="n">Scoring reference needs fixing <span class="gl-note bad">open</span></div><div class="b"><div class="gl-track"><div class="gl-fill" style="width:60%"></div></div></div><div class="v">6</div>
  <div class="it">Detectorists EN first, Fleabag EN best, Succession EN first, …</div>
</div>
```

- For failures, losses, waste or problems the answer groups by cause: one row per cause with its count or amount, and the items it affects listed underneath in small muted text. It's a list and a bar chart in one, so the reader sees which cause matters most and exactly what it covers.
- Use the answer's own causes, its own grouping and its own counts. Never regroup the items, and list every item the answer names under its cause (no "and 6 more" when the answer names them).
- The bar carries the number the answer ranks the causes by: a count, or an amount such as cost per month. When the answer gives both, the bar and the value column take the one it leads with and the other goes after the name ("Unattached EBS volumes · 3"). Bars share one scale: width % = value ÷ the largest value × 100, largest first. Mark only the cause the answer is about.
- A status the answer gives for a cause ("fix built", "re-measuring", "open") is a plain `gl-note` right after its name; only a status that's still a problem gets `bad`.

### Interactive table: many rows, or one set of rows sliced several ways

Only when SKILL.md's rule for interaction says so (about 15 rows or more, or two or more ways to slice the same rows). Everything else stays static.

```html
<div class="gl-sec" data-gl-view>
  <div class="gl-ctl">
    <div class="gl-seg" role="group" aria-label="Show">
      <button type="button" class="gl-chip" aria-pressed="true" data-f="">All</button>
      <button type="button" class="gl-chip" aria-pressed="false" data-f="lose">Losses only</button>
    </div>
    <input class="gl-find" type="search" placeholder="Find a title" aria-label="Find a title">
    <span class="gl-count" aria-live="polite">25 of 25 shown</span>
  </div>
  <table class="gl-dt">
    <thead><tr><th scope="col"><button type="button">Title</button></th><th scope="col" class="num"><button type="button">EN best</button></th><th scope="col" class="num"><button type="button">RU first</button></th></tr></thead>
    <tbody>
      <tr data-tags="lose"><td>The Station Agent</td><td class="num x" data-v="0">lose</td><td class="num x" data-v="0">lose</td></tr>
      <tr><td>Sherlock</td><td class="num" data-v="2">beat</td><td class="num" data-v="2">beat</td></tr>
    </tbody>
  </table>
</div>
```

- A real `<table>`, so screen readers announce rows, columns and the sort. The first column is the row's name; every other column is `num`, right-aligned like the static table, with `x` (failing, worse) and `w` (borderline) on cells and `class="x"` on a `<tr>` for a whole exception row, exactly as in Table.
- **Sorting:** every header that can be sorted holds a `<button>`. A cell sorts by its `data-v` when it has one (a plain number: the amount without its unit, or a rank for words, such as lose 0, tie 1, beat 2) and by its text otherwise. Give `data-v` to every cell of a column or to none.
- **Filter chips** use the answer's own categories and words ("Losses only", "Failing", "Over budget"); a row belongs to a chip through the words in its `data-tags`. The first chip, `data-f=""`, shows every row. One group, one chip pressed at a time.
- **Search** (`gl-find`) only when there are enough rows that people would look for one by name, roughly 30 or more. It matches the row's text.
- **The count** (`gl-count`) always says how many rows are showing: "12 of 40 shown".
- The first view is the static picture: every row shown, already sorted and marked the way the answer needs. Mark the column it's sorted by with `aria-sort="descending"` or `"ascending"` on its `<th>`.

### View switch: one slice at a time

```html
<div class="gl-sec">
  <div class="gl-ctl"><div class="gl-seg" role="group" aria-label="Month">
    <button type="button" aria-pressed="false" aria-controls="gl-v-sep">September</button>
    <button type="button" aria-pressed="true" aria-controls="gl-v-oct">October</button>
  </div></div>
  <div class="gl-pane" id="gl-v-sep"> … September's services, as a table or bars … </div>
  <div class="gl-pane" id="gl-v-oct"> … October's services … </div>
</div>
```

- For an answer that gives the same rows for several slices (each month's services, each language's results) when the reader needs one slice at a time. Each pane is an ordinary kit component; each button's `aria-controls` names its pane's `id` (make the ids unique, `gl-v-…`).
- The pressed button is the slice the answer is about, so the first view answers the question. While the widget streams, every pane is visible; the script then shows only the pressed one.
- Two to about six slices. With more, it's a table with a column per slice.

### The script for interactive pieces

Paste once, as the last thing in the widget, whenever the picture has a `data-gl-view` section or a view switch:

```html
<script>
(()=>{const P='aria-pressed',S='aria-sort';
for(const v of document.querySelectorAll('[data-gl-view]')){const tb=v.querySelector('.gl-dt tbody');if(!tb)continue;
const rows=[...tb.rows],cnt=v.querySelector('.gl-count'),find=v.querySelector('.gl-find'),chips=[...v.querySelectorAll('.gl-chip')];let f='',q='';
const apply=()=>{let k=0;for(const r of rows){const ok=(!f||(r.dataset.tags||'').split(' ').includes(f))&&(!q||r.textContent.toLowerCase().includes(q));r.hidden=!ok;if(ok)k++}if(cnt)cnt.textContent=k+' of '+rows.length+' shown'};
for(const c of chips)c.addEventListener('click',()=>{for(const o of chips)o.setAttribute(P,o===c);f=c.dataset.f||'';apply()});
if(find)find.addEventListener('input',()=>{q=find.value.trim().toLowerCase();apply()});
const ths=[...v.querySelectorAll('.gl-dt thead th')];
ths.forEach((th,i)=>{const b=th.querySelector('button');if(!b)return;b.addEventListener('click',()=>{
const num=rows.some(r=>r.cells[i]&&r.cells[i].dataset.v!==undefined),cur=th.getAttribute(S);
const dir=cur?(cur==='descending'?'ascending':'descending'):(num?'descending':'ascending');
for(const o of ths)o.removeAttribute(S);th.setAttribute(S,dir);
const key=r=>{const c=r.cells[i];return num?parseFloat(c.dataset.v):c.textContent.trim().toLowerCase()};
[...tb.rows].sort((a,b)=>{const x=key(a),y=key(b),d=num?x-y:String(x).localeCompare(String(y));return dir==='ascending'?d:-d}).forEach(r=>tb.appendChild(r))})});
apply()}
for(const g of document.querySelectorAll('.gl-seg')){const bs=[...g.querySelectorAll('button[aria-controls]')];if(!bs.length)continue;
const show=b=>{for(const o of bs){o.setAttribute(P,o===b);const p=document.getElementById(o.getAttribute('aria-controls'));if(p)p.hidden=o!==b}};
bs.forEach(b=>b.addEventListener('click',()=>show(b)));show(bs.find(b=>b.getAttribute(P)==='true')||bs[0])}})();
</script>
```

- It only reorders and hides rows and panes that are already on the page; it never creates, changes or computes a value, and reads no data from anywhere else.
- Controls are ordinary buttons and a search field, so Tab, Enter and Space work, and the focus ring comes from the kit.

### Lines with many points (more than 12)

Use Chart.js only here; everything else is plain HTML. One line, or two when the answer compares two series in the same unit: the one it's about in the accent, the other gray, with a `gl-key` above the chart naming both. Never a second y-axis.

```html
<div class="gl-key"><span><i class="hi"></i>This year</span><span><i></i>Last year</span></div>
<div class="gl-line"><canvas id="gl-line" role="img" aria-label="What the line shows">Every point as text: 1 May 0.4 %, 2 May 0.3 %, …</canvas></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<script>
(()=>{const r=document.documentElement,cs=getComputedStyle(r),tk=(n,f)=>cs.getPropertyValue(n).trim()||f;
const dk=r.dataset.mode?r.dataset.mode==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
const mu=tk('--text-muted','#898781'),ink=tk('--text-primary','#0b0b0b'),sec=tk('--text-secondary','#52514e'),srf=tk('--surface-2','#ffffff'),bd=tk('--border-strong','rgba(11,11,11,.22)'),font=tk('--font-sans','sans-serif');
const fmt=v=>v.toLocaleString('en-US');
const cross={id:'glx',afterDatasetsDraw(c){const a=c.tooltip&&c.tooltip.getActiveElements();if(!a||!a.length)return;const x=a[0].element.x,g=c.ctx;g.save();g.strokeStyle=mu;g.lineWidth=1;g.beginPath();g.moveTo(x,c.chartArea.top);g.lineTo(x,c.chartArea.bottom);g.stroke();g.restore();}};
const end={id:'gle',afterDatasetsDraw(c){const m=c.getDatasetMeta(0).data,p=m[m.length-1];if(!p)return;const g=c.ctx,d=c.data.datasets[0].data;g.save();g.fillStyle=ink;g.font='500 12px '+font;g.textAlign='right';g.fillText(fmt(d[d.length-1]),p.x,p.y-8);g.restore();}};
const line=(data,color,label,bad)=>({data,label,borderColor:color,borderWidth:2,pointRadius:0,pointHoverRadius:4,pointHoverBackgroundColor:color,pointHoverBorderColor:srf,pointHoverBorderWidth:2,tension:.25,segment:{borderColor:s=>bad&&s.p0DataIndex>=bad[0]&&s.p1DataIndex<=bad[1]?'#E24B4A':undefined}});
new Chart(document.getElementById('gl-line'),{type:'line',
data:{labels:[/* … */],datasets:[line([/* … */],'#378ADD','This year'),line([/* … */],'#888780','Last year')]},
options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:20}},interaction:{mode:'index',intersect:false},
plugins:{legend:{display:false},tooltip:{backgroundColor:srf,borderColor:bd,borderWidth:0.5,titleColor:sec,bodyColor:ink,titleFont:{size:12,weight:'400'},bodyFont:{size:13,weight:'500'},padding:8,displayColors:false,callbacks:{label:i=>fmt(i.parsed.y)+(c=>c>1?'  '+i.dataset.label:'')(i.chart.data.datasets.length)}}},
scales:{x:{grid:{display:false},ticks:{color:mu,font:{size:12},maxRotation:0,autoSkipPadding:16}},y:{beginAtZero:true,grid:{color:dk?'#2c2c2a':'#e1e0d9'},border:{display:false},ticks:{color:mu,font:{size:12},callback:fmt}}}},plugins:[cross,end]});})();
</script>
```

- With one line, drop the `gl-key` and the second `line(…)`.
- The y-axis starts at zero, like bars, so a drop to half looks like half. Don't change it.
- When the answer is about one stretch of the line (a dip, a spike, an outage), pass the index of its first and last point as the fourth argument, for example `line([/* … */],'#378ADD','',[20,23])` for an outage on the 21st to the 24th point. That stretch turns the alert red, and the section caption names it in words ("Error rate, May · outage 21–24 May"), since color alone isn't enough.
- `fmt` writes values the way the original does: change it to add the unit (`v=>v+' ms'`) or the currency (`v=>'$'+v.toLocaleString('en-US')`).
- The canvas text lists every point, so every value is on the picture without hovering. The chart prints only the last value; hovering anywhere shows a guide line and that date's values.
- Colors are read from the app's theme at load, so the chart matches light and dark mode.

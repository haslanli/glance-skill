# glance UI kit

Build every glance picture from this kit. It handles spacing, type, alignment, light and dark mode, and narrow panels, so every picture comes out at the same quality.

Contents: The look · How to use it · CSS · Components: card, headline figures, table, gauge, bars, split bar, columns, bridge, inline trend, diverging bars, comparison, status grid, interactive table, view switch, line · The script.

## The look

Calm and built with care, like a well-made report. Each part of the answer sits on its own grey card; size does the ranking (one big figure, everything else smaller); type, alignment and space do the rest. No boxes inside cards, no badges, no decoration.

- **Three colors, three jobs.** Soft blue for every ordinary mark. Blue for the one thing to look at: the figure, row, bar or option the answer is about. Red only for a value past a line the answer gives (a limit, budget, target) or failing, and only on that value: its number, the part of its bar past the line, its word. No green, no amber marks; "tight" or "borderline" is a word in the warning text color.
- **Data in ink, grey only for labels.** Every value is in the primary text color; grey is for labels, units, notes and axis text. Nothing smaller than 12 px, and labels and notes are 13 px.
- **Units once.** The unit goes in the column header, the row label or the card's subtitle ("Dollars a month", "RAM (GB)"), and cells hold plain numbers. Write every value in full the same way within a column (no "61k" next to "48,000").
- **Qualifiers are marks.** "About" is `~`, "at least" is `>`, "at most" is `<`, right before the number, with no legend: `~1,750`, `>3,360`, `~$50.4k`.
- **Notes go in the subtitle.** What the reader needs to read a card (a unit, a scale break, a cut bar, a magnification, what a tick means) goes in the card's subtitle, never as text inside the plot.
- **No flag after a name.** A row that's past a line shows it with its value (red), its gauge (the overshoot red) and, when the answer says by how much, a short line under its name ("8,900 over"). Never a dot-and-word tag after the name.
- **Differences you can see.** When compared values would draw less than about 4 px apart, or a mark would be under 4 px, change the form honestly and say so in the subtitle: give a line a fitted scale, break the scale, cut the outlier, or give the small values their own panel with an exact factor. Bars and columns always start at zero.
- **Every value is printed** on the picture. The one exception is a line with more than 12 points: it labels the points the answer names plus the last one, and the hover readout carries the rest.
- **Narrow panels.** At 520 px and below, table rows become two aligned lines (the name, then the values in the same columns as the header), comparisons stack with the pick first, and nothing scrolls sideways.

## How to use it

1. Put the CSS block below at the top of the widget, exactly as written.
2. Right after it, one `<h2 class="sr-only">` with one sentence on what the picture shows, for screen readers.
3. Wrap the whole picture in one `<div class="gl">`. Each part of the answer is one `<section class="gl-card">`, at most three cards (headline figures count as one).
4. Use only these components. Don't restyle them and don't add inline styles other than the documented ones: `--c`, `--nc`, `--cols`, `--lw`, `--v`, `--a`, `--w`, `--n`, `--nw`, `flex`, `width`, `height`, `left`, `top`.
5. A value the answer doesn't give is `—`, never a guess.

## CSS

```html
<style>
.gl{--gl-a:#378ADD;--gl-r:#E24B4A;--gl-s:color-mix(in srgb,#378ADD 55%,transparent);--gl-use:color-mix(in srgb,var(--text-primary) 38%,transparent);--gl-track:color-mix(in srgb,var(--text-primary) 10%,transparent);--gl-panel:color-mix(in srgb,var(--text-primary) 4%,transparent);--gl-ring:color-mix(in srgb,var(--text-primary) 4%,var(--surface-0));--gl-rule:color-mix(in srgb,var(--text-primary) 12%,transparent);--gl-rule2:color-mix(in srgb,var(--text-primary) 72%,transparent);--gl-lane:color-mix(in srgb,#378ADD 10%,transparent);--gl-pick:color-mix(in srgb,#378ADD 12%,transparent);font-size:14px;line-height:20px;color:var(--text-primary);font-variant-numeric:tabular-nums;container-type:inline-size}
.gl *{box-sizing:border-box;margin:0}
.gl [hidden]{display:none!important}
.gl :focus-visible{outline:2px solid var(--border-accent);outline-offset:2px}
.gl-card{background:var(--gl-panel);border-radius:16px;padding:24px}
.gl-card+.gl-card,.gl-card+.gl-bento,.gl-bento+.gl-card{margin-top:12px}
.gl-hd{margin-bottom:16px}
.gl-t{font-size:15px;line-height:20px;font-weight:600}
.gl-sub{font-size:13px;line-height:18px;color:var(--text-secondary);margin-top:2px}
.gl-mk{margin-right:1px}
.gl .x{color:var(--text-danger);font-weight:600}.gl .w{color:var(--text-warning);font-weight:600}
.gl-figs{display:flex;align-items:stretch;justify-content:space-between;gap:24px 40px}
.gl-fig .gl-k{font-size:13px;line-height:18px;color:var(--text-secondary)}
.gl-fig .gl-v{font-size:24px;line-height:32px;font-weight:600;letter-spacing:-.01em;white-space:nowrap;margin-top:4px}
.gl-fig .gl-n{font-size:13px;line-height:18px;color:var(--text-secondary);margin-top:4px}
.gl-fig.hero .gl-v{font-size:48px;line-height:52px;letter-spacing:-.02em;color:var(--text-accent)}
.gl-fig.hero .gl-v.bad{color:var(--text-danger)}
.gl-fig .gl-v .gl-mk{font-size:.78em;font-weight:500}
.gl-fig .gl-ga{width:240px;margin-top:12px}
.gl-sup{display:flex;flex-direction:column;justify-content:center;gap:20px;padding-left:32px;border-left:1px solid var(--gl-rule);min-width:12em}
.gl-sup.row{flex-direction:row;align-items:flex-start;gap:32px;min-width:0}
.gl-tb{position:relative;--c:2;display:grid;grid-template-columns:var(--cols,minmax(0,1fr) repeat(var(--c),max-content));column-gap:20px}
.gl-tb.lane::before{content:"";position:absolute;top:-10px;bottom:-6px;right:-12px;width:calc(var(--lw) + 24px);border-radius:8px;background:var(--gl-lane)}
.gl-tb>*{position:relative;grid-column:1/-1}
.gl-row{display:grid;grid-template-columns:subgrid;align-items:center;padding:10px 0 12px;border-top:1px solid var(--gl-rule)}
.gl-row.h{border-top:0;border-bottom:1px solid var(--gl-rule2);padding:0 0 8px;align-items:end}
.gl-row.h>*{font-size:13px;line-height:18px;color:var(--text-secondary);font-weight:500}
.gl-row.h+.gl-row,.gl-gh+.gl-row{border-top:0}
.gl-row.tot{border-top:1px solid var(--gl-rule2);font-weight:600}
.gl-row .num{text-align:right;white-space:nowrap}
.gl-row .gc{width:96px}
.gl-row button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:inherit}
.gl-row [aria-sort] button{color:var(--text-accent)}.gl-row [aria-sort=ascending] button::after{content:" ↑"}.gl-row [aria-sort=descending] button::after{content:" ↓"}
.gl-nm{min-width:0;overflow-wrap:break-word}
.gl-nm small{display:block;font-size:13px;line-height:18px;color:var(--text-secondary);font-weight:400}
.gl-nm small.x{color:var(--text-danger);font-weight:500}.gl-nm small.w{color:var(--text-warning);font-weight:500}
.gl-gh{display:flex;justify-content:space-between;align-items:baseline;padding:24px 0 8px;border-bottom:1px solid var(--gl-rule)}
.gl-gh:first-child,.gl-row.h+.gl-gh{padding-top:12px}
.gl-gh b{font-weight:600}.gl-gh span{font-size:13px;color:var(--text-secondary)}
.gl-ga{display:flex;align-items:center;gap:2px;height:10px;width:100%}
.gl-ga>i{display:block;height:10px;min-width:2px;background:var(--gl-s)}
.gl-ga>i:first-child{border-radius:3px 0 0 3px}.gl-ga>i:last-child{border-radius:0 3px 3px 0}.gl-ga>i:only-child{border-radius:3px}
.gl-ga>.use{background:var(--gl-use)}.gl-ga>.hi{background:var(--gl-a)}.gl-ga>.rest{background:var(--gl-track)}.gl-ga>.bad{background:var(--gl-r)}
.gl-ga.lim{gap:0;--v:0}
.gl-ga.lim>i{border-radius:0}
.gl-ga.lim>.f{flex:none;width:calc(min(var(--v),1)*80%);border-radius:3px 0 0 3px}
.gl-ga.lim>.rest{flex:none;width:calc((1 - min(var(--v),1))*80%)}
.gl-ga.lim>.tick{flex:none;width:2px;min-width:2px;height:18px;border-radius:1px;background:var(--text-primary)}
.gl-ga.lim>.bad{flex:none;width:calc(clamp(0,var(--v) - 1,.25)*80%);min-width:0;border-radius:0 3px 3px 0}
.gl-ga.lim.hi>.f{background:var(--gl-a)}.gl-ga.lim>.f.use{background:var(--gl-use)}
.gl-bars{display:grid;grid-template-columns:var(--nw,fit-content(40%)) minmax(0,1fr) 4.8em;gap:8px 16px;align-items:center}
.gl-bars>.gl-b{display:contents}
.gl-bars .n{color:var(--text-secondary);min-width:0;overflow-wrap:break-word}
.gl-bars .gl-b.hi .n{color:var(--text-primary);font-weight:600}
.gl-bars .t{display:flex;align-items:center;min-height:24px}
.gl-bars .t>i{position:relative;display:block;height:16px;min-width:3px;border-radius:0 4px 4px 0;background:var(--gl-s)}
.gl-bars .gl-b.hi .t>i{background:var(--gl-a)}.gl-bars .gl-b.bad .t>i{background:var(--gl-r)}
.gl-bars .v{text-align:right;white-space:nowrap}
.gl-bars .gl-b.hi .v{font-weight:600}
.gl-zoom{grid-column:1/-1;margin-top:10px;padding-top:12px;border-top:1px dashed color-mix(in srgb,var(--text-primary) 22%,transparent);font-size:13px;line-height:18px;color:var(--text-secondary)}
.gl-cut{position:absolute;top:-3px;bottom:-3px;left:82%;width:7px;background:var(--gl-ring);transform:skewX(-20deg)}
.gl-split{display:flex;gap:2px;height:16px;margin-bottom:16px}
.gl-split>i{display:block;min-width:3px;background:var(--gl-s)}
.gl-split>i:first-child{border-radius:4px 0 0 4px}.gl-split>i:last-child{border-radius:0 4px 4px 0}
.gl-split>i.hi{background:var(--gl-a)}.gl-split>i.bad{background:var(--gl-r)}
.gl-cols{position:relative;height:180px;display:grid;grid-template-columns:repeat(var(--n),1fr);align-items:end;border-bottom:1px solid color-mix(in srgb,var(--text-primary) 40%,transparent)}
.gl-col{position:relative;height:100%;display:flex;align-items:flex-end;justify-content:center}
.gl-col>i{position:relative;display:block;width:28px;border-radius:6px 6px 0 0;background:var(--gl-s)}
.gl-col.hi>i{background:var(--gl-a)}.gl-col.bad>i{background:var(--gl-r)}
.gl-col .gl-cut{left:-4px;right:-4px;width:auto;height:7px;top:14px;bottom:auto;transform:skewY(-12deg)}
.gl-axis{display:grid;grid-template-columns:repeat(var(--n),1fr);margin-top:10px;text-align:center;font-size:13px;line-height:18px}
.gl-axis span{display:block;color:var(--text-secondary)}.gl-axis b{display:block;font-weight:400}
.gl-axis .hi span,.gl-axis .hi b{color:var(--text-primary);font-weight:600}
.gl-br{display:grid;grid-template-columns:var(--nw,fit-content(40%)) minmax(0,1fr) 4.8em;gap:8px 16px;align-items:center}
.gl-br>.gl-s{display:contents}
.gl-br .n{color:var(--text-secondary);min-width:0}.gl-br .gl-s.tot .n,.gl-br .gl-s.tot .v,.gl-br .gl-s.hi .n{color:var(--text-primary);font-weight:600}
.gl-br .t{position:relative;height:16px}
.gl-br .t>i{position:absolute;top:0;bottom:0;left:var(--a);width:var(--w);min-width:3px;border-radius:2px;background:var(--gl-s)}
.gl-br .gl-s.tot .t>i{background:var(--gl-use)}.gl-br .gl-s.hi .t>i{background:var(--gl-a)}.gl-br .gl-s.bad .t>i{background:var(--gl-r)}
.gl-br .v{text-align:right;white-space:nowrap}
.gl-spk{display:flex;align-items:flex-end;gap:2px;height:22px;width:66px}
.gl-spk>i{flex:1;min-height:1px;border-radius:1px 1px 0 0;background:var(--gl-s)}
.gl-spk>i.hi{background:var(--gl-a)}.gl-spk>i.bad{background:var(--gl-r)}
.gl-dv{display:grid;grid-template-columns:var(--nw,fit-content(38%)) minmax(0,1fr) minmax(0,1fr) 4.8em;align-items:center;row-gap:8px}
.gl-dv>.gl-s{display:contents}
.gl-dv .n{color:var(--text-secondary);padding-right:16px;min-width:0}.gl-dv .gl-s.hi .n{color:var(--text-primary);font-weight:600}
.gl-dv .l,.gl-dv .r{height:24px;display:flex;align-items:center}
.gl-dv .l{justify-content:flex-end;border-right:1px solid color-mix(in srgb,var(--text-primary) 45%,transparent)}
.gl-dv i{display:block;height:16px;min-width:3px;background:var(--gl-s)}
.gl-dv .l i{border-radius:4px 0 0 4px}.gl-dv .r i{border-radius:0 4px 4px 0}
.gl-dv .gl-s.hi i{background:var(--gl-a)}.gl-dv .gl-s.bad i{background:var(--gl-r)}
.gl-dv .v{text-align:right;padding-left:16px;white-space:nowrap}.gl-dv .gl-s.hi .v{font-weight:600}
.gl-bento{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:12px}
.gl-pick,.gl-alt{background:var(--gl-panel);border-radius:16px;padding:20px}
.gl-pick{background:var(--gl-pick)}
.gl-alts{display:grid;gap:12px}
.gl-vd{font-size:13px;line-height:18px;font-weight:600}
.gl-vd.pick{color:var(--text-accent)}.gl-vd.bad{color:var(--text-danger)}.gl-vd.warn{color:var(--text-warning)}
.gl-alt .gl-vd{font-size:16px;line-height:22px}
.gl-pick h4{font-size:22px;line-height:28px;font-weight:600;margin-top:6px}
.gl-price{margin-top:6px;font-size:14px;color:var(--text-secondary)}
.gl-price b{font-size:40px;line-height:44px;font-weight:600;letter-spacing:-.02em;color:var(--text-primary);margin-right:4px}
.gl-price.x b{color:var(--text-danger)}
.gl-specs{margin-top:18px}
.gl-kv{display:grid;grid-template-columns:7.5em minmax(0,1fr);gap:12px;padding:8px 0;border-top:1px solid var(--gl-rule)}
.gl-kv dt,.gl-mini dt{font-size:13px;line-height:20px;color:var(--text-secondary)}
.gl-kv dd,.gl-mini dd{margin:0;min-width:0}
.gl-kv dd small{font-size:13px;color:var(--text-secondary);margin-left:6px;font-weight:400}
.gl-kv.x dd,.gl-mini .x dd{color:var(--text-danger);font-weight:600}.gl-kv.w dd,.gl-mini .w dd{color:var(--text-warning);font-weight:600}
.gl-nmrow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:4px}
.gl-nmrow b{font-weight:600}
.gl-pr2{font-size:13px;color:var(--text-secondary);white-space:nowrap}.gl-pr2 b{font-size:18px;color:var(--text-primary);font-weight:600}
.gl-pr2.x b{color:var(--text-danger)}
.gl-mini{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--gl-rule)}
.gl-mini dt{font-size:12px;line-height:16px}
.gl-mini dd{font-size:13px;line-height:18px}
.gl-mini dd small{display:block;font-size:12px;line-height:16px;color:var(--text-secondary);font-weight:400}
.gl-cell{text-align:center;font-size:13px;color:var(--text-secondary);border-radius:6px;padding:2px 0}
.gl-cell.fail{color:var(--text-danger);font-weight:600;background:color-mix(in srgb,#E24B4A 12%,transparent)}
.gl-cell.warn{color:var(--text-warning);font-weight:500}
.gl-ctl{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 12px}
.gl-chip{font:inherit;font-size:13px;line-height:20px;padding:4px 12px;border-radius:8px;border:0;background:var(--gl-panel);color:var(--text-primary);cursor:pointer}
.gl-chip[aria-pressed=true]{background:var(--bg-accent);color:var(--text-accent);font-weight:600}
.gl-find{font:inherit;font-size:13px;height:28px;padding:0 10px;border-radius:8px;border:1px solid var(--gl-rule);background:transparent;color:var(--text-primary);flex:0 1 200px;min-width:0}
.gl-count{margin-left:auto;font-size:13px;color:var(--text-secondary);white-space:nowrap}
.gl-more{margin-top:12px;font:inherit;font-size:13px;border:0;background:var(--gl-panel);border-radius:8px;padding:6px 12px;color:var(--text-primary);cursor:pointer}
.gl-seg{display:inline-flex;flex-wrap:wrap;background:var(--gl-panel);border-radius:10px;padding:3px;gap:2px;margin-bottom:16px}
.gl-seg button{font:inherit;font-size:13px;border:0;background:transparent;border-radius:8px;padding:4px 12px;color:var(--text-primary);cursor:pointer}
.gl-seg button[aria-pressed=true]{background:var(--surface-0);font-weight:600;box-shadow:0 0 0 .5px var(--gl-rule)}
.gl-line{position:relative}
.gl-plot{position:relative;height:200px}
.gl-plot svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.gl-ln{fill:none;stroke:var(--gl-s);stroke-width:2;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.gl-ln.hi{stroke:var(--gl-a);stroke-width:3}.gl-ln.bad{stroke:var(--gl-r);stroke-width:3}.gl-ln.skip{stroke-dasharray:2 5;stroke-linecap:butt}
.gl-g{position:absolute;left:0;right:0;border-top:1px solid var(--gl-rule)}
.gl-g.z{border-top-color:color-mix(in srgb,var(--text-primary) 40%,transparent)}
.gl-g span{position:absolute;left:0;bottom:3px;font-size:12px;line-height:16px;color:var(--text-secondary)}
.gl-pt{position:absolute;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:var(--gl-s);box-shadow:0 0 0 2px var(--gl-ring);z-index:2}
.gl-pt.hi{width:12px;height:12px;margin:-6px 0 0 -6px;background:var(--gl-a)}.gl-pt.bad{width:12px;height:12px;margin:-6px 0 0 -6px;background:var(--gl-r)}
.gl-lab{position:absolute;font-size:13px;line-height:18px;font-weight:600;white-space:nowrap;z-index:2;transform:translate(-50%,calc(-100% - 10px))}
.gl-lab.below{transform:translate(-50%,12px)}.gl-lab.end{transform:translate(calc(-100% - 12px),-50%)}
.gl-head{position:absolute;top:0;right:0;display:flex;flex-direction:column;align-items:flex-end}
.gl-head b{font-size:26px;line-height:30px;font-weight:600;letter-spacing:-.015em}
.gl-head span{font-size:13px;line-height:18px;color:var(--text-secondary)}
.gl-line:has(.gl-head){padding-top:64px}
.gl-xax{position:relative;height:18px;margin-top:8px;font-size:13px;line-height:18px;color:var(--text-secondary)}
.gl-xax span{position:absolute;transform:translateX(-50%);white-space:nowrap}.gl-xax span:first-child{transform:none}.gl-xax span:last-child{transform:translateX(-100%)}
.gl-guide{position:absolute;top:0;bottom:0;width:1px;background:var(--text-secondary);pointer-events:none}
.gl-read{position:absolute;top:-8px;transform:translate(-50%,-100%);background:var(--surface-0);border-radius:6px;padding:2px 8px;font-size:13px;white-space:nowrap;box-shadow:0 0 0 .5px var(--gl-rule);pointer-events:none;z-index:3}
@container (max-width:520px){
.gl-card{padding:16px}
.gl-figs{flex-wrap:wrap}.gl-fig.hero{flex-basis:100%}.gl-fig.hero .gl-v{font-size:40px;line-height:44px}.gl-fig .gl-v{font-size:20px;line-height:28px}
.gl-sup{flex-direction:row;flex-wrap:wrap;justify-content:flex-start;padding:16px 0 0;border-left:0;border-top:1px solid var(--gl-rule);gap:16px 24px;flex:1 1 100%;min-width:0}
.gl-tb{column-gap:12px}
.gl-tb.stack,.gl-tb:has(>.gl-row>:nth-child(5)){grid-template-columns:repeat(var(--nc,var(--c)),1fr)}
.gl-tb.stack>.gl-row,.gl-row:has(>:nth-child(5)){row-gap:4px}
.gl-tb.stack>.gl-row>:first-child,.gl-row:has(>:nth-child(5))>:first-child{grid-column:1/-1}
.gl-tb.stack>.gl-row:has(>.top)>:first-child,.gl-row:has(>:nth-child(5)):has(>.top)>:first-child{grid-column:1/-2}
.gl-tb.stack>.gl-row>.top,.gl-row:has(>:nth-child(5))>.top{grid-row:1;grid-column:-2/-1}
.gl-tb.stack .gc,.gl-row:has(>:nth-child(5)) .gc{width:auto}
.gl-tb.lane::before{display:none}
.gl-bars,.gl-br{grid-template-columns:fit-content(36%) minmax(0,1fr) 4.2em;column-gap:12px}
.gl-dv{grid-template-columns:fit-content(34%) minmax(0,1fr) minmax(0,1fr) 4.2em}
.gl-col>i{width:20px}.gl-axis{font-size:12px}
.gl-bento{grid-template-columns:1fr}.gl-mini{grid-template-columns:repeat(2,minmax(0,1fr))}.gl-price b{font-size:36px}.gl-kv{grid-template-columns:6.5em minmax(0,1fr)}
.gl-count{margin-left:0;flex-basis:100%}
.gl-head b{font-size:22px;line-height:26px}
}
</style>
```

## Components

### Card: one part of the answer

```html
<section class="gl-card">
  <header class="gl-hd"><h3 class="gl-t">Monthly AWS bill</h3><p class="gl-sub">Dollars, May to October</p></header>
  … one component …
</section>
```

The title says what the card shows in the answer's words. The subtitle carries the unit and anything the reader needs to read the card: "The scale jumps from 2,200 to 4,600.", "NAT Gateway's bar is cut to fit.", "The tick on each bar is the team's budget." Two subtitles at most. Headline figures need no title.

### Headline figures: 1 to 4 numbers the answer is about

```html
<section class="gl-card"><div class="gl-figs">
  <div class="gl-fig hero"><div class="gl-k">Total a year</div><div class="gl-v"><span class="gl-mk">~</span>$50.4k</div><div class="gl-n">24% of the $205k you spend</div></div>
  <div class="gl-sup">
    <div class="gl-fig"><div class="gl-k">Cancel or shrink 6 tools</div><div class="gl-v"><span class="gl-mk">~</span>$46.6k</div></div>
    <div class="gl-fig"><div class="gl-k">Drop unused seats on 5 tools</div><div class="gl-v"><span class="gl-mk">~</span>$3.8k</div></div>
  </div>
</div></section>
```

- One `hero`: the figure the answer is about, large and blue. When that figure is itself past a line (over budget, failing), `gl-v bad` makes it red. Everything else is in `gl-sup`, smaller, stacked beside it (`gl-sup row` puts three side by side).
- The label (`gl-k`) above, a short note (`gl-n`) below when the answer gives one. A hero measured against a limit can carry a gauge under it (`<span class="gl-ga lim" style="--v:1.019">…</span>`, see Gauge).
- A single number is a figure, never a chart with one bar.

### Table: items with a few values each

```html
<section class="gl-card">
  <header class="gl-hd"><h3 class="gl-t">Every line item</h3><p class="gl-sub">Dollars a month</p></header>
  <div class="gl-tb" style="--c:3">
    <div class="gl-row h"><div>Line item</div><div class="num">Sep</div><div class="num">Oct</div><div class="num">Change</div></div>
    <div class="gl-row"><div class="gl-nm"><b>Fast Data Transfer</b></div><div class="num">40</div><div class="num">1,620</div><div class="num"><b>+1,580</b></div></div>
    <div class="gl-row"><div class="gl-nm">Function invocations<small>One note</small></div><div class="num">120</div><div class="num">145</div><div class="num">+25</div></div>
    <div class="gl-row tot"><div class="gl-nm">Total</div><div class="num">310</div><div class="num">1,920</div><div class="num">+1,610</div></div>
  </div>
</section>
```

- `--c` is the number of cells after the name. Columns are as wide as their contents; `--cols` sets them when a column needs a fixed width (a gauge, a mini bar): `style="--c:4;--cols:minmax(0,1fr) 4.2em 96px 4.6em 6.4em"`.
- The name cell is `gl-nm`, with a `<small>` line under it for the answer's note about that row ("Only the Reports page uses it", "Up every month"). A row past a line gets its number as `<small class="x">` there ("8,900 over"), and its value cell `num x`. "Tight" is `w`. The row the answer is about has its name and key value in `<b>`.
- Values are plain numbers, the unit in the header or subtitle; text left, numbers right (`num`). A value with a qualifier that won't fit on one line breaks with `<br>` ("~61,000<br>of 48,000").
- **Groups:** when the answer sorts rows into groups (what to do, over / close / the rest), a `<div class="gl-gh"><b>Cancel</b><span>2 tools</span></div>` goes before each group's rows. The group label is the answer's own word.
- **Lane:** `class="gl-tb lane" style="--lw:6.4em"` puts a faint blue lane behind the last column, the one the table is about (the saving, the result). `--lw` is that column's width, so give it in `--cols` too.
- **Narrow panels:** a row with four or more values turns into two lines on its own: the name, then every value in the same columns as the header. Rows with up to three values stay on one line; add `stack` to the table (`class="gl-tb stack"`) when they still don't fit, such as when a gauge column is among them. `--nc` sets how many cells go on the second line (default `--c`). A cell with `class="num top"` stays on the name's line instead, at the right: use it for the one value the table is about, and set `--nc` to the rest.
- A cell can hold a gauge, a mini bar or an inline trend; give its column a width in `--cols` (64–100 px) and the cell `class="gc"`.

### Gauge: a value against what it could be, or against a limit

```html
<!-- parts of one whole: 22 of 90 seats in use, the rest unused (blue: what the answer is about) -->
<span class="gl-ga"><i class="use" style="flex:22"></i><i class="hi" style="flex:68"></i></span>
<!-- against a limit: --v is value ÷ limit; the tick is the limit, only the part past it is red -->
<span class="gl-ga lim" style="--v:0.865"><i class="f"></i><i class="rest"></i><i class="tick"></i><i class="bad"></i></span>
```

- **Parts:** each `<i>` is one part, its `flex` the part's amount, 2 px apart. `use` is grey (in use, kept), `hi` blue (what the answer is about, such as what you'd stop paying for), plain soft blue for an ordinary part, `rest` the empty track, `bad` red (past the line).
- **Against a limit:** always the four parts in that order; only `--v` changes. Every limit sits at the same place (80% of the width), so rows compare at a glance. The overshoot is drawn up to 25% past the limit; beyond that it stops at the edge, and the value printed next to it says the rest. `gl-ga lim hi` makes the fill blue for the row the answer is about. `<i class="f use">` makes it grey when the gauge sits among usage gauges whose grey means "in use".
- Always print the value and the limit next to the gauge, in words or columns ("2.3 of 2 GiB", "Budget 50,000").

### Bars: amounts across up to about 12 items

```html
<section class="gl-card">
  <header class="gl-hd"><h3 class="gl-t">AWS change from September to October</h3><p class="gl-sub">Dollars, by service. NAT Gateway's bar is cut to fit; the four smallest are drawn 5 times bigger.</p></header>
  <div class="gl-bars">
    <div class="gl-b hi"><div class="n">NAT Gateway</div><div class="t"><i style="width:100%"><b class="gl-cut"></b></i></div><div class="v">+2,130</div></div>
    <div class="gl-b"><div class="n">CloudWatch</div><div class="t"><i style="width:76%"></i></div><div class="v">+380</div></div>
    <div class="gl-zoom">These four, drawn 5 times bigger</div>
    <div class="gl-b"><div class="n">Other</div><div class="t"><i style="width:95%"></i></div><div class="v">+95</div></div>
  </div>
</section>
```

- Largest first, one scale from zero: width = value ÷ the scale's top × 100%. The value sits on one right edge.
- **Outlier:** when one bar is more than about 3 times the next, it gets `width:100%` with a `gl-cut` inside, and the rest use the next one's scale. Say "… is cut to fit" in the subtitle.
- **Small values:** when bars would be under about 4 px, they go below a `gl-zoom` divider on their own scale, drawn an exact whole number of times bigger, and the factor is in the divider and the subtitle. `style="--nw:9.5em"` on both lists keeps their tracks aligned when a factor compares them.
- `hi` on the item the answer is about, `bad` on one past a line.

### Split bar: one total and its parts

```html
<div class="gl-split"><i class="hi" style="flex:860"></i><i style="flex:410"></i><i style="flex:290"></i></div>
```

Followed by a table of the parts in the same left-to-right order ("Part, left to right"), with the amount and share columns. No legend, no swatches: the order ties them.

### Columns: one series across up to 12 periods

```html
<div class="gl-cols" style="--n:6">
  <div class="gl-col"><i style="height:77%"></i></div> …
  <div class="gl-col hi"><i style="height:100%"><b class="gl-cut"></b></i></div>
</div>
<div class="gl-axis" style="--n:6"><div><span>May</span><b>1,840</b></div> … <div class="hi"><span>Oct</span><b>4,760</b></div></div>
```

From zero; height = value ÷ the scale's top × 100%. Values sit in one row under the period names, never floating above the columns. An outlier more than about twice the next gets `height:100%` and a `gl-cut`, said in the subtitle.

### Bridge: how a total got from A to B

```html
<div class="gl-br" style="--nw:9.5em">
  <div class="gl-s tot"><div class="n">September</div><div class="t"><i style="--a:0%;--w:44.3%"></i></div><div class="v">2,110</div></div>
  <div class="gl-s hi"><div class="n">NAT Gateway</div><div class="t"><i style="--a:44.3%;--w:44.7%"></i></div><div class="v">+2,130</div></div>
  <div class="gl-s tot"><div class="n">October</div><div class="t"><i style="--a:0%;--w:100%"></i></div><div class="v">4,760</div></div>
</div>
```

`--a` is where a step starts and `--w` its length, both as a share of the largest total. The start plus every step equals the end. Steps too small to see are grouped into one step ("The four smallest +140", calculated), and listed below in a `gl-bars` panel drawn an exact factor bigger, as in Bars.

### Inline trend: several periods for each row

A `gl-spk` in a `gc` table cell, then the first and last values in their own columns:

```html
<span class="gl-spk" role="img" aria-label="Logs, May to October: 1,020, 1,240, 1,460, 1,730, 2,040, 2,430"><i style="height:42%"></i> … <i class="hi" style="height:100%"></i></span>
```

Each row's bars are scaled to that row (say so in the subtitle); the aria-label lists every value.

### Diverging bars: changes up and down, one unit

```html
<div class="gl-dv">
  <div class="gl-s hi"><div class="n">/search</div><div class="l"></div><div class="r"><i style="width:100%"></i></div><div class="v">+140</div></div>
  <div class="gl-s"><div class="n">/checkout</div><div class="l"><i style="width:86%"></i></div><div class="r"></div><div class="v">−120</div></div>
</div>
```

Sorted from the largest rise to the largest fall; the subtitle says which side is which ("Milliseconds; faster to the left, slower to the right").

### Comparison: options, one of them recommended

```html
<div class="gl-bento">
  <div class="gl-pick">
    <p class="gl-vd pick">Recommended</p><h4>Kestrel KS‑8</h4>
    <p class="gl-price"><b>$34</b> a month</p>
    <dl class="gl-specs">
      <div class="gl-kv"><dt>CPU</dt><dd>8 vCPU<small>dedicated, EPYC</small></dd></div>
      <div class="gl-kv"><dt>RAM (GB)</dt><dd>16</dd></div> …
    </dl>
  </div>
  <div class="gl-alts">
    <div class="gl-alt">
      <p class="gl-vd bad">Over budget</p>
      <div class="gl-nmrow"><b>Corvid C4</b><span class="gl-pr2 x"><b>$42</b> a month</span></div>
      <dl class="gl-mini"><div><dt>CPU</dt><dd>6 vCPU<small>dedicated</small></dd></div> …</dl>
    </div> …
  </div>
</div>
```

- Goes straight inside `.gl`, without a card: the tiles are the cards. A one-line title above it is a `gl-hd` on its own.
- The recommended option is the big tile: its verdict, name, the main number large (`gl-price`), every spec on a label column. The others are smaller tiles, each headed by the one deciding drawback the answer gives, in its words and color (`gl-vd bad` past a line or failing, `gl-vd warn` tight), then name and main number, then the same specs in a compact grid.
- Mark the value behind each drawback in its spec (`<div class="x">` or `class="w"` on the spec's `div`, `gl-pr2 x` on a price). Don't repeat the drawback's words there.
- Same specs, same labels, same order in every tile; units in the labels ("RAM (GB)"). With no recommendation in the answer, every option is a `gl-alt` tile in the answer's order.
- Narrow panels stack the tiles, the pick first.

### Status grid: a status for each item in each setting

A table whose cells are `<div class="gl-cell">pass</div>`, with `gl-cell fail` (red word on a red tint) and `gl-cell warn` (borderline, such as flaky) as needed: one word per cell, the answer's word. The one real problem the answer names gets a `<small class="x">` line under its name.

### Interactive table: many rows, or one set sliced several ways

Only when SKILL.md says so (about 15 rows or more, or two or more ways to slice the same rows).

```html
<section class="gl-card" data-gl-view data-limit="12">
  <header class="gl-hd"><h3 class="gl-t">p95 latency, 40 endpoints</h3><p class="gl-sub">Milliseconds, slowest first. The target is 300 ms; values over it are red.</p></header>
  <div class="gl-ctl">
    <button type="button" class="gl-chip" aria-pressed="true" data-f="">All</button>
    <button type="button" class="gl-chip" aria-pressed="false" data-f="miss">Misses target</button>
    <input class="gl-find" type="search" placeholder="Find an endpoint" aria-label="Find an endpoint">
    <span class="gl-count" aria-live="polite">12 of 40 shown</span>
  </div>
  <div class="gl-tb" role="table" style="--c:3">
    <div class="gl-row h" role="row"><div role="columnheader"><button type="button" data-k="n">Endpoint</button></div><div class="num" role="columnheader"><button type="button" data-k="b">Before</button></div><div class="num" role="columnheader"><button type="button" data-k="a">After</button></div><div class="num" role="columnheader" aria-sort="descending"><button type="button" data-k="c">Change</button></div></div>
    <div class="gl-row" role="row" data-tags="miss slower"><div class="gl-nm" role="cell" data-k="n">/reports<wbr>/export</div><div class="num" role="cell" data-k="b" data-v="390">390</div><div class="num x" role="cell" data-k="a" data-v="530">530</div><div class="num" role="cell" data-k="c" data-v="140">+140</div></div>
  </div>
  <button type="button" class="gl-more">Show all 40</button>
</section>
```

- Rows are a `gl-tb` with ARIA table roles, so screen readers announce rows and columns.
- **Sorting:** a header holds a `<button data-k="…">`; the cells of that column carry the same `data-k`. A cell sorts by its `data-v` (a plain number) when it has one, by its text otherwise. Mark the column the first view is sorted by with `aria-sort`.
- **Filter chips** use the answer's own categories and words; a row belongs to a chip through its `data-tags`. The first chip (`data-f=""`) shows every row. Pressed chips are blue text on a blue tint.
- **Search** (`gl-find`) only from about 30 rows.
- **Long tables:** `data-limit` shows the first rows (sorted so the ones the answer is about come first, with all of them inside the limit) and a `gl-more` button to show the rest. The count always says how many rows are showing.
- Break long paths with `<wbr>` before each `/`, so they wrap only between segments.

### View switch: one slice at a time

```html
<div class="gl-seg" role="group" aria-label="When">
  <button type="button" aria-pressed="false" aria-controls="gl-v-start">Start</button>
  <button type="button" aria-pressed="true" aria-controls="gl-v-now">Now</button>
</div>
<div id="gl-v-start"> … a table … </div>
<div id="gl-v-now"> … the same table, now … </div>
```

For the same rows in two to about six slices, when the reader needs one at a time. The pressed button is the slice the answer is about.

### Line: a series over time

```html
<section class="gl-card">
  <header class="gl-hd"><h3 class="gl-t">Monthly AWS bill</h3><p class="gl-sub">Dollars, May to October</p><p class="gl-sub">The scale jumps from 2,200 to 4,600.</p></header>
  <div class="gl-line">
    <div class="gl-head"><b>+2,650</b><span>from September</span></div>
    <div class="gl-plot">
      <div class="gl-g" style="top:0%"><span>4,800</span></div> … <div class="gl-g z" style="top:100%"><span>1,800</span></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline class="gl-ln" points="12,90 28.4,74.3 …"/>
        <polyline class="gl-ln hi" points="77.6,49.8 85.2,32"/><polyline class="gl-ln hi skip" points="85.2,32 89.9,16"/><polyline class="gl-ln hi" points="89.9,16 94,6.4"/>
      </svg>
      <div class="gl-pt" style="left:12%;top:90%"></div> … <div class="gl-pt hi" style="left:94%;top:6.4%"></div>
    </div>
    <div class="gl-axis" style="--n:6"> … <div class="hi"><span>Oct</span><b>4,760</b></div></div>
  </div>
</section>
```

- Points are spaced evenly across the plot: x = 12 + i ÷ (n − 1) × 82 for up to 12 points (room for the scale labels on the left), x = i ÷ (n − 1) × 100 for more. y = 100 − (value − bottom) ÷ (top − bottom) × 100, and each `gl-g` sits at its value's y.
- A line may start above zero: fit the scale to the values (a few round gridlines). When one stretch is far from the rest, break the scale: two ranges with no space between them, the line `skip` (dashed) where it crosses, and the subtitle says what's left out ("The scale jumps from 2,200 to 4,600.").
- The stretch the answer is about is `hi` (blue); `bad` (red) only for a stretch past a line. The answer's headline change can go in `gl-head`, top right.
- **Up to 12 points:** values in one row under the periods (`gl-axis`), as in Columns.
- **More than 12:** label the points the answer names and the last one (`<div class="gl-lab below" style="left:…;top:…">190 on 13 Mar</div>`, `gl-lab end` for the last), dates on a few ticks (`<div class="gl-xax"><span style="left:0%">1 Mar</span>…</div>`), and put every point on the line's wrapper for the hover readout and screen readers: `<div class="gl-line" data-gl-line data-x='["1 Mar","2 Mar",…]' data-y='[412,398,…]' data-unit="" role="img" aria-label="Daily verified signups, March: 412, 398, …">`.
- One line, or two in the same unit (the one the answer is about in blue). Never a second y-axis.

## The script

Paste once, as the last thing in the widget, whenever the picture has a `data-gl-view` card, a view switch or a line with more than 12 points:

```html
<script>
(()=>{const P='aria-pressed',S='aria-sort',fmt=v=>Number(v).toLocaleString('en-US');
for(const v of document.querySelectorAll('[data-gl-view]')){const tb=v.querySelector('.gl-tb');if(!tb)continue;
const rows=[...tb.querySelectorAll('.gl-row:not(.h)')],cnt=v.querySelector('.gl-count'),find=v.querySelector('.gl-find'),more=v.querySelector('.gl-more'),chips=[...v.querySelectorAll('.gl-chip')],lim=+v.dataset.limit||0;let f='',q='',open=!lim;
const apply=()=>{let k=0,n=0;for(const r of [...tb.querySelectorAll('.gl-row:not(.h)')]){const ok=(!f||(r.dataset.tags||'').split(' ').includes(f))&&(!q||r.textContent.toLowerCase().includes(q));const show=ok&&(open||f||q||n<lim);if(ok)n++;r.hidden=!show;if(show)k++}
if(cnt)cnt.textContent=k+' of '+rows.length+' shown';if(more){more.hidden=!lim||!!f||!!q;more.textContent=open?'Show fewer':'Show all '+rows.length}};
for(const c of chips)c.addEventListener('click',()=>{for(const o of chips)o.setAttribute(P,o===c);f=c.dataset.f||'';apply()});
if(find)find.addEventListener('input',()=>{q=find.value.trim().toLowerCase();apply()});
if(more)more.addEventListener('click',()=>{open=!open;apply()});
const hs=[...tb.querySelectorAll('.gl-row.h [data-k]')];
for(const b of hs)b.addEventListener('click',()=>{const k=b.dataset.k,th=b.parentElement,cell=r=>r.querySelector('[data-k="'+k+'"]');
const num=rows.some(r=>cell(r)&&cell(r).dataset.v!==undefined),cur=th.getAttribute(S),dir=cur?(cur==='descending'?'ascending':'descending'):(num?'descending':'ascending');
for(const o of hs)o.parentElement.removeAttribute(S);th.setAttribute(S,dir);
const key=r=>{const c=cell(r);return num?parseFloat(c&&c.dataset.v):(c?c.textContent.trim().toLowerCase():'')};
[...rows].sort((a,c)=>{const x=key(a),y=key(c),d=num?x-y:String(x).localeCompare(String(y));return dir==='ascending'?d:-d}).forEach(r=>tb.appendChild(r));apply()});
apply()}
for(const g of document.querySelectorAll('.gl-seg')){const bs=[...g.querySelectorAll('button[aria-controls]')];if(!bs.length)continue;
const show=b=>{for(const o of bs){o.setAttribute(P,o===b);const p=document.getElementById(o.getAttribute('aria-controls'));if(p)p.hidden=o!==b}};
bs.forEach(b=>b.addEventListener('click',()=>show(b)));show(bs.find(b=>b.getAttribute(P)==='true')||bs[0])}
for(const l of document.querySelectorAll('[data-gl-line]')){const xs=JSON.parse(l.dataset.x),ys=JSON.parse(l.dataset.y),u=l.dataset.unit||'',p=l.querySelector('.gl-plot');if(!p||xs.length<2)continue;
const g=document.createElement('div'),r=document.createElement('div');g.className='gl-guide';r.className='gl-read';g.hidden=r.hidden=true;p.append(g,r);
const at=e=>{const b=p.getBoundingClientRect(),i=Math.max(0,Math.min(xs.length-1,Math.round((e.clientX-b.left)/b.width*(xs.length-1)))),x=i/(xs.length-1)*100;
g.style.left=x+'%';r.style.left='clamp(60px,'+x+'%,calc(100% - 60px))';r.textContent=xs[i]+': '+fmt(ys[i])+u;g.hidden=r.hidden=false};
p.addEventListener('pointermove',at);p.addEventListener('pointerleave',()=>{g.hidden=r.hidden=true})}})();
</script>
```

- It only reorders and hides rows and panes already on the page and reads values already in the widget; it never computes or changes a value.
- Controls are ordinary buttons and a search field, so Tab, Enter and Space work, and the focus ring comes from the kit.

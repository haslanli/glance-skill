<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/hero-dark.png">
  <img alt="Before and after. On the left, stock Claude's 622-word answer about which SaaS subscriptions to cut: a lead paragraph, then a markdown table so crowded that the header Seats used (90 days) / paid wraps onto five lines and each row runs four lines tall. Someone types /glance. On the right, in front, glance's reply, 219 words from 622: Cutting Miro and Linear and shrinking four other tools saves about $46.6k a year. Removing spare seats elsewhere brings the total to about $50k. Below it, the saving a year, about $50.4k, large and blue, about 24% of $205k spend, beside about $46.6k from cutting or shrinking 6 tools and about $3.8k from dropping unused seats on 5 tools. Then the start of a table of every tool, grouped by what to do: under Cut, Miro, FigJam covers most use, renews Jan 20, 9 of 35 seats used with a bar of used seats in grey and unused in blue, cost 6,300, saving 6,300." src="docs/images/hero-light.png" width="100%">
</picture>

# glance

**Claude's long answers, readable at a glance.**

### [Live demo →](https://haslanli.github.io/glance-skill/)

Every picture on the site is live: sort and filter the tables, drag to compare with the original answer, and hover any number to see the line it came from.

glance is a skill for Claude Code. Type `/glance` after a long answer, and Claude tells it again for someone short on time or background. You get the answer in one plain sentence, a picture when the answer has data, and a few short bullets for the rest. It's built to keep every number, name, path, command, warning and open question, and to add nothing. So it cuts wording, not facts: on real answers the text comes out about half to two-thirds as long, and a table keeps its size, because every value stays. In the Claude desktop app the picture is drawn right in the chat; in a terminal it becomes a markdown table.

**Contents:** [Live demo](https://haslanli.github.io/glance-skill/) · [Install](#install) · [Big tables](#big-tables) · [Examples](#examples): [bills](#bills), [test results](#test-results), [performance](#performance), [progress](#progress) · [Commands](#commands) · [Why not dataviz?](#why-not-just-use-dataviz) · [Readable by everyone](#readable-by-everyone) · [New in v3](#new-in-v3)

## Install

```bash
git clone https://github.com/haslanli/glance-skill ~/.claude/skills/glance
```

Claude Code picks up new skills while it runs, so there's no restart. If `~/.claude/skills` didn't exist before, run `/reload-skills` once. To update later, run `git -C ~/.claude/skills/glance pull`.

## Big tables

A wide table is where a plain answer reads worst. Claude writes it as markdown, the chat lays it out at the width of its column, and every column with a long cell takes the room: short columns shrink to stacks of wrapped words, rows grow four lines tall, and the rows that matter look like all the others. glance rebuilds the same table: the same 14 tools and the same numbers, one line per row, grouped by what to do and sorted by what you'd save, with a bar of used and unused seats on every row and the long advice moved into short notes under each name and the bullets.

**Stock Claude:** 622 words, with a 14-row, 6-column table of renewals and three sections after it. Its table as the chat lays it out:

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/table-stock-dark.png">
  <img alt="Stock Claude's answer about which SaaS subscriptions to cut. A lead paragraph, then a markdown table with columns Tool, Renews, Cost, Seats used (90 days) / paid, Recommendation and Annual saving. The Recommendation column takes most of the width, so the header 'Seats used (90 days) / paid' wraps onto four lines and rows like DocuSign grow four lines tall. The rows are in renewal order with nothing marked." src="docs/images/table-stock-light.png" width="100%">
</picture>

<details><summary>The whole table</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/table-stock-full-dark.png">
  <img alt="The same stock answer's whole 14-row table." src="docs/images/table-stock-full-light.png" width="100%">
</picture>

</details>

**glance, on the same answer:**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/table-glance-dark.png">
  <img alt="glance's reply: Cutting Miro and Linear and shrinking four other tools saves about $46.6k a year. Removing spare seats elsewhere brings the total to about $50k. Below it, the saving a year, about $50.4k, large and blue, about 24% of $205k spend, beside about $46.6k from cutting or shrinking 6 tools and about $3.8k from dropping unused seats on 5 tools. Then every tool in groups, biggest saving first in each: Cut, with Miro, FigJam covers most use, 9 of 35 seats used, saving 6,300, and Linear, pilot ended, 6 of 25, saving 4,800; then Shrink. Each row has its renewal date, seats used of paid with a bar of used seats in grey and unused seats in blue, its cost and its saving in a tinted column. The table fades out after the first rows." src="docs/images/table-glance-light.png" width="100%">
</picture>

<details><summary>The whole picture</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/table-glance-full-dark.png">
  <img alt="glance's whole picture: the headline figures and all 14 tools in five groups, cut, shrink, keep but drop seats, keep, and raise the commitment, ending with Datadog, 48,000 committed and about 61,000 used." src="docs/images/table-glance-full-light.png" width="100%">
</picture>

</details>

<sub>A SaaS renewal review for a made-up 140-person company, answered by stock Claude (Opus 5.5), then re-told with `/glance`. Both pictures are the same width; the stock table is drawn by the browser's own table layout, the way a chat column draws markdown. glance's reply text: 219 words, from 622.</sub>

## Examples

Each picture is glance's own reply to a sample answer, drawn with the current kit and cropped to the sentence and the picture. The bullets that follow it in the chat are left out. Above each one is what the original answer looked like. When an answer is mostly reasoning, glance draws nothing and keeps it to a sentence and bullets.

### Bills

#### Why a bill jumped

**Before:** 276 words: the monthly totals in one line, a six-row table by service, what happened, four fixes and three caveats.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-jump-dark.png">
  <img alt="glance's reply: October's AWS bill went up $2,650, almost all of it from NAT Gateway and CloudWatch, because of two changes made in the first week of October. Below it, two headline figures: +$2,650 added from September to October, large and blue, and 49.8 TB of NAT data processed in October. Then the monthly bill from May to October as columns with each value underneath, October in blue at 4,760. The picture continues with a table by service and fades out." src="docs/images/bill-jump-light.png" width="100%">
</picture>

<sub>An AWS bill that more than doubled. glance picked the increase as a headline figure, columns for six months of totals, then a table by service with each change in a tinted column.</sub>

<details><summary>The whole picture</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-jump-full-dark.png">
  <img alt="The same reply at full length: the headline figures, the columns, and what changed by service in dollars, September, October and change: NAT Gateway 110, 2,240, +2,130; CloudWatch 70, 450, +380; Other 30, 125, +95, not explained yet; EC2 1,180, 1,210, +30, Savings Plan coverage not checked; S3 290, 300, +10; RDS 430, 435, +5." src="docs/images/bill-jump-full-light.png" width="100%">
</picture>

</details>

#### Teams against their budgets

**Before:** 152 words: a table of five teams' Q2 spend, Q3 spend and Q3 budget, why two teams went over, and what happens next.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-budget-dark.png">
  <img alt="glance's reply: Data platform and ML spent more than their Q3 budgets. That pushed total spend $2,600 over, even though the other three teams came in under. Below it, total Q3 spend of $139,600, large and red, budget $137,000, 2,600 over, with a gauge that runs just past its budget tick. Then each team against its Q3 budget in dollars: Q2, Q3, budget, and a gauge whose tick is the budget, at the same place on every row. Data platform, 41,200 to 58,900 against 50,000, 8,900 over, and ML, 30,500 to 34,300 against 32,000, 2,300 over, have their Q3 in red and the part of the gauge past the tick in red. Web, Mobile backend and Internal tools stay under." src="docs/images/bill-budget-light.png" width="100%">
</picture>

<sub>Quarterly cloud spend by team. glance picked the total as a headline figure, then a gauge per team with every budget at the same place, so the two teams over budget stand out.</sub>

#### Money spent on nothing

**Before:** 111 words: a table of 11 idle resources in three groups with counts and monthly cost, then the status of each group.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-idle-dark.png">
  <img alt="glance's reply: You're paying $1,240 a month for 11 AWS resources nobody uses. The six left from September's load test cost $820 of that, and you can delete them today. Below it, $1,240 a month for 11 resources, large and blue. Then what they are and what to do, in dollars a month, largest first: Sept load test leftovers, lt-runner-1 to lt-runner-4, lt-db and lt-cache, 6, delete today, 820; unattached EBS volumes vol-0a1f, vol-0b77 and vol-0c3e, 3, snapshot, then delete, 210; NAT Gateways in a retired VPC, nat-0f3a and nat-0f3b, 2, wait for networking, 210." src="docs/images/bill-idle-light.png" width="100%">
</picture>

<sub>Idle cloud resources. glance picked the total as a headline figure, then a table of causes: every resource under its cause, the count, the next step and the monthly cost.</sub>

### Test results

#### A nightly run in four browsers

**Before:** 479 words: a 24-row table of every spec in Chrome, Firefox, Safari and Edge, then each of the 5 failures and 3 flaky specs explained, and four fixes.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tests-grid-dark.png">
  <img alt="glance's reply: Only one failure needs fixing before Thursday: address suggestions break for Safari customers. The other 4 failures are test problems, and nothing failed on Chrome or Edge. Below it, 5 runs failed, large and blue, of 96, 1 blocks release, beside 85 passed, 3 flaky and 3 skipped. Then every spec by browser, problem specs first, with filter chips for All, Failed and Flaky: checkout/address, real bug, blocks release, and two more specs fail on Safari; account/avatar-upload and orders/invoice-pdf fail on Firefox. Each fail is a red word on a red tint. The list fades out after the first rows." src="docs/images/tests-grid-light.png" width="100%">
</picture>

<sub>An end-to-end test run, 24 specs × 4 browsers. glance picked headline numbers and a status grid you can filter, problem specs first and the one real bug named under its spec.</sub>

<details>
<summary>See all 24 specs</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tests-grid-full-dark.png">
  <img alt="The same reply at full length: the headline numbers, the filters and all 24 specs in four browsers, with every cell a word: pass, fail, flaky or skip." src="docs/images/tests-grid-full-light.png" width="100%">
</picture>

</details>

### Performance

#### Latency after an upgrade

**Before:** 367 words: the nine endpoints that miss the target listed in a sentence, how it was measured, a 40-row table of every endpoint's p95 before and after the Go 1.23 upgrade, and two caveats.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-endpoints-dark.png">
  <img alt="glance's reply: After the Go 1.23 upgrade, as many endpoints got slower as got faster, and 9 are now over the 300 ms target. Below it, 9 of 40 endpoints now miss the 300 ms p95 target, large and blue, beside 19 faster, 19 slower and 2 unchanged. Then p95 latency in milliseconds, slowest after the upgrade first, with filter chips, a search box and 12 of 40 shown: /reports/export 390 to 530, /health 380 to 415, /feature-flags 340 to 400 and the other endpoints over the target have their after value in red and a gauge that runs past the 300 ms tick in red. The table fades out after the first rows." src="docs/images/perf-endpoints-light.png" width="100%">
</picture>

<sub>p95 latency for 40 endpoints. glance picked a headline count and a table you can sort, filter and search, with a gauge for each endpoint against the 300 ms target.</sub>

<details>
<summary>See all 40 endpoints</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-endpoints-full-dark.png">
  <img alt="The same reply at full length: all 40 endpoints with their before, after and change, slowest first, each with a gauge against the 300 ms target." src="docs/images/perf-endpoints-full-light.png" width="100%">
</picture>

</details>

#### What a bundle is made of

**Before:** 183 words: what's in `main.js` as a six-row table, three fixes with their savings, and three things to watch out for.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-bundle-dark.png">
  <img alt="glance's reply: main.js is big mostly because the chart library, echarts, loads on every page even though only the Reports page uses it. It makes up almost half the file. Below it, what's in main.js, 1.84 MB minified and 512 KB gzipped: a split bar of its parts from left to right with echarts in blue, then a table of the six parts in KB and percent: echarts 860 and 47, only Reports uses it; our code 410 and 22; moment + locales 290 and 16; react + react-dom 140 and 8; lodash 72 and 4; everything else, 31 packages, 68 and 4. The picture continues with the fixes and fades out." src="docs/images/perf-bundle-light.png" width="100%">
</picture>

<sub>A JavaScript bundle that's too big. glance picked a split bar and a table of what it's made of, then the fixes as bars, biggest win first.</sub>

<details><summary>The whole picture</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-bundle-full-dark.png">
  <img alt="The same reply at full length: the split bar, the table of six parts, and the fixes as bars, biggest win first, in KB cut from main.js: lazy-load echarts 860, moment to date-fns about 250, per-function lodash about 60." src="docs/images/perf-bundle-full-light.png" width="100%">
</picture>

</details>

### Progress

#### A day of work, recapped

**Before:** four answers in one session, 526 words: a first measurement against the budget, two rounds of fixes with new numbers, then what's left and the plan for Monday.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/progress-session-dark.png">
  <img alt="glance's reply: Checkout on mobile now loads fast enough and stays put on screen. Taps and the server are still slower than the budget allows. Below it, checkout on mobile against the budget, median of 5 Lighthouse runs on a Moto G Power over slow 4G: each metric at the start, after step 1 (hero image and banner slot), its budget, a gauge whose tick is the budget, and now, after step 2 (lazy SDKs, Intl for moment). LCP 4.8, 2.9, now 2.3 s against 2.5; INP 380, 370, now 240 ms against 200, 40 over, in red; CLS 0.21, 0.04, now 0.04 against 0.1; JavaScript 612, 612, now 284 KB gzipped against 300; TTFB 0.9 s throughout against 0.8, in red." src="docs/images/progress-session-light.png" width="100%">
</picture>

<sub>A day of performance work, recapped with `/glance everything we did today`. glance picked one row per metric with the start, step 1 and now, and a gauge against its budget.</sub>

## Why not just use dataviz?

Claude Code's built-in dataviz skill teaches Claude how to draw a good chart: which form to pick, how to color it and how heavy the marks should be. It's very good at that, and glance follows its rules. But the two skills do different jobs.

- **dataviz draws the chart you ask for. glance re-tells an answer you already have.** It decides whether anything in the answer is worth a picture, which part that is and which form shows it best. Then it rewrites the words around it.
- **glance promises to keep every fact and invent nothing.** Every number, name, path, command, warning and open question stays in. It adds no trend lines, averages or projections, shows a missing value as `—`, and keeps commands and error messages word for word.
- **It's made to be read at a glance.** The answer comes first, in one plain sentence. The picture comes next, then a few bullets. You have the point before you read a single axis.
- **It only draws when there's data.** Reasoning stays as words, so you never get a chart for the sake of a chart.
- **Every picture comes from one tested kit.** The same components every time, checked in light mode, dark mode and narrow side panels. The tenth picture looks as considered as the first.
- **It builds on dataviz instead of replacing it.** glance's thin marks, one-axis rule and color checks come straight from dataviz's rules and its palette validator.

Use dataviz when you want Claude to make a chart. Use glance when Claude has already answered and you want to understand it fast.

## Readable by everyone

About one man in twelve can't easily tell red from green. Most charts lean on exactly that pair, so glance is built to work without it.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/color-dark.png">
  <img alt="Red next to amber or green nearly disappears for red-green color-blind readers; red next to blue stays clear. Three color pairs, as most people see them and with red-green color blindness: alert red and warning amber both turn olive, difference 3.2; alert red and success green both turn olive, 2.1; alert red and accent blue stay apart, 22.1. 8 is the minimum for colors that must be told apart." src="docs/images/color-light.png" width="100%">
</picture>

- **Blue says look here, red says negative.** Ordinary marks are a soft blue, and what the answer is about is blue, even when it's bad news. Red appears only on a value past a limit, target or budget, or on something failing: that number, the part of its gauge past the line, and, when the answer says by how much, a short line under its name such as "8,900 over". Never a whole row of red text.
- **Red never sits against green.** There's no green at all: an improvement stays soft blue. Blue and red stay far apart for everyone.
- **There is no amber warning color.** v2 tried one for "tight" meters, and the color validator rejected it. Under red-green color blindness, amber and the alert red differ by only 3.2, where 8 is the minimum. Even with full color vision they score 12.7, below the floor of 15. So "tight" and "close" are words, and the bar stays soft blue.
- **Nothing depends on color alone.** A value past a line also runs past the tick on its gauge, a failing cell says "fail", the subtitle says what the tick and the red mean, and the recommended option is the large tile. Color helps you find it; the shape and the word tell you what it means.
- **Every value is printed** on the picture, so nothing hides behind a hover. The two exceptions are the points of a long line chart and the middle months of an inline trend, which show on hover and are read out to screen readers.
- **Each picture opens with a one-sentence summary** for screen readers. Its colors come from the app's theme, so light and dark mode both work. In narrow side panels, wide rows fold into two aligned lines and comparisons stack into one column.

## Commands

After a long answer, type `/glance` in the main conversation.

| Command | What it does |
|---|---|
| `/glance` | Re-tells the last answer once |
| `/glance <what>` | Re-tells one answer, part of one, or several: `your reply about the build`, `only the numbers`, `everything we did today`, `all decisions so far`, or pasted text |
| `/glance on` | Re-tells the last answer, then answers this way until you turn it off |
| `/glance super` | Same as `on`, with every bullet cut to a short fragment |
| `/glance off` | Back to normal replies |
| `/glance status` | Says which mode is on |
| `/glance help` | Shows this list |

`/btw /glance` doesn't work as well: side questions can't load skills, so Claude guesses at the format from its one-paragraph description. In our tests it kept 52–63 % of the numbers and names, against 99 % for `/glance`.

## New in v3

- **The picture fits what the answer says.** A bill that grew because of a few changes gets a bridge from one total to the other. One charge that caused almost all of it leads as a tile. Six months per product get small inline trends, teams against budget get before → after rows with the budget underneath, and waste grouped by cause gets a list with a bar per cause.
- **Long tables can be sorted and filtered.** From about 15 rows, or when the same rows are sliced two ways, the table gets sort buttons, filter chips in the answer's own words and a count ("9 of 40 shown"). Shorter answers stay static.
- **Several answers at once.** [`/glance everything we did today`](#progress) or `/glance дай итог всего прогресса` re-tells the whole session as one glance. When a later answer changed something, the later one wins and the glance says so.
- **Blue leads, red means negative.** Ordinary marks are soft blue and what to look at is blue; red is kept for values past a line or failing. Tables got a header band, a blue tint on the rows to look at, and bars against a target when the answer gives one.
- **Any language.** Asking for the gist, the key points, a picture or a recap triggers glance in any language. It's tested in the ten most spoken.

## What's next

glance is actively improving, with more chart types and refinements on the way. Star the repo to follow updates.

## Credits

glance started from [tldr](https://github.com/generativelabs/g-genlabs-skill-tldr) by [Generative Labs](https://www.generativelabs.com). Pointing at an earlier answer, the on/super/off modes and the rule to cut wording but keep every fact all come from tldr. glance adds the plain-language first line, the pictures and the UI kit. If you only want bullet summaries, tldr does that well.

What a bill answer needs to show (`references/bills.md`) adapts ideas from Anthropic's [variance-analysis](https://github.com/anthropics/knowledge-work-plugins/tree/main/finance/skills/variance-analysis) skill, AWS's [billing and cost management](https://github.com/aws/agent-toolkit-for-aws) skill and the [cost-check](https://github.com/aws-samples/sample-claude-code-plugins-for-startups) skill from aws-samples.

## License

MIT. See [LICENSE](LICENSE).

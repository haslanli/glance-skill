<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/hero-dark.png">
  <img alt="A long Claude answer about an AWS bill, 276 words, fades into the background. Someone types /glance, and in front of it is glance's reply: Your AWS bill went from $2,110 in September to $4,760 in October because of two changes made in early October. Below the sentence, monthly totals from May to October as columns, with October in blue at $4,760." src="docs/images/hero-light.png" width="100%">
</picture>

# glance

**Claude's long answers, readable at a glance.**

### [Live demo →](https://haslanli.github.io/glance-skill/)

Every picture on the site is live: sort and filter the tables, drag to compare with the original answer, and hover any number to see the line it came from.

glance is a skill for Claude Code. Type `/glance` after a long answer, and Claude tells it again for someone short on time or background. You get the answer in one plain sentence, a picture when the answer has data, and a few short bullets for the rest. It's built to keep every number, name, path, command, warning and open question, and to add nothing. So it cuts wording, not facts: on real answers the text comes out about half to two-thirds as long, and a table keeps its size, because every value stays. In the Claude desktop app the picture is drawn right in the chat; in a terminal it becomes a markdown table.

**Contents:** [Live demo](https://haslanli.github.io/glance-skill/) · [Install](#install) · [Examples](#examples): [bills](#bills), [test results](#test-results), [performance](#performance), [progress](#progress) · [Commands](#commands) · [Why not dataviz?](#why-not-just-use-dataviz) · [Readable by everyone](#readable-by-everyone) · [New in v3](#new-in-v3)

## Install

```bash
git clone https://github.com/haslanli/glance-skill ~/.claude/skills/glance
```

Claude Code picks up new skills while it runs, so there's no restart. If `~/.claude/skills` didn't exist before, run `/reload-skills` once. To update later, run `git -C ~/.claude/skills/glance pull`.

## Examples

Each picture is glance's own reply to a sample answer, drawn with the v3 kit and cropped to the sentence and the picture. The bullets that follow it in the chat are left out. Above each one is what the original answer looked like. When an answer is mostly reasoning, glance draws nothing and keeps it to a sentence and bullets.

### Bills

#### Why a bill jumped

**Before:** 276 words: the monthly totals in one line, a six-row table by service, what happened, four fixes and three caveats.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-jump-dark.png">
  <img alt="glance's reply: Your AWS bill went from $2,110 in September to $4,760 in October because of two changes made in early October. Below it, monthly totals from May to October as columns, with October in blue at $4,760. Then a bridge from September's $2,110 to October's $4,760: NAT Gateway +$2,130 and CloudWatch +$380 in blue, then Other, EC2, S3 and RDS, each with its September and October cost." src="docs/images/bill-jump-light.png" width="100%">
</picture>

<sub>An AWS bill that more than doubled. glance picked columns for six months of totals, then a bridge from September to October with one step per service.</sub>

#### Teams against their budgets

**Before:** 152 words: a table of five teams' Q2 spend, Q3 spend and Q3 budget, why two teams went over, and what happens next.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-budget-dark.png">
  <img alt="glance's reply: Two of five teams overspent in Q3, and the other three didn't save enough to cover it, so total spend went over budget. Below it, Q3 total spend of $139,600 in red, against a budget of $137,000, $2,600 over. Then one row per team from Q2 to Q3 with its budget underneath: Data platform, $41,200 to $58,900, and ML, $30,500 to $34,300, are tinted and flagged over budget. Web, Internal tools and Mobile backend came in under." src="docs/images/bill-budget-light.png" width="100%">
</picture>

<sub>Quarterly cloud spend by team. glance picked a headline number, then before → after rows with each team's budget under its new value, so the two teams over budget stand out.</sub>

#### Money spent on nothing

**Before:** 111 words: a table of 11 idle resources in three groups with counts and monthly cost, then the status of each group.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/bill-idle-dark.png">
  <img alt="glance's reply: I found 11 idle AWS resources costing $1,240 a month. The six left over from the September load test can be deleted today. Below it, monthly cost by cause, each with a bar and its resources listed underneath: Sept load test leftovers, 6 resources, $820, safe to delete, in blue; unattached EBS volumes, 3, $210, snapshot first; NAT Gateways in a retired VPC, 2, $210, waiting." src="docs/images/bill-idle-light.png" width="100%">
</picture>

<sub>Idle cloud resources. glance picked causes with counts: one bar per cause, its status right after its name and every resource listed under it.</sub>

### Test results

#### A nightly run in four browsers

**Before:** 479 words: a 24-row table of every spec in Chrome, Firefox, Safari and Edge, then each of the 5 failures and 3 flaky specs explained, and four fixes.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tests-grid-dark.png">
  <img alt="glance's reply: The nightly run has 5 failures, all on Safari or Firefox. Only one is a real bug: Safari users can't pick a checkout address. Fix that one before Thursday. Below it, tiles for 85 passed, 5 failed in red, 3 flaky and 3 skipped. Then filter chips for All, Failing and Flaky, 24 of 24 shown, and a grid of specs by browser with failures first: checkout/address is tinted and flagged real bug, and the five fail cells are red. The list fades out after the first rows." src="docs/images/tests-grid-light.png" width="100%">
</picture>

<sub>An end-to-end test run, 24 specs × 4 browsers. glance picked headline numbers and a status grid with filters, failures sorted to the top and the one real bug flagged.</sub>

<details>
<summary>See all 24 specs</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/tests-grid-full-dark.png">
  <img alt="The same reply at full length: the tiles, the filters and all 24 specs in four browsers, with every cell a word: pass, fail, flaky or skip." src="docs/images/tests-grid-full-light.png" width="100%">
</picture>

</details>

### Performance

#### Latency after an upgrade

**Before:** 367 words: the nine endpoints that miss the target listed in a sentence, how it was measured, a 40-row table of every endpoint's p95 before and after the Go 1.23 upgrade, and two caveats.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-endpoints-dark.png">
  <img alt="glance's reply: Of 40 endpoints, 19 got faster, 19 got slower and 2 stayed the same. 9 now miss the 300 ms p95 target. Below it, filter chips for All, Misses target, Slower, Faster and No change, a search box and 40 of 40 shown. Then a table sorted by the after value: the nine endpoints over 300 ms come first, tinted and flagged misses target, with the after value in red and a bar whose part past the 300 ms line is red. The table fades out after the first rows." src="docs/images/perf-endpoints-light.png" width="100%">
</picture>

<sub>p95 latency for 40 endpoints. glance picked a table you can sort, filter and search, with a bar for each endpoint against the 300 ms target.</sub>

<details>
<summary>See all 40 endpoints</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-endpoints-full-dark.png">
  <img alt="The same reply at full length: all 40 endpoints with their before, after and change, sorted by the after value, each with a bar against the 300 ms target." src="docs/images/perf-endpoints-full-light.png" width="100%">
</picture>

</details>

#### What a bundle is made of

**Before:** 183 words: what's in `main.js` as a six-row table, three fixes with their savings, and three things to watch out for.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/perf-bundle-dark.png">
  <img alt="glance's reply: Almost half of main.js is the chart library, echarts, and it loads on every page even though only the Reports page uses it. Below it, a split bar of main.js, 1.84 MB minified and 512 KB gzipped, with echarts in blue, and a table of its six parts, from echarts at 860 KB and 47 percent, flagged only Reports uses it, down to 31 other packages at 68 KB. Then three fixes as bars, biggest win first: lazy-load echarts, −860 KB; moment to date-fns, about −250 KB; per-function lodash, about −60 KB." src="docs/images/perf-bundle-light.png" width="100%">
</picture>

<sub>A JavaScript bundle that's too big. glance picked a split bar of what it's made of, then the fixes as bars, biggest win first.</sub>

### Progress

#### A day of work, recapped

**Before:** four answers in one session, 526 words: a first measurement against the budget, two rounds of fixes with new numbers, then what's left and the plan for Monday.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/progress-session-dark.png">
  <img alt="glance's reply: Checkout now meets its mobile budget for load time, layout shift and JavaScript. Tap response and server time are still over, and it ships Monday behind a flag. Below it, five metrics from the start, to after the image and banner fixes, to now, each with its budget underneath. INP, 380 to 370 to 240 ms, and TTFB, 0.9 s throughout, are tinted and flagged over budget. LCP went from 4.8 to 2.3 s, JavaScript from 612 to 284 KB and CLS from 0.21 to 0.04, all under budget." src="docs/images/progress-session-light.png" width="100%">
</picture>

<sub>A day of performance work, recapped with `/glance everything we did today`. glance picked before → after rows with three steps, start, midway and now, each against its budget.</sub>

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

- **Blue says look here, red says negative.** Ordinary marks are a soft blue, and what the answer is about is blue, even when it's bad news. Red appears only on a value past a limit, target or budget, or on something failing: that number, the part of its bar past the line, and a red dot with a word after its name. Never a whole row of red text.
- **Red never sits against green.** There's no green at all: an improvement stays soft blue. Blue and red stay far apart for everyone.
- **There is no amber warning color.** v2 tried one for "tight" meters, and the color validator rejected it. Under red-green color blindness, amber and the alert red differ by only 3.2, where 8 is the minimum. Even with full color vision they score 12.7, below the floor of 15. So "tight" and "close" are words, and the bar stays soft blue.
- **Every colored mark also carries a word**: "over limit", "over target", "fail", "Recommended". Color helps you find it, and the word tells you what it means, so nothing depends on color alone.
- **Every value is printed** on the picture, so nothing hides behind a hover. The two exceptions are the points of a long line chart and the middle months of an inline trend, which show on hover and are read out to screen readers.
- **Each picture opens with a one-sentence summary** for screen readers. Its colors come from the app's theme, so light and dark mode both work. Comparisons turn into cards in narrow side panels.

## Commands

After a long answer, type `/glance`. To keep the result out of the main conversation, ask it as a side question: `/btw /glance`.

| Command | What it does |
|---|---|
| `/glance` | Re-tells the last answer once |
| `/glance <what>` | Re-tells one answer, part of one, or several: `your reply about the build`, `only the numbers`, `everything we did today`, `all decisions so far`, or pasted text |
| `/glance on` | Re-tells the last answer, then answers this way until you turn it off |
| `/glance super` | Same as `on`, with every bullet cut to a short fragment |
| `/glance off` | Back to normal replies |
| `/glance status` | Says which mode is on |
| `/glance help` | Shows this list |

Modes set inside `/btw` stay there. A side question doesn't change the main conversation.

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

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/hero-dark.png">
  <img alt="A long Claude answer about memory limits fades into the background. In front of it, someone types /glance, and a stack of glance pictures fans out in light and dark: memory meters with one service over its limit, a line chart with a red dip, a server comparison with the recommended option filled in, a split bar of a JavaScript bundle and up-and-down bars of latency changes." src="docs/images/hero-light.png" width="100%">
</picture>

# glance

**Claude's long answers, readable at a glance.**

glance is a skill for Claude Code. Type `/glance` after a long answer, and Claude tells it again for someone short on time or background. You get the answer in one plain sentence, a picture when the answer has data, and a few short bullets for the rest. It's built to keep every number, name, path, command, warning and open question, and to add nothing. So it cuts wording, not facts: on real answers the text comes out about half to two-thirds as long, and a table keeps its size, because every value stays. In the Claude desktop app the picture is drawn right in the chat; in a terminal it becomes a markdown table.

```bash
git clone https://github.com/haslanli/glance-skill ~/.claude/skills/glance
```

Claude Code picks up new skills while it runs, so there's no restart. If `~/.claude/skills` didn't exist before, run `/reload-skills` once. To update later, run `git -C ~/.claude/skills/glance pull`.

## Whatever you're working on

Whether you're on call at 2 a.m., shipping a frontend or picking a server, Claude's answer is usually longer than the decision you need to make. glance reads it, finds what's worth seeing and draws that.

### On call at 2 a.m.

You don't need a report. You need to know what's about to fall over. glance measures every service against its own limit, and the one already past it turns red.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-oncall-dark.png">
  <img alt="glance's answer about memory: report-worker is over its limit and was killed 14 times in a day, api and search are close. Below it, seven meters on one scale with a limit mark: report-worker in red at 115 percent runs past the mark, api at 91 percent and search at 88 percent are labeled close, and the rest are soft blue." src="docs/images/reader-oncall-light.png" width="100%">
</picture>

### Shipping a frontend

A bundle analysis becomes one bar split into its parts. The part the answer is about turns blue, and every size is listed underneath.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-frontend-dark.png">
  <img alt="glance's answer about a JavaScript bundle: nearly half of the main file is the chart library. Below it, a split bar of main.js with echarts in blue, then a list of all six parts with their minified size and share, from echarts at 860 KB and 47 percent down to 31 other packages at 68 KB." src="docs/images/reader-frontend-light.png" width="100%">
</picture>

### Upgrading a dependency

Some endpoints got faster and some got slower. The bars grow both ways from zero, the three that got slower are blue, and only the one that now misses its target turns red.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-upgrade-dark.png">
  <img alt="glance's answer about a database driver upgrade: four of seven endpoints got faster and three slower, and /search now misses its 300 ms target. Below it, bars from a zero line: /search grows right in red, flagged over target; /reports/export and /orders grow right in blue; /products/:id, /cart, /login and /checkout grow left in soft blue." src="docs/images/reader-upgrade-light.png" width="100%">
</picture>

### Watching a metric

A month of daily numbers becomes one line that starts at zero, so a drop to half looks like half. The stretch the answer is about turns red, and you can hover over any day to read its value.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-metric-dark.png">
  <img alt="glance's answer about March signups: they fell to about half on 12 to 15 March when the verification email stopped going out, then bounced back. Below it, three headline numbers and a line chart of 31 daily values from zero, with 12 to 15 March in red." src="docs/images/reader-metric-light.png" width="100%">
</picture>

### Cutting a release

A test matrix becomes a grid. Only the failing cells turn red, and a flaky suite says it's flaky.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-release-dark.png">
  <img alt="glance's answer about a CI run: only Windows is broken, with file-watcher failing on Node 20 and 22, so Linux and macOS can ship. Below it, six suites across five platforms, all pass except two red fail cells for file-watcher on Windows, whose row is tinted blue and flagged failing on Windows, and one flaky cell for cli-e2e on macOS." src="docs/images/reader-release-light.png" width="100%">
</picture>

### Picking a server

Options with the same details line up side by side. The recommended one is filled in, and every other option shows its one reason to skip it.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-server-dark.png">
  <img alt="glance's answer about choosing a server: get the Kestrel KS-8, the only option under the 40 dollar budget with enough memory and no traffic cap. Below it, four servers compared on price, CPU, RAM, storage, traffic, location and a trial, with Kestrel's column filled and one red note on each of the others: tight with Postgres, over budget, and no capacity." src="docs/images/reader-server-light.png" width="100%">
</picture>

### Explaining a bill

Six months of totals as columns, with the month that jumped in blue. Underneath, a bridge from September to October, one step per service, with each service's own before and after amounts.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-bill-dark.png">
  <img alt="glance's answer about an AWS bill: it more than doubled in October, almost all because of two changes in its first week. Below it, monthly totals from May to October with October in blue at 4,760 dollars, then a bridge from September's 2,110 dollars to October's 4,760, with NAT Gateway and CloudWatch in blue as the two big steps and each service's September and October cost beside its step." src="docs/images/reader-bill-light.png" width="100%">
</picture>

### Chasing a bug

Not every answer needs a chart. When the answer is reasoning, glance leaves it as words: one plain sentence, then bullets grouped around why it happens, the fix and what's still unconfirmed. Every path and URL stays exactly as written.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/reader-bug-dark.png">
  <img alt="glance's answer about a logout bug, with no picture: one sentence saying the payment page sends people back to www.shop.example.com while the login cookie only works on shop.example.com, then bullets under why it happens, fix and still to confirm, ending with glance mode off." src="docs/images/reader-bug-light.png" width="100%">
</picture>

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
  <img alt="Three color pairs, as most people see them and as they look with red-green color blindness. Alert red and warning amber both turn olive: difference 3.2, needs 8. Alert red and success green both turn olive: 2.1. Alert red and accent blue stay apart: 22.1." src="docs/images/color-light.png" width="100%">
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
- **Several answers at once.** `/glance everything we did today` or `/glance дай итог всего прогресса` re-tells the whole session as one glance. When a later answer changed something, the later one wins and the glance says so.
- **Blue leads, red means negative.** Ordinary marks are soft blue and what to look at is blue; red is kept for values past a line or failing. Tables got a header band, a blue tint on the rows to look at, and bars against a target when the answer gives one.
- **Any language.** Asking for the gist, the key points, a picture or a recap triggers glance in any language. It's tested in the ten most spoken.

## What's next

glance is actively improving, with more chart types and refinements on the way. Star the repo to follow updates.

## Credits

glance started from [tldr](https://github.com/generativelabs/g-genlabs-skill-tldr) by [Generative Labs](https://www.generativelabs.com). Pointing at an earlier answer, the on/super/off modes and the rule to cut wording but keep every fact all come from tldr. glance adds the plain-language first line, the pictures and the UI kit. If you only want bullet summaries, tldr does that well.

What a bill answer needs to show (`references/bills.md`) adapts ideas from Anthropic's [variance-analysis](https://github.com/anthropics/knowledge-work-plugins/tree/main/finance/skills/variance-analysis) skill, AWS's [billing and cost management](https://github.com/aws/agent-toolkit-for-aws) skill and the [cost-check](https://github.com/aws-samples/sample-claude-code-plugins-for-startups) skill from aws-samples.

## License

MIT. See [LICENSE](LICENSE).

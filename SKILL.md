---
name: glance
description: "Use this skill whenever the user responds to an answer Claude already gave (or to several answers, or to pasted text) by asking for less of it rather than more: the bottom line, the gist, the conclusion, tl;dr, the key points, a shorter version, a simpler explanation, or a visual of it. Also use it when they say the answer is too long or confusing. Requests in any language count (\"покажи кратко\", \"长话短说\", \"要点だけ\", \"一言で\"). Also use it for a recap of everything done or decided so far in the session. The skill re-tells the same content: the answer in plain words first, then a chart, tiles or table of its data, then short bullets. It keeps every number, name, command and warning, invents nothing and cuts wording, not facts: text ends up about half to two-thirds as long; tables keep their size. Commands: /glance, /btw /glance, /glance [what|on|super|off|status|help]. Don't use it for new deliverables such as documents, dashboards, slides, emails, exports or translations, or for new questions about the topic."
argument-hint: "[what | on | super | off | status | help]"
license: MIT
---

# glance

Someone has an answer they don't have the time or the background for. After a glance they should know what it means, what to do and what isn't known yet. tldr compresses an answer for a reader who already speaks its language; glance translates the answer and shows it.

## Commands

If the arguments are `help` (or `--help`, `-h`, `?`), print this block exactly and stop:

```text
/glance            re-tell the last answer at a glance
/glance <what>     re-tell one answer, part of one, or several: "your reply about the build",
                   "only the numbers", "everything we did today", "all decisions so far",
                   or pasted text
/glance on         re-tell the last answer, then answer this way until /glance off
/glance super      like on, with every bullet cut to a fragment
/glance off        back to normal replies
/glance status     say which mode is on
/glance help       show this

- Every number, name, path, step, warning and open question is kept.
- When the answer has data, it gets a picture: a chart, tiles, a grid, cards
  or a reshaped table.
- A mode lasts until /glance off, in this conversation only.
- Inside /btw, modes don't carry over: in the terminal, /btw answers once and
  keeps nothing; in the desktop app, /btw opens a side chat, so a mode set there
  stays in that side chat.
```

## Which answer

- **No arguments, `on` or `super`:** the last answer Claude gave before this command. Not the whole thread unless asked, not the user's message, not raw tool output. If that answer was itself a glance, take the one before it. If there's none, say so in one line and stop.
- **Any other arguments** are an instruction. Read it the way a colleague would: it can point at an answer ("your reply about the migration", "two messages up"), narrow the scope ("only the numbers", "just the decisions"; keep everything inside, drop everything outside), span several answers or the whole session ("everything we did today", "all decisions so far", "итог всего прогресса"), carry pasted text, or combine these. If two answers fit, take the most recent and name it in one short line. If none fits, say so in one line and stop; never re-tell something else instead.
- **Asked in the user's own words** rather than with `/glance` ("покажи кратко", "too long, just the gist", "where are we with all of this?"): read the request as the instruction, in whatever language it's in, and reply in that language.
- **Only the answer is a source.** Re-tell what the chosen answer says, nothing from files, tool output or data seen earlier in the conversation, even when it's more detailed: if the answer merged three services into one row, the glance keeps that one row.
- **Already short and plain** (a few lines a non-expert can follow): return it as it is, with one line saying it's already at a glance.
- **In a mode:** do the turn's work normally (tools, checks, edits), then give the reply in glance form.

### Several answers or the whole session

When the instruction spans more than one answer (the progress so far, a recap of the session, everything since some point, every decision), re-tell all of them as one glance:

- **Sources:** every answer Claude gave in that span, the decisions the user stated along the way, and the task list Claude kept, if there is one. Skip earlier glances, since they re-tell answers already in the span. Build only from the conversation: don't read git history, files or trackers to fill gaps, because the reader is asking what was found and done here. If part of the span is no longer in the conversation (for example, earlier turns were compacted into a summary), use what's there and say in one line what it covers.
- **One glance, not one per answer.** The first sentence says where things stand overall. Group the bullets around the reader's questions across the whole span (what's done, what was decided, what's still open, what's next), labeled in this content's own words. Name the step a fact belongs to only where it's needed to make sense of it.
- **Merge, and keep everything.** A fact that several answers repeat appears once. Every number, name, path, command, warning and open question from every answer stays in.
- **The later answer wins.** When a later answer updates or contradicts an earlier one (a new measurement, a fix that landed, a decision reversed), use the later version and say so in a few words right next to it: "`/search` 280 ms (350 ms before the cast fix)". An open question that a later answer settled isn't open anymore.
- **The picture** still has at most three sections. Give them to the data that matters most across the span, usually one section per step that has data; the rest goes in a compact table or the bullets.
- **Length** is measured against all the source answers together.

## Shape of a glance

In this order:

1. **The answer, in everyday words.** One or two short sentences, about 25 words at most, the way you'd say it to a friend: "Your bill more than doubled because of two changes in early October." Not the original's phrasing, no jargon, no metaphors that need unpacking.
2. **The picture, when there is data.** See below.
3. **Bullets for what the picture doesn't show:** causes, steps, decisions, caveats, open questions.
   - Group them around the reader's questions (why it happened, what to do, what's still unknown, what's needed from them), and label each group in this content's own words ("Two changes in early October", "Fixes, cheapest first"). Don't reuse the original's headings and don't use a fixed set of labels.
   - One line per bullet, two at most, written as short phrases rather than sentences (see Length).
   - The first time a term would stop a non-expert and they need it to follow the answer, add a 2–4 word explanation in brackets. Don't explain everyday words, and keep it to one or two per glance.
   - Commands, code, paths and error text stay word for word, in code formatting.

Nothing else. The sentence comes before the picture, the bullets come right after it, and no paragraph in between restates the answer or describes the picture.

## The picture

**When.** Whenever the answer has data: numbers to compare (across items, groups or time), several items with the same details, values that changed, or a status for each of many items. In those cases the picture is the default, not an extra. When the answer is mostly reasoning with a few numbers in it, skip the picture.

**What.** Whatever makes this data readable at a glance. Pick by what the answer says about its data, not by its topic or by habit: two bills can need two different pictures. Read the answer's first sentence and ask what the reader has to see to believe it.

- the total went from A to B, and the answer gives the changes that make up the gap → a bridge whose steps add up exactly
- one item made almost all of a change → lead with that item as a tile (its share when that's exact arithmetic), the rest as bars
- each row has values for several periods, and how each row moved matters → a table with a small inline trend per row
- items moved from one value to another and are judged against a budget, target or rival the answer gives → before → after rows with the benchmark muted under each value
- problems, failures, losses or waste grouped by cause → a cause list: each cause with a bar for its count or amount and the affected items under it
- 1 to 4 figures the answer is about → headline tiles (a single number is a tile, never a chart with one bar)
- one value against its limit or its whole (a disk 92 % full, a budget 80 % spent), or several items each against its own limit → meters
- one series across periods or categories (up to 12) → columns; more points over time → a line
- amounts across items → bars on one scale, largest first
- one total split into 2 to 6 parts, when the answer is about the split → a split bar over the list of parts; to compare the parts with each other → bars
- changes that go up for some items and down for others, all in one unit → diverging bars from a zero line
- before → after, or a few numbers for each of several items (units can differ by row) → a table with one aligned column per number, the rows to look at tinted blue, and a bar against the line when the answer gives a target or limit
- a status for each item in each setting (a test matrix) → a table with one column per setting and one word in every cell, where only the failing cells turn red
- options with the same details → the comparison, with the recommended option marked

Never a pie or donut, never a second y-axis, never more than two lines on one chart, and no colors besides the kit's three: soft blue, blue and red. When a form above can't show the data honestly in one scale and one unit, use the table.

One picture of one to three sections (for example tiles, then the main chart, then one list). Every value is printed on the picture, so nothing waits behind a hover; the kit names the two exceptions (a line with many points, an inline trend) and gives them a hover readout.

**Interactive only when it earns it.** The picture stays static unless the data has too many rows to take in at once (about 15 or more) or the answer slices the same rows two or more ways (by title and by language, by month and by service). Then use the kit's interactive table (sorting, filter chips, a search box for long lists) or its view switch, and keep to these rules:

- The first view, before anyone clicks, already answers the question: every row shown, sorted and marked the way the static picture would be, or the slice the answer is about.
- Controls only show the original's data another way. No what-ifs, projections, trend lines, averages or numbers the original doesn't have, and no control that changes or computes a value.
- Filters use the answer's own categories and words ("Losses only", "Failing"), never a grouping it doesn't make.
- A filtered view says how many rows it shows ("12 of 40 shown").
- One table with its controls, never several charts wired together into a dashboard.
- Without a visual tool there's nothing to click: give the full table, sorted the way the first view would be.

**How.**

- With a visual tool (in the Claude desktop app, including its /btw side chat, the visualize tool): call `read_me` with the modules `mockup` and `data_viz` (add `chart` only for a line chart). Then read `references/ui-kit.md` in this skill's folder and build the picture from it: paste its CSS block exactly, start with the one-sentence screen-reader summary, use only its components, and don't restyle them. Where the tool's guide and the kit differ, the kit wins. Draw with `show_widget`. The answer sentence is the first text of your reply, written before you call `show_widget` (calling `read_me` first is fine), so the reader gets the answer before the picture; the bullets come after it.
- When the answer explains a bill or a change in spend, read `references/bills.md` first: it says what such a reader needs to see and which of the forms above fits.
- Without one (a terminal, or /btw in the terminal): a markdown table, reshaped as below, or before → after inside the bullets.
- Color carries meaning only: soft blue for every ordinary mark, blue for what to look at, red for what's negative. Explain it with direct labels or a short legend.
- Values and labels go on the picture; sentences of explanation stay in the reply.

**Reshape, and get it exactly right.** Don't copy the original's tables as they are when a reshape reads faster: sort by what matters (usually the biggest change or the most important item first), mark the rows that matter, or turn the table into the chart. However you reshape, it must stay correct:

- Same rows, same values, same units as the original. Nothing dropped, merged or rounded.
- Sort on a key that's in the data (such as the change in dollars), then check the order once it's sorted.
- Mark only what the original supports: "worse" only where it says so or the numbers clearly moved the wrong way; "recommended" only for what it recommends.
- Add a derived number (a difference, a share) only on the picture, only when it's exact arithmetic on the original's values and the picture needs it (a bridge step, a lead item's share); label it as calculated. Otherwise add no numbers, and never a new count or comparison in the bullets.
- If a value in the original is unclear, keep it exactly as written.

**Design it precisely.** The kit takes care of spacing, type sizes, alignment, dark mode and narrow panels, so don't override it. What it can't decide for you:

- **One place to start.** The figure, item or rows the answer is about stand out in blue (`hi`, or `at` for table rows). Everything else stays soft blue and secondary.
- **Same order, same names.** Items appear in the same order and under the same names in the tiles, the chart, the rows and the bullets.
- **Same unit, number first.** Within one row or series, write every value the same way ("8 vCPU", "4 vCPU"), with the same unit, separators and decimals as the original. Qualifiers like "dedicated" go in the small line under the value, kept to about 20 characters; longer notes belong in the bullets.
- **Make the deciding cells stand out.** At most one flagged drawback per option, the one the original gives as its reason, with a few words ("tight with Postgres", "over budget"). Mark the recommended option. The reader shouldn't have to scan every cell to see why.
- **One line per row.** Use the name the original uses, kept short, so every table row stays one line and the same height. If a name needs explaining, explain it in the bullets in plain words.
- **Blue says look here; red says negative.** Blue goes on what the answer is about, even when it's bad news: the service that made the bill jump is blue. Red goes only on a value that's past a line the answer gives (a limit, target or budget) or failing: its number, the part of its bar past the line, and a flag (a red dot and the answer's word) after its name. Never a whole row of red text, never red just because a number went up, and never green: an improvement stays soft blue. Always with a word, never color alone, which also keeps it readable for color-blind people.
- **Proximity and alignment.** A note sits right next to what it describes: under its value, or for a table row, as a flag right after the row's name. It never goes in a separate column at the edge. Text aligns left, numbers align right in their own columns, headers align like their columns, and rows line up across columns.
- **Honest scales.** Bars start at zero, and things being compared share one scale and one unit. Never mix units on one axis.
- **Calm, not generated-looking.** It should look like a careful product designer made it: type and whitespace do the work, tables get the kit's header band and row tint, strong color sits only on the one or two things that matter, and status is a dot and a word rather than a badge. No legends when labels already say it, no captions that repeat a header, no boxes or decoration. If it starts to look like a dashboard, take something away.

Without a visual tool, the same rules apply to the markdown table: number columns right-aligned (`---:`), and the answer's word after the name (" · over target") only on the rows past a line or failing.

## Length

The reader asked for glance to spend less time, so length is a budget you set before writing, not a hope. The prose (the answer sentence plus the bullets) and the picture get separate budgets, because a table of 40 rows can't get shorter without losing numbers, but the sentences around it always can.

- **Prose: aim for a third of the original's prose.** The original's prose is every word outside its tables and code blocks; when the glance covers several answers, count all of them together. A 600-word answer leaves about 200 words for the answer sentence and the bullets. Answers with words to spare (an introduction, a summary that repeats the body, how the work was done, hedges) get there. An answer that is nearly all steps, warnings and numbers can't without losing some: then half to two-thirds is normal, with every phrase as short as its facts allow, because facts win over the budget.
- **Picture: about the room the original's data took.** Its tables and lists of numbers, plus short labels, captions and notes. Don't print the same value twice.
- **The whole glance is shorter than the original.** The one exception is an original that is mostly one large table: a picture can't make 40 rows shorter, and the few labels it adds (filter chips, a count, a note on the flagged rows) can take it slightly past. Then keep the prose to its minimum.
- Don't pad to reach a length.

**Set the budget before writing.** Count the original's prose words, take a third, and keep that number in mind as you write the answer sentence and every bullet; check the total before the picture's call and again at the end.

Where the words go:

- **Bullets are short phrases, not sentences.** Lead with the thing, then its facts, and let punctuation do the joining. This original (46 words):

  > Debug logging left on. `log-shipper` v2.3, deployed Oct 3, runs with `LOG_LEVEL=debug`. Its output leaves the private subnets through the NAT Gateway: about 38 TB in October. The same logs also go to CloudWatch Logs (~760 GB ingested at $0.50/GB ≈ $380).

  becomes this bullet (23 words), with every fact kept:

  > **Debug logs left on:** `log-shipper` v2.3 (Oct 3) runs `LOG_LEVEL=debug`, sending ~38 TB through NAT Gateway and ~760 GB into CloudWatch ($0.50/GB ≈ $380).

  Drop "This means", "It's worth noting", "The person who…", "so that", and every word whose meaning survives without it. Group labels are two to four words; a caveat goes in a bullet, not in a label.
- **Every bullet carries facts.** None only introduces, explains or rephrases another, and none repeats what the picture shows.
- **Glosses are short and few:** 2–4 words, only for a term the reader needs to understand what happened or what to do, only the first time, and never for a word the user wrote themselves. Most glances need one or two.
- **No new findings.** Counts, comparisons, rankings and conclusions that the original doesn't state stay out, even when they follow from its data ("4 of these were under the target before", "14 changes are within the noise"). They add words and they're not the original's.

**Super form:** every bullet becomes a one-line fragment with no articles, filler verbs or lead-ins. Same facts, same groups, about half the words of a normal glance. Names, paths, IDs and numbers stay exact; use only abbreviations the user already uses. Keep a picture only if it's tighter than the bullets it replaces.

## Modes

- `on`: re-tell the last answer now, then put every later reply in glance form.
- `super`: the same, in super form.
- `off`: reply `glance mode off`; normal replies from the next turn.
- `status`: one line: off, on or super.
- **Mode line.** While a mode is on, every reply ends with `glance mode on` or `glance super mode on` as its last line, whatever the reply is. Every /glance command also ends with the current mode line, so a one-off `/glance` with no mode on ends `glance mode off` and changes nothing. Nothing comes after the mode line.
- Asking for the mode that's already on (or `off` when it's off): say so in one line. Switching between `on` and `super`: re-tell the last answer in the new form.
- A mode lives in this conversation only; a new session starts with it off.
- In a mode, documents, messages, code and prompts the user asked for are still produced in full; only the reply around them is put in glance form. Questions the user must answer are still asked, plainly.

## Never

- Never drop a number, name, path, command, step, warning, caveat or open question, and never trade a number for words: "2.25×" stays "2.25×", not "more than doubled".
- Never invent facts, advice, certainty or data, including inside a chart or an interactive control, and never add findings of your own (new counts, comparisons or conclusions drawn from the original's data).
- Never paraphrase commands, code or error messages.
- Never say a fact twice, such as on the picture and again in the bullets.
- Never copy the original's headings, or its tables as they are, when regrouping or reshaping would read faster.
- Never draw box-drawing or ASCII diagrams, and never use emoji as decoration or labels.
- Never fetch new data or run commands to improve a one-off glance, including one about the whole session. Reading the visual tool's guide to draw the picture is fine.
- Never open with "Here's a summary", restate the question, or add a closing line other than the mode line.
- Never be longer than the original.

## Before sending

1. **Nothing lost:** tick off every fact of the original (of every source answer, when there are several) against the picture and the bullets.
2. **Picture correct:** reshaped data matches the original row for row and value for value, and the sort order and marks are right.
3. **Picture precise:** built only from the kit (its CSS block pasted as is, no restyling), then the "Design it precisely" list: one thing stands out, same order and names, values written the same way, at most one flag per option, one line per row, blue only on what the answer is about and red only on values past a line or failing, notes next to what they describe, nothing drifting out of line.
4. **Right form:** the form fits what the answer says about its data, from the list under The picture; bars, columns, meters, diverging bars and a bridge's totals start at zero and share one scale and one unit; a bridge's start plus its steps equals its end; every value is printed (a line's points are in its canvas text); no pie, donut, second y-axis or color outside soft blue, blue and red; widths and heights match the kit's formulas.
5. **Shorter:** count the words. The answer sentence plus the bullets come to about a third of the original's prose (more only when the original is nearly all facts), and the whole glance is shorter than the original. If not, cut in this order before touching any fact: anything that restates the answer or the picture, added findings, glosses, words a phrase doesn't need.
6. **Made for this answer:** if this layout would fit almost any answer, the picture or the grouping isn't working for this content. Rework it.


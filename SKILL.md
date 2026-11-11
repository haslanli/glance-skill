---
name: glance
description: "Make Claude's previous answer (or the answer, part or pasted text the user points to) understandable at a glance: the answer in everyday words first, then a picture of the data when there is data (a rendered or interactive chart, stat tiles, a comparison grid or a reshaped table, built from a tested UI kit), then short bullets for the rest. Keeps every number, name, path, command, step, warning and open question; invents nothing; about a third of the original's length. Use when the user types /glance, /btw /glance, /glance <what>, /glance on, super, off, status or help, or asks to explain that simply, show it visually, dumb it down, or says it's too long or they don't get it."
argument-hint: "[what | on | super | off | status | help]"
license: MIT
---

# glance

Someone has an answer they don't have the time or the background for. After a glance they should know what it means, what to do and what isn't known yet. tldr compresses an answer for a reader who already speaks its language; glance translates the answer and shows it.

## Commands

If the arguments are `help` (or `--help`, `-h`, `?`), print this block exactly and stop:

```text
/glance            re-tell the last answer at a glance
/glance <what>     re-tell one answer or one part of it: "your reply about the build",
                   "only the numbers", "just the decisions", or pasted text
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

- **No arguments, `on` or `super`:** the last answer Claude gave before this command. Not the whole thread, not the user's message, not raw tool output. If that answer was itself a glance, take the one before it. If there's none, say so in one line and stop.
- **Any other arguments** are an instruction. Read it the way a colleague would: it can point at an answer ("your reply about the migration", "two messages up"), narrow the scope ("only the numbers", "just the decisions"; keep everything inside, drop everything outside), carry pasted text, or combine these. If two answers fit, take the most recent and name it in one short line. If none fits, say so in one line and stop; never re-tell something else instead.
- **Already short and plain** (a few lines a non-expert can follow): return it as it is, with one line saying it's already at a glance.
- **In a mode:** do the turn's work normally (tools, checks, edits), then give the reply in glance form.

## Shape of a glance

In this order:

1. **The answer, in everyday words.** One or two short sentences, the way you'd say it to a friend: "Your bill more than doubled because of two changes in early October." Not the original's phrasing, no jargon.
2. **The picture, when there is data.** See below.
3. **Bullets for what the picture doesn't show:** causes, steps, decisions, caveats, open questions.
   - Group them around the reader's questions (why it happened, what to do, what's still unknown, what's needed from them), and label each group in this content's own words ("Two changes in early October", "Fixes, cheapest first"). Don't reuse the original's headings and don't use a fixed set of labels.
   - One line per bullet, two at most. Fragments are fine.
   - The first time a term would stop a non-expert, add a 2–4 word explanation in brackets. Don't explain everyday words.
   - Commands, code, paths and error text stay word for word, in code formatting.

## The picture

**When.** Whenever the answer has data: numbers to compare (across items, groups or time), several items with the same details, values that changed, or a status for each of many items. In those cases the picture is the default, not an extra. When the answer is mostly reasoning with a few numbers in it, skip the picture.

**What.** Whatever makes this data readable at a glance. Pick by what the data is for:

- 1 to 4 figures the answer is about → headline tiles (a single number is a tile, never a chart with one bar)
- one value against its limit or its whole (a disk 92 % full, a budget 80 % spent), or several items each against its own limit → meters
- one series across periods or categories (up to 12) → columns; more points over time → a line
- amounts across items → bars on one scale, largest first
- one total split into 2 to 6 parts, when the answer is about the split → a split bar over the list of parts; to compare the parts with each other → bars
- changes that go up for some items and down for others, all in one unit → diverging bars from a zero line
- before → after, or a few numbers for each of several items (units can differ by row) → a table with one aligned column per number, where only the rows that got worse turn red
- a status for each item in each setting (a test matrix) → a table with one column per setting and one word in every cell, where only the failing cells turn red
- options with the same details → the comparison, with the recommended option marked

Never a pie or donut, never a second y-axis, never more than two lines on one chart, and no color besides gray, the accent and the alert red. When a form above can't show the data honestly in one scale and one unit, use the table.

One picture of one to three sections (for example tiles, then the main chart, then one list). Not a dashboard. Every value is printed on the picture, so nothing waits behind a hover; a line with many points is the one exception, and the kit gives it a hover readout. Add other interaction only when the data truly doesn't fit at once, and then it only shows the original's data a different way; it never adds what-ifs, projections, trend lines, averages or numbers the original doesn't have.

**How.**

- With a visual tool (in the Claude desktop app, including its /btw side chat, the visualize tool): call `read_me` with the modules `mockup` and `data_viz` (add `chart` only for a line chart). Then read `references/ui-kit.md` in this skill's folder and build the picture from it: paste its CSS block exactly, start with the one-sentence screen-reader summary, use only its components, and don't restyle them. Where the tool's guide and the kit differ, the kit wins. Draw with `show_widget`. Write the answer sentence before the call and the bullets after it.
- Without one (a terminal, or /btw in the terminal): a markdown table, reshaped as below, or before → after inside the bullets.
- Color carries meaning only: good / bad / neutral, or one highlight against gray. Explain it with a short legend or direct labels.
- Values and labels go on the picture; sentences of explanation stay in the reply.

**Reshape, and get it exactly right.** Don't copy the original's tables as they are when a reshape reads faster: sort by what matters (usually the biggest change or the most important item first), mark the rows that matter, or turn the table into the chart. However you reshape, it must stay correct:

- Same rows, same values, same units as the original. Nothing dropped, merged or rounded.
- Sort on a key that's in the data (such as the change in dollars), then check the order once it's sorted.
- Mark only what the original supports: "worse" only where it says so or the numbers clearly moved the wrong way; "recommended" only for what it recommends.
- Add a derived number (a difference, a share) only when it's exact arithmetic on the original's values and helps the reader; label it as calculated. Otherwise add no numbers.
- If a value in the original is unclear, keep it exactly as written.

**Design it precisely.** The kit takes care of spacing, type sizes, alignment, dark mode and narrow panels, so don't override it. What it can't decide for you:

- **One place to start.** The figure or item the answer is about is the one that stands out: in a tile, or marked `hi`, `bad` or `good`. Everything else stays gray and secondary.
- **Same order, same names.** Items appear in the same order and under the same names in the tiles, the chart, the rows and the bullets.
- **Same unit, number first.** Within one row or series, write every value the same way ("8 vCPU", "4 vCPU"), with the same unit, separators and decimals as the original. Qualifiers like "dedicated" go in the small line under the value, kept to about 20 characters; longer notes belong in the bullets.
- **Make the deciding cells stand out.** At most one flagged drawback per option, the one the original gives as its reason, with a few words ("tight with Postgres", "over budget"). Mark the recommended option. The reader shouldn't have to scan every cell to see why.
- **One line per row.** Use the name the original uses, kept short, so every table row stays one line and the same height. If a name needs explaining, explain it in the bullets in plain words.
- **Color marks the exception, not the rule.** Normal and improved values stay uncolored. Only what's worse, over a limit or failing gets the alert color, judged by what's bad for the reader (slower load time is worse, a lower score is worse). Always with a word, never color alone, and never a column of green. This also keeps it readable for color-blind people.
- **Proximity and alignment.** A note sits right next to what it describes: under its value, or for a table row, " · worse" after the row's name with the whole row in the alert color. It never goes in a separate column at the edge. Text aligns left, numbers align right in their own columns, headers align like their columns, and rows line up across columns.
- **Honest scales.** Bars start at zero, and things being compared share one scale and one unit. Never mix units on one axis.
- **Calm, not generated-looking.** It should look like a careful product designer made it: type and whitespace do the work, color sits only on the one or two things that matter, and status is a colored word rather than a badge. No legends when labels already say it, no captions that repeat a header, no boxes or decoration. If it starts to look like a dashboard, take something away.

Without a visual tool, the same rules apply to the markdown table: number columns right-aligned (`---:`), and " · worse" after the name only on the exception rows.

## Length

Aim for about a third of the original, counting the words on the picture. Never longer than the original. Don't pad to reach a length, and never cut a fact to hit one.

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

- Never drop a number, name, path, command, step, warning, caveat or open question.
- Never invent facts, advice, certainty or data, including inside a chart or an interactive control.
- Never paraphrase commands, code or error messages.
- Never say a fact twice, such as on the picture and again in the bullets.
- Never copy the original's headings, or its tables as they are, when regrouping or reshaping would read faster.
- Never draw box-drawing or ASCII diagrams, and never use emoji as decoration or labels.
- Never fetch new data or run commands to improve a one-off glance. Reading the visual tool's guide to draw the picture is fine.
- Never open with "Here's a summary", restate the question, or add a closing line other than the mode line.
- Never be longer than the original.

## Before sending

1. **Nothing lost:** tick off every fact of the original against the picture and the bullets.
2. **Picture correct:** reshaped data matches the original row for row and value for value, and the sort order and marks are right.
3. **Picture precise:** built only from the kit (its CSS block pasted as is, no restyling), then the "Design it precisely" list: one thing stands out, same order and names, values written the same way, at most one flag per option, one line per row, color only on exceptions, notes next to what they describe, nothing drifting out of line.
4. **Right form:** the form fits the data's job from the list under The picture; bars, columns, meters and diverging bars start at zero and share one scale and one unit; every value is printed (a line's points are in its canvas text); no pie, donut, second y-axis or third color; widths and heights match the kit's formulas.
5. **Shorter:** under the original, ideally about a third.
6. **Made for this answer:** if this layout would fit almost any answer, the picture or the grouping isn't working for this content. Rework it.


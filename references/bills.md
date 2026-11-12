# Bills and spend

Read this when the answer explains a bill or a change in spend: a cloud or SaaS invoice, a budget against actuals, payroll, any total of money that moved between two periods. It says what the reader of such an answer needs to see. How to draw it is in `ui-kit.md`.

## What the reader needs to see

1. **The two totals and the gap.** Where the money was, where it is now and by how much it moved, with both periods named ("September $2,110 → October $4,760, +$2,650"). This is usually the first sentence or the headline tiles.
2. **What moved, biggest first, with its sign.** Every item the answer gives a change for, sorted by the size of the change. Keep the items that went down or barely moved: offsetting items are part of the story, and leaving them out makes the biggest driver look bigger than it is.
3. **The cause of each move, in plain words.** "Debug logging left on in `log-shipper`", not "higher NAT usage". Use the cause the answer gives; if it names only the line item, keep it at that and don't guess one.
4. **Whether a change is one-off or ongoing,** but only where the answer says so ("a one-time migration fee", "will repeat every month until fixed").
5. **What the numbers are measured on.** Words that change what a total means stay attached to it: unblended or amortized, before or after credits and refunds, with or without tax, estimated (a month that isn't closed yet). Put them in the small line under the value or in a bullet, never drop them.
6. **What's left unexplained.** A remainder the answer can't account for ("Other +$95, not explained yet") stays visible as its own row and as an open question.
7. **Fixes with what they save and what they cost.** When the answer gives a saving, a cost or an effort for each fix, keep them on the same line as the fix ("restore the ECR endpoints: about $29/month, saves about $400/month"), in the answer's order or biggest saving first. Don't work out savings the answer doesn't give.
8. **Forecasts stay words.** "November should land around $2,150 if fixes 1 and 2 are done by Nov 5" is the answer's projection: keep it with its condition, in a bullet. Never draw it as a bar or a point, because the picture shows only what happened.

## Which picture

| The answer says | Picture (in `ui-kit.md`) |
|---|---|
| The total went from A to B because of these changes, and the changes add up to the gap | **Bridge**: start, one step per change, end |
| One item made almost all of the change | **Lead item**: that item's change as the headline figure, the rest as a table or bars |
| Several months for each item, and the trend per item matters | **Table with an inline trend** in each row |
| Each item against its budget or a benchmark | **Table with a gauge per row**: both values, the budget as the gauge's tick |
| Only the monthly totals, with one month that jumped | **Columns** (the jump cut to fit when it dwarfs the rest) or a **line** with a scale break, the month that jumped marked |

When two of these fit, pick the one closest to the answer's own first sentence: if it says "almost all of it is NAT Gateway", lead with that item; if it says "two changes added $2,510", draw the bridge.

## Checks before sending

- A bridge reconciles: start + every step = end, to the cent, using only the answer's figures. If they don't add up, the answer has a remainder: show it as its own step named the way the answer names it, or, if the answer doesn't give one, use a table instead.
- Every amount keeps the answer's currency, rounding and separators.
- A share of the change ("80 % of the increase") is added only when it's exact arithmetic on the answer's figures, and it's marked as calculated.

## Credits

The rules above adapt ideas from three skills, rewritten for re-telling an existing answer rather than analyzing a bill:

- Bridge reconciliation, offsetting items and one-off versus ongoing changes: `variance-analysis` in Anthropic's finance plugin, [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/finance/skills/variance-analysis), Apache License 2.0.
- Cost basis (unblended, credits and refunds, estimates): `aws-billing-and-cost-management`, [aws/agent-toolkit-for-aws](https://github.com/aws/agent-toolkit-for-aws), Apache License 2.0.
- Fixes ranked by savings against effort: `cost-check`, [aws-samples/sample-claude-code-plugins-for-startups](https://github.com/aws-samples/sample-claude-code-plugins-for-startups), MIT-0.

## Why the dashboard bundle is 1.84 MB

**Short version:** Almost half of the main bundle is the charting library, and it loads on every page even though only the Reports page uses it. Loading it only there would cut `main.js` by about **860 KB**.

### What's in `main.js` (1.84 MB minified, 512 KB gzipped)

| Part | Size (minified) | Share |
|---|---|---|
| echarts | 860 KB | 47 % |
| Our code | 410 KB | 22 % |
| react + react-dom | 140 KB | 8 % |
| lodash | 72 KB | 4 % |
| moment + locales | 290 KB | 16 % |
| Everything else (31 packages) | 68 KB | 4 % |

From `npx vite-bundle-visualizer` on commit `a41c9e2`.

### What to do, biggest win first

1. Load `echarts` with `React.lazy` in `pages/Reports.tsx` only: −860 KB from `main.js` (it moves to a `reports` chunk).
2. Replace `moment` with `date-fns` and drop the unused locales: about −250 KB.
3. Change `import _ from 'lodash'` to per-function imports (`lodash/debounce`): about −60 KB.

### Watch out

- The Reports page will be about **300 ms** slower on a first visit, while the chart chunk downloads.
- `react-datepicker` also uses `moment`; check it still works after step 2.
- I haven't measured the gzipped size after these changes.

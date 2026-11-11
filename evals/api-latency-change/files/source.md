## p95 latency after the pgx v5 upgrade

**Short version:** After moving from `lib/pq` to `pgx` v5, four of seven endpoints got faster and three got slower. `/search` now misses its **300 ms** target.

Measured with k6 against staging: **200** virtual users, **10 minutes** per run, same data snapshot (Nov 8).

| Endpoint | Before (p95) | After (p95) | Change |
|---|---|---|---|
| /search | 210 ms | 350 ms | +140 ms |
| /reports/export | 1,240 ms | 1,310 ms | +70 ms |
| /orders | 145 ms | 175 ms | +30 ms |
| /products/:id | 64 ms | 58 ms | −6 ms |
| /cart | 180 ms | 140 ms | −40 ms |
| /login | 230 ms | 150 ms | −80 ms |
| /checkout | 420 ms | 300 ms | −120 ms |

### Why three got slower

- `/search` and `/reports/export` pass large ID lists with `ANY($1)`. pgx v5 sends them as binary arrays, and the planner now picks a sequential scan on `products` (seen in `EXPLAIN ANALYZE`).
- `/orders` isn't explained yet; its query plan is unchanged.

### Why the rest got faster

- pgx reuses prepared statements, which saves a round trip per query. That helps endpoints that run many small queries, like `/checkout` (**14** queries per request).

### Next

1. Add `::bigint[]` casts to the two `ANY($1)` queries in `store/search.go` and `store/export.go`, then rerun k6.
2. Keep the upgrade rather than rolling back: `/checkout` and `/login` improved the most.
3. Profile `/orders` once step 1 is done.

### Caveats

- Staging has about **1/10** of production's data, so production numbers will be higher.
- Each number is a single run; run-to-run noise was about **±10 ms** in earlier tests.

## Which services are about to run out of memory?

**Short version:** `report-worker` is already over its limit and was OOM-killed **14** times in the last 24 hours. `api` and `search` are close. Everything else has room.

### Peak memory (last 24 h) against each limit

| Service | Peak | Limit | Used |
|---|---|---|---|
| report-worker | 2.3 GiB | 2 GiB | 115 % |
| api | 1.82 GiB | 2 GiB | 91 % |
| search | 3.5 GiB | 4 GiB | 88 % |
| web | 410 MiB | 1 GiB | 40 % |
| scheduler | 180 MiB | 512 MiB | 35 % |
| auth | 220 MiB | 1 GiB | 21 % |
| mailer | 95 MiB | 512 MiB | 19 % |

Peaks come from `container_memory_working_set_bytes` in Prometheus, 5-minute max.

### Why report-worker keeps dying

- It loads each month's full export into memory before writing the PDF. The October export is **1.6 GB** of rows, up from **0.9 GB** in September.
- Kubernetes kills it when it crosses **2 GiB** (`OOMKilled`, exit code **137**). The job retries and fails again, which is why the count is 14.

### What to do

1. Raise `report-worker`'s limit to **3 GiB** in `deploy/report-worker.yaml` as a stopgap.
2. Switch the export to streaming (`cursor.itersize = 5000`) so memory stays flat no matter the month's size.
3. For `api`: the climb started with the **v4.12** release on Nov 2. I suspect the new in-process cache (`CACHE_MAX_ITEMS=200000`); lowering it to **50000** should give back about **400 MiB**.
4. `search` is normal for its index size, but the index grows about **5 %** a month, so raise its limit to **5 GiB** before December.

### Not checked

- Whether the node pool has room for the extra limits (+1 GiB for report-worker, +1 GiB for search).
- `api`'s cache hit rate after lowering `CACHE_MAX_ITEMS`.

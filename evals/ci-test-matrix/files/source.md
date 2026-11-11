## CI failures on the release branch

**Short version:** There are two real failures, both in the file-watcher tests on Windows (Node 20 and Node 22). One suite is flaky on macOS. Linux is fully green, so 3.4 can ship for Linux and macOS while Windows is fixed.

Run **#4812** on `release/3.4`, commit `9c03be1`, Nov 10. **1,284** tests ran: **1,271** passed, **9** failed and **4** were flaky.

| Suite | Linux · Node 20 | Linux · Node 22 | macOS · Node 22 | Windows · Node 20 | Windows · Node 22 |
|---|---|---|---|---|---|
| unit | pass | pass | pass | pass | pass |
| integration | pass | pass | pass | pass | pass |
| file-watcher | pass | pass | pass | fail (4 of 38) | fail (5 of 38) |
| cli-e2e | pass | pass | flaky | pass | pass |
| plugins | pass | pass | pass | pass | pass |
| snapshot | pass | pass | pass | pass | pass |

### Why Windows fails

- `watcher.test.ts` expects paths with `/`, but since the chokidar 4 upgrade (#2291) it returns `\` on Windows.
- The same 4 tests fail on both Node versions. Node 22 has one more, `rename-detects-move`, which times out at **5,000 ms**.

### The flaky suite

- `cli-e2e › init --template` on macOS: the npm registry mock sometimes starts after the test does (a race in `setup.ts:18`). It failed **2** of **5** retries.

### Options

1. Normalize paths with `path.posix` in `src/watch/emit.ts`. It's a small change and fixes the 4 shared failures.
2. Raise the timeout for `rename-detects-move` to **10,000 ms** and see whether it passes.
3. Ship 3.4 for Linux and macOS now, and hold the Windows builds until 1 and 2 land.

### Not known

- Whether `rename-detects-move` is a real bug or just slow Windows runners.

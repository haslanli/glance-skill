## Results: image + bundle optimization pass

**Short version:** The home page is much faster on mobile (Lighthouse performance went from **41 to 88**), but two numbers got worse: server response time and build time.

### Measurements

Lab test, Moto G Power profile, 4× CPU slowdown, slow 4G, median of 5 runs.

- Largest Contentful Paint (when the main content shows): **4.8 s** before, **2.1 s** after.
- Total Blocking Time: **620 ms** before, **180 ms** after.
- Cumulative Layout Shift: **0.24** before, **0.03** after.
- Time to First Byte: **380 ms** before, **410 ms** after (worse).
- JavaScript shipped: **1.42 MB** before, **610 KB** after.
- Image weight on the home page: **3.9 MB** before, **1.1 MB** after.
- Lighthouse performance score: **41** before, **88** after.
- Production build time: **52 s** before, **74 s** after (worse).

### What changed

1. Converted hero and gallery images to AVIF with a WebP fallback, sized with `srcset`.
2. Lazy-loaded everything below the fold with `loading="lazy"`.
3. Split the `admin` and `editor` routes out of the main bundle with dynamic `import()`.
4. Replaced `moment` with `date-fns` (−230 KB).
5. Added explicit `width`/`height` to all images and the ad slot, which fixed most of the layout shift.

### Why two got worse

- **Time to First Byte, +30 ms:** the new on-the-fly image resizing runs in the same Node process. Pre-generating sizes at build time would remove it, but that would push build time up further.
- **Build time, +22 s:** AVIF encoding of 148 images. Caching encoded images between builds (in `.image-cache/`) should bring it back near 55 s.

### Not verified yet

- These are lab numbers. Field data (real users, from CrUX) needs 28 days to update.
- Safari 16 users get WebP, not AVIF; that wasn't measured separately.

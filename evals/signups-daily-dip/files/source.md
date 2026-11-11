## What happened to signups in March

**Short version:** Signups were normal all month except **12–15 March**, when they fell to about half because the verification email wasn't being sent. They recovered on the 16th, and March ended at **13,132** verified signups, up **4 %** on February (**12,627**).

### Daily verified signups, March

1 Mar 412 · 2 Mar 398 · 3 Mar 430 · 4 Mar 441 · 5 Mar 405 · 6 Mar 388 · 7 Mar 420 · 8 Mar 436 · 9 Mar 452 · 10 Mar 447 · 11 Mar 431 · 12 Mar 210 · 13 Mar 190 · 14 Mar 205 · 15 Mar 228 · 16 Mar 440 · 17 Mar 455 · 18 Mar 462 · 19 Mar 449 · 20 Mar 438 · 21 Mar 470 · 22 Mar 481 · 23 Mar 466 · 24 Mar 459 · 25 Mar 490 · 26 Mar 502 · 27 Mar 488 · 28 Mar 475 · 29 Mar 510 · 30 Mar 523 · 31 Mar 531

### Cause

- The `web@2025.03.12-1` deploy switched the mailer to the new SendGrid template `welcome_v3`. The template was saved but never published, so SendGrid accepted every API call and sent nothing.
- We count a signup only once the email is verified, which is why the outage shows up as a dip in signups.
- **1,026** people started signing up in that window without verifying; **611** of them verified after we resent the emails on 16 March.

### Fixes made

1. Published `welcome_v3` and resent the verification emails (16 Mar, 10:40).
2. Added an alert that fires when fewer than **20** verification emails go out in an hour.

### Still open

- The remaining **415** unverified signups: send one more reminder, or let them go?
- SendGrid's dashboard shows **0** bounces and **0** drops for those days, which I can't explain.

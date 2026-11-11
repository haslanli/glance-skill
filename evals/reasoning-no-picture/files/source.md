## Why some users get logged out after checkout

**Short answer:** The session cookie only works on `shop.example.com`, but the payment provider sends people back to `www.shop.example.com`. On that host the cookie isn't sent, so the user looks logged out.

### What I found

- The login handler sets the session cookie without a `Domain` attribute (`auth/session.ts:41`), so the browser only sends it to `shop.example.com` exactly.
- The payment provider's return URL is set to `https://www.shop.example.com/checkout/done` in their dashboard, not in our code.
- `www.shop.example.com` is served by the same app with no redirect, so the checkout page loads without the cookie and shows the logged-out state.
- It only happens with the hosted card form. Apple Pay returns through a JavaScript callback on the same page, so the session survives.

### Fix

1. Change the return URL in the payment dashboard to `https://shop.example.com/checkout/done`.
2. Optionally, set `Domain=shop.example.com` on the cookie and redirect `www.` to the bare domain, so both hosts behave the same.

### Not verified

- I couldn't open the dashboard myself; the return URL comes from the screenshot you sent.
- I haven't checked whether older versions of the mobile app use the same return URL.

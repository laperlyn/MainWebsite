# La Perlyn — GitHub Pages + Supabase + Razorpay

## Files (repo root = site root)
`index.html sarees.html product.html cart.html wishlist.html checkout.html order-placed.html style.css app.js data.js`
`images/` (hero.jpg, placeholder.svg, the saree photos) · `supabase/` (database + payment backend) · `supabase-setup.sql`
Commit the whole folder. GitHub Pages serves the website; the `supabase/` folder is just stored there (no secrets inside it).

## Setup — do in this order
**1. Products** — Supabase → SQL Editor → paste `supabase-setup.sql` → Run (RLS + your 14 sarees).
**2. Orders** — SQL Editor → paste `supabase/orders-setup.sql` → Run (orders tables, locked to the public).
**3. Photos** — Storage → New bucket `product-images`, **Public ON** → upload every file from `images/` except `hero.jpg`, `placeholder.svg` and the `extra/` folder.
**4. Set real stock** — Table Editor → products → `stock_quantity` (seeded as 5 — placeholder).
**5. Razorpay** — create an account at razorpay.com → Dashboard → **Test Mode** → Account & Settings → API Keys → generate (Key Id `rzp_test_…` + Key Secret).
**6. Deploy the backend** (terminal, in the repo folder):
```
npm i -g supabase          # or prefix commands with npx
supabase login
supabase init              # only if there is no supabase/config.toml yet
supabase link --project-ref ixlxnjmlbhvyotfvzkef
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx RAZORPAY_KEY_SECRET=xxx RAZORPAY_WEBHOOK_SECRET=choose-a-long-random-string ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
supabase functions deploy create-order --no-verify-jwt
supabase functions deploy verify-payment --no-verify-jwt
supabase functions deploy razorpay-webhook --no-verify-jwt
```
**7. Webhook** — Razorpay → Settings → Webhooks → Add: URL `https://ixlxnjmlbhvyotfvzkef.supabase.co/functions/v1/razorpay-webhook`,
secret = your `RAZORPAY_WEBHOOK_SECRET`, event **order.paid**. (Catches payments where the customer closed the tab.)

## Test (Test Mode — no real money)
Add a saree to the bag → Checkout → "Pay online" → in the Razorpay window use UPI `success@razorpay`, or card `4111 1111 1111 1111`
(any future expiry, any CVV, any OTP). You land on the order-placed page. Then check Supabase → Table Editor → `orders` (status `paid`)
and `order_items`; the product's `stock_quantity` drops. Try UPI `failure@razorpay` to see the failure message.
Logs: Supabase → Edge Functions → pick a function → Logs.

## Going live
Complete Razorpay KYC/activation → generate **Live** keys → re-run `supabase secrets set RAZORPAY_KEY_ID=rzp_live_… RAZORPAY_KEY_SECRET=…`
(no code or redeploy needed) → create the webhook again in Live Mode. Razorpay also expects Privacy Policy, Terms,
Shipping and Refund/Return pages on the site — the footer links are still placeholders.

## Everyday use
New saree: upload photo to the bucket → add a row in `products` (see README of the previous step / SQL template) → it appears on the site.
Orders: Table Editor → `orders` (customer, address, payment status). Change `status` to `shipped` / `delivered` yourself.

## Money rules (edit in 2 places, keep identical)
`data.js` (TAX_RATE, SHIP_FLAT, FREE_SHIPPING_FROM — what customers see) and `supabase/orders-setup.sql` (c_tax_rate, c_flat_ship, c_free_from — what is charged; re-run the file after editing).
The server always recalculates prices from the database, so the browser can never change what is charged.

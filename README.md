# La Perlyn — Setup

## 1. Add your images
Create a folder named `images/` next to these files and drop in photos using these **exact filenames** (13 total):

Category banners (5):
- images/cat-silk.jpg
- images/cat-cotton.jpg
- images/cat-linen.jpg
- images/cat-festive.jpg
- images/cat-wedding.jpg

Product photos, 2 per product (28 — p1 to p14):
- images/p1-1.jpg … images/p14-2.jpg (see `data.js` for which name maps to which saree)

That's it — every page pulls from `data.js`, so once the files exist with these names they'll appear on the homepage, product pages, cart, and wishlist automatically. To add a 5th product, add an entry to `PRODUCTS` in `data.js` and reference two new image filenames.

The hero section was left untouched as requested — it still uses the `url('/image.png')` background you had.

## 2. Run the backend (optional)
The site works fully on its own using the browser's localStorage for cart/wishlist/orders — you can just open `index.html` directly. The backend is only needed if you want orders saved to a real server file (`orders.json`) instead of the browser.

```bash
npm install
npm start
```
Then open http://localhost:3000. Orders placed at checkout will be saved to `orders.json` and are fetchable at `/api/orders/:id`.

## Files
- `index.html` — landing page (hero unchanged)
- `product.html` — product detail page, works for any product via `?id=p1` etc.
- `cart.html`, `wishlist.html`, `checkout.html`, `order-placed.html`
- `data.js` — all product/category data + image paths (edit this to add products)
- `app.js` — shared cart/wishlist/render logic used by every page
- `style.css` — shared styles
- `server.js`, `package.json` — minimal Node/Express backend

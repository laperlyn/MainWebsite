# La Perlyn — Handcrafted Sarees E-Commerce

A luxury Indian handcrafted saree boutique web store with responsive editorial design, interactive category filters, product details, dynamic cart, wishlist, and checkout system.

---

## 🚀 Deployment Options

The project is fully pre-configured for instant zero-config deployment to any hosting platform of your choice:

### 1. Vercel (Recommended)
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Keep all default settings — `vercel.json` and `package.json` handle routing, static files, and serverless API execution automatically.
5. Click **Deploy**.

### 2. Netlify
1. Connect your repository to [netlify.com](https://netlify.com).
2. The pre-configured `netlify.toml` automatically sets `publish = "."` and build command `npm run build`.
3. Click **Deploy Site**.

### 3. Render / Railway / Heroku
- The repository includes a `Procfile` (`web: node server.js`) and auto-detects `process.env.PORT` on `0.0.0.0`.
- On Render: Create a **Web Service**, connect your repository, set the runtime to **Node**, and deploy.

### 4. Cloudflare Pages
- Run `npx wrangler pages deploy .` or connect your repository in Cloudflare Pages dashboard.
- Uses `wrangler.toml` out of the box.

### 5. GitHub Pages
- Go to repository **Settings > Pages**, choose `Deploy from a branch`, select `main` and root `/`.
- The repository includes `.nojekyll` and uses relative asset paths.

---

## 💻 Local Development

### Static Mode
You can open `index.html` directly in any web browser. Cart, wishlist, and checkout persist seamlessly using browser `localStorage`.

### Full-Stack Mode (with Express server)
```bash
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Asset Inventory

All 36 visual assets are bundled locally in `images/` with zero broken links or external dependencies:
- **Hero & Branding**:
  - `images/hero.jpg` & `image.png` (fallback) — Wide 16:9 cinematic heritage courtyard saree photoshoot.
  - `favicon.svg` — Custom gold luxury LP monogram vector icon.
- **Category Banners (5)**:
  - `images/cat-silk.jpg` — Silk Sarees
  - `images/cat-cotton.jpg` — Cotton Sarees
  - `images/cat-linen.jpg` — Linen Sarees
  - `images/cat-festive.jpg` — Festive Collection
  - `images/cat-wedding.jpg` — Wedding Collection
- **Product Photos (28)**:
  - `images/p1-1.jpg` to `images/p14-2.jpg` (2 photos per saree: front drape & pallu/zari detail).

---

## 📁 Project Architecture

- `index.html` — Homepage with Hero banner, Curated Collections showcase, Featured sarees, Brand story, Reviews, and Newsletter.
- `sarees.html` — All Sarees catalog with interactive category filters (All, Silk, Cotton, Linen, Festive, Wedding).
- `product.html` — Product detail page with interactive gallery thumbnails, fabric/blouse/length specs, quantity stepper, add-to-cart, wishlist toggle, and related recommendations.
- `cart.html` — Shopping bag with line items, quantity steppers, shipping calculation, and 5% tax.
- `checkout.html` — Order placement with address form, payment options, and fallback resilience.
- `order-placed.html` — Order confirmation screen with receipt summary and unique order ID.
- `wishlist.html` — Saved sarees grid with direct add-to-cart / view details.
- `data.js` — Saree catalog database and category configurations.
- `app.js` — Shared cart, wishlist, and responsive navigation logic.
- `style.css` — High-end luxury typography (Cormorant Garamond, Poppins, Annie Use Your Telescope) and responsive layout styles.
- `server.js` — Resilient Express server supporting both standalone Node servers and serverless runtimes.
- `vercel.json`, `netlify.toml`, `wrangler.toml`, `Procfile`, `.nojekyll` — Platform deployment configs.

-- ============================================================
-- La Perlyn — Supabase setup. Paste into Supabase > SQL Editor > Run.
-- Safe to re-run (idempotent).
-- ============================================================

-- 1) Helpful defaults (harmless if they already exist)
alter table public.products alter column id set default gen_random_uuid();
alter table public.products alter column created_at set default now();
alter table public.products alter column updated_at set default now();
alter table public.products alter column is_active set default true;
alter table public.products alter column is_featured set default false;
create unique index if not exists products_slug_key on public.products (slug);

-- 2) Security: Row Level Security ON, public may ONLY read ACTIVE products.
--    No insert/update/delete policies exist, so visitors can never change data.
alter table public.products enable row level security;
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

-- 3) STORAGE: create the bucket in the dashboard (Storage > New bucket)
--    name: product-images   |   Public bucket: ON
--    (Public = anyone can VIEW images; only you can upload from the dashboard.)

-- 4) YOUR 14 SAREES (run once; re-running is safe). First removes the old demo rows if you ran the earlier seed.
--    Upload every photo from the repo's images/ folder (except hero.jpg, placeholder.svg, extra/) into the product-images bucket.
--    stock_quantity is set to 5 as a placeholder — set your REAL stock in Table Editor.
delete from public.products where slug in ('rukmini-crimson-tussar-silk', 'meera-ivory-satin-embroidered', 'anika-plum-chiffon-butta', 'neela-sapphire-banarasi', 'hari-olive-tissue-silk', 'vana-emerald-banarasi', 'indira-navy-copper-zari', 'lakshmi-scarlet-banarasi', 'ahana-violet-foil-silk', 'rani-royal-purple-embroidered', 'kaveri-royal-blue-silk', 'zara-teal-sequin-embroidered', 'amrita-violet-embroidered', 'tara-copper-kanjeevaram', 'surya-saffron-cotton-silk', 'gul-crimson-cotton-silk');
insert into public.products
  (name, slug, description, price, original_price, category, fabric, image_urls, stock_quantity, is_featured, is_active)
values
  ('White Crape Saree with Cutwork & Black Border', 'white-crape-cutwork-black-border', 'Crafted from premium crape fabric, this elegant white saree features intricate cutwork embroidery, delicate floral motifs all over, and a striking contrasting black scalloped border. It comes paired with a matching black unstitched blouse piece to complete the sophisticated monochrome look.', 850, null, 'Designer Crape', 'Crape', array['white-crape-cutwork-black-border-1.jpg', 'white-crape-cutwork-black-border-2.jpg'], 5, false, true),
  ('Rukmini Rust Elegance', 'rukmini-rust-elegance', 'Make a graceful statement with the Rukmini Rust Elegance Saree from La Perlyn. Featuring a rich rust-orange body, this saree is beautifully complemented by delicate gold-toned floral motifs and an elaborate deep-brown border. The contrasting border adds depth and character, while the coordinated pallu showcases intricate traditional-inspired detailing. Perfect for women who appreciate classic Indian aesthetics with an elegant touch.', 500, null, 'Silk', 'Silk', array['rukmini-rust-elegance-1.jpg', 'rukmini-rust-elegance-2.jpg'], 5, true, true),
  ('Amrapali Wine Grace', 'amrapali-wine-grace', 'Make a sophisticated statement with the Amrapali Wine Grace Saree from La Perlyn. Featuring a rich wine-purple body, this saree is beautifully patterned with all-over delicate foil or print motifs, complemented by a striking traditional zari border. The rich pallu and refined finish add depth and character, making it a stellar choice for both intimate occasions and festive gatherings.', 650, null, 'Printed / Festive', 'Printed Blend', array['amrapali-wine-grace-1.jpg'], 5, false, true),
  ('Kasturi Royal Blue', 'kasturi-royal-blue', 'Make a striking statement with the Kasturi Royal Blue Pattu Saree from La Perlyn. Featuring a vibrant royal blue body, this saree is beautifully patterned with all-over intricate silver zari weaving, complemented by a rich and heavy silver-bordered pallu. The refined finish and regal sheen add depth and grace, making it an exceptional choice for weddings, grand celebrations, and festive occasions.', 650, null, 'Pattu / Silk', 'Silk Blend', array['kasturi-royal-blue-1.jpg'], 5, true, true),
  ('Kasthuri Olive Green', 'kasthuri-olive-green', 'Step out in traditional splendor with the Kasthuri Olive Green Silk Saree from La Perlyn. Featuring a rich olive green body, this saree is beautifully patterned with intricate all-over gold zari weaving and an ornate, detailed pallu. The elegant contrast border and classic finish add depth, making it an ideal choice for cultural functions and festive celebrations.', 650, null, 'Silk', 'Silk Blend', array['kasthuri-olive-green-1.jpg'], 5, false, true),
  ('Kasthuri Emerald Green', 'kasthuri-emerald-green', 'Embrace profound elegance with the Kasthuri Emerald Green Silk Saree from La Perlyn. This saree showcases a deep emerald green shade highlighted by luminous woven motifs and an opulent zari border. Its refined texture and regal fall make it a breathtaking option for weddings, parties, and festive occasions.', 650, null, 'Silk', 'Silk Blend', array['kasthuri-emerald-green-1.jpg'], 5, false, true),
  ('Kasthuri Midnight Blue', 'kasthuri-midnight-blue', 'Redefine ethnic sophistication with the Kasthuri Midnight Blue Silk Saree from La Perlyn. Designed with a deep midnight blue base, this saree exhibits intricate copper-gold floral motifs across the body, complemented by a heavily detailed designer border. It radiates effortless charm and class for any special event.', 650, null, 'Silk', 'Silk Blend', array['kasthuri-midnight-blue-1.jpg'], 5, false, true),
  ('Kasthuri Crimson Red', 'kasthuri-crimson-red', 'Make heads turn with the vibrant Kasthuri Crimson Red Silk Saree from La Perlyn. This striking red piece is adorned with exquisite gold zari motifs and features an elaborately woven heavy border and pallu. Crafted to capture traditional Indian heritage, it brings unmatched radiance to any celebratory occasion.', 650, null, 'Silk', 'Silk Blend', array['kasthuri-crimson-red-1.jpg'], 5, true, true),
  ('Ananya Royal Purple', 'ananya-royal-purple', 'Command attention with the Ananya Royal Purple Saree from La Perlyn. This striking royal purple silk saree is beautifully adorned with all-over traditional gold-toned motifs and finished with a rich, ornate zari border and pallu. It is uniquely styled with a contrasting white blouse detailed with delicate bead work, offering a sophisticated blend of classic tradition and modern flair.', 500, null, 'Silk', 'Royal Silk Blend', array['ananya-royal-purple-1.jpg'], 5, false, true),
  ('Nandini Royal Blue', 'nandini-royal-blue', 'Exude timeless elegance with the Nandini Royal Blue Saree from La Perlyn. Featuring a smooth, radiant royal blue body, this saree is gracefully highlighted by a luxurious contrasting copper-gold zari woven border. The rich sheen and classic finish make it a phenomenal choice for grand festivities, weddings, and special occasions.', 1550, null, 'Silk', 'Silk Blend', array['nandini-royal-blue-1.jpg'], 5, false, true),
  ('Sunita Copper-Zari Rust', 'sunita-copper-zari-rust', 'Bring warm vibrance to your ethnic wardrobe with the Sunita Copper-Zari Rust Saree from La Perlyn. Crafted with a rich rust-orange body that catches the light with a soft shimmer, this saree is framed by an eye-catching deep purple and copper-gold patterned border. Perfect for festive gatherings, day events, or intimate celebrations, it delivers an effortless, graceful statement.', 1550, null, 'Silk', 'Silk Blend', array['sunita-copper-zari-rust-1.jpg'], 5, false, true),
  ('Mohini Crimson Gold', 'mohini-crimson-gold', 'Exude classic grace with the Mohini Crimson Gold Saree from La Perlyn. Fashioned from a rich crimson red fabric with a luxurious fluid drape, this piece is beautifully accented by a broad, finely woven silver-gold zari border. Its understated elegance and rich color tone make it an absolute must-have for weddings, family functions, and festive rituals.', 1550, null, 'Silk', 'Silk Blend', array['mohini-crimson-gold-1.jpg'], 5, false, true),
  ('Arya Royal Purple', 'arya-royal-purple', 'Make a glamorous impression with the Arya Royal Purple Work Saree from La Perlyn. Featuring a rich royal purple fabric, this saree is adorned with heavy, intricate gold-toned thread and zari embroidery along the scalloped borders and scattered across the body. It comes complete with a heavily embellished matching blouse piece, making it a showstopping choice for weddings, receptions, and major festive celebrations.', 999, null, 'Designer Work Sarees', 'Designer Blend', array['arya-royal-purple-1.jpg'], 5, true, true),
  ('Kamala Rust & Green', 'kamala-rust-green', 'Make a graceful impression with the Kamala Rust & Green Saree from La Perlyn. Featuring a rich rust-orange body with artistic floral print elements and a soft shimmer, this saree is beautifully highlighted by a broad, contrasting deep green and gold zari woven border. Perfect for festive gatherings, day functions, and traditional celebrations.', 500, null, 'Silk', 'Silk Blend', array['kamala-rust-green-1.jpg'], 5, false, true)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- TEMPLATE: adding a saree with SQL instead of the Table Editor
-- ------------------------------------------------------------
-- insert into public.products
--   (name, slug, description, price, original_price, category, fabric, image_urls, stock_quantity, is_featured)
-- values
--   ('My New Saree', 'my-new-saree', 'Short description', 12500, 15000, 'silk', 'Banarasi Silk',
--    array['my-new-saree-1.jpg','my-new-saree-2.jpg'], 5, true);

/* La Perlyn — product data now comes from Supabase (public.products). Only the PUBLISHABLE key is used here. */
const SUPABASE_URL = 'https://ixlxnjmlbhvyotfvzkef.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OXK14RgW_YVh64SZk_dmyA_yD0VwO-J';
const IMAGE_BUCKET = 'product-images';           // Supabase Storage bucket (must be Public)
const PLACEHOLDER  = 'images/placeholder.svg';
const FUNCTIONS_URL = SUPABASE_URL + '/functions/v1';   // Edge Functions: create-order, verify-payment
// Display-only pricing rules — the SERVER recalculates everything. Keep in sync with supabase/orders-setup.sql
const TAX_RATE = 0.05, SHIP_FLAT = 199, FREE_SHIPPING_FROM = 5000;

let PRODUCTS = [];
let _loading = null;

// image_urls entries can be full URLs OR just a file name/path inside the storage bucket
function imgUrl(v){
  v = String(v || '').trim();
  if (!v) return null;
  if (/^(https?:)?\/\//.test(v) || v.startsWith('data:')) return v;
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${v.split('/').map(encodeURIComponent).join('/')}`;
}

function normalize(r){
  const list = Array.isArray(r.image_urls) ? r.image_urls : [];
  const imgs = list.map(imgUrl).filter(Boolean);
  const price = Number(r.price) || 0, orig = Number(r.original_price) || 0;
  return {
    id: r.id, slug: r.slug, name: r.name || 'Untitled saree',
    category: r.category || '', price, mrp: orig > price ? orig : null,
    images: imgs.length ? imgs : [PLACEHOLDER],
    fabric: r.fabric || '', desc: r.description || '',
    stock: r.stock_quantity == null ? null : Number(r.stock_quantity),
    featured: !!r.is_featured
  };
}

function loadProducts(force){
  if (_loading && !force) return _loading;
  const url = `${SUPABASE_URL}/rest/v1/products?select=*&is_active=eq.true&order=is_featured.desc,created_at.desc`;
  _loading = fetch(url, { headers: { apikey: SUPABASE_KEY } })
    .then(res => { if (!res.ok) throw new Error('Supabase responded ' + res.status); return res.json(); })
    .then(rows => { PRODUCTS = rows.map(normalize); pruneStale(); return PRODUCTS; })
    .catch(err => { _loading = null; throw err; });
  return _loading;
}

function getProduct(id){ return PRODUCTS.find(p => p.id === id); }

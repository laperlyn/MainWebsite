const LS_CART='lp_cart', LS_WISH='lp_wish', LS_ORDER='lp_last_order';
const money = n => '₹' + n.toLocaleString('en-IN');

const store = {
  get(key){ try{return JSON.parse(localStorage.getItem(key))||[]}catch{return []} },
  set(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
};

function getCart(){ return store.get(LS_CART); }
function saveCart(c){ store.set(LS_CART,c); updateCounts(); }
function addToCart(id, qty=1){
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty += qty; else cart.push({id, qty});
  saveCart(cart);
}
function updateQty(id, qty){
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(l => l.id !== id);
  else cart.forEach(l => { if (l.id === id) l.qty = qty; });
  saveCart(cart);
}
function removeFromCart(id){ saveCart(getCart().filter(l => l.id !== id)); }

function getWishlist(){ return store.get(LS_WISH); }
function toggleWishlist(id){
  let w = getWishlist();
  if (w.includes(id)) w = w.filter(x => x !== id); else w.push(id);
  store.set(LS_WISH, w);
  updateCounts();
  return w.includes(id);
}

function cartTotals(){
  const cart = getCart();
  const subtotal = cart.reduce((sum,l) => { const p = getProduct(l.id); return sum + (p ? p.price*l.qty : 0); }, 0);
  const shipping = subtotal === 0 ? 0 : (subtotal >= 5000 ? 0 : 199);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  return {subtotal, shipping, tax, total, count: cart.reduce((s,l)=>s+l.qty,0)};
}

function updateCounts(){
  const cartCountEl = document.getElementById('cartCount');
  const wishCountEl = document.getElementById('wishCount');
  if (cartCountEl) cartCountEl.textContent = cartTotals().count;
  if (wishCountEl) wishCountEl.textContent = getWishlist().length;
}

/* ---------- shared render: product card ---------- */
function productCardHTML(p){
  const wished = getWishlist().includes(p.id);
  return `
  <div class="product-card" data-category="${p.category}">
    <div class="product-media">
      <button class="wishlist-toggle ${wished?'active':''}" data-id="${p.id}" aria-label="Wishlist">${wished?'♥':'♡'}</button>
      <img class="front" src="${p.images[0]}" alt="${p.name}" loading="lazy" decoding="async">
      <img class="back" src="${p.images[1]||p.images[0]}" alt="${p.name} alternate view" loading="lazy" decoding="async">
      <a class="view-details" href="product.html?id=${p.id}">View Details</a>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}${p.mrp?` <span class="was">${money(p.mrp)}</span>`:''}</div>
    </div>
  </div>`;
}

function bindWishlistButtons(root=document){
  root.querySelectorAll('.wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const id = btn.dataset.id;
      const active = toggleWishlist(id);
      btn.classList.toggle('active', active);
      btn.textContent = active ? '♥' : '♡';
    });
  });
}

/* ---------- nav / header wiring, shared on every page ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));

  const menuBtn = document.getElementById('menuBtn');
  const navMobile = document.getElementById('navMobile');
  if (menuBtn && navMobile){
    menuBtn.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMobile.classList.remove('open')));
  }

  updateCounts();

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length){
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold:.15});
    revealEls.forEach(el => io.observe(el));
  }

  const nlForm = document.getElementById('nlForm');
  if (nlForm) nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('nlEmail').value;
    const note = document.getElementById('nlNote');
    if (email && note) { note.textContent = "You're on the list — welcome to La Perlyn."; nlForm.reset(); }
  });
});

const LS={c:'lp_cart',w:'lp_wish',o:'lp_order'},money=n=>'₹'+Number(n).toLocaleString('en-IN');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IMG_ERR=`onerror="this.onerror=null;this.src='${PLACEHOLDER}'"`;
const store={get:k=>{try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const getCart=()=>store.get(LS.c),saveCart=c=>{store.set(LS.c,c);counts()};
const maxQty=id=>{const p=getProduct(id);return p&&p.stock!=null?p.stock:99};
function addToCart(id,q=1){const c=getCart(),l=c.find(x=>x.id===id);if(l)l.qty=Math.min(l.qty+q,maxQty(id));else c.push({id,qty:Math.min(q,maxQty(id))});saveCart(c)}
function updateQty(id,q){saveCart(q<=0?getCart().filter(l=>l.id!==id):getCart().map(l=>l.id===id?{...l,qty:Math.min(q,maxQty(id))}:l))}
const removeFromCart=id=>saveCart(getCart().filter(l=>l.id!==id)),getWish=()=>store.get(LS.w);
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];store.set(LS.w,w);counts();return w.includes(id)}
function totals(){const c=getCart(),sub=c.reduce((s,l)=>s+(getProduct(l.id)?.price||0)*l.qty,0),ship=sub&&sub<FREE_SHIPPING_FROM?SHIP_FLAT:0,tax=Math.round(sub*TAX_RATE);return{sub,ship,tax,total:sub+ship+tax,count:c.reduce((s,l)=>s+l.qty,0)}}
function counts(){const a=document.getElementById('cartCount'),b=document.getElementById('wishCount');if(a)a.textContent=totals().count;if(b)b.textContent=getWish().length}
function pcard(p){const w=getWish().includes(p.id),sold=p.stock!=null&&p.stock<=0;return`<div class="pcard"><div class="pmedia">${sold?'<span class="tag">Sold out</span>':''}<button class="wish ${w?'on':''}" data-id="${esc(p.id)}" aria-label="Wishlist">${w?'♥':'♡'}</button><img class="front" src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" ${IMG_ERR}>${p.images[1]?`<img class="back" src="${esc(p.images[1])}" alt="" loading="lazy" onerror="this.remove()">`:''}<a class="vd" href="product.html?id=${encodeURIComponent(p.id)}">View Details</a></div><div class="pinfo"><h3>${esc(p.name)}</h3><div class="price">${money(p.price)}${p.mrp?`<span class="was">${money(p.mrp)}</span>`:''}</div></div></div>`}
function bindWish(root=document){root.querySelectorAll('.wish[data-id]').forEach(b=>b.onclick=e=>{e.preventDefault();const on=toggleWish(b.dataset.id);b.classList.toggle('on',on);b.textContent=on?'♥':'♡'})}
function pruneStale(){if(!PRODUCTS.length)return;
 store.set(LS.c,getCart().filter(l=>{const p=getProduct(l.id);return p&&(p.stock==null||p.stock>0)}).map(l=>({...l,qty:Math.min(l.qty,maxQty(l.id))})));
 store.set(LS.w,getWish().filter(id=>getProduct(id)));counts()}
async function withProducts(box,render){
 box.innerHTML='<div class="state"><div class="spin"></div><p>Loading sarees…</p></div>';
 try{await loadProducts()}catch(e){console.error('Could not load products from Supabase:',e);
  box.innerHTML='<div class="state"><h3>We couldn\'t load the collection</h3><p>Please check your connection and try again.</p><button class="btn btn-dark" style="margin-top:20px" id="retry">Try again</button></div>';
  box.querySelector('#retry').onclick=()=>withProducts(box,render);return}
 if(!PRODUCTS.length){box.innerHTML='<div class="state"><h3>New sarees are on their way</h3><p>Our collection is being curated — please check back soon.</p></div>';return}
 render(PRODUCTS)}
document.addEventListener('DOMContentLoaded',()=>{
 const solid=document.body.hasAttribute('data-solid'),L=[['index.html','Home'],['index.html#featured','Featured'],['sarees.html','Sarees'],['index.html#story','About'],['index.html#contact','Contact']],a=L.map(x=>`<a href="${x[0]}">${x[1]}</a>`).join('');
 document.body.insertAdjacentHTML('afterbegin',`<header id="hd" class="${solid?'solid':''}"><div class="wrap nav"><a class="nav-logo logo-font" href="index.html">La Perlyn</a><nav class="nav-c">${a}</nav><div class="nav-r"><a href="wishlist.html">Wishlist<span class="badge" id="wishCount">0</span></a><a href="cart.html">Cart<span class="badge" id="cartCount">0</span></a><button class="menu-btn" id="mb" aria-label="Menu">☰</button></div></div><div class="nav-m" id="nm">${a}</div></header>`);
 document.body.insertAdjacentHTML('beforeend',`<footer><div class="wrap"><div class="fg"><div><div class="logo-font" style="font-size:32px;margin-bottom:16px">La Perlyn</div><p>Handpicked sarees, sourced with care and shipped to your door.</p></div><div><h4>Shop</h4><ul><li><a href="index.html#featured">Featured</a></li><li><a href="sarees.html">All Sarees</a></li></ul></div><div><h4>Company</h4><ul><li><a href="index.html#story">About</a></li><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li></ul></div><div><h4>Contact</h4><ul><li><a href="mailto:hello@laperlyn.example">hello@laperlyn.example</a></li><li><a href="#">Instagram</a></li><li><a href="#">Pinterest</a></li></ul></div></div><div class="fb"><span>© 2026 La Perlyn. All rights reserved.</span><span>Designed for those who wear their story.</span></div></div></footer>`);
 const hd=document.getElementById('hd');if(!solid)addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>60));
 const nm=document.getElementById('nm');document.getElementById('mb').onclick=()=>nm.classList.toggle('open');nm.querySelectorAll('a').forEach(x=>x.onclick=()=>nm.classList.remove('open'));
 counts();
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
 const f=document.getElementById('nlf');if(f)f.onsubmit=e=>{e.preventDefault();document.getElementById('nlnote').textContent="You're on the list — welcome to La Perlyn.";f.reset()};
});

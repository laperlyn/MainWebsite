const LS={c:'lp_cart',w:'lp_wish',o:'lp_order'},money=n=>'₹'+n.toLocaleString('en-IN');
const store={get:k=>{try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const getCart=()=>store.get(LS.c),saveCart=c=>{store.set(LS.c,c);counts()};
function addToCart(id,q=1){const c=getCart(),l=c.find(x=>x.id===id);l?l.qty+=q:c.push({id,qty:q});saveCart(c)}
function updateQty(id,q){saveCart(q<=0?getCart().filter(l=>l.id!==id):getCart().map(l=>l.id===id?{...l,qty:q}:l))}
const removeFromCart=id=>saveCart(getCart().filter(l=>l.id!==id)),getWish=()=>store.get(LS.w);
function toggleWish(id){let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];store.set(LS.w,w);counts();return w.includes(id)}
function totals(){const c=getCart(),sub=c.reduce((s,l)=>s+(getProduct(l.id)?.price||0)*l.qty,0),ship=sub&&sub<5000?199:0,tax=Math.round(sub*.05);return{sub,ship,tax,total:sub+ship+tax,count:c.reduce((s,l)=>s+l.qty,0)}}
function counts(){const a=document.getElementById('cartCount'),b=document.getElementById('wishCount');if(a)a.textContent=totals().count;if(b)b.textContent=getWish().length}
function pcard(p){const w=getWish().includes(p.id);return`<div class="pcard"><div class="pmedia"><button class="wish ${w?'on':''}" data-id="${p.id}" aria-label="Wishlist">${w?'♥':'♡'}</button><img class="front" src="${p.images[0]}" alt="${p.name}"><img class="back" src="${p.images[1]||p.images[0]}" alt=""><a class="vd" href="product.html?id=${p.id}">View Details</a></div><div class="pinfo"><h3>${p.name}</h3><div class="price">${money(p.price)}${p.mrp?`<span class="was">${money(p.mrp)}</span>`:''}</div></div></div>`}
function bindWish(root=document){root.querySelectorAll('.wish[data-id]').forEach(b=>b.onclick=e=>{e.preventDefault();const on=toggleWish(b.dataset.id);b.classList.toggle('on',on);b.textContent=on?'♥':'♡'})}
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

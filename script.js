
/* ===== RASMLAR =====
   Haqiqiy rasmlarni images/ papkasiga iphone-1.jpg ... iphone-50.jpg nomi bilan qo'ying
   YOKI quyidagi IMG funksiyasini o'zingizning rasm URL manzillaringiz bilan almashtiring.
   Rasm topilmasa, avtomatik chizilgan iPhone ko'rinadi. */
const IMG = (kind,i) => `images/${kind}-${i}.jpg`;   // iphone-1.jpg, macbook-1.jpg, watch-1.jpg ...
 
/* nom, qatorga tegishli seriya, boshlang'ich narx ($), ranglar */
const models = [
 ["iPhone 17 Pro Max","iPhone 17",1199,[["Cosmic Orange","#e0743c"],["Deep Blue","#2f4a6d"],["Silver","#e3e4e6"]]],
 ["iPhone 17 Pro","iPhone 17",1099,[["Cosmic Orange","#e0743c"],["Deep Blue","#2f4a6d"],["Silver","#e3e4e6"]]],
 ["iPhone Air","iPhone 17",999,[["Space Black","#2b2b2d"],["Cloud White","#f2f2ef"],["Light Gold","#e6d3b3"],["Sky Blue","#b9d3e8"]]],
 ["iPhone 17","iPhone 17",799,[["Black","#222"],["White","#f5f5f0"],["Mist Blue","#b8cde0"],["Sage","#b6c4a8"],["Lavender","#cbbfe0"]]],
 ["iPhone 16e","iPhone 16",599,[["Black","#222"],["White","#f5f5f0"]]],
 ["iPhone 16 Pro Max","iPhone 16",1199,[["Desert Titanium","#c9b29b"],["Natural Titanium","#b5b0a8"],["White Titanium","#e5e3de"],["Black Titanium","#3a3a3c"]]],
 ["iPhone 16 Pro","iPhone 16",999,[["Desert Titanium","#c9b29b"],["Natural Titanium","#b5b0a8"],["White Titanium","#e5e3de"],["Black Titanium","#3a3a3c"]]],
 ["iPhone 16 Plus","iPhone 16",899,[["Ultramarine","#7f93e8"],["Teal","#9cc7c4"]]],
 ["iPhone 16","iPhone 16",799,[["Black","#222"],["White","#f5f5f0"],["Pink","#f0c4d4"],["Teal","#9cc7c4"],["Ultramarine","#7f93e8"]]],
 ["iPhone 15 Pro Max","iPhone 15",1099,[["Natural Titanium","#b5b0a8"],["Blue Titanium","#4b5a6e"],["White Titanium","#e5e3de"],["Black Titanium","#3a3a3c"]]],
 ["iPhone 15 Pro","iPhone 15",999,[["Natural Titanium","#b5b0a8"],["Blue Titanium","#4b5a6e"],["White Titanium","#e5e3de"],["Black Titanium","#3a3a3c"]]],
 ["iPhone 15 Plus","iPhone 15",799,[["Black","#3b3b3d"],["Blue","#cfdde8"],["Green","#d3e0cf"],["Yellow","#f2eac2"],["Pink","#f0dcdc"]]],
 ["iPhone 15","iPhone 15",699,[["Black","#3b3b3d"],["Blue","#cfdde8"],["Green","#d3e0cf"],["Yellow","#f2eac2"],["Pink","#f0dcdc"]]],
 /* MacBook */
 ["MacBook Air 13\" M4","MacBook",999,[["Midnight","#2e3642"],["Starlight","#e6ddd0"],["Sky Blue","#a9c4dc"],["Silver","#e3e4e6"]],"macbook"],
 ["MacBook Air 15\" M4","MacBook",1199,[["Midnight","#2e3642"],["Starlight","#e6ddd0"],["Sky Blue","#a9c4dc"],["Silver","#e3e4e6"]],"macbook"],
 ["MacBook Pro 14\" M5","MacBook",1599,[["Space Black","#2d2d2f"],["Silver","#e3e4e6"]],"macbook"],
 ["MacBook Pro 16\" M4 Pro","MacBook",2499,[["Space Black","#2d2d2f"],["Silver","#e3e4e6"]],"macbook"],
 /* Apple Watch */
 ["Apple Watch Series 11","Watch",399,[["Jet Black","#1c1c1e"],["Rose Gold","#e6bfb0"],["Silver","#e3e4e6"],["Space Gray","#6b6b70"]],"watch"],
 ["Apple Watch Ultra 3","Watch",799,[["Natural","#c8c3b8"],["Black","#1c1c1e"]],"watch"],
 ["Apple Watch SE 3","Watch",249,[["Midnight","#1f2733"],["Starlight","#e6ddd0"]],"watch"]
];
const products=[];const cnt={};
models.forEach(([name,series,price,cols,kind="iphone"])=>cols.forEach(([color,hex])=>{
 cnt[kind]=(cnt[kind]||0)+1;
 products.push({id:products.length+1,name,series,price,color,hex,kind,img:IMG(kind,cnt[kind])});
}));
/* 50 iPhone + 12 MacBook + 8 Watch = 70 ta mahsulot */
 
const $=s=>document.querySelector(s);
const grid=$("#grid");let filter="all",term="",sort="def",favOnly=false;
const OPTS={iphone:[["128 GB",0],["256 GB",100],["512 GB",300],["1 TB",500]],macbook:[["256 GB",0],["512 GB",200],["1 TB",400]],watch:[["42 mm",0],["46 mm",30]]};
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let cart=load("cart",[]),favs=load("favs",[]);
const byId=id=>products.find(p=>p.id===id);
const unit=(p,o)=>p.price+OPTS[p.kind][o][1];
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),1800)}
function setImg(img,p){img.onerror=function(){this.onerror=null;this.src=phoneSVG(p.hex,p.kind,p.name)};img.src=p.img}
function addToCart(id,o=0){
 const l=cart.find(c=>c.id===id&&c.o===o);
 l?l.q++:cart.push({id,o,q:1});
 save("cart",cart);renderCart();toast("Savatga qo'shildi");
}
function renderCart(){
 const box=$("#items");let sum=0,cnt=0;box.innerHTML=cart.length?"":'<p style="padding:30px 0;color:#6e6e73;text-align:center">Savat bo\'sh.</p>';
 cart.forEach((c,i)=>{
  const p=byId(c.id);sum+=unit(p,c.o)*c.q;cnt+=c.q;
  const r=document.createElement("div");r.className="it";
  r.innerHTML=`<img alt=""><div class="t">${p.name}<small>${p.color} · ${OPTS[p.kind][c.o][0]}</small>${usd(unit(p,c.o))}</div>
  <div class="qty"><button>−</button><span>${c.q}</span><button>+</button></div>`;
  setImg(r.querySelector("img"),p);
  const [m,pl]=r.querySelectorAll("button");
  m.onclick=()=>{c.q--;if(c.q<=0)cart.splice(i,1);save("cart",cart);renderCart()};
  pl.onclick=()=>{c.q++;save("cart",cart);renderCart()};
  box.appendChild(r);
 });
 $("#sum").textContent=usd(sum);$("#count").textContent=cnt;
}
function toggleFav(id){favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save("favs",favs);render()}
const panel=(el,on)=>{$(el).classList.toggle("show",on);if(el==="#drawer")$("#ov").classList.toggle("show",on)};
let cur=null,curO=0;
function openModal(p){
 cur=p;curO=0;$("#mname").textContent=p.name;$("#mcol").textContent=p.color;setImg($("#mimg"),p);
 const box=$("#mopts");box.innerHTML="";
 OPTS[p.kind].forEach(([l],i)=>{const b=document.createElement("button");b.textContent=l;if(!i)b.className="sel";
  b.onclick=()=>{curO=i;[...box.children].forEach(x=>x.classList.remove("sel"));b.classList.add("sel");$("#mprice").textContent=usd(unit(p,i))};box.appendChild(b)});
 $("#mprice").textContent=usd(unit(p,0));panel("#modal",true);
}
 
function shade(hex,a){
 const n=parseInt(hex.slice(1),16);
 const f=c=>Math.max(0,Math.min(255,Math.round(c+(a>0?(255-c)*a:c*a))));
 return `rgb(${f(n>>16)},${f(n>>8&255)},${f(n&255)})`;
}
function phoneSVG(hex,kind,name=""){
 const hi=shade(hex,.35),lo=shade(hex,-.3);
 const defs=`<defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${hi}'/><stop offset='.5' stop-color='${hex}'/><stop offset='1' stop-color='${lo}'/></linearGradient>
 <linearGradient id='s' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#1b2a4a'/><stop offset='.5' stop-color='#5b3c8c'/><stop offset='1' stop-color='#e0663a'/></linearGradient>
 <radialGradient id='l'><stop offset='0' stop-color='#3a4a6a'/><stop offset='.45' stop-color='#10131a'/><stop offset='1' stop-color='#000'/></radialGradient></defs>`;
 let svg;
 if(kind==="macbook"){
  svg=`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'>${defs}
  <rect x='46' y='12' width='208' height='134' rx='10' fill='url(#b)' stroke='${lo}' stroke-width='2'/>
  <rect x='54' y='20' width='192' height='118' rx='4' fill='#050505'/>
  <rect x='58' y='24' width='184' height='110' rx='2' fill='url(#s)'/>
  <rect x='135' y='24' width='30' height='7' rx='3' fill='#050505'/>
  <path d='M14 150h272l-10 24a8 8 0 0 1-7 4H31a8 8 0 0 1-7-4z' fill='url(#b)' stroke='${lo}' stroke-width='2'/>
  <rect x='120' y='150' width='60' height='5' rx='2.5' fill='${lo}' opacity='.6'/>
  <g fill='${lo}' opacity='.45'>${[0,1,2].map(r=>`<rect x='40' y='${158+r*5}' width='220' height='3' rx='1'/>`).join('')}</g>
  <rect x='20' y='178' width='260' height='4' rx='2' fill='${lo}' opacity='.5'/></svg>`;
 }else if(kind==="watch"){
  svg=`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='220' viewBox='0 0 140 220'>${defs}
  <path d='M48 80V8q0-6 6-6h32q6 0 6 6v72z' fill='url(#b)' opacity='.8'/>
  <path d='M48 140v72q0 6 6 6h32q6 0 6-6v-72z' fill='url(#b)' opacity='.8'/>
  <rect x='22' y='60' width='96' height='100' rx='28' fill='url(#b)' stroke='${lo}' stroke-width='2'/>
  <rect x='118' y='92' width='8' height='22' rx='3' fill='${lo}'/><rect x='118' y='122' width='5' height='14' rx='2' fill='${lo}'/>
  <rect x='30' y='68' width='80' height='84' rx='21' fill='#000'/>
  <circle cx='70' cy='110' r='32' fill='none' stroke='#2a2a2e' stroke-width='3'/>
  <circle cx='70' cy='110' r='32' fill='none' stroke='#ff3b30' stroke-width='3' stroke-dasharray='90 200' stroke-linecap='round'/>
  <line x1='70' y1='110' x2='70' y2='90' stroke='#fff' stroke-width='3' stroke-linecap='round'/>
  <line x1='70' y1='110' x2='84' y2='116' stroke='#fff' stroke-width='3' stroke-linecap='round'/>
  <circle cx='70' cy='110' r='3' fill='#ff9500'/></svg>`;
 }else{
  const lenses=/Pro/.test(name)?3:/Air|16e/.test(name)?1:2;
  const pos={1:[[44,44]],2:[[32,32],[32,66]],3:[[30,28],[30,60],[62,44]]}[lenses];
  const bump=lenses===1?`<rect x='16' y='20' width='${/Air/.test(name)?150:50}' height='50' rx='${/Air/.test(name)?14:16}' fill='${lo}' opacity='.35'/>`:`<rect x='16' y='20' width='${lenses===3?66:44}' height='${lenses===3?70:78}' rx='16' fill='${lo}' opacity='.35'/>`;
  const lens=pos.map(([x,y])=>`<circle cx='${x}' cy='${y}' r='11' fill='#1a1a1c' stroke='${hi}' stroke-width='2'/><circle cx='${x}' cy='${y}' r='6' fill='url(#l)'/>`).join('');
  svg=`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='300' viewBox='0 0 260 300'>${defs}
  <g transform='translate(8,6) scale(.82)'>
  <rect x='6' y='6' width='108' height='222' rx='24' fill='url(#b)' stroke='${lo}' stroke-width='2.5' transform='translate(0,0)'/>
  <rect x='-1' y='60' width='3' height='20' rx='1.5' fill='${lo}'/><rect x='118' y='80' width='3' height='36' rx='1.5' fill='${lo}'/>
  <rect x='12' y='12' width='96' height='210' rx='19' fill='#050505'/>
  <rect x='15' y='15' width='90' height='204' rx='16' fill='url(#s)'/>
  <rect x='46' y='21' width='28' height='9' rx='4.5' fill='#050505'/>
  </g>
  <g transform='translate(120,6) scale(.82)'>
  <rect x='6' y='6' width='108' height='222' rx='24' fill='url(#b)' stroke='${lo}' stroke-width='2.5'/>
  ${bump}${lens}
  <circle cx='${lenses===1?92:86}' cy='${lenses===1?32:28}' r='4' fill='#fff' opacity='.7'/>
  <path d='M60 140l-8 12h16z' fill='${lo}' opacity='.35'/>
  </g></svg>`;
 }
 return "data:image/svg+xml,"+encodeURIComponent(svg);
}
const usd=v=>"$"+v.toLocaleString("en-US");
 
function render(){
 let list=products.filter(p=>(filter==="all"||p.series===filter)&&(!favOnly||favs.includes(p.id))&&(p.name+" "+p.color).toLowerCase().includes(term));
 if(sort==="asc")list.sort((a,b)=>a.price-b.price);
 if(sort==="desc")list.sort((a,b)=>b.price-a.price);
 $("#total").textContent=list.length+" ta mahsulot";$("#favc").textContent=favs.length;$("#fav").classList.toggle("on",favOnly);
 grid.innerHTML=list.length?"":'<div class="empty">Hech narsa topilmadi.</div>';
 list.forEach(p=>{
  const d=document.createElement("article");d.className="card";
  d.innerHTML=`<button class="heart ${favs.includes(p.id)?"on":""}" aria-label="Sevimli">${favs.includes(p.id)?"♥":"♡"}</button>
  <div class="im"><img loading="lazy" alt="${p.name} ${p.color}"></div>
  <h3>${p.name}</h3><div class="c">${p.color}</div><div class="p">${usd(p.price)} dan</div>
  <div class="row"><button class="add">Savatga</button><button class="ghost more">Batafsil</button></div>`;
  setImg(d.querySelector("img"),p);
  d.querySelector(".heart").onclick=()=>toggleFav(p.id);
  d.querySelector(".im").onclick=d.querySelector("h3").onclick=d.querySelector(".more").onclick=()=>openModal(p);
  d.querySelector(".add").onclick=()=>addToCart(p.id);
  grid.appendChild(d);
 });
}
 
document.querySelectorAll("#links a").forEach(a=>a.onclick=()=>{
 document.querySelectorAll("#links a").forEach(x=>x.classList.remove("active"));
 a.classList.add("active");filter=a.dataset.f;favOnly=false;
 $("#links").classList.remove("open");render();
 window.scrollTo({top:0,behavior:"smooth"});
});
$("#q").oninput=e=>{term=e.target.value.toLowerCase().trim();render()};
$("#sort").onchange=e=>{sort=e.target.value;render()};
$("#burger").onclick=()=>$("#links").classList.toggle("open");
$("#cart").onclick=()=>panel("#drawer",true);
$("#dclose").onclick=$("#ov").onclick=()=>panel("#drawer",false);
$("#clr").onclick=()=>{cart=[];save("cart",cart);renderCart()};
$("#checkout").onclick=()=>{if(!cart.length)return toast("Savat bo'sh");cart=[];save("cart",cart);renderCart();panel("#drawer",false);toast("Buyurtma qabul qilindi. Rahmat!")};
$("#fav").onclick=()=>{favOnly=!favOnly;render()};
$("#mclose").onclick=()=>panel("#modal",false);
$("#modal").onclick=e=>{if(e.target.id==="modal")panel("#modal",false)};
$("#madd").onclick=()=>{addToCart(cur.id,curO);panel("#modal",false)};
document.onkeydown=e=>{if(e.key==="Escape"){panel("#modal",false);panel("#drawer",false)}};
$("#up").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
addEventListener("scroll",()=>{$("#up").style.display=scrollY>600?"block":"none"});
renderCart();
render();
 
/* ===== Ro'yxatdan o'tish ===== */
const F=$("#form");
F.onsubmit=e=>{
 e.preventDefault();
 const v=id=>$("#"+id).value.trim();
 const er={};
 if(v("name").length<2)er.name="Ismingizni kiriting.";
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))er.email="To'g'ri email kiriting.";
 if(v("pw").length<8)er.pw="Parol kamida 8 belgidan iborat bo'lsin.";
 if(v("pw2")!==v("pw")||!v("pw2"))er.pw2="Parollar bir xil emas.";
 if(!$("#agree").checked)er.agree="Davom etish uchun rozilik bering.";
 F.querySelectorAll(".err").forEach(d=>d.textContent=er[d.dataset.e]||"");
 if(Object.keys(er).length)return;
 /* Bu yerda ma'lumotni serveringizga yuboring (fetch). Hozir faqat ko'rsatiladi. */
 $("#fields").style.display="none";
 const ok=$("#ok");ok.style.display="block";
 ok.textContent=`Rahmat, ${v("name")}! ${v("email")} manziliga tasdiqlash xati yuborildi.`;
};
 
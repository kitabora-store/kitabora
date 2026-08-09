const books=[
{id:1,title:"Səssiz Pasaj",author:"Elif Şafak",cat:"Roman",price:18.90,tag:"Yeni",bg:"#d8c2a9"},
{id:2,title:"Düşün və Var Ol",author:"James Clear",cat:"Psixologiya",price:22.50,tag:"Bestseller",bg:"#c8d0c0"},
{id:3,title:"Kiçik Şahzadə",author:"Antoine de Saint-Exupéry",cat:"Uşaq",price:12.90,tag:"Seçilmiş",bg:"#d6c7b8"},
{id:4,title:"Atomik Vərdişlər",author:"James Clear",cat:"Biznes",price:24.90,tag:"",bg:"#c6c1b3"},
{id:5,title:"İnsan Nə İstəyir?",author:"Viktor Frankl",cat:"Psixologiya",price:16.50,tag:"",bg:"#d3bcae"},
{id:6,title:"1984",author:"George Orwell",cat:"Roman",price:15.90,tag:"Bestseller",bg:"#b9b9b0"},
{id:7,title:"Sapiens",author:"Yuval Noah Harari",cat:"Tarix",price:29.90,tag:"",bg:"#c9b79e"},
{id:8,title:"Dune",author:"Frank Herbert",cat:"Fantastika",price:27.90,tag:"Yeni",bg:"#c8a978"}];

let cart=JSON.parse(localStorage.getItem("kitabora-cart")||"[]");

const grid=document.querySelector("#grid");
const count=document.querySelector("#cartCount");
const panel=document.querySelector("#cartPanel");
const overlay=document.querySelector("#overlay");

function render(list=books){
grid.innerHTML=list.map(b=>`
<article class="card">
<div class="cover" style="background:${b.bg}">
<span>${b.title}</span>
</div>
${b.tag?`<span class="tag">${b.tag}</span>`:""}
<h3>${b.title}</h3>
<div class="author">${b.author}</div>
<div class="price">
<span>${b.price.toFixed(2)} ₼</span>
<button class="add" onclick="add(${b.id})">+ Səbət</button>
</div>
</article>`).join("")
}

function save(){
localStorage.setItem("kitabora-cart",JSON.stringify(cart));
renderCart()
}

function add(id){
const x=cart.find(i=>i.id===id);
x?x.qty++:cart.push({id,qty:1});
save();
openCart()
}

function renderCart(){
count.textContent=cart.reduce((a,x)=>a+x.qty,0);

document.querySelector("#cartItems").innerHTML=cart.length?
cart.map(x=>{
let b=books.find(y=>y.id===x.id);
return `
<div class="cart-row">
<div class="mini" style="background:${b.bg}">${b.title.slice(0,8)}</div>
<div>
<h4>${b.title}</h4>
<small>${b.price.toFixed(2)} ₼ × ${x.qty}</small>
</div>
<div class="qty">
<button onclick="change(${b.id},-1)">−</button>
${x.qty}
<button onclick="change(${b.id},1)">+</button>
</div>
</div>`
}).join("")
:`<p style="color:#777">Səbətiniz hələ boşdur.</p>`;

document.querySelector("#total").textContent=
cart.reduce((a,x)=>a+books.find(b=>b.id===x.id).price*x.qty,0).toFixed(2)+" ₼"
}

function change(id,n){
let x=cart.find(i=>i.id===id);
x.qty+=n;
if(x.qty<=0)cart=cart.filter(i=>i.id!==id);
save()
}

function openCart(){
panel.classList.remove("hidden");
overlay.classList.remove("hidden")
}

function closeCart(){
panel.classList.add("hidden");
overlay.classList.add("hidden")
}

document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
overlay.onclick=closeCart;

document.querySelector("#search").oninput=e=>{
let q=e.target.value.toLowerCase();
render(books.filter(b=>
(b.title+" "+b.author+" "+b.cat).toLowerCase().includes(q)
))
};

document.querySelectorAll(".cats button").forEach(b=>{
b.onclick=()=>{
let c=b.dataset.cat;
render(books.filter(x=>x.cat===c));
document.querySelector("#books").scrollIntoView()
}
});

document.querySelector("#checkout").onclick=()=>{
if(!cart.length)return alert("Səbət boşdur.");
document.querySelector("#checkoutModal").classList.remove("hidden");
closeCart()
};

document.querySelector("#closeModal").onclick=()=>{
document.querySelector("#checkoutModal").classList.add("hidden")
};

document.querySelector("#orderForm").onsubmit=e=>{
e.preventDefault();

const f=new FormData(e.target);

const order={
id:"KB-"+Date.now().toString().slice(-6),
customer:Object.fromEntries(f),
items:cart,
date:new Date().toISOString()
};

let orders=JSON.parse(localStorage.getItem("kitabora-orders")||"[]");

orders.push(order);

localStorage.setItem("kitabora-orders",JSON.stringify(orders));

cart=[];
save();

e.target.reset();

document.querySelector("#checkoutModal").classList.add("hidden");

alert("Sifarişiniz qəbul edildi! Sifariş № "+order.id)
};

render();
renderCart();

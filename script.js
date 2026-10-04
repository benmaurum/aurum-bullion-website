/* Aurum 2.0 global behaviour */
document.querySelectorAll('.brand img, footer img, .brochure-top img').forEach(img=>{img.src='Logo.png';img.alt='Aurum Bullion PLC'});
let fav=document.querySelector("link[rel~='icon']");if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav)}fav.type='image/png';fav.href='Logo.png';
const menu=document.querySelector('.menu');if(menu)menu.addEventListener('click',()=>{document.querySelector('nav')?.classList.toggle('open')});

/* Ghana field footage: preserve aspect ratio, contain it in a cinematic frame and play all clips in sequence. Original camera audio is always muted. */
(function(){
 const videos=[...document.querySelectorAll('[data-ghana-video]')];
 const frame=document.querySelector('.ghana-video-showcase');
 if(!videos.length||!frame)return;
 Object.assign(frame.style,{position:'relative',width:'100%',height:'clamp(280px,38vw,520px)',maxHeight:'520px',overflow:'hidden',background:'#17191a',margin:'38px 0 18px'});
 videos.forEach((video,i)=>{
   Object.assign(video.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'contain',objectPosition:'center',background:'#17191a',opacity:i===0?'1':'0',visibility:i===0?'visible':'hidden',transition:'opacity .55s ease'});
   video.muted=true;video.defaultMuted=true;video.volume=0;video.removeAttribute('controls');video.setAttribute('muted','');video.setAttribute('playsinline','');
   video.addEventListener('volumechange',()=>{if(!video.muted||video.volume!==0){video.muted=true;video.volume=0}});
 });
 const dots=[...frame.querySelectorAll('.ghana-video-progress span')];
 const show=i=>{videos.forEach((v,n)=>{const active=n===i;v.style.opacity=active?'1':'0';v.style.visibility=active?'visible':'hidden';if(!active){v.pause();v.currentTime=0}});dots.forEach((d,n)=>d.style.opacity=n===i?'1':'.32');videos[i].play().catch(()=>{});};
 videos.forEach((v,i)=>v.addEventListener('ended',()=>show((i+1)%videos.length)));
 show(0);
})();

let goldCurrency='GBP',lastUsd=null,lastGbp=null;
function renderGold(){const el=document.getElementById('gold'),pair=document.getElementById('goldpair');if(!el)return;if(goldCurrency==='USD'&&lastUsd){el.textContent='$'+lastUsd.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pair)pair.textContent='XAU/USD'}else if(lastGbp){el.textContent='£'+lastGbp.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2})+' / TROY OZ';if(pair)pair.textContent='XAU/GBP'}}
async function updateGold(){const el=document.getElementById('gold'),tm=document.getElementById('goldtime');if(!el)return;try{const [g,fx]=await Promise.all([fetch('https://api.gold-api.com/price/XAU').then(r=>r.json()),fetch('https://api.frankfurter.app/latest?from=USD&to=GBP').then(r=>r.json())]);lastUsd=Number(g.price);lastGbp=lastUsd*Number(fx.rates.GBP);if(!Number.isFinite(lastUsd)||!Number.isFinite(lastGbp))throw new Error('price');renderGold();if(tm)tm.textContent='• INDICATIVE LIVE SPOT'}catch(e){el.textContent='Live spot temporarily unavailable';if(tm)tm.textContent=''}}
const toggle=document.getElementById('currencyToggle');if(toggle)toggle.addEventListener('click',()=>{goldCurrency=goldCurrency==='GBP'?'USD':'GBP';renderGold()});updateGold();setInterval(updateGold,300000);

/* Consent banner: necessary-only by default; no non-essential tracking is loaded until separately added and consented. */
(function(){if(localStorage.getItem('aurumCookieChoice'))return;const b=document.createElement('div');b.className='cookie-banner';b.innerHTML='<div><strong>Cookie choices</strong><p>Aurum uses necessary cookies for core site functions. Optional analytics or marketing technologies will only be activated with consent if introduced.</p></div><div><button data-cookie="necessary">Necessary only</button><button class="accept" data-cookie="all">Accept all</button><a href="cookies.html">Cookies Policy</a></div>';document.body.appendChild(b);b.querySelectorAll('[data-cookie]').forEach(x=>x.onclick=()=>{localStorage.setItem('aurumCookieChoice',x.dataset.cookie);b.remove()})})();